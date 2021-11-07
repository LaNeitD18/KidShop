import { useState } from 'react';
import { fireError } from '../utils/feedback';

export default function useApiResult() {
  const [loading, setLoading] = useState(false);

  const apiCall = async (
    apiPromise,
    onSuccess = () => {},
    onError = () => {}
  ) => {
    try {
      setLoading(true);
      const resData = await apiPromise;
      onSuccess(resData);
      setLoading(false);
    } catch (err) {
      fireError(err);
      onError(err);
      setLoading(false);
    }
  };

  return { apiCall, loading };
}
