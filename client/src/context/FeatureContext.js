import React, { createContext, useMemo, useState, useContext } from 'react';

const FeatureContext = createContext();

function FeatureProvider(props) {
  const [feature, setFeature] = useState([]);
  const value = useMemo(() => [feature, setFeature], [feature]);
  return <FeatureContext.Provider value={value} {...props} />;
}

function useFeature() {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error('useFeature must be used within a FeatureProvider');
  }
  return context;
}

export { FeatureProvider, useFeature };
