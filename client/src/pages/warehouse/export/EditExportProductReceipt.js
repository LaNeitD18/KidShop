import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AppButton from '../../../components/AppButton';
import {
  DatePicker,
  Form,
  Input,
  message,
  Select,
  TimePicker,
  Typography,
} from 'antd';
import { ContentHeader } from '../../../components/Content';
import {
  createExportReceipt,
  deleteExportReceipt,
  editExportReceipt,
  fetchAllImportReceipts,
  fetchExportReceipt,
  fetchExportReceipts,
  fetchImportReceipt,
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
import Loading from '../../../components/Loading';
import { getStoreList } from '../../../api/store';
import { EXPORT_STATE } from '../../../constants/enum';

const { Text } = Typography;

const addConsts = {
  title: 'Tạo phiếu xuất kho',
  okText: 'Hoàn tất',
};

const editConsts = {
  title: 'Sửa phiếu xuất kho',
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
];

export default function EditExportReceiptPage({ mode }) {
  const isEdit = mode === 'edit';
  const byModes = isEdit ? editConsts : addConsts;

  const { exportReceiptId, warehouseId } = useParams();
  const navigate = useNavigate();

  const [formAddDetail] = Form.useForm();
  const [formAddReceipt] = Form.useForm();
  const [listNewDetails, setListNewDetails] = useState([]);
  const [sumMoney, setSumMoney] = useState(0);

  const [getCall, loading, getError, { data: getData }] = useApiFeedback();
  const [postCall, postLoad] = useApiFeedback();
  const [editCall, editLoad] = useApiFeedback();
  const [deleteCall, deleteLoad] = useApiFeedback();
  const [products, setProducts] = useState([]);
  const [storesCall, storesLoading, storesError, { data: stores }] =
    useApiFeedback();
  const [warehouseGoods, setWarehouseGoods] = useState({});
  const [tonKho, setTonKho] = useState(0);
  const [warehouseGoodsLoading, setWarehouseGoodsLoading] = useState(false);

  const fetchWarehouseGoods = useCallback(async () => {
    setWarehouseGoodsLoading(true);
    const imports = await fetchAllImportReceipts(warehouseId);
    const exportReceipts = await fetchExportReceipts('warehouse', warehouseId);
    const result = {};
    await imports?.data?.forEach(async (imp) => {
      const ds = await fetchImportReceipt(imp.id);
      ds.data.dsCTPhieuNhap.forEach((item) => {
        result[item.matHang.id] =
          parseInt(result[item.matHang.id] || 0) + item.soLuong;
      });
    });
    await exportReceipts?.data.forEach(async (exp) => {
      if (exportReceiptId?.toString() !== exp.id.toString()) {
        const ds = await fetchExportReceipt(exp.id);
        ds.data.dsCTPhieuXuat.forEach((item) => {
          result[item.matHang.id] =
            parseInt(result[item.matHang.id] || 0) - item.soLuong;
        });
      }
    });
    setWarehouseGoodsLoading(false);
    setWarehouseGoods(result);
  }, [warehouseId]);

  useEffect(() => {
    fetchWarehouseGoods();
  }, [fetchWarehouseGoods]);

  useEffect(() => {
    getProductList().then((res) => {
      setProducts(res.data);
    });
    storesCall(getStoreList());
    formAddReceipt.setFieldsValue({
      trangThai: {
        value: 1,
      },
    });
  }, []);

  useEffect(() => {
    if (isEdit) {
      getCall(fetchExportReceipt(exportReceiptId), ({ data }) => {
        formAddReceipt.setFieldsValue({
          ...data,
        });

        formAddReceipt.setFieldsValue({
          idCuaHang: data.cuaHang.id,
          trangThai: { value: data.trangThai },
        });

        const curDetails = data?.dsCTPhieuXuat?.map((detail) => {
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

  useEffect(() => {
    if (getData?.tongTien) setSumMoney(getData?.tongTien);
  }, [getData?.tongTien]);

  const onFinishAddDetail = (values) => {
    const product = products.find(
      (p) => p.id.toString() === values?.idMatHang.toString()
    );
    setTonKho(0);
    setListNewDetails((prev) => {
      let found = false;
      const updatedList = prev.map((item) => {
        if (item.idMatHang.toString() === values?.idMatHang.toString()) {
          found = true;
          const sl = parseInt(item.soLuong);
          const newSl = parseInt(values?.soLuong);
          return {
            ...item,
            soLuong: sl + newSl,
          };
        }
        return item;
      });
      if (found) {
        return updatedList;
      } else {
        return prev.concat({
          idMatHang: values?.idMatHang,
          tenMH: product?.tenMH,
          giaNhap: product?.giaNhap,
          soLuong: values?.soLuong,
        });
      }
    });

    setSumMoney(sumMoney + values?.soLuong * product?.giaNhap);
    formAddDetail.resetFields();
  };

  function handleDelete() {
    deleteCall(deleteExportReceipt(exportReceiptId), () => {
      message.success('Đã xóa thành công');
      navigate('../');
    });
  }

  const onFinishAddReceipt = (values) => {
    const receiptData = {
      idNguoiLap: JSON.parse(localStorage.getItem('user'))?.id,
      idKho: warehouseId,
      idCuaHang: values.idCuaHang,
      trangThai: values.trangThai.value,
      ghiChu: values?.ghiChu,
      dsChiTietPhieuXuat: listNewDetails.map((detail) => {
        return {
          idMatHang: detail?.idMatHang,
          soLuong: detail.soLuong,
        };
      }),
    };

    if (isEdit) {
      const { idNguoiLap, idKho, ...editedData } = receiptData;

      editCall(editExportReceipt(exportReceiptId, editedData), () => {
        message.success('Đã lưu thay đổi thành công');
      });
    } else {
      postCall(createExportReceipt(receiptData), () => {
        fireSuccessModal({
          title: 'Tạo phiếu xuất kho thành công',
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
      {loading || warehouseGoodsLoading ? (
        <Loading />
      ) : (
        <div className="mb-4">
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
                  onSelect={(v) => {
                    setTonKho(
                      (warehouseGoods[
                        formAddDetail.getFieldValue('idMatHang')
                      ] || 0) -
                        (listNewDetails?.find(
                          (d) => d.idMatHang?.toString() === v.toString()
                        )?.soLuong || 0)
                    );
                  }}
                  data={products.map((p) => ({
                    label: p.tenMH,
                    value: p.id,
                  }))}
                />
              </Form.Item>

              <Form.Item
                label={`Số lượng (Tồn kho: ${tonKho})`}
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
                  onClick={() => {}}
                  disabled={!tonKho}
                >
                  Thêm vào phiếu
                </AppButton>
              </Form.Item>
            </div>

            <div className="col-span-8">
              <Form.Item label="Chi tiết phiếu">
                <AppTable
                  columns={columns}
                  data={listNewDetails}
                  minCols={3}
                  defaultPageSize={5}
                />
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
            <div>
              <Form.Item
                label="Đến cửa hàng"
                name="idCuaHang"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn cửa hàng',
                  },
                ]}
              >
                <SelectInput
                  data={stores?.map((s) => ({
                    label: s.diaChi,
                    value: s.id,
                  }))}
                />
              </Form.Item>
              <Form.Item label="Trạng thái" name="trangThai">
                <Select
                  labelInValue
                  options={EXPORT_STATE.map((s, i) => ({
                    value: i,
                    label: s,
                  }))}
                  size="large"
                  showSearch={false}
                />
              </Form.Item>
            </div>
            <div className="flex flex-col gap-1">
              <Form.Item label="Ghi chú" name="ghiChu">
                <Input.TextArea
                  size="large"
                  autoSize={{ minRows: 2, maxRows: 2 }}
                  showCount
                  maxLength={300}
                />
              </Form.Item>
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
                    Xóa phiếu xuất kho
                  </AppButton>
                </Form.Item>
              )}
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}
