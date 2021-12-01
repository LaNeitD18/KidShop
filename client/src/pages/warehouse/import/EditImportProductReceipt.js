import React, { useEffect, useState } from 'react';
import AppButton from '../../../components/AppButton';
import { DatePicker, Form, Input, message, TimePicker, Typography } from 'antd';
import { ContentHeader } from '../../../components/Content';
import {
  deleteImportReceipt,
  editImportReceipt,
  fetchImportReceipt,
  createImportReceipt,
} from '../../../api/warehouse';
import { getProductList } from '../../../api/product';
import { SelectInput } from '../../../components/Inputs';
import useApiFeedback from '../../../hooks/useApiFeedback';
import { useNavigate, useParams } from 'react-router-dom';
import { currency, inputRuleNaN } from '../../../utils/string';
import { fireSuccessModal } from '../../../utils/feedback';
import { FormGrid } from '../../../components/Grid';
import AppTable from '../../../components/AppTable';
import { PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;

const addConsts = {
  title: 'Tạo phiếu nhập kho',
  okText: 'Hoàn tất',
};

const editConsts = {
  title: 'Sửa phiếu nhập kho',
  okText: 'Lưu thay đổi',
};

const columns = [
  {
    title: 'Tên mặt hàng',
    dataIndex: 'tenMH',
  },
  {
    title: 'Số lượng',
    dataIndex: 'soLuong',
  },
  {
    title: 'Giá nhập',
    dataIndex: 'giaNhap',
  },
];

export default function EditImportReceiptPage({ mode }) {
  const isEdit = mode === 'edit';
  const byModes = isEdit ? editConsts : addConsts;

  const { importReceiptId } = useParams();
  const navigate = useNavigate();

  const [formAddDetail] = Form.useForm();
  const [formAddReceipt] = Form.useForm();
  const [listNewDetails, setListNewDetails] = useState([]);
  const [sumMoney, setSumMoney] = useState(0);

  const [getCall] = useApiFeedback();
  const [postCall, postLoad] = useApiFeedback();
  const [editCall, editLoad] = useApiFeedback();
  const [deleteCall, deleteLoad] = useApiFeedback();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProductList().then((res) => {
      setProducts(res.data);
    });
  }, []);

  useEffect(() => {
    if (isEdit) {
      getCall(fetchImportReceipt(importReceiptId), ({ data }) => {
        formAddReceipt.setFieldsValue({
          ...data,
        });

        const curDetails = data?.dsCTPhieuNhap.map((detail) => {
          return {
            idMatHang: detail?.matHang?.id,
            tenMH: detail?.matHang?.tenMH,
            giaNhap: detail?.matHang?.giaNhap,
            soLuong: detail?.soLuong,
          };
        });
        setListNewDetails(curDetails);
      });
    } else {
      formAddReceipt.setFieldsValue({
        tongTien: sumMoney,
      });
    }
  }, []);

  useEffect(() => {
    formAddReceipt.setFieldsValue({
      tongTien: sumMoney,
    });
  }, [sumMoney]);

  const onFinishAddDetail = (values) => {
    const product = products.filter((p) => p.id == values?.idMatHang)[0];
    setListNewDetails([
      ...listNewDetails,
      {
        idMatHang: values?.idMatHang,
        tenMH: product?.tenMH,
        giaNhap: product?.giaNhap,
        soLuong: values?.soLuong,
      },
    ]);

    setSumMoney(sumMoney + values?.soLuong * product?.giaNhap);
    formAddDetail.resetFields();
  };

  function handleDelete() {
    deleteCall(deleteImportReceipt(importReceiptId), () => {
      message.success('Đã xóa thành công');
      navigate('../');
    });
  }

  const onFinishAddReceipt = (values) => {
    const receiptData = {
      idNguoiLap: 1, // thay = user dang dang nhap
      idKho: 2, //
      tongTien: sumMoney,
      ghiChu: values?.ghiChu,
      dsChiTietPhieuNhap: listNewDetails.map((detail) => {
        return {
          idMatHang: detail?.idMatHang,
          soLuong: detail.soLuong,
        };
      }),
    };

    if (isEdit) {
      editCall(editImportReceipt(importReceiptId, receiptData), () => {
        message.success('Đã lưu thay đổi thành công');
      });
    } else {
      postCall(createImportReceipt(receiptData), () => {
        fireSuccessModal({
          title: 'Tạo phiếu nhập kho thành công',
          onOk: () => {
            setListNewDetails([]);
            formAddReceipt.resetFields();
            setSumMoney(0);
          },
          onCancel: () => {
            navigate('../');
          },
        });
      });
    }
  };
  const tempMess = formAddDetail.getFieldInstance('idMatHang');
  return (
    <div>
      <ContentHeader title={byModes.title}>
        <AppButton type="cancel" responsive>
          Hủy bỏ
        </AppButton>
      </ContentHeader>
      <div>
        <Form
          className="sm:grid grid-cols-12 gap-x-5"
          form={formAddDetail}
          name="create-import-detail"
          layout="vertical"
          onFinish={onFinishAddDetail}
          autoComplete="off"
        >
          <div className="col-span-4">
            <Form.Item
              label="Mặt hàng"
              name="idMatHang"
              rules={[
                inputRuleNaN(),
                {
                  required: true,
                  message: 'Vui lòng chọn mặt hàng',
                },
              ]}
            >
              <SelectInput
                data={products.map((p) => ({
                  label: p.tenMH,
                  value: p.id,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="Số lượng"
              name="soLuong"
              rules={[
                inputRuleNaN(),
                {
                  required: true,
                  message: 'Vui lòng nhập số lượng',
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item>
              <AppButton
                type="add"
                className="w-full mt-4"
                htmlType="submit"
                size="large"
              >
                Thêm vào phiếu
              </AppButton>
            </Form.Item>
          </div>

          <div className="col-span-8">
            <Form.Item label="Chi tiết phiếu">
              <AppTable columns={columns} data={listNewDetails} minCols={3} />
            </Form.Item>
          </div>
        </Form>

        <Form
          className="col-span-12 sm:grid grid-cols-2 gap-x-5"
          form={formAddReceipt}
          name="create-import-receipt"
          layout="vertical"
          onFinish={onFinishAddReceipt}
          autoComplete="off"
        >
          <Form.Item label="Ghi chú" name="ghiChu">
            <Input.TextArea
              size="large"
              autoSize={{ minRows: 5, maxRows: 5 }}
              showCount
              maxLength={300}
            />
          </Form.Item>
          <div className="flex flex-col">
            <Form.Item label="Thời gian tạo" name="thoiGian">
              <div className="flex gap-x-2">
                <DatePicker size="large" className="flex-1" />
                <TimePicker size="large" className="flex-1" format="HH:mm" />
              </div>
            </Form.Item>
            <div className="flex justify-between gap-y-1 -mt-2">
              <Text>Tổng tiền</Text>
              <Text className="font-semibold">{currency(sumMoney)}</Text>
            </div>
            <div className="xs:flex flex-row-reverse items-center gap-6 mt-4">
              <Form.Item className="flex-1">
                <AppButton
                  loading={postLoad || editLoad}
                  type="done"
                  className="w-full"
                  htmlType="submit"
                  size="large"
                  // onClick={handleAddNewReceipt}
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
                    Xóa phiếu nhập kho
                  </AppButton>
                </Form.Item>
              )}
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
