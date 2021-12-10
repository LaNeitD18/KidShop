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
import { fireConfirmModal } from '../utils/feedback';

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
  normal: {
    buttonProps: {},
  },
};

export default function AppButton({
  type = 'normal',
  className,
  children,
  responsive,
  link,
  linkOptions,
  onClick,
  confirm,
  loading,
  icon,
  buttonType,
  ...rest
}) {
  const media = useResponsive();
  const navigate = useNavigate();

  const handleClick = (e) => {
    const getOnClick = () => {
      if (onClick) {
        return onClick;
      } else {
        link = link || mapType[type].linkProps?.link;
        if (link) return () => navigate(link, { ...linkOptions });
      }
    };
    if (confirm || type === 'delete') {
      fireConfirmModal({ ...confirm, onOk: getOnClick() });
    } else {
      const onClickRes = getOnClick();
      if (onClickRes) {
        onClickRes();
      }
    }
  };

  icon = icon || mapType[type].buttonProps.icon;
  buttonType = buttonType || mapType[type].buttonProps.type;

  return (
    <Button
      className={className}
      onClick={handleClick}
      loading={loading}
      {...mapType[type].buttonProps}
      icon={icon}
      type={buttonType}
      {...rest}
    >
      {media.isXs || !responsive
        ? children || mapType[type]?.buttonProps?.children
        : null}
    </Button>
  );
}

export function TextButton({ icon, children }) {
  return (
    <button className="w-full flex items-center gap-2 justify-center font-semibold p-2 cursor-pointer hover:text-primary">
      {icon}
      {children}
    </button>
  );
}
