import { Button } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useResponsive } from './Media';

export function AddButton({ className, children, responsive, ...rest }) {
  const media = useResponsive();
  return (
    <Button
      type="primary"
      className={className}
      icon={<PlusOutlined />}
      {...rest}
    >
      {media.isXs || !responsive ? children : null}
    </Button>
  );
}

export function DoneButton({ className, children, responsive, ...rest }) {
  const media = useResponsive();
  return (
    <Button
      type="primary"
      className={className}
      icon={<CheckOutlined />}
      {...rest}
    >
      {media.isXs || !responsive ? children : null}
    </Button>
  );
}

export function DeleteButton({ className, children, responsive, ...rest }) {
  const media = useResponsive();
  return (
    <Button
      type="danger"
      className={className}
      icon={<DeleteOutlined />}
      {...rest}
    >
      {media.isXs || !responsive ? children : null}
    </Button>
  );
}

export function CancelButton({ className, children, responsive, ...rest }) {
  const media = useResponsive();
  return (
    <Button danger className={className} icon={<CloseOutlined />} {...rest}>
      {media.isXs || !responsive ? children : null}
    </Button>
  );
}
