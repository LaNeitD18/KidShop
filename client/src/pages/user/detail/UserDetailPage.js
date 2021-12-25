import React, { useEffect, useState } from 'react';
import AppButton from '../../../components/AppButton';
import { Cascader, Form, Input, message, Select } from 'antd';
import { ContentHeader } from '../../../components/Content';
import { createUser, deleteUser, editUser, getUser } from '../../../api/user';
import useApiFeedback from '../../../hooks/useApiFeedback';
import { useNavigate, useParams } from 'react-router-dom';
import { inputRuleNaN } from '../../../utils/string';
import { fireSuccessModal } from '../../../utils/feedback';
import { FormGrid } from '../../../components/Grid';
import { useRoles } from '../../../context/RolesContext';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { GROUP } from '../../../constants/enum';
import useLocalStorage from '../../../hooks/useLocalStorage';

const editConsts = {
  title: 'Sửa nhân viên',
  okText: 'Lưu thay đổi',
};

const defaultPassword = '12345678';

export default function UserDetailPage({ mode }) {
  const isEdit = true;
  const byModes = editConsts;
  const [user, setUser] = useLocalStorage('user');
  const userId = user?.id;

  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [getUserCall] = useApiFeedback();
  const [postUserCall, postUserLoading] = useApiFeedback();
  const [editCall, editLoading] = useApiFeedback();
  const [deleteCall, deleteLoading] = useApiFeedback();
  const [name, setName] = useState();

  const [group, setGroup] = useState([]);

  const fetchUser = () => {
    getUserCall(getUser(userId), ({ data }) => {
      form.setFieldsValue({
        ...data,
      });
      setName(data.hoTen);
      const quyen = data?.quyen || '[]';
      const quyenArr = JSON.parse(quyen)?.filter((e) => e);
      setGroup(quyenArr);
    });
  };
  useEffect(() => {
    if (isEdit) {
      fetchUser();
    }
  }, []);

  const onFinish = (values) => {
    const dto = {
      ...values,
      matKhau: defaultPassword,
      quyen: JSON.stringify(group),
    };
    if (isEdit) {
      editCall(editUser(userId, dto), ({ data }) => {
        message.success('Đã lưu thay đổi thành công');
        fetchUser();
      });
    } else {
      postUserCall(createUser(dto), () => {
        fireSuccessModal({
          title: 'Thêm nhân viên thành công',
          onOk: () => {
            form.resetFields();
          },
          onCancel: () => {
            navigate('../');
          },
        });
      });
    }
  };

  function handleDelete() {
    deleteCall(deleteUser(userId), () => {
      message.success('Đã xóa thành công');
      navigate('../');
    });
  }

  return (
    <div>
      <ContentHeader title={name || 'Đang tải'} />
      <Form
        form={form}
        name="create-branch"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <FormGrid column={2}>
          <div>
            <Form.Item
              label="Tên đăng nhập"
              name="tenTaiKhoan"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên đăng nhập',
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              label="Họ và tên"
              name="hoTen"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập họ và tên',
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              label="Giới tính"
              name="gioiTinh"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập giới tính',
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="sdt"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số điện thoại!',
                },
                inputRuleNaN(),
              ]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="diaChi"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập địa chỉ',
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
          </div>
          <div>
            <Form.Item label="Nhóm quyền">
              <Select
                disabled
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                size="large"
                placeholder="Chọn các quyền"
                value={group}
                onChange={(v) => {
                  setGroup(v);
                }}
                options={Object.keys(GROUP).map((k) => ({
                  value: k,
                  label: GROUP[k],
                }))}
              />
            </Form.Item>

            <div className="xs:flex flex-row-reverse items-center gap-6 mt-8 xs:mt-12">
              <Form.Item className="flex-1">
                <AppButton
                  loading={postUserLoading || editLoading}
                  type="done"
                  className="w-full"
                  htmlType="submit"
                  size="large"
                >
                  {byModes.okText}
                </AppButton>
              </Form.Item>
            </div>
            {!isEdit && (
              <p className="text-center text-gray-400">
                Mật khẩu mặc định là {defaultPassword}
              </p>
            )}
          </div>
        </FormGrid>
      </Form>
    </div>
  );
}
