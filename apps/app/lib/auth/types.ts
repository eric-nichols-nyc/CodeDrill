export type ApiAuthUser = {
  id: string;
  email: string;
  name: string | null;
  image?: string | null;
};

export type ApiAuthSession = {
  id: string;
  expiresAt: string;
};

export type ApiAuthState = {
  session: ApiAuthSession | null;
  user: ApiAuthUser | null;
};
