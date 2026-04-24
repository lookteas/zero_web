import { cookies } from "next/headers";

import { apiBaseUrl } from "@/lib/env";
import { normalizeWeeklyVote } from "@/lib/weekly-vote-normalize.mjs";

type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export type Topic = {
  id: number;
  title: string;
  summary: string;
  description?: string;
  orderNo: number;
  status: number;
  scheduleDate?: string;
};

export type AdminUser = {
  id: number;
  account: string;
  email?: string;
  mobile?: string;
  nickname: string;
  avatar?: string;
  status: number;
  createdAt: string;
  lastLoginAt?: string;
};

export type AdminUserSummary = {
  total: number;
  active: number;
  withEmail: number;
  withMobile: number;
};

export type AdminUserListData = {
  list: AdminUser[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  summary: AdminUserSummary;
};

export type DailyTask = {
  id: number;
  taskDate: string;
  topicId: number;
  topicOrderNo: number;
  topicTitle: string;
  topicSummary: string;
  topicDescription?: string;
  weakness?: string;
  improvementPlan?: string;
  verificationPath?: string;
  reflectionNote?: string;
  status: string;
  canEditContent: boolean;
  canAppendReflection: boolean;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type DailyLog = {
  id: number;
  dailyTaskId: number;
  logTime: string;
  actionText?: string;
  status: string;
  remark?: string;
  createdAt: string;
  updatedAt: string;
};

export type ReviewItem = {
  id: number;
  dailyTaskId: number;
  reviewStage: string;
  dueAt: string;
  status: string;
  completedAt?: string;
  dailyTask: DailyTask;
};

export type ReviewRecoveryGroup = {
  dailyTaskId: number;
  mergedStageLabel: string;
  reviewStageNames: string[];
  reviewItemIds: number[];
  oldestDueAt?: string;
  latestDueAt?: string;
  dailyTask: DailyTask;
};

export type ReviewItemListData = {
  list: ReviewItem[];
  recoveryGroups?: ReviewRecoveryGroup[];
  pendingRemainingCount?: number;
  recoveryRemainingCount?: number;
};

export type ReviewHistoryRecord = {
  id: number;
  reviewItemId: number;
  dailyTaskId: number;
  reviewStage: string;
  taskDate: string;
  topicTitle: string;
  topicSummary?: string;
  summary: string;
  result: string;
  actualSituation?: string;
  suggestion?: string;
  submittedAt: string;
};

export type ReinforcementHint = {
  topicTitle: string;
  prompt: string;
  sourceSummary?: string;
};

export type CycleSummary = {
  totalPoints: number;
  completedTaskCount: number;
  restDays: number;
  cycleCompletedDate?: string;
  nextCycleStartDate?: string;
};

export type VoteCandidate = {
	id: number;
	topicId: number;
	topicTitle: string;
	topicSummary: string;
	topicDate?: string;
	topicDateLabel?: string;
	voteCount: number;
	sortNo: number;
};

export type VoteRecord = {
	id: number;
	candidateId: number;
	topicId: number;
	topicTitle: string;
	topicSummary: string;
	createdAt: string;
};

export type WeeklyVote = {
	id: number;
	weekStartDate: string;
	voteStartAt: string;
	voteEndAt: string;
	status: string;
	resultTopicId?: number;
	hasVoted: boolean;
	todayHasVoted: boolean;
	userCandidateId?: number;
	todayCandidateId?: number;
	todayVotedAt?: string;
	candidates: VoteCandidate[];
	myRecords: VoteRecord[];
};

export type DiscussionInfo = {
	id?: number;
	weekStartDate: string;
	topicId?: number;
	topicTitle: string;
	discussionTitle: string;
	description?: string;
	goals?: string;
	meetingTime: string;
	meetingLink?: string;
	shareText?: string;
	status: string;
	adminRemark?: string;
};

export type HomeData = {
  todayTask?: DailyTask;
  overview: {
    continuousDays: number;
    totalTaskCount: number;
    totalReviewCount: number;
    pendingReviewCount: number;
  };
  pendingReviews: ReviewItem[];
  recoveryReviews?: ReviewRecoveryGroup[];
  reinforcementHints?: ReinforcementHint[];
  cycleSummary?: CycleSummary;
  currentVote?: WeeklyVote;
  currentDiscussion?: DiscussionInfo;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("zero_user_id")?.value;

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(userId ? { "X-User-Id": userId } : {}),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const json = (await response.json()) as ApiResponse<T>;
  return json.data;
}

async function requestAdmin<T>(path: string, init?: RequestInit): Promise<T> {
  const cookieStore = await cookies();
  const adminId = cookieStore.get("zero_admin_id")?.value;

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(adminId ? { "X-Admin-Id": adminId } : {}),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const json = (await response.json()) as ApiResponse<T>;
  return json.data;
}

export async function getHome() {
  return request<HomeData>("/me/home");
}

export async function listTopics() {
  const data = await request<{ list: Topic[] }>("/topics");
  return data.list;
}

export async function getCurrentWeeklyVote() {
	const data = await request<WeeklyVote>("/weekly-votes/current");
	return normalizeWeeklyVote(data) as WeeklyVote;
}

export async function createCurrentWeeklyVoteRecord(candidateId: number) {
	return request<{ code?: number }>("/weekly-votes/current/records", {
		method: "POST",
		body: JSON.stringify({ candidateId }),
	});
}

export async function getCurrentDiscussion() {
	return request<DiscussionInfo>("/discussions/current");
}

export async function getTodayTask() {
  return request<DailyTask>("/me/today-task");
}

export async function createTodayTask() {
  return request<DailyTask>("/daily-tasks", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function listDailyTasks(filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
  keyword?: string;
}) {
  const params = new URLSearchParams();

  if (filters?.status) params.set("status", filters.status);
  if (filters?.startDate) params.set("startDate", filters.startDate);
  if (filters?.endDate) params.set("endDate", filters.endDate);
  if (filters?.keyword) params.set("keyword", filters.keyword);

  const query = params.toString();
  const data = await request<{ list: DailyTask[] }>(query ? `/daily-tasks?${query}` : "/daily-tasks");
  return data.list;
}

export async function listDailyTaskLogs(taskId: number) {
  const data = await request<{ list: DailyLog[] }>(`/daily-tasks/${taskId}/logs`);
  return data.list;
}

export async function listReviewItems() {
  return request<ReviewItemListData>("/review-items");
}

export async function listReviewHistoryRecords(filters?: {
  startDate?: string;
  endDate?: string;
  keyword?: string;
}) {
  const params = new URLSearchParams();

  if (filters?.startDate) params.set("startDate", filters.startDate);
  if (filters?.endDate) params.set("endDate", filters.endDate);
  if (filters?.keyword) params.set("keyword", filters.keyword);

  const query = params.toString();
  const data = await request<{ list: ReviewHistoryRecord[] }>(query ? `/review-records?${query}` : "/review-records");
  return data.list;
}

export async function updateDailyTask(taskId: number, payload: {
  weakness?: string;
  improvementPlan?: string;
  verificationPath?: string;
  reflectionNote?: string;
}) {
  return request<DailyTask>(`/daily-tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function submitDailyTask(taskId: number) {
  return request<DailyTask>(`/daily-tasks/${taskId}/submit`, {
    method: "POST",
  });
}

export async function createDailyTaskLog(taskId: number, payload: {
  logTime: string;
  actionText: string;
  status: string;
  remark?: string;
}) {
  return request<DailyLog>(`/daily-tasks/${taskId}/logs`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createReviewRecord(reviewItemId: number, payload: {
  result: string;
  actualSituation?: string;
  suggestion?: string;
}) {
  return request<{ code?: number }>(`/review-items/${reviewItemId}/records`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


export async function createRecoveryReview(payload: {
  reviewItemIds: number[];
  result: string;
  actualSituation?: string;
  suggestion?: string;
}) {
  return request<{ code?: number }>("/review-recovery-records", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


export async function listAdminTopics(filters?: { status?: number; keyword?: string }) {
  const params = new URLSearchParams();
  if (filters?.status === 0 || filters?.status === 1) params.set("status", String(filters.status));
  if (filters?.keyword) params.set("keyword", filters.keyword);
  const query = params.toString();
  const data = await requestAdmin<{ list: Topic[] }>(query ? `/admin/topics?${query}` : "/admin/topics");
  return data.list;
}

export async function createAdminTopic(payload: {
  title: string;
  summary: string;
  description?: string;
  orderNo: number;
  status: number;
  scheduleDate?: string;
}) {
  return requestAdmin<{ code?: number }>("/admin/topics", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminTopic(topicId: number, payload: {
  title: string;
  summary: string;
  description?: string;
  orderNo: number;
  status: number;
  scheduleDate?: string;
}) {
  return requestAdmin<{ code?: number }>(`/admin/topics/${topicId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function createAdminDiscussion(payload: {
  weekStartDate: string;
  topicId: number;
  topicTitle: string;
  discussionTitle: string;
  description?: string;
  goals?: string;
  meetingTime: string;
  meetingLink: string;
  shareText?: string;
  status: string;
  adminRemark?: string;
}) {
  return requestAdmin<{ code?: number }>("/admin/discussions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAdminDiscussion(discussionId: number, payload: {
  discussionTitle: string;
  description?: string;
  goals?: string;
  meetingTime: string;
  meetingLink: string;
  shareText?: string;
  status: string;
  adminRemark?: string;
}) {
  return requestAdmin<{ code?: number }>(`/admin/discussions/${discussionId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function listAdminUsers(filters?: { keyword?: string; status?: string; page?: number; pageSize?: number }) {
  const params = new URLSearchParams();
  if (filters?.keyword) params.set("keyword", filters.keyword);
  if (filters?.status === "0" || filters?.status === "1") params.set("status", filters.status);
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.pageSize) params.set("pageSize", String(filters.pageSize));
  const query = params.toString();
  return requestAdmin<AdminUserListData>(query ? `/admin/users?${query}` : "/admin/users");
}

export async function updateAdminUser(userId: number, payload: {
  nickname: string;
  email?: string;
  mobile?: string;
  avatar?: string;
  status: number;
}) {
  return requestAdmin<{ code?: number }>(`/admin/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

