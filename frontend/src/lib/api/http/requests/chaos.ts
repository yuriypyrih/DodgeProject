import { getRequest } from '../index.ts';

export const getLeaderboardsRequest = () => {
  return getRequest('/game/leaderboards');
};
