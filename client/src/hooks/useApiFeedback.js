import { useState } from 'react';
import { fireErrorModal } from '../utils/feedback';

export default function useApiFeedback() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({});
  const [error, setError] = useState({});

  const apiCall = async (apiPromise, onSuccess, onError) => {
    try {
      setLoading(true);
      const res = await apiPromise;
      setLoading(false);
      setResult(res);
      if (onSuccess) onSuccess(res);
    } catch (err) {
      setLoading(false);
      setError(err);
      if (onError) {
        onError(err);
      } else {
        fireErrorModal(err);
      }
    }
  };

  return { apiCall, loading, result, error };
}
