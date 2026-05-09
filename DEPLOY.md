# Zero Web 部署说明

本文档针对当前 `apps/web` 的线上部署方式整理，适用于：

- 域名：`example.com`
- Web 服务：`Next.js` 生产启动
- 反向代理：`nginx`
- 进程管理：`systemd`
- API 地址：通过 `.env.production` 中的 `NEXT_PUBLIC_API_BASE_URL` 配置

---

## 一、项目目录

假设前端项目部署在：

```bash
/srv/example-app/apps/web
```

前端常用目录说明：

- 项目根目录：`/srv/example-app/apps/web`
- 静态文件目录：`/srv/example-app/apps/web/public`
- 构建输出目录：`/srv/example-app/apps/web/.next`
- 生产环境变量：`/srv/example-app/apps/web/.env.production`

---

## 二、首次部署

### 1. 安装依赖

```bash
cd /srv/example-app/apps/web
npm install
```

### 2. 配置生产环境变量

编辑：

```bash
/srv/example-app/apps/web/.env.production
```

示例：

```env
NEXT_PUBLIC_API_BASE_URL=https://api.example.com/api/v1
```

### 3. 构建前端

```bash
cd /srv/example-app/apps/web
npm run build
```

### 4. 手动启动测试

```bash
cd /srv/example-app/apps/web
PORT=3000 HOSTNAME=127.0.0.1 npm run start
```

如果终端显示服务已启动，可在服务器本机验证：

```bash
curl http://127.0.0.1:3000
```

如果这一条本机访问不通，就先不要继续配置 `nginx`，先看构建日志和启动日志。

---

## 三、做成 systemd 服务

建议把前端做成 `systemd` 服务，这样机器重启后会自动拉起，也方便统一查看日志和重启。

### 1. 先确认 Node 和 npm 路径

执行：

```bash
which node
which npm
```

通常会得到类似：

```bash
/usr/bin/node
/usr/bin/npm
```

如果你机器上的 `npm` 不在 `/usr/bin/npm`，后面 `ExecStart` 要替换成你实际查到的路径。

### 2. 创建服务文件

创建：

```bash
/etc/systemd/system/example-web.service
```

内容如下：

```ini
[Unit]
Description=Example Web
After=network.target

[Service]
Type=simple
WorkingDirectory=/srv/example-app/apps/web
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=HOSTNAME=127.0.0.1
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5
User=root

[Install]
WantedBy=multi-user.target
```

### 3. 各字段说明

- `WorkingDirectory`：前端项目目录
- `Environment=PORT=3000`：Next 服务监听的本地端口
- `Environment=HOSTNAME=127.0.0.1`：只监听本机，交给 `nginx` 对外暴露
- `ExecStart`：启动命令，当前项目就是 `npm run start`
- `User=root`：用哪个系统用户启动服务

如果你服务器上不是用 `root` 跑应用，也可以改成例如：

```ini
User=www
```

但要确保该用户对 `/srv/example-app/apps/web` 有读取权限。

### 4. 让 systemd 识别并启动服务

执行：

```bash
systemctl daemon-reload
systemctl enable example-web
systemctl start example-web
systemctl status example-web --no-pager
```

说明：

- `daemon-reload`：重新加载服务定义
- `enable`：开机自启
- `start`：立刻启动
- `status`：查看当前状态

### 5. 常用 systemd 操作

启动：

```bash
systemctl start example-web
```

停止：

```bash
systemctl stop example-web
```

重启：

```bash
systemctl restart example-web
```

查看状态：

```bash
systemctl status example-web --no-pager
```

查看日志：

```bash
journalctl -u example-web -f
```

### 6. 如何判断服务是否正常

执行：

```bash
ss -lntp | grep 3000
curl http://127.0.0.1:3000
```

如果能监听 `3000` 且 `curl` 返回 HTML，说明前端服务已经正常运行。

---

## 四、nginx 反向代理怎么配

当前推荐做法：

- `nginx` 占用 `80/443`
- `Next.js` 仅监听 `127.0.0.1:3000`
- 用户访问 `https://example.com`
- `nginx` 将请求转发到 `http://127.0.0.1:3000`

### 1. 反代关系说明

外部访问：

```text
https://example.com
```

实际链路：

```text
浏览器 -> nginx(80/443) -> Next.js(127.0.0.1:3000)
```

所以：

- `Next.js` 不直接监听 `80`
- `nginx` 才是外网入口
- `systemd` 管理的是 `Next.js` 进程

### 2. 标准 nginx 配置示例

如果你是自己管理 nginx 配置文件，可参考：

```nginx
server {
    listen 80;
    listen 443 ssl;
    http2 on;
server_name example.com;

    ssl_certificate     /path/to/certs/example.com/fullchain.pem;
    ssl_certificate_key /path/to/certs/example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_connect_timeout 60s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;
    }
}
```

### 3. 宝塔面板里怎么填

如果你是宝塔面板站点配置，通常已经有一份完整 `server {}`。这时不要整段覆盖，重点是把根路径代理到 `127.0.0.1:3000`。

核心配置应类似：

```nginx
location ^~ / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Real-Port $remote_port;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Port $server_port;

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;

    proxy_connect_timeout 60s;
    proxy_send_timeout 600s;
    proxy_read_timeout 600s;
}
```

### 4. 改完 nginx 后怎么生效

执行：

```bash
nginx -t
systemctl reload nginx
```

说明：

- `nginx -t`：先检查语法
- `reload`：平滑重载配置，不会粗暴中断服务

### 5. 如何验证反代成功

先确认 Next 服务正常：

```bash
curl http://127.0.0.1:3000
```

再确认域名入口正常：

```bash
curl -I https://example.com
curl https://example.com
```

如果本机能访问 `3000`，但域名访问不通，优先检查：

```bash
nginx -t
tail -n 100 /var/log/nginx/example.com.error.log
```

### 6. 哪些情况下需要 reload nginx

需要 `reload nginx` 的情况：

- 改了域名配置
- 改了 SSL 配置
- 改了反向代理配置
- 改了静态文件专门放行规则

不需要 `reload nginx` 的情况：

- 只是前端发版
- 只是执行 `npm run build`
- 只是重启 `example-web`
- 只是更新 `.env.production`

---

## 五、日常更新流程

推荐按以下顺序执行：

```bash
cd /srv/example-app/apps/web
git pull
npm install
npm run build
systemctl restart example-web
systemctl status example-web --no-pager
```

验证：

```bash
curl http://127.0.0.1:3000
curl https://example.com
```

### 也可以直接执行脚本

仓库已提供一个服务器直接执行的脚本：

```bash
/srv/example-app/apps/web/scripts/deploy-web.sh
```

推荐这样执行：

```bash
cd /srv/example-app/apps/web
bash ./scripts/deploy-web.sh
```

脚本默认会执行：

- `git pull --ff-only`
- `npm install`
- `npm run build`
- `systemctl restart example-web`
- `curl http://127.0.0.1:3000` 本机检查

如果你还想顺手检查线上域名，可临时带上：

```bash
cd /srv/example-app/apps/web
PUBLIC_URL=https://example.com bash ./scripts/deploy-web.sh
```

如果这次确定没有依赖变化，也可以跳过安装：

```bash
cd /srv/example-app/apps/web
RUN_NPM_INSTALL=0 bash ./scripts/deploy-web.sh
```

---

## 六、`.env.production` 冲突处理

如果执行 `git pull` 时提示：

```bash
error: Your local changes to the following files would be overwritten by merge:
    .env.production
```

说明服务器本地的 `.env.production` 有修改，而当前拉取的提交涉及该文件。

处理方式：

```bash
cd /srv/example-app/apps/web
cp .env.production .env.production.bak
git restore .env.production
git pull
mv .env.production.bak .env.production
```

如果 `.env.development` 也有类似问题，可一起处理：

```bash
cd /srv/example-app/apps/web
cp .env.production .env.production.bak
cp .env.development .env.development.bak
git restore .env.production .env.development
git pull
mv .env.production.bak .env.production
mv .env.development.bak .env.development
```

处理完成后，可确认忽略规则是否生效：

```bash
git status --short
git check-ignore -v .env.production
```

---

## 七、验证文件放置位置

如果需要通过域名访问验证文件，不要放到 nginx 的站点根目录去赌当前代理规则是否命中，优先放到 `public` 目录。

例如：

- 访问路径：`https://example.com/example.txt`
- 对应文件：`/srv/example-app/apps/web/public/example.txt`

再例如：

- 访问路径：`https://example.com/.well-known/test.txt`
- 对应文件：`/srv/example-app/apps/web/public/.well-known/test.txt`

说明：

- 当前站点是 `nginx -> Next.js` 反代模式
- 外部访问大部分路径时，实际由 `Next.js` 返回内容
- 因此验证文件放到 `public` 目录最稳妥

新增 `public` 文件后，线上建议执行一次重启：

```bash
systemctl restart example-web
```

然后验证：

```bash
curl http://127.0.0.1:3000/example.txt
curl https://example.com/example.txt
```

---

## 八、常用排查命令

### 1. 查看前端服务状态

```bash
systemctl status example-web --no-pager
```

### 2. 查看前端实时日志

```bash
journalctl -u example-web -f
```

### 3. 查看 3000 端口监听

```bash
ss -lntp | grep 3000
```

### 4. 查看 nginx 错误日志

```bash
tail -n 100 /var/log/nginx/example.com.error.log
```

### 5. 测试本机访问

```bash
curl http://127.0.0.1:3000
```

### 6. 测试域名访问

```bash
curl -I https://example.com
curl https://example.com
```

---

## 九、发布注意事项

- 修改代码后，记得重新执行 `npm run build`
- 修改环境变量后，记得重启 `example-web`
- 修改 `public` 目录文件后，线上建议也重启一次 `example-web`
- 修改 nginx 配置后，记得执行 `nginx -t` 再 `reload`
- 不要把真实生产环境变量重新提交到 Git

---

## 十、最常用的一条发布命令

如果本次只是正常更新前端代码，可直接执行：

```bash
cd /srv/example-app/apps/web && git pull && npm install && npm run build && systemctl restart example-web && systemctl status example-web --no-pager
```
