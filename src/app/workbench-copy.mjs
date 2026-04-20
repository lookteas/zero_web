export function getWorkbenchPageCopy(page) {
  const map = {
    today: {
      formTitle: '整理今天这次打卡',
      formDescription: '先看清今天最重要的一件事，再写下准备怎么做和怎么验证。',
    },
    logs: {
      formTitle: '记下这次觉察',
      formDescription: '先记下来，不用追求完整，给之后回看的自己留一条线索。',
    },
    reviews: {
      formTitle: '填写这次复盘',
      formDescription: '先确认执行结果，再回顾过程，最后写下一个更容易做到的下一步。',
    },
  }

  return map[page]
}