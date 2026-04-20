export const taskStatusLabelMap: Record<string, string> = {
  draft: "今天还在整理中",
  submitted: "今天已完成打卡",
};

export const reviewStatusLabelMap: Record<string, string> = {
  pending: "等你回看",
  completed: "这次已经回看过了",
  overdue: "已经错过这次回看时间",
};

export const reviewResultLabelMap: Record<string, string> = {
  done: "这次做到了",
  partial: "做到了部分",
  failed: "这次没做到",
};

export const logStatusLabelMap: Record<string, string> = {
  pending: "还在进行中",
  partial: "做了一部分",
  done: "已经完成",
  failed: "这次没做到",
};
