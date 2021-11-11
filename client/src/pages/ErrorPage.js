import { useLocation, useNavigate } from 'react-router-dom';
import { Result, Button } from 'antd';
import { stringToPaths } from '../utils/route';

export default function ErrorPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const status = () => {
    const extractedCode = stringToPaths(pathname)[1];
    switch (extractedCode) {
      case '404':
        return {
          code: 404,
          title: 'Không tìm thấy',
          subTitle: 'Trang bạn đang tìm kiếm không tồn tại.',
        };
      case '403':
        return {
          code: 403,
          title: 'Không có quyền truy cập',
          subTitle: 'Bạn không có quyền truy cập trang này',
        };
      default:
        return {
          code: 404,
          title: 'Không tìm thấy',
          subTitle: 'Trang bạn đang tìm kiếm không tồn tại.',
        };
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <Result
        status={status().code}
        title={`${status().code} - ${status().title}`}
        subTitle={status().subTitle}
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
