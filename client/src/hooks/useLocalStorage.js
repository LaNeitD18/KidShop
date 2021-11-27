import { useEffect, useState } from 'react';

const PREFIX = '';

/**
 * local storage
 * @param {string} key
 * @param {object} initialValue
 * @returns {[object, Function]} initialValue
 */
export default function useLocalStorage(key, initialValue) {
  const prefixedKey = PREFIX + key;

  const [value, _setValue] = useState(() => {
    // check in local storage first
    const existingData = localStorage.getItem(prefixedKey);
    if (existingData) return existingData;

    // then use the provided initial value
    if (typeof initialValue === 'function') {
      return initialValue();
    } else {
      return initialValue;
    }
  });

  // when the local storage updated, update the value
  useEffect(() => {
    window.addEventListener(
      'storage',
      (e) => {
        const newData = localStorage.getItem(prefixedKey);
        _setValue(newData);
      },
      false
    );
  }, [prefixedKey]);

  const setValue = (value) => {
    if (!value) {
      localStorage.removeItem(prefixedKey);
      _setValue(null);
    } else {
      localStorage.setItem(prefixedKey, JSON.stringify(value));
      _setValue(JSON.stringify(value));
    }
  };

  const parsedValue = (value) => {
    let parsed = value;
    try {
      parsed = JSON.parse(value);
    } catch (error) {
      console.error(error);
    }
    return parsed;
  };

  return [parsedValue(value), setValue];
}
