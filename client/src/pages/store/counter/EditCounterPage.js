import React, { useEffect } from 'react';
import AppButton from '../../../components/AppButton';
import { Form, Input, message } from 'antd';
import { ContentHeader } from '../../../components/Content';
import {
  createCounter,
  editCounter,
  getCounter,
  deleteCounter,
} from '../../../api/counter';
import { SelectInput } from '../../../components/Inputs';
import useApiFeedback from '../../../hooks/useApiFeedback';
import { useNavigate, useParams } from 'react-router-dom';
import { idString } from '../../../utils/string';
import { fireSuccessModal } from '../../../utils/feedback';
import { FormGrid, OneColumnFormContainer } from '../../../components/Grid';
import { useRoles } from '../../../context/RolesContext';

const addConsts = {
  title: 'Tạo quầy',
  okText: 'Hoàn tất',
};

const editConsts = {
  title: 'Sửa quầy',
  okText: 'Lưu thay đổi',
};

export default function EditCounterPage({ mode }) {
  const isEdit = mode === 'edit';
  const byModes = isEdit ? editConsts : addConsts;

  const [roles] = useRoles();

  const { storeId, counterId } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [getCall] = useApiFeedback();
  const [postCall, postLoad] = useApiFeedback();
  const [editCall, editLoad] = useApiFeedback();
  const [deleteCall, deleteLoad] = useApiFeedback();

  useEffect(() => {
    form.setFieldsValue({
      ...form.getFieldsValue(),
      idCuaHang: storeId,
    });
  }, [storeId]);

  useEffect(() => {
    if (!isEdit) return;
    getCall(getCounter(counterId), ({ data }) => {
      if (data?.cuaHang?.id.toString() !== storeId) {
        navigate('/error/404', { replace: true });
        return;
      }
      form.setFieldsValue({
        idCuaHang: storeId,
        tenQuay: data?.tenQuay,
        trangThai: data?.dangHoatDong ? '1' : '0',
        nhanVienTruc: data?.dangHoatDong ? data?.nhanVienTruc?.hoTen : null,
      });
    });
  }, [storeId]);

  const onFinish = (values) => {
    if (isEdit) {
      editCall(
        editCounter(counterId, {
          idCuaHang: values.idCuaHang,
          tenQuay: values.tenQuay,
        }),
        () => {
          message.success('Lưu thay đổi thành công');
        }
      );
    } else {
      postCall(
        createCounter({
          ...values,
        }),
        () => {
          fireSuccessModal({
            title: 'Tạo quầy thành công',
            onOk: () => {
              form.setFieldsValue({
                idCuaHang: storeId,
                tenQuay: null,
              });
            },
          });
        }
      );
    }
  };

  function handleDelete() {
    deleteCall(deleteCounter(counterId), () => {
      message.success('Xóa quầy thành công');
      navigate('../');
    });
  }

  return (
    <FormGrid>
      <ContentHeader title={byModes.title}>
        <AppButton type="cancel" responsive>
          Hủy bỏ
        </AppButton>
      </ContentHeader>
      <OneColumnFormContainer>
        <div>
          <Form
            form={form}
            name="create-branch"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Cửa hàng"
              requiredMark="optional"
              name="idCuaHang"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng ',
                },
              ]}
            >
              <SelectInput
                data={roles?.stores?.map((id) => ({
                  value: id,
                  label: idString(id, ['CH', 4]),
                }))}
                showId={false}
              />
            </Form.Item>
            <Form.Item
              label="Tên quầy"
              requiredMark="optional"
              name="tenQuay"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên quầy',
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
            {isEdit && (
              <Form.Item
                label="Trạng thái"
                requiredMark="optional"
                name="trangThai"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập địa chỉ',
                  },
                ]}
              >
                <SelectInput
                  disabled
                  data={[
                    { label: 'Đang đóng', value: 0 },
                    { label: 'Đang hoạt động', value: 1 },
                  ]}
                  showId={false}
                  allowClear={false}
                  showSearch={false}
                />
              </Form.Item>
            )}
            {isEdit && (
              <Form.Item label="Nhân viên trực" name="nhanVienTruc">
                <Input size="large" disabled />
              </Form.Item>
            )}
            <div className="xs:flex flex-row-reverse items-center gap-6 mt-8 xs:mt-12">
              <Form.Item className="flex-1">
                <AppButton
                  loading={postLoad || editLoad}
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
                    loading={deleteLoad}
                    confirm={{
                      title: 'Bạn có muốn xóa quầy này?',
                    }}
                  >
                    Xóa quầy
                  </AppButton>
                </Form.Item>
              )}
            </div>
          </Form>
        </div>
      </OneColumnFormContainer>
    </FormGrid>
  );
}
