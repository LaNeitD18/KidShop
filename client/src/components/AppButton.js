import React from 'react';
import { Button } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useResponsive } from './Media';
import { useNavigate } from 'react-router-dom';

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

export default function AppButton({
  type,
  className,
  children,
  responsive,
  link,
  linkOptions,
  onClick = () => {},
  ...rest
}) {
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
}
