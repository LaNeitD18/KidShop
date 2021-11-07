import { Collapse, message, Modal } from 'antd';
import { errorString } from './string';

const { Panel } = Collapse;

export function fireError(err) {
  const { code, codeName, message } = errorString(err);
  Modal.error({
    title: codeName,
    content: (
      <div>
        {message}
        <br />
        <br />
        {!!code && (
          <a
            rel="noreferrer"
            target="_blank"
            className="font-semibold hover:underline"
            href={`https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${code}`}
          >
            Tìm hiểu thêm về lỗi này
          </a>
        )}
      </div>
    ),
    keyboard: true,
  });
  // message.error(errorString(err));
}
