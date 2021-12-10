import React, { useEffect, useState } from 'react';
import AppButton from '../../components/AppButton';
import { Form, Input, message } from 'antd';
import { ContentHeader } from '../../components/Content';
import Map from '../../components/Map';
import {
  deleteSupplier,
  editSupplier,
  fetchASupplier,
  createSupplier,
} from '../../api/supplier';
import useApiFeedback from '../../hooks/useApiFeedback';
import { useNavigate, useParams } from 'react-router-dom';
import { inputRuleNaN } from '../../utils/string';
import { fireSuccessModal } from '../../utils/feedback';

const addConsts = {
  title: 'Tạo nhà cung cấp',
  okText: 'Hoàn tất',
};

const editConsts = {
  title: 'Sửa nhà cung cấp',
  okText: 'Lưu thay đổi',
};

const defaultMapLct = {
  coordinates: [106.80452, 10.871013],
  address: 'Xa Lộ Hà Nội 58/47, Hồ Chí Minh, Hồ Chí Minh, 71308',
};

export default function EditSupplierPage({ mode }) {
  const isEdit = mode === 'edit';
  const byModes = isEdit ? editConsts : addConsts;

  const { supplierId } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [mapCenter, setMapCenter] = useState(defaultMapLct.coordinates);
  const [mapLocation, setMapLocation] = useState(defaultMapLct);

  const [getCall] = useApiFeedback();
  const [postCall, postLoad] = useApiFeedback();
  const [editCall, editLoad] = useApiFeedback();
  const [deleteCall, deleteLoad] = useApiFeedback();

  useEffect(() => {
    if (isEdit) {
      getCall(fetchASupplier(supplierId), ({ data }) => {
        form.setFieldsValue(data);
        setMapLocation({
          coordinates: [data?.kinhDo, data?.viDo],
          address: data?.viTri,
        });
        setMapCenter([data?.kinhDo, data?.viDo]);
      });
    }
  }, []);

  const onFinish = (values) => {
    const dto = {
      ...values,
      kinhDo: mapLocation?.coordinates[0],
      viDo: mapLocation?.coordinates[1],
      viTri: mapLocation?.address,
    };
    if (isEdit) {
      editCall(editSupplier(supplierId, dto), () => {
        message.success('Đã lưu thay đổi thành công');
      });
    } else {
      postCall(createSupplier(dto), () => {
        fireSuccessModal({
          title: 'Tạo nhà sản xuất thành công',
          onOk: () => {
            form.resetFields();
            setMapLocation(defaultMapLct);
            setMapCenter(defaultMapLct.coordinates);
          },
          onCancel: () => {
            navigate('../');
          },
        });
      });
    }
  };

  function handleDelete() {
    deleteCall(deleteSupplier(supplierId), () => {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 xl:gap-14">
        <Map
          center={mapCenter}
          mapLocation={mapLocation}
          onChangeMapLocation={setMapLocation}
        />
        <div>
          <Form
            form={form}
            name="create-branch"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Tên nhà cung cấp"
              name="tenNCC"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên nhà sản xuất',
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              requiredMark="optional"
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
            <Form.Item label="Vị trí (chọn trên bản đồ)">
              <Input
                size="large"
                disabled
                value={mapLocation?.address}
                name="map-location"
              />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="sdt"
              requiredMark="optional"
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
                      title: 'Bạn có muốn xóa chi nhánh này?',
                    }}
                  >
                    Xóa nhà cung cấp
                  </AppButton>
                </Form.Item>
              )}
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
