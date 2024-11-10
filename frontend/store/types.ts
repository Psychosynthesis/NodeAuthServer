export type StoreType = {
  user: {
    username: string | null;
    userId: string | null;
    email: string | null;
    telegramUsername: string | null;
    telegramId: string | null;
  };
  token: string | null;
  error: any[];
  networkError: string | null;
}

export type Action = { type: string; load: any }
export type Dispatch = (action: Action) => void

export type StoreManagerType = [ StoreType, Dispatch ];

export type AppStoreProviderProps = { children: React.ReactNode }
