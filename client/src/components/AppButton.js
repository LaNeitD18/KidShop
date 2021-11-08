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
      children: 'Tạo mới',
    },
    linkProps: {
      link: 'add',
    },
  },
  done: {
    buttonProps: {
      type: 'primary',
      icon: <CheckOutlined />,
      children: 'Hoàn tất',
    },
  },
  delete: {
    buttonProps: {
      type: 'danger',
      icon: <DeleteOutlined />,
      children: 'Xóa',
    },
  },
  cancel: {
    buttonProps: {
      danger: true,
      icon: <CloseOutlined />,
      children: 'Hủy bỏ',
    },
    linkProps: {
      link: '../',
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
  onClick,
  loading,
  ...rest
}) {
  const media = useResponsive();
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      link = link || mapType[type].linkProps?.link;
      if (link) navigate(link, { ...linkOptions });
    }
  };

  return (
    <Button
      className={className}
      onClick={handleClick}
      loading={loading}
      {...mapType[type].buttonProps}
      {...rest}
    >
      {media.isXs || !responsive
        ? children || mapType[type]?.buttonProps?.children
        : null}
    </Button>
  );
}
