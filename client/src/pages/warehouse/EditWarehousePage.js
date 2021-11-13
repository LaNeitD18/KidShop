import React, { useContext } from 'react';
import { Form, Input } from 'antd';
import AppButton from '../../components/AppButton';
import { ContentHeader } from '../../components/Content';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import CommonString from '../../constants/string';
import * as api from '../../api/warehouse';
import { WarehouseContext } from '../../context';
import { useLocation, useNavigate } from 'react-router';

const addConsts = {
  title: CommonString.WAREHOUSE_ADD,
  okText: CommonString.FINISH_ADD,
};

const editConsts = {
  title: CommonString.WAREHOUSE_EDIT,
  okText: CommonString.FINISH_EDIT,
};

export default function EditWarehousePage({ mode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [listWarehouses] = useContext(WarehouseContext);
  const selectedWarehouse = location.state ?? {
    diaChi: '',
    sdt: '',
  };

  const handleCreateWarehouse = async (values) => {
    try {
      const data = {
        diaChi: values.address,
        sdt: values.phone ?? null,
      };

      const newWarehouse = await api
        .createWarehouse(data)
        .catch((err) => console.log(err));
      alert(CommonString.WAREHOUSE_ADD_SUCCESS);
      listWarehouses.push(newWarehouse);
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditWarehouse = async (values) => {
    try {
      const data = {
        diaChi: values.address,
        sdt: values.phone ?? null,
      };

      const warehouseIndex = listWarehouses.findIndex(
        (item) => item.id === selectedWarehouse.id
      );
      const updatedWarehouse = await api.editWarehouse(
        selectedWarehouse.id,
        data
      );
      listWarehouses[warehouseIndex] = updatedWarehouse;
      alert(CommonString.WAREHOUSE_EDIT_SUCCESS);
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = async (values) => {
    if (mode === 'edit') {
      await handleEditWarehouse(values);
    } else {
      await handleCreateWarehouse(values);
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
        {/* <div ref={mapElement} className="h-96 md:h-128" /> */}
        <div>
          <Form
            name="create-branch"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label={CommonString.WAREHOUSE_ADDRESS}
              requiredMark="optional"
              name="address"
              rules={[
                {
                  required: true,
                  message: CommonString.WAREHOUSE_ADDRESS_EMPTY,
                },
              ]}
              initialValue={selectedWarehouse.diaChi}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label={CommonString.WAREHOUSE_PHONE}
              name="phone"
              requiredMark="optional"
              initialValue={selectedWarehouse.sdt}
              rules={[
                {
                  pattern: new RegExp(CommonString.REGEX_PHONE_NUMBER),
                  message: CommonString.WAREHOUSE_PHONE_NAN,
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
                    {CommonString.WAREHOUSE_DELETE}
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
