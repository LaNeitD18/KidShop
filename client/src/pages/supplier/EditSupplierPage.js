import React, { useContext, useEffect } from 'react';
import { Form, Input, Select } from 'antd';
import {
  CancelButton,
  DeleteButton,
  DoneButton,
} from '../../components/Button';
import { ContentHeader } from '../../components/Content';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import CommonString from '../../constants/string';
import * as api from '../../api/supplier';
import { SupplierContext } from '../../context/SupplierContext';
import { useLocation, useNavigate } from 'react-router';

const addConsts = {
  title: CommonString.SUPPLIER_ADD,
  okText: CommonString.FINISH_ADD,
};

const editConsts = {
  title: CommonString.SUPPLIER_EDIT,
  okText: CommonString.FINISH_EDIT,
};

export default function EditSupplierPage({ mode }) {
  const navigate = useNavigate();
  const location = useLocation();

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
      alert(CommonString.SUPPLIER_ADD_SUCCESS);
      listSuppliers.push(newSupplier);
      navigate(-1);
    } catch (error) {
      console.log(error);
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
        <CancelButton onClick={() => navigate(-1)} responsive>
          {CommonString.CANCEL}
        </CancelButton>
      </ContentHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 xl:gap-14">
        <div>
          <Form
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
                  pattern: new RegExp(
                    /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g
                  ),
                  message: CommonString.SUPPLIER_PHONE_NAN,
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
                    {CommonString.SUPPLIER_DELETE}
                  </DeleteButton>
                </Form.Item>
              )}
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
