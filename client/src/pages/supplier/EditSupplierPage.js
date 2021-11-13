import React, { useContext, useState } from 'react';
import { Form, Input } from 'antd';
import AppButton from '../../components/AppButton';
import { ContentHeader } from '../../components/Content';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import CommonString from '../../constants/string';
import * as api from '../../api/supplier';
import { SupplierContext } from '../../context/SupplierContext';
import { useLocation, useNavigate } from 'react-router';
import { fireErrorModal, useFireSuccessModal } from '../../utils/feedback';
import Map from '../../components/Map';

const addConsts = {
  title: CommonString.SUPPLIER_ADD,
  okText: CommonString.FINISH_ADD,
};

const editConsts = {
  title: CommonString.SUPPLIER_EDIT,
  okText: CommonString.FINISH_EDIT,
};

const defaultMapLocation = {
  coordinates: [106.80452, 10.871013],
  address: 'Xa Lộ Hà Nội 58/47, Hồ Chí Minh, Hồ Chí Minh, 71308',
};

export default function EditSupplierPage({ mode }) {
  const fireSuccessModal = useFireSuccessModal();
  const navigate = useNavigate();
  const location = useLocation();

  const [form] = Form.useForm();

  const [mapLocation, setMapLocation] = useState(defaultMapLocation);

  const [listSuppliers] = useContext(SupplierContext);
  const selectedSupplier = location.state ?? {
    tenNCC: '',
    diaChi: '',
    sdt: '',
  };

  const handleCreateSupplier = async (values) => {
    try {
      const data = {
        tenNCC: values.name,
        diaChi: values.address,
        sdt: values.phone ?? null,
      };

      const newSupplier = await api
        .createSupplier(data)
        .catch((err) => console.log(err));
      listSuppliers.push(newSupplier);
      fireSuccessModal({
        title: 'Tạo nhà cung cấp thành công',
        onOk: () => {
          form.resetFields();
        },
        onCancel: () => navigate('../'),
      });
    } catch (error) {
      fireErrorModal(error);
    }
  };

  const handleEditSupplier = async (values) => {
    try {
      const data = {
        tenNCC: values.name,
        diaChi: values.address,
        sdt: values.phone ?? null,
      };

      const supplierIndex = listSuppliers.findIndex(
        (sup) => sup.id === selectedSupplier.id
      );
      const updatedSupplier = await api.editSupplier(selectedSupplier.id, data);
      listSuppliers[supplierIndex] = updatedSupplier;
      alert(CommonString.SUPPLIER_EDIT_SUCCESS);
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = async (values) => {
    if (mode === 'edit') {
      await handleEditSupplier(values);
    } else {
      await handleCreateSupplier(values);
    }
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const isEdit = mode === 'edit';
  const byModes = isEdit ? editConsts : addConsts;

  return (
    <div>
      <ContentHeader title={byModes.title}>
        <AppButton type="cancel" onClick={() => navigate(-1)} responsive>
          {CommonString.CANCEL}
        </AppButton>
      </ContentHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 xl:gap-14">
        <Map mapLocation={mapLocation} onChangeMapLocation={setMapLocation} />
        <div>
          <Form
            form={form}
            name="create-supplier"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label={CommonString.SUPPLIER_NAME}
              requiredMark="optional"
              name="name"
              rules={[
                {
                  required: true,
                  message: CommonString.SUPPLIER_ADDRESS_EMPTY,
                },
              ]}
              initialValue={selectedSupplier.tenNCC}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              label={CommonString.SUPPLIER_ADDRESS}
              requiredMark="optional"
              name="address"
              rules={[
                {
                  required: true,
                  message: CommonString.SUPPLIER_ADDRESS_EMPTY,
                },
              ]}
              initialValue={selectedSupplier.diaChi}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label={CommonString.SUPPLIER_PHONE}
              name="phone"
              requiredMark="optional"
              initialValue={selectedSupplier.sdt}
              rules={[
                {
                  pattern: new RegExp(CommonString.REGEX_PHONE_NUMBER),
                  message: CommonString.SUPPLIER_PHONE_NAN,
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
                    {CommonString.SUPPLIER_DELETE}
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
