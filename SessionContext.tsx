// SessionContext.tsx
import React, { createContext, useContext } from 'react';

type SessionContextType = {
  handleSignOut: () => void;
  handleLoginStatusChange: (loggedIn: boolean) => void;
};

export const SessionContext = createContext<SessionContextType | undefined>(
  undefined,
);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
