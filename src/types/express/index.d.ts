declare module 'express' {
    interface Request {
      user?: {
        userId: string;
        nickname?: string;
      };
    }
  }