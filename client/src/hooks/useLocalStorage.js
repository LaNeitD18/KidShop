import { useEffect, useState } from 'react';

const PREFIX = '';

/**
 * local storage to store signed in user's information
 * @param {"user"} key
 * @param {{token: string, result: object}} initialValue
 * @returns {[{token: string, result: object}, Function]} initialValue
 * //**
 *
 * local storage
 * @param {string} key
 * @param {object} initialValue
 * @returns {[object, Function]} initialValue
 */
export const useLocalStorage = (key, initialValue) => {
  const prefixedKey = PREFIX + key;

  const getItemFromLocalStorage = (prefixedKey) => {
    const jsonValue = localStorage.getItem(prefixedKey);

    if (jsonValue != null) return JSON.parse(jsonValue);
    else return null;
  };

  const [value, setValue] = useState(() => {
    // check in local storage first
    const existingData = getItemFromLocalStorage(prefixedKey);
    if (existingData != null) return existingData;

    // then use the provided initial value
    if (typeof initialValue === 'function') {
      return initialValue();
    } else {
      return initialValue;
    }
  });

  // when the value updated, update the local storage
  useEffect(() => {
    if (value != null)
      localStorage.setItem(
        prefixedKey,
        typeof value !== 'string' ? JSON.stringify(value) : value
      );
    else localStorage.removeItem(prefixedKey);
  }, [prefixedKey, value]);

  // when the local storage updated, updated the value
  useEffect(() => {
    window.addEventListener(
      'storage',
      (e) => {
        const newData = getItemFromLocalStorage(prefixedKey);
        setValue(newData);
      },
      false
    );
  }, [prefixedKey]);

  return [value, setValue];
};
