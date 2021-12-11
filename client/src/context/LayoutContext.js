import React, {
  createContext,
  useMemo,
  useState,
  useContext,
  useCallback,
} from 'react';

const LayoutContext = createContext();

export function LayoutProvider(props) {
  const [options, setOptions] = useState({});
  const value = useMemo(() => [options, setOptions], [options]);
  return <LayoutContext.Provider value={value} {...props} />;
}

export function useLayoutContext() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return [context[0], context[1]];
}
