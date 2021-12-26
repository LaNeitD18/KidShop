import { Checkbox, Form, Input, message } from 'antd';
import AppButton from '../components/AppButton';
import useApiFeedback from '../hooks/useApiFeedback';
import { login, verifyToken } from '../api/auth';
import { fireError, fireSuccessModal } from '../utils/feedback';
import useLocalStorage from '../hooks/useLocalStorage';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserByUsername } from '../api/user';
import { LoginOutlined } from '@ant-design/icons';
import { useRoles } from '../context/RolesContext';

export function LoginPage() {
  const [form] = Form.useForm();
  const [loginCall, loginLoading] = useApiFeedback();

  const navigate = useNavigate();
  const [user, setUser] = useLocalStorage('user');
  const [roles, updateRoles, setRoles] = useRoles();

  useEffect(() => {
    if (user?.token) {
      verifyToken(user.token)
        .then(() => navigate('/', { replace: true }))
        .catch(() => setUser(null));
    }
  }, [user]);

  function onFinish(values) {
    loginCall(
      login({
        tenTaiKhoan: values.username,
        matKhau: values.password,
      }),
      (res) => {
        getUserByUsername(values.username)
          .then(({ data }) => {
            setUser({
              id: data[0].id,
              hoTen: data[0].hoTen,
              gioiTinh: data[0].gioiTinh,
              token: res.data.accessToken,
            });
            updateRoles();
          })
          .catch((err) => fireError(err));
        form.resetFields();
      },
      (err) => {
        if (err?.response?.status === 401) {
          message.error('Sai tên đăng nhập hoặc mật khẩu');
        } else {
          fireError(err);
        }
      }
    );
  }

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
                loading={loginLoading}
                type="done"
                className="w-full"
                htmlType="submit"
                size="large"
                icon={<LoginOutlined />}
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
