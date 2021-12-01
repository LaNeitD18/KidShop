import React, { useEffect, useRef, useState } from 'react';
import AppButton from '../../../components/AppButton';
import { Form, Input, InputNumber, message } from 'antd';
import { ContentHeader } from '../../../components/Content';
import {
  deleteStore,
  editStore,
  getStore,
  postStore,
} from '../../../api/store';
import { SelectInput, UploadImageInput } from '../../../components/Inputs';
import useApiFeedback from '../../../hooks/useApiFeedback';
import { useNavigate, useParams } from 'react-router-dom';
import { fireError, fireSuccessModal } from '../../../utils/feedback';
import { FormGrid } from '../../../components/Grid';
import { ExpandableImage } from '../../../components/Images';
import { fetchProducers } from '../../../api/producer';

const addConsts = {
  title: 'Tạo mặt hàng',
  okText: 'Hoàn tất',
};

const editConsts = {
  title: 'Sửa mặt hàng',
  okText: 'Lưu thay đổi',
};

export default function EditProductPage({ mode }) {
  const isEdit = mode === 'edit';
  const byModes = isEdit ? editConsts : addConsts;

  const { branchId } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [getCall] = useApiFeedback();
  const [postCall, postLoad] = useApiFeedback();
  const [editCall, editLoad] = useApiFeedback();
  const [deleteCall, deleteLoad] = useApiFeedback();
  const [producers, setProducers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchProducers()
      .then((res) => {
        setProducers(res.data);
      })
      .catch((err) => fireError(err));
  }, []);

  useEffect(() => {
    if (isEdit) {
      getCall(getStore(branchId), ({ data }) => {
        form.setFieldsValue({
          ...data,
          idChuCuaHang: data?.chuCuaHang?.id,
        });
      });
    }
  }, []);

  const onFinish = (values) => {
    const dto = {
      ...values,
    };
    console.log(dto);
    if (isEdit) {
      editCall(editStore(branchId, dto), () => {
        message.success('Đã lưu thay đổi thành công');
      });
    } else {
      postCall(postStore(dto), () => {
        fireSuccessModal({
          title: 'Tạo mặt hàng thành công',
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
    deleteCall(deleteStore(branchId), () => {
      message.success('Đã xóa thành công');
      navigate('../');
    });
  }

  const [imgUrl, setImgUrl] = useState(null);

  return (
    <div>
      <ContentHeader title={byModes.title}>
        <AppButton type="cancel" responsive>
          Hủy bỏ
        </AppButton>
      </ContentHeader>
      <Form
        form={form}
        name="create-branch"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <FormGrid column={3}>
          <div>
            <Form.Item label="Ảnh sản phẩm">
              <ExpandableImage src={imgUrl} height={454} />
            </Form.Item>
          </div>
          <div>
            <Form.Item
              label="Tên mặt hàng"
              requiredMark="optional"
              name="tenMH"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên mặt hàng',
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item label="Liên kết hình ảnh">
              <UploadImageInput onValueChange={setImgUrl} />
            </Form.Item>

            <Form.Item
              label="Đơn vị"
              requiredMark="optional"
              name="donVi"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên đơn vị',
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item label="Màu sắc" name="mauSac">
              <Input size="large" />
            </Form.Item>

            <Form.Item label="Kích thước" name="kichThuoc">
              <Input size="large" />
            </Form.Item>
          </div>
          <div className="md:col-span-2 xl:col-span-1">
            <Form.Item
              label="Nhà sản xuất"
              name="idNSX"
              requiredMark="optional"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn nhà sản xuất',
                },
              ]}
            >
              <SelectInput
                data={producers.map((u) => ({
                  label: u.tenNSX,
                  value: u.id,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="Nhà cung cấp"
              name="idNCC"
              requiredMark="optional"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn nhà cung cấp',
                },
              ]}
            >
              <SelectInput
                data={producers.map((u) => ({
                  label: u.tenNSX,
                  value: u.id,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="Giá nhập (VNĐ)"
              requiredMark="optional"
              name="giaNhap"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập giá nhập',
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                formatter={(value) =>
                  value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                size="large"
                step={1000}
              />
            </Form.Item>

            <Form.Item
              label="Giá bán (VNĐ)"
              requiredMark="optional"
              name="giaBan"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập giá bán',
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                formatter={(value) =>
                  value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                size="large"
                step={1000}
              />
            </Form.Item>
            <div className="xs:flex flex-row-reverse items-center gap-6 mt-8 xl:mt-14">
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
                      title: 'Bạn có muốn xóa mặt hàng này?',
                    }}
                  >
                    Xóa mặt hàng
                  </AppButton>
                </Form.Item>
              )}
            </div>
          </div>
        </FormGrid>
      </Form>
    </div>
  );
}
