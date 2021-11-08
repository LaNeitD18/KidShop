import React, { useEffect, useState } from 'react';
import AppButton from '../../../components/AppButton';
import { Form, Input } from 'antd';
import { ContentHeader } from '../../../components/Content';
import Map from '../../../components/Map';
import { getStore, postStore } from '../../../api/store';
import { getUserList } from '../../../api/user';
import SelectInput from '../../../components/SelectInput';
import useLoading from '../../../hooks/useApiFeedback';
import { useParams } from 'react-router-dom';

const addConsts = {
  title: 'Tạo chi nhánh',
  okText: 'Hoàn tất',
};

const editConsts = {
  title: 'Sửa chi nhánh',
  okText: 'Lưu thay đổi',
};

const defaultMapLocation = {
  coordinates: [106.80452, 10.871013],
  address: 'Xa Lộ Hà Nội 58/47, Hồ Chí Minh, Hồ Chí Minh, 71308',
};

export default function EditBranchPage({ mode }) {
  const { id } = useParams();

  const [form] = Form.useForm();

  const [mapLocation, setMapLocation] = useState(defaultMapLocation);

  const { apiCall: postCall, loading: postLoad } = useLoading();
  const { apiCall: getCall, loading: getLoad, result } = useLoading();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUserList().then((res) => {
      setUsers(res.data);
    });
    if (mode === 'edit') {
      getCall(getStore(id), (feedback, { data }) => {
        form.setFieldsValue({
          ...data,
          idChuCuaHang: data?.chuCuaHang?.id,
        });
        console.log('kinh vi', data?.kinhDo, data?.viDo);
        setMapLocation({
          coordinates: [data?.kinhDo, data?.viDo],
          address: data?.viTri,
        });
      });
    }
  }, []);

  const isEdit = mode === 'edit';
  const byModes = isEdit ? editConsts : addConsts;

  const onFinish = (values) => {
    console.log({
      kinhDo: mapLocation.coordinates[0],
      viDo: mapLocation.coordinates[1],
      viTri: mapLocation.address,
    });
    postCall(
      postStore({
        ...values,
        kinhDo: mapLocation.coordinates[0],
        viDo: mapLocation.coordinates[1],
        viTri: mapLocation.address,
      }),
      (feedback) => {
        feedback({
          type: 'modal',
          name: 'Tạo chi nhánh thành công',
          onContinue: () => {
            form.resetFields();
            setMapLocation(defaultMapLocation);
          },
        });
      }
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
            form={form}
            name="create-branch"
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
                value={mapLocation.address}
                name="map-location"
              />
            </Form.Item>

            <Form.Item
              label="Chủ cửa hàng"
              name="idChuCuaHang"
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
              name="sdt"
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
                  loading={postLoad}
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
                    loading={postLoad}
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
