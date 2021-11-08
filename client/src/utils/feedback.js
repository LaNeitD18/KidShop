import { Collapse, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { errorString } from './string';

export function fireErrorModal(err) {
  const { code, codeName, message } = errorString(err);
  Modal.error({
    title: codeName,
    content: (
      <div>
        {message}
        {!!code && (
          <>
            <br />
            <br />
            <a
              rel="noreferrer"
              target="_blank"
              className="font-semibold hover:underline"
              href={`https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${code}`}
            >
              Tìm hiểu thêm về lỗi này
            </a>
          </>
        )}
      </div>
    ),
    keyboard: true,
    mask: true,
    maskClosable: true,
    centered: true,
  });
}

export function useFireSuccessModal() {
  const navigate = useNavigate();
  return (title, message, onOk, okText, onCancel, cancelText) =>
    Modal.success({
      title: title || 'Hoàn tất',
      content: message || 'Bạn có muốn tiếp tục?',
      cancelText: cancelText || 'Trở về',
      onCancel: (close) => {
        if (!onCancel) {
          close();
          navigate('../');
        } else {
          onCancel();
          close();
        }
      },
      okCancel: true,
      okText: okText || 'Tiếp tục',
      onOk: (close) => {
        if (onOk) {
          onOk();
          close();
        } else {
          close();
        }
      },
      keyboard: true,
      centered: true,
    });
}
