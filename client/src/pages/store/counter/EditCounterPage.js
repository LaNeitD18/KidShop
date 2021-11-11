import React, { useEffect, useState } from 'react';
import AppButton from '../../../components/AppButton';
import { Form, Input, message } from 'antd';
import { ContentHeader } from '../../../components/Content';
import Map from '../../../components/Map';
import {
  deleteStore,
  editStore,
  getStore,
  postStore,
} from '../../../api/store';
import { getUserList } from '../../../api/user';
import SelectInput from '../../../components/SelectInput';
import useApiFeedback from '../../../hooks/useApiFeedback';
import { useNavigate, useParams } from 'react-router-dom';
import { inputRuleNaN } from '../../../utils/string';
import { fireSuccessModal, useFireSuccessModal } from '../../../utils/feedback';
import { FormGrid } from '../../../components/Grid';
import { useCurrentUser } from '../../../context/CurrentUserProvider';

const addConsts = {
  title: 'Tạo quầy',
  okText: 'Hoàn tất',
};

const editConsts = {
  title: 'Sửa chi nhánh',
  okText: 'Lưu thay đổi',
};

const defaultMapLct = {
  coordinates: [106.80452, 10.871013],
  address: 'Xa Lộ Hà Nội 58/47, Hồ Chí Minh, Hồ Chí Minh, 71308',
};

export default function EditCounterPage({ mode }) {
  const isEdit = mode === 'edit';
  const byModes = isEdit ? editConsts : addConsts;

  const [currentUser, setCurrentUser] = useCurrentUser();

  const { id } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [mapCenter, setMapCenter] = useState(defaultMapLct.coordinates);
  const [mapLocation, setMapLocation] = useState(defaultMapLct);

  const { apiCall: getCall } = useApiFeedback();
  const { apiCall: postCall, loading: postLoad } = useApiFeedback();
  const { apiCall: editCall, loading: editLoad } = useApiFeedback();
  const { apiCall: deleteCall, loading: deleteLoad } = useApiFeedback();

  useEffect(() => {
    if (isEdit) {
      getCall(getStore(id), ({ data }) => {
        form.setFieldsValue({
          ...data,
          idChuCuaHang: data?.chuCuaHang?.id,
        });
        setMapLocation({
          coordinates: [data?.kinhDo, data?.viDo],
          address: data?.viTri,
        });
        setMapCenter([data?.kinhDo, data?.viDo]);
      });
    }
  }, []);

  useEffect(() => {
    setCurrentUser((prev) => ({
      ...prev,
      storeList: [1, 3, 5],
      currentStore: 3,
    }));
  }, []);

  const onFinish = (values) => {
    const dto = {
      ...values,
      kinhDo: mapLocation?.coordinates[0],
      viDo: mapLocation?.coordinates[1],
      viTri: mapLocation?.address,
    };
    console.log(dto);
    if (isEdit) {
      editCall(editStore(id, dto), () => {
        message.success('Đã lưu thay đổi thành công');
      });
    } else {
      postCall(postStore(dto), () => {
        fireSuccessModal({
          title: 'Tạo chi nhánh thành công',
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
    deleteCall(deleteStore(id), () => {
      message.success('Đã xóa thành công');
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
      <div className="gap-6 md:gap-10 xl:gap-14 mt-7">
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
                labelField="label"
                data={[{ label: 'CH0001', id: 1 }]}
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
                  data={[
                    { label: 'Đang đóng', id: 0 },
                    { label: 'Đang hoạt động', id: 1 },
                  ]}
                  showId={false}
                  allowClear={false}
                  showSearch={false}
                />
              </Form.Item>
            )}
            {isEdit && (
              <Form.Item label="Nhân viên trực" name="idNhanVienTruc">
                <SelectInput
                  data={[
                    { label: 'Đang đóng', id: 0 },
                    { label: 'Đang hoạt động', id: 1 },
                  ]}
                  showId={false}
                  allowClear={false}
                  showSearch={false}
                />
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
                      title: 'Bạn có muốn xóa chi nhánh này?',
                    }}
                  >
                    Xóa chi nhánh
                  </AppButton>
                </Form.Item>
              )}
            </div>
          </Form>
        </div>
      </div>
    </FormGrid>
  );
}
