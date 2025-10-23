// Shared protocol/types between client & server
export type UserProfile = {
  id: string;
  displayName: string;
};

export type RewardGrant = {
  userId: string;
  chapter: number;
  itemId: string;
  grantedAt: number;
};

export type AuthTokenPayload = {
  sub: string; // user id
  name?: string;
  exp: number;
};
