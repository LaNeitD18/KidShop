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

const addConsts = {
  title: 'Thêm nhân viên',
  okText: 'Hoàn tất',
};

const editConsts = {
  title: 'Sửa nhân viên',
  okText: 'Lưu thay đổi',
};

const defaultPassword = '12345678';

export default function EditEmployeePage({ mode }) {
  const isEdit = mode === 'edit';
  const byModes = isEdit ? editConsts : addConsts;

  const { employeeId } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [getUserCall] = useApiFeedback();
  const [postUserCall, postUserLoading] = useApiFeedback();
  const [editCall, editLoading] = useApiFeedback();
  const [deleteCall, deleteLoading] = useApiFeedback();

  const [group, setGroup] = useState([]);

  useEffect(() => {
    if (isEdit) {
      getUserCall(getUser(employeeId), ({ data }) => {
        form.setFieldsValue({
          ...data,
        });
        const quyen = data?.quyen || '[]';
        const quyenArr = JSON.parse(quyen)?.filter((e) => e);
        setGroup(quyenArr);
      });
    }
  }, []);

  const onFinish = (values) => {
    const dto = {
      ...values,
      matKhau: defaultPassword,
      quyen: JSON.stringify(group),
    };
    if (isEdit) {
      editCall(editUser(employeeId, dto), () => {
        message.success('Đã lưu thay đổi thành công');
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
    deleteCall(deleteUser(employeeId), () => {
      message.success('Đã xóa thành công');
      navigate('../');
    });
  }

  return (
    <div>
      <ContentHeader title={byModes.title}>
        <AppButton type="cancel" responsive>
          Hủy bỏ
        </AppButton>
      </ContentHeader>
      <Form
        form={form}
        name="edit-employee"
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
              {!!isEdit && (
                <Form.Item className="flex-1">
                  <AppButton
                    onClick={handleDelete}
                    type="delete"
                    className="w-full"
                    size="large"
                    loading={deleteLoading}
                    confirm={{
                      title: 'Bạn có muốn xóa nhân viên này?',
                    }}
                  >
                    Xóa nhân viên
                  </AppButton>
                </Form.Item>
              )}
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
