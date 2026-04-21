param(
  [Parameter(Mandatory = $true)]
  [string]$HostName,

  [Parameter(Mandatory = $true)]
  [string]$UserName,

  [Parameter(Mandatory = $true)]
  [string]$RemotePath,

  [int]$Port = 22,
  [string]$RemoteArchivePath = '/tmp/zero-web-deploy.tar.gz',
  [switch]$InstallDependencies,
  [switch]$BuildOnServer,
  [string]$PostDeployCommand = ''
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Assert-CommandExists {
  param([Parameter(Mandatory = $true)][string]$Name)

  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Missing required command: $Name"
  }
}

function Assert-RequiredPath {
  param([Parameter(Mandatory = $true)][string]$Path)

  if (-not (Test-Path -LiteralPath $Path)) {
    throw "Missing required path: $Path"
  }
}

Assert-CommandExists -Name 'tar'
Assert-CommandExists -Name 'scp'
Assert-CommandExists -Name 'ssh'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$webRoot = (Resolve-Path (Join-Path $scriptDir '..')).Path
$remoteTarget = '{0}@{1}' -f $UserName, $HostName

$requiredPaths = @(
  'src',
  'public',
  'package.json',
  'package-lock.json',
  'next.config.ts',
  'tsconfig.json',
  'postcss.config.mjs',
  '.env.production'
)

foreach ($relativePath in $requiredPaths) {
  Assert-RequiredPath -Path (Join-Path $webRoot $relativePath)
}

$stagingDir = Join-Path ([System.IO.Path]::GetTempPath()) ('zero-web-deploy-' + [System.Guid]::NewGuid().ToString('N'))
$archivePath = Join-Path $stagingDir 'zero-web-deploy.tar.gz'

New-Item -ItemType Directory -Path $stagingDir | Out-Null

Push-Location $webRoot
try {
  $tarArgs = @(
    '-czf',
    $archivePath,
    '--exclude=.git',
    '--exclude=.next',
    '--exclude=node_modules',
    '--exclude=.turbo',
    '--exclude=tmp-utf8-test.txt',
    'src',
    'public',
    'scripts',
    'package.json',
    'package-lock.json',
    'next.config.ts',
    'tsconfig.json',
    'postcss.config.mjs',
    'eslint.config.mjs',
    '.env.production',
    '.env.example',
    'README.md'
  )

  & tar @tarArgs
  if ($LASTEXITCODE -ne 0) {
    throw 'Failed to create deployment archive.'
  }

  & scp -P $Port $archivePath ('{0}:{1}' -f $remoteTarget, $RemoteArchivePath)
  if ($LASTEXITCODE -ne 0) {
    throw 'Failed to upload deployment archive.'
  }

  $remoteSteps = @(
    'set -e',
    "mkdir -p '$RemotePath'",
    "tar -xzf '$RemoteArchivePath' -C '$RemotePath'",
    "rm -f '$RemoteArchivePath'"
  )

  if ($InstallDependencies) {
    $remoteSteps += "cd '$RemotePath' && npm install"
  }

  if ($BuildOnServer) {
    $remoteSteps += "cd '$RemotePath' && npm run build"
  }

  if ($PostDeployCommand -ne '') {
    $remoteSteps += "cd '$RemotePath' && $PostDeployCommand"
  }

  $remoteCommand = [string]::Join('; ', $remoteSteps)

  & ssh -p $Port $remoteTarget $remoteCommand
  if ($LASTEXITCODE -ne 0) {
    throw 'Failed to extract deployment archive or run remote commands.'
  }
}
finally {
  Pop-Location
  if (Test-Path -LiteralPath $stagingDir) {
    Remove-Item -LiteralPath $stagingDir -Recurse -Force
  }
}

Write-Host ''
Write-Host 'Web deploy finished.' -ForegroundColor Green
Write-Host ('Remote path: {0}' -f $RemotePath)
Write-Host 'Recommended next steps:'
Write-Host ('  ssh -p {0} {1} "cd ''{2}'' && npm run start"' -f $Port, $remoteTarget, $RemotePath)
Write-Host 'If you use systemd or pm2, start the service with your usual command.'
