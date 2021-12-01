import { Typography } from 'antd';
import { useResponsive } from './Media';

const { Title } = Typography;

export function ContentHeader({ title, children, className = 'mb-6' }) {
  const media = useResponsive();
  return (
    <div
      className={
        'flex flex-wrap justify-between items-center gap-2 mb-4 ' + className
      }
    >
      <Title level={media.isXs ? 3 : 4}>{title}</Title>
      <div className="flex-1 flex flex-row-reverse gap-2">{children}</div>
    </div>
  );
}
