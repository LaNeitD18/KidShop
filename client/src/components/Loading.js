import { Result } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
export default function Loading() {
  return <Result icon={<LoadingOutlined />} title="Đang tải dữ liệu" />;
}
