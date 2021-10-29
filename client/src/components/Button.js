import { Button } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { useResponsive } from './Media'

export function AddButton({ className, children, ...rest }) {
  const media = useResponsive()
  return (
    <Button
      type="primary"
      className={className}
      icon={<PlusOutlined />}
      {...rest}
    >
      {media.isXs ? children : null}
    </Button>
  )
}

export function DeleteButton({ className, children, ...rest }) {
  const media = useResponsive()
  return (
    <Button
      type="danger"
      className={className}
      icon={<DeleteOutlined />}
      {...rest}
    >
      {media.isXs ? children : null}
    </Button>
  )
}
