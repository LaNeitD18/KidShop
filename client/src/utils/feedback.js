import { Modal, message as antdMessage } from 'antd';
import { errorString } from './string';

export function fireError(err) {
  if (Array.isArray(err)) err = err[0];
  const { code, codeName, message } = errorString(err);
  if (!code) {
    antdMessage.error(message);
  } else {
    Modal.error({
      title: codeName || 'Đã xảy ra lỗi',
      content: (
        <div>
          {message || 'Vui lòng thử lại sau'}
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
}

export function fireSuccessModal({
  title,
  message,
  onOk,
  okText,
  onCancel,
  cancelText,
}) {
  Modal.success({
    title: title || 'Hoàn tất',
    content: message || 'Bạn có muốn tiếp tục?',
    cancelText: cancelText || 'Trở về',
    onCancel: (close) => {
      if (!onCancel) {
        close();
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

export function fireConfirmModal(
  confirmObject = { title: '', content: '', onOk: () => {} }
) {
  const { title, content, onOk } = confirmObject;
  Modal.confirm({
    title: title || 'Bạn có chắc không?',
    content: content || 'Thao tác này không thể thu hồi',
    cancelText: 'Từ chối',
    okText: 'Đồng ý',
    onOk: (close) => {
      if (onOk) {
        onOk();
        close();
      } else {
        close();
      }
    },
    keyboard: true,
    mask: true,
    maskClosable: true,
    centered: true,
  });
}
