import { useNavigate } from 'react-router-dom';
import { Result, Button } from 'antd';

export default function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex justify-center items-center">
      <Result
        status="404"
        title="404 - Không tìm thấy"
        subTitle="Trang bạn đang tìm kiếm không tồn tại."
        extra={
          <div className="gap-6 flex flex-wrap justify-center mb-16">
            <Button
              onClick={() => {
                navigate('/', { replace: true });
              }}
            >
              Về trang chủ
            </Button>
            <Button
              type="primary"
              onClick={() => {
                navigate(-1);
              }}
            >
              Về trang trước
            </Button>
          </div>
        }
      />
    </div>
  );
}
