import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Button, Checkbox, Select } from 'antd';
import MainContainer from '../../../components/MainContainer';
import {
  CancelButton,
  DeleteButton,
  DoneButton,
} from '../../../components/Button';
import { ContentHeader } from '../../../components/Content';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import * as tt from '@tomtom-international/web-sdk-maps';

const { Option } = Select;

const addConsts = {
  title: 'Tạo chi nhánh',
  okText: 'Hoàn tất',
};

const editConsts = {
  title: 'Sửa chi nhánh',
  okText: 'Lưu thay đổi',
};

const mapZoom = 6;

export default function EditBranchPage({ mode }) {
  const [mapLongitude, setMapLongitude] = useState(106.8045253);
  const [mapLatitude, setMapLatitude] = useState(10.8710132);

  const [map, setMap] = useState(null);
  const mapElement = useRef();

  useEffect(() => {
    let map = tt.map({
      key: 'IsOviojVHPpliKxoC7WZj9WtqaIQ6YPG',
      container: mapElement.current,
      center: [mapLongitude, mapLatitude],
      zoom: mapZoom,
    });
    setMap(map);
    return () => map.remove();
  }, []);

  useEffect(() => {
    if (map) {
      const passengerInitCoordinates = [mapLongitude, mapLatitude];
      let passengerMarker;
      function createPassengerMarker(markerCoordinates, popup) {
        const passengerMarkerElement = document.createElement('div');
        passengerMarkerElement.innerHTML =
          "<img src='https://i.ibb.co/Bn0XnWm/location-pin.png' style='width: 36px; height: 36px';>";
        return new tt.Marker({ element: passengerMarkerElement })
          .setLngLat(markerCoordinates)
          .setPopup(popup)
          .addTo(map);
      }
      passengerMarker = createPassengerMarker(
        passengerInitCoordinates,
        new tt.Popup({
          offset: 35,
          closeButton: false,
          closeOnClick: true,
          className: 'text-center w-28',
        }).setHTML('Cầm kéo thả để thay đổi vị trí')
      );
      passengerMarker.togglePopup();
    }
  }, [map]);

  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const isEdit = mode === 'edit';
  const byModes = isEdit ? editConsts : addConsts;

  return (
    <MainContainer path="admin/branch/add">
      <ContentHeader title={byModes.title}>
        <CancelButton responsive>Hủy bỏ</CancelButton>
      </ContentHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 xl:gap-14">
        <div ref={mapElement} className="h-96 md:h-128" />
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
            <div className="xs:flex gap-6">
              <Form.Item className="flex-1" label="Kinh độ" name="longitude">
                <Input size="large" />
              </Form.Item>
              <Form.Item className="flex-1" label="Hoành độ" name="latitude">
                <Input size="large" />
              </Form.Item>
            </div>

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
                <DoneButton className="w-full" htmlType="submit" size="large">
                  {byModes.okText}
                </DoneButton>
              </Form.Item>
              {!!isEdit && (
                <Form.Item className="flex-1">
                  <DeleteButton className="w-full" size="large">
                    Xóa chi nhánh
                  </DeleteButton>
                </Form.Item>
              )}
            </div>
          </Form>
        </div>
      </div>
    </MainContainer>
  );
}
