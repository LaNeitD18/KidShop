import React, { useEffect, useState } from 'react';
import AppButton from '../../../components/AppButton';
import { Form, Input, message, Select } from 'antd';
import { ContentHeader } from '../../../components/Content';
import Map from '../../../components/Map';
import { postStore } from '../../../api/store';
import { getUserList } from '../../../api/user';
import SelectInput from '../../../components/SelectInput';
import useLoading from '../../../hooks/useApiResult';

const addConsts = {
  title: 'Tạo chi nhánh',
  okText: 'Hoàn tất',
};

const editConsts = {
  title: 'Sửa chi nhánh',
  okText: 'Lưu thay đổi',
};

export default function EditBranchPage({ mode }) {
  const { apiCall, loading } = useLoading();
  const [users, setUsers] = useState([]);
  const [mapLocation, setMapLocation] = useState({
    coordinates: [106.80452, 10.871013],
    address: 'Xa Lộ Hà Nội 58/47, Hồ Chí Minh, Hồ Chí Minh, 71308',
  });

  useEffect(() => {
    getUserList().then((res) => {
      setUsers(res.data);
    });
  }, []);

  const isEdit = mode === 'edit';
  const byModes = isEdit ? editConsts : addConsts;

  const onFinish = (values) => {
    apiCall(
      postStore({
        diaChi: values.address,
        kinhDo: mapLocation.coordinates[0],
        viDo: mapLocation.coordinates[1],
        viTri: mapLocation.address,
        maChuCuaHang: values.owner,
      }),
      (res) => console.log('res', res),
      (err) => console.log('err', err)
    );
  };

  return (
    <div>
      <ContentHeader title={byModes.title}>
        <AppButton type="cancel" responsive>
          Hủy bỏ
        </AppButton>
      </ContentHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 xl:gap-14">
        <Map mapLocation={mapLocation} onChangeMapLocation={setMapLocation} />
        <div>
          <Form
            name="create-branch"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Địa chỉ"
              requiredMark="optional"
              name="address"
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
                value={mapLocation.address}
                name="map-location"
              />
            </Form.Item>

            <Form.Item
              label="Chủ cửa hàng"
              name="owner"
              requiredMark="optional"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn chủ cửa hàng',
                },
              ]}
            >
              <SelectInput data={users} />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              requiredMark="optional"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số điện thoại!',
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <div className="xs:flex flex-row-reverse items-center gap-6 mt-8 xs:mt-12">
              <Form.Item className="flex-1">
                <AppButton
                  loading={loading}
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
                    type="delete"
                    className="w-full"
                    size="large"
                    loading={loading}
                  >
                    Xóa chi nhánh
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
