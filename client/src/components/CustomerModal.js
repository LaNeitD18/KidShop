import { Button, DatePicker, Form, Input, message, Modal } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { MdEdit, MdModeEditOutline } from 'react-icons/md';
import { createCustomer, editCustomer, fetchCustomer } from '../api/customer';
import useApiFeedback from '../hooks/useApiFeedback';
import { fireError } from '../utils/feedback';
import AppButton from './AppButton';
import { SelectInput } from './Inputs';

export default function CustomerModal({
  onCancel,
  cus = {},
  onUpdated = () => {},
}) {
  const [customerForm] = Form.useForm();
  const [babies, setBabies] = useState([]);
  const [edit, setEdit] = useState(null);
  const [okCall, okLoading, okErr] = useApiFeedback();

  useEffect(() => {
    if (cus.id) {
      const { hoTen, gioiTinh, ngaySinh, sdt, dsCTKhachHang } = cus;
      customerForm.setFieldsValue({
        hoTen,
        gioiTinh,
        ngaySinh: moment(ngaySinh),
        sdt,
      });
      setBabies(
        dsCTKhachHang.map((b) => ({
          ...b,
          ngaySinhCon: moment(b?.ngaySinhCon),
        }))
      );
    }
  }, [cus.id]);

  return (
    <Modal
      visible
      onCancel={() => onCancel(false)}
      onOk={() => {
        console.log(customerForm.getFieldsValue());
        const { hoTen, sdt, gioiTinh, ngaySinh } =
          customerForm.getFieldsValue();
        if (!hoTen || !sdt || !gioiTinh || !ngaySinh) {
          fireError({ message: 'Vui lòng điền các trường còn trống' });
          return;
        }
        const dto = {
          hoTen,
          sdt,
          gioiTinh,
          ngaySinh,
          dsCTKhachHang: babies,
        };
        if (cus.id) {
          okCall(editCustomer(cus.id, dto), () => {
            message.success('Sửa khách hàng thành công');
            onCancel(false);
            onUpdated();
          });
        } else {
          okCall(createCustomer(dto), () => {
            message.success('Tạo khách hàng thành công');
            onCancel(false);
            onUpdated();
          });
        }
      }}
      title={cus.id ? 'Sửa khách hàng' : 'Tạo khách hàng'}
      width={1024}
      centered
      className="overflow-hidden"
    >
      <div className="grid grid-cols-2 gap-8 overflow-hidden">
        <Form
          form={customerForm}
          name="edit-employee"
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="Họ và tên"
            name="hoTen"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập họ tên',
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Giới tính"
            name="gioiTinh"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập giới tính',
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="Ngày sinh"
            name="ngaySinh"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập ngày sinh',
              },
            ]}
          >
            <DatePicker size="large" className="w-full" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="sdt"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập số điện thoại',
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
        </Form>
        {edit !== null && (
          <EditChild
            data={babies[edit]}
            onFinish={(v) => {
              setBabies((prev) => {
                const temp = prev;
                temp[edit] = v;
                return temp;
              });
              setEdit(null);
            }}
            onCancel={() => {
              setEdit(null);
            }}
          />
        )}
        {edit === null && (
          <div>
            <h3 className="text-2xl">Các con</h3>
            <div className="flex flex-col gap-3">
              {babies?.map((b, i) => (
                <div
                  key={b.hoTenCon}
                  className="bg-gray-100 rounded-lg border flex items-center justify-between"
                >
                  <span className="ml-3 m-1">{b.hoTenCon}</span>
                  <div
                    className="p-2 pr-3 cursor-pointer hover:opacity-50 transition-all"
                    onClick={() => {
                      setEdit(i);
                    }}
                  >
                    <MdEdit className="text-lg" />
                  </div>
                </div>
              ))}
              <AppButton
                type="add"
                onClick={() => {
                  setEdit(babies.length);
                }}
              >
                Thêm con
              </AppButton>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export function EditChild({ data = {}, index, onFinish, onCancel }) {
  const [babyForm] = Form.useForm();
  useEffect(() => {
    babyForm.setFieldsValue(data);
  }, [babyForm, data]);
  return (
    <div>
      <h3 className="text-2xl">{data?.hoTenCon ? 'Sửa con' : 'Thêm con'}</h3>
      <Form
        form={babyForm}
        name="con"
        layout="vertical"
        autoComplete="off"
        onFinish={onFinish}
      >
        <Form.Item
          label="Họ và tên"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập họ tên',
            },
          ]}
          name="hoTenCon"
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          label="Giới tính"
          name="gioiTinhCon"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập giới tính',
            },
          ]}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          label="Ngày sinh"
          name="ngaySinhCon"
          required
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập ngày sinh',
            },
          ]}
        >
          <DatePicker size="large" className="w-full" />
        </Form.Item>
        <div className="w-full flex justify-end gap-3">
          {index && <AppButton type="delete">Xóa</AppButton>}
          <AppButton type="cancel" onClick={onCancel}>
            Hủy
          </AppButton>
          <AppButton type="done" htmlType="submit">
            Lưu
          </AppButton>
        </div>
      </Form>
    </div>
  );
}
