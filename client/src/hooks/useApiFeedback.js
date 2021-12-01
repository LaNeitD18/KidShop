import { useState } from 'react';
import { fireError } from '../utils/feedback';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

export default function useApiFeedback() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({});
  const [error, setError] = useState({});

  const navigate = useNavigate();

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
        if (err?.response?.status === 401) {
          navigate('/login');
          message.error('Vui lòng đăng nhập để truy cập vào hệ thống.');
        } else {
          fireError(err);
        }
      }
    }
  };

  return [apiCall, loading, error, result];
}
