import { Typography } from 'antd'
import { useResponsive } from './Media'

const { Title } = Typography

export function ContentHeader({ title, children }) {
  const media = useResponsive()
  return (
    <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
      <Title level={media.isXs ? 2 : 5}>{title}</Title>
      <div className="flex-1 flex flex-row-reverse gap-2">{children}</div>
    </div>
  )
}
