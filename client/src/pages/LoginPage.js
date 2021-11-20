import { Checkbox, Form, Input } from 'antd';
import { IoLogInOutline } from 'react-icons/io5';
import AppButton from '../components/AppButton';

export function LoginPage() {
  const [form] = Form.useForm();
  function onFinish() {}
  return (
    <div className="h-screen bg-kidshop bg-cover bg-no-repeat bg-center flex flex-col justify-center items-center p-4">
      <div className="bg-white w-full max-w-md border rounded-lg pb-8 pt-12 px-6 sm:px-10 flex flex-col shadow-sm">
        <span className="text-primary font-logo whitespace-nowrap self-center text-5xl mb-6">
          KidsShop
        </span>
        <div className="mt-4">
          <Form
            form={form}
            name="create-branch"
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              label="Tên người dùng"
              name="username"
              requiredMark="optional"
              rules={[
                { required: true, message: 'Vui lòng nhập tên người dùng' },
              ]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              requiredMark="optional"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password size="large" />
            </Form.Item>
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Tự đăng nhập lần sau</Checkbox>
            </Form.Item>
            <Form.Item className="flex-1">
              <AppButton
                // loading={loading}
                type="done"
                className="w-full"
                htmlType="submit"
                size="large"
                icon={<IoLogInOutline />}
              >
                Đăng nhập
              </AppButton>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
