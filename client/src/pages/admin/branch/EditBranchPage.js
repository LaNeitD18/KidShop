import React, { useState } from 'react';
import AppButton from '../../../components/AppButton';
import { Form, Input, Select } from 'antd';
import { ContentHeader } from '../../../components/Content';
import Map from '../../../components/Map';

const { Option } = Select;

const addConsts = {
  title: 'Tạo chi nhánh',
  okText: 'Hoàn tất',
};

const editConsts = {
  title: 'Sửa chi nhánh',
  okText: 'Lưu thay đổi',
};

export default function EditBranchPage({ mode }) {
  const [mapLocation, setMapLocation] = useState({
    coordinates: [106.8045253, 10.8710132],
    address: 'Xa Lộ Hà Nội 58/47, Hồ Chí Minh, Hồ Chí Minh, 71308',
  });
  const onFinish = (values) => {
    console.log('form', values);
  };

  const onFinishFailed = (errorInfo) => {};

  const isEdit = mode === 'edit';
  const byModes = isEdit ? editConsts : addConsts;

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
            onFinishFailed={onFinishFailed}
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
              <Select size="large" showSearch placeholder="Chọn...">
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
              </Select>
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
                  <AppButton type="delete" className="w-full" size="large">
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
