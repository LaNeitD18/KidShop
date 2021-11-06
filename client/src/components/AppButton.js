import { Button } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useResponsive } from './Media';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const mapType = {
  add: {
    buttonProps: {
      type: 'primary',
      icon: <PlusOutlined />,
    },
    linkProps: {
      link: 'add',
    },
  },
  done: {
    buttonProps: {
      type: 'primary',
      icon: <CheckOutlined />,
    },
  },
  delete: {
    buttonProps: {
      type: 'danger',
      icon: <DeleteOutlined />,
    },
  },
  cancel: {
    buttonProps: {
      danger: true,
      icon: <CloseOutlined />,
    },
    linkProps: {
      link: -1,
    },
  },
};

const AppButton = ({
  type,
  className,
  children,
  responsive,
  link,
  linkOptions,
  onClick = () => {},
  ...rest
}) => {
  const media = useResponsive();
  const navigate = useNavigate();

  const handleClick = (e) => {
    onClick(e);
    if (!link) link = mapType[type].linkProps?.link;
    if (link) navigate(link, { ...linkOptions });
  };

  return (
    <Button
      className={className}
      onClick={handleClick}
      {...mapType[type].buttonProps}
      {...rest}
    >
      {media.isXs || !responsive ? children : null}
    </Button>
  );
};

AppButton.propTypes = {
  type: PropTypes.oneOf(Object.keys(mapType)),
};

export default AppButton;
