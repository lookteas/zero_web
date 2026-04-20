export function normalizeWeeklyVote(vote = {}) {
  return {
    id: Number(vote.id || 0),
    weekStartDate: vote.weekStartDate || '',
    voteStartAt: vote.voteStartAt || '',
    voteEndAt: vote.voteEndAt || '',
    status: vote.status || 'draft',
    resultTopicId: Number(vote.resultTopicId || 0),
    hasVoted: Boolean(vote.hasVoted),
    todayHasVoted: Boolean(vote.todayHasVoted),
    userCandidateId: Number(vote.userCandidateId || 0),
    todayCandidateId: Number(vote.todayCandidateId || 0),
    todayVotedAt: vote.todayVotedAt || '',
    candidates: Array.isArray(vote.candidates) ? vote.candidates : [],
    myRecords: Array.isArray(vote.myRecords) ? vote.myRecords : [],
  }
}
