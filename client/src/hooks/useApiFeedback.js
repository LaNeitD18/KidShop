import { useState } from 'react';
import { fireErrorModal, useFireSuccessModal } from '../utils/feedback';
import { message as antdMessage } from 'antd';
import { errorString } from '../utils/string';

export default function useApiFeedback() {
  const [loading, setLoading] = useState(false);
  const fireSuccessModal = useFireSuccessModal();
  const [result, setResult] = useState({});
  const [error, setError] = useState({});

  const apiCall = async (apiPromise, onSuccess, onError) => {
    try {
      setLoading(true);
      const res = await apiPromise;
      setLoading(false);
      setResult(res);
      const feedback = (
        options = {
          type: '',
          message: '',
          name: '',
          onContinue: () => {},
        }
      ) => {
        const { type, message, name, onContinue } = options;
        let mess = message;
        if (!mess) {
          switch (res.status) {
            case 200:
              mess = 'Thực hiện thành công';
              break;
            case 201:
              mess = 'Tạo thành công';
              break;
            default:
              mess = 'Hoàn tất';
          }
        }
        switch (type) {
          case 'modal': {
            fireSuccessModal({
              title: name,
              message: message,
              onOk: onContinue,
            });
            break;
          }
          case 'message': {
            antdMessage.success(mess);
            break;
          }
          default: {
          }
        }
      };
      onSuccess ? onSuccess(feedback, res) : feedback();
    } catch (err) {
      setLoading(false);
      setError(err);
      const autoErr = errorString(err);
      const feedback = (options = { type: '', message: '' }) => {
        const { type, message } = options;
        switch (type) {
          case 'modal': {
            fireErrorModal(err);
            break;
          }
          case 'message': {
            antdMessage.error(message || autoErr.message);
            break;
          }
          default: {
            antdMessage.error(message || autoErr.message);
            break;
          }
        }
      };
      onError ? onError(feedback, err) : feedback();
    }
  };

  return { apiCall, loading, result, error };
}
