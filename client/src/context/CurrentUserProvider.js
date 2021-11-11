import React, { createContext, useMemo, useState, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CurrentUserContext = createContext();

function CurrentUserProvider(props) {
  const [user] = useLocalStorage('user');
  const [currentUser, setCurrentUser] = useState(user?.token);
  const value = useMemo(() => [currentUser, setCurrentUser], [currentUser]);
  return <CurrentUserContext.Provider value={value} {...props} />;
}

function useCurrentUser() {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error('useCurrentUser must be used within a CurrentUserProvider');
  }
  return context;
}

export { CurrentUserProvider, useCurrentUser };
