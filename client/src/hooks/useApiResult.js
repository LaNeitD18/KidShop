import { useState } from 'react';
import { fireErrorModal, useFireSuccessModal } from '../utils/feedback';
import { message as antdMessage } from 'antd';

export default function useApiFeedback() {
  const [loading, setLoading] = useState(false);
  const fireSuccessModal = useFireSuccessModal();

  const apiCall = async (
    apiPromise,
    onSuccess = (res, feedback) => {},
    onError = (error, feedback) => {}
  ) => {
    try {
      setLoading(true);
      const result = await apiPromise;
      setLoading(false);
      const feedback = ({
        type = 'modal',
        message = '',
        name = '',
        onContinue = () => {},
      }) => {
        let mess = message;
        if (!mess) {
          switch (result.status) {
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
        if (type === 'modal') {
          fireSuccessModal(name, message, onContinue);
        } else {
          antdMessage.success(mess);
        }
      };

      onSuccess(result, feedback);
    } catch (error) {
      setLoading(false);
      const feedback = ({ type = 'modal', message = '', name = '' }) => {
        if (type === 'modal') {
          fireErrorModal({ name, message } || error);
        } else {
          antdMessage.success(message);
        }
      };
      onError(error, feedback);
    }
  };

  return { apiCall, loading };
}
