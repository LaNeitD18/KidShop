import React, { useEffect, useState } from 'react';
import AppButton from '../../components/AppButton';
import { Form, Input, message } from 'antd';
import { ContentHeader } from '../../components/Content';
import Map from '../../components/Map';
import {
  deleteWarehouse,
  editWarehouse,
  fetchAWarehouse,
  createWarehouse,
} from '../../api/warehouse';
import { SelectInput } from '../../components/Inputs';
import useApiFeedback from '../../hooks/useApiFeedback';
import { useNavigate, useParams } from 'react-router-dom';
import { inputRuleNaN } from '../../utils/string';
import { fireSuccessModal, useFireSuccessModal } from '../../utils/feedback';
import { FormGrid } from '../../components/Grid';
import CommonString from '../../constants/string';
import { getUserList } from '../../api/user';
import { useRoles } from '../../context/RolesContext';

const addConsts = {
  title: CommonString.WAREHOUSE_ADD,
  okText: CommonString.FINISH_ADD,
};

const editConsts = {
  title: CommonString.WAREHOUSE_EDIT,
  okText: CommonString.FINISH_EDIT,
};

const defaultMapLct = {
  coordinates: [106.80452, 10.871013],
  address: 'Xa Lộ Hà Nội 58/47, Hồ Chí Minh, Hồ Chí Minh, 71308',
};

export default function EditWarehousePage({ mode }) {
  const isEdit = mode === 'edit';
  const byModes = isEdit ? editConsts : addConsts;

  const { warehouseId } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [mapCenter, setMapCenter] = useState(defaultMapLct.coordinates);
  const [mapLocation, setMapLocation] = useState(defaultMapLct);

  const [getCall] = useApiFeedback();
  const [postCall, postLoad] = useApiFeedback();
  const [editCall, editLoad] = useApiFeedback();
  const [deleteCall, deleteLoad] = useApiFeedback();
  const [users, setUsers] = useState([]);

  const [roles, updateRoles] = useRoles();

  useEffect(() => {
    getUserList().then((res) => {
      setUsers(res.data);
    });
  }, []);

  useEffect(() => {
    if (isEdit) {
      getCall(fetchAWarehouse(warehouseId), ({ data }) => {
        form.setFieldsValue({
          ...data,
          idQuanLyKho: data?.quanLyKho?.id,
        });
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
      editCall(editWarehouse(warehouseId, dto), () => {
        message.success('Đã lưu thay đổi thành công');
      });
    } else {
      postCall(createWarehouse(dto), () => {
        updateRoles();
        fireSuccessModal({
          title: CommonString.WAREHOUSE_ADD_SUCCESS,
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
    deleteCall(deleteWarehouse(warehouseId), () => {
      updateRoles();
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
      <FormGrid column={2}>
        <Map
          center={mapCenter}
          mapLocation={mapLocation}
          onChangeMapLocation={setMapLocation}
        />
        <div>
          <Form
            form={form}
            name="create-warehouse"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
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
              label="Quản lý kho"
              name="idQuanLyKho"
              requiredMark="optional"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn quản lý kho',
                },
              ]}
            >
              <SelectInput
                data={users.map((u) => ({
                  label: u.hoTen,
                  value: u.id,
                }))}
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
                      title: 'Bạn có muốn xóa kho này?',
                    }}
                  >
                    Xóa kho
                  </AppButton>
                </Form.Item>
              )}
            </div>
          </Form>
        </div>
      </FormGrid>
    </div>
  );
}
