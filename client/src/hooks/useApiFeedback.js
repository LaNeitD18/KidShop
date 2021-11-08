import { useState } from 'react';
import { fireErrorModal, useFireSuccessModal } from '../utils/feedback';
import { message as antdMessage } from 'antd';

export default function useApiFeedback() {
  const [loading, setLoading] = useState(false);
  const fireSuccessModal = useFireSuccessModal();
  const [result, setResult] = useState({});
  const [error, setError] = useState({});

  const apiCall = async (
    apiPromise,
    onSuccess = (feedback, res) => {},
    onError = (feedback, err) => {}
  ) => {
    try {
      setLoading(true);
      const res = await apiPromise;
      setLoading(false);
      setResult(res);
      const feedback = ({
        type = '',
        message = '',
        name = '',
        onContinue = () => {},
      }) => {
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
            fireSuccessModal(name, message, onContinue);
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

      onSuccess(feedback, res);
    } catch (err) {
      setLoading(false);
      setError(err);
      const feedback = ({ type = 'modal', message = '', name = '' }) => {
        switch (type) {
          case 'modal': {
            fireErrorModal(err);
            break;
          }
          case 'message': {
            antdMessage.success(message);
            break;
          }
          default: {
          }
        }
      };
      onError(feedback, err);
    }
  };

  return { apiCall, loading, result, error };
}
