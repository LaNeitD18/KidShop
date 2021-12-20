import { Result } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
export default function Loading() {
  return (
    <Result
      className="h-96 flex flex-col items-center justify-center"
      icon={<LoadingOutlined />}
      title="Đang tải dữ liệu"
    />
  );
}
