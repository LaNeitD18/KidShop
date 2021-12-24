import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLayoutContext } from '../../context/LayoutContext';
import {
  Button,
  Card,
  Checkbox,
  Collapse,
  Input,
  Popover,
  Radio,
  Select,
  Table,
  Tag,
  Tooltip,
  Typography,
  Modal,
  message,
  Form,
  Affix,
} from 'antd';
import {
  UserOutlined,
  UserAddOutlined,
  ManOutlined,
  WomanOutlined,
  SearchOutlined,
  BarcodeOutlined,
  QrcodeOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { MdOutlineCake } from 'react-icons/md';
import { IoIosCash } from 'react-icons/io';
import { BsCheckCircleFill } from 'react-icons/bs';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { SelectInput } from '../../components/Inputs';
import AppButton from '../../components/AppButton';
import { HorizontalDivider, VerticalDivider } from '../../components/Divider';
import { currency, currencyShort, date, idString } from '../../utils/string';
import moment from 'moment';
import Moment from 'react-moment';
import AppTable from '../../components/AppTable';
import { StatusIndicator } from '../../components/Decorative';
import { ProductCard } from '../../components/Card';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { fireError, fireSuccessModal } from '../../utils/feedback';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { sha256 } from 'js-sha256';
import useApiFeedback from '../../hooks/useApiFeedback';
import { getStore, getStoreList } from '../../api/store';
import { editCounter, getCounter, getCounterList } from '../../api/counter';
import { arrayFind } from '../../utils/array';
import { getProductList } from '../../api/product';
import Loading from '../../components/Loading';
import { fetchExportReceipt, fetchExportReceipts } from '../../api/warehouse';

const { Panel } = Collapse;
const { Meta } = Card;

function CustomerDetailsCol({ label, children }) {
  return (
    <div className="flex-1 flex flex-col gap-1 items-center">
      <span className="text-xs font-semibold text-gray-400">{label}</span>
      <span className="text-3xl font-bold">{children}</span>
    </div>
  );
}

function ChildDetail({ male, name, dob }) {
  return (
    <>
      <div className="flex items-center gap-2">
        {male ? <ManOutlined /> : <WomanOutlined />}
        <span>{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <MdOutlineCake />
        <span>{date(dob)}</span>
        <span>
          (
          {
            <Moment diff={moment()} unit="years">
              {dob}
            </Moment>
          }{' '}
          tuổi)
        </span>
      </div>
    </>
  );
}

const billColumns = [
  {
    title: 'Mặt hàng',
    dataIndex: 'tenMH',
  },
  {
    title: 'Số lượng',
    dataIndex: 'count',
  },
  {
    title: 'Thành tiền',
    dataIndex: 'money',
  },
];

const momoAPI = axios.create({
  baseURL: 'https://test-payment.momo.vn/v2/gateway/api/create',
  headers: { 'Access-Control-Allow-Origin': true },
});

export default function SalePage() {
  const [layout, setLayout] = useLayoutContext();
  const [scannedCode, setScannedCode] = useState('Đang nhận diện...');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [momoModal, setMomoModal] = useState(null);
  const [selectedStore, setSelectedStore] = useState();
  const [selectedCounter, setSelectedCounter] = useState();
  const [getStoresCall, getStoresLoading, getStoresError, { data: stores }] =
    useApiFeedback();
  const [dsNhanVien, setDsNhanVien] = useState([]);
  const [
    getCounterCall,
    getCounterLoading,
    getCounterError,
    { data: getCounterData },
  ] = useApiFeedback();
  const paymentMethodRef = useRef(null);
  const [updateCounterCall, updateCounterLoading] = useApiFeedback();
  const [productsCall, productsLoading, productsError, { data: products }] =
    useApiFeedback();
  const [items, setItems] = useState([]);
  const [ton, setTon] = useState({});

  useLayoutEffect(() => {
    setLayout({
      disableSider: true,
      disableBreadcrumb: true,
      disablePx: true,
      alwaysScrollY: true,
    });
    return () => {
      setLayout({});
    };
  }, [setLayout]);

  const fetchAllStore = () => {
    getStoresCall(getStoreList(), (res) => {
      setSelectedStore(res.data[0]);
    });
  };
  useEffect(() => {
    fetchAllStore();
  }, []);

  const fetchTon = async () => {
    const tonResult = {};
    if (selectedStore?.id) {
      const exps = await fetchExportReceipts('store', selectedStore?.id);

      exps.data.forEach(async (exp) => {
        const ct = await fetchExportReceipt(exp.id);

        if (ct.data.trangThai?.toString() === '1') {
          ct.data.dsCTPhieuXuat.forEach((item, i, arr) => {
            tonResult[item.matHang.id] =
              parseInt(tonResult[item.matHang.id] || 0) + item.soLuong;
            if (i === arr.length - 1) {
              console.log('enddddd');
              setTon(tonResult);
            }
          });
        } else {
        }
      });
    }
  };
  useEffect(() => {
    setSelectedCounter(getCounterData);
  }, [getCounterData]);

  console.log(ton);

  useEffect(() => {
    if (selectedStore?.dsQuay?.length > 0) {
      getCounter(selectedStore.dsQuay[0].id).then(({ data }) => {
        setSelectedCounter(data);
      });
    }
    fetchTon();
  }, [selectedStore]);

  const manuallySelectCounterAssignee = (idUser, onFinish) => {
    editCounter(selectedCounter?.id, {
      idNhanVienTruc: idUser,
      idCuaHang: selectedStore?.id,
    })
      .then((res) =>
        getCounter(selectedCounter?.id).then((res) => {
          setSelectedCounter(res.data);
        })
      )
      .catch((err) => fireError(err));
  };

  useEffect(() => {
    productsCall(getProductList());
  }, []);

  const total = useMemo(
    () =>
      items.reduce(
        (prev, curr) => prev + (curr.giaBan - curr.khuyenMai) * curr.count,
        0
      ),
    [items]
  );

  const rawPrice = useMemo(
    () => items.reduce((prev, curr) => prev + curr.giaBan * curr.count, 0),
    [items]
  );

  const discount = useMemo(
    () => items.reduce((prev, curr) => prev + curr.khuyenMai * curr.count, 0),
    [items]
  );

  useEffect(() => {
    if (!selectedCounter?.nhanVienTruc?.id) {
      setItems([]);
    }
  }, [selectedCounter?.nhanVienTruc?.id]);

  return (
    <div className="flex mb-10 gap-3 flex-col lg:flex-row">
      <div className="flex-1 flex flex-col items-stretch gap-3">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch">
          <div className="flex gap-3 flex-1 flex-col lg:flex-row">
            <SelectInput
              value={selectedStore?.id}
              data={stores?.map((d) => ({
                value: d.id,
                label: d.diaChi,
              }))}
              idFormat={['CH', 4]}
              className="flex-1"
              placeholder="Cửa hàng"
              onSelect={(ch) => setSelectedStore(arrayFind(stores, ch, 'id'))}
            />
            <SelectInput
              style={{ minWidth: '144px' }}
              disabled={!selectedStore?.id}
              data={selectedStore?.dsQuay?.map((q) => ({
                value: q.id,
                label: q.tenQuay,
              }))}
              value={selectedCounter?.id}
              onSelect={(v) =>
                getCounterCall(getCounter(v), ({ data }) =>
                  setSelectedCounter(data)
                )
              }
              idFormat={['Q', 4]}
              className="flex-1"
              placeholder="Quầy"
            />
          </div>
          <div className="flex flex-1 gap-3">
            <SelectInput
              className="flex-1"
              placeholder="Nhân viên trực"
              data={selectedStore?.dsNhanVien
                ?.filter((nv) => !nv.quay?.id)
                .map((u) => ({
                  value: u.id,
                  label: u.hoTen,
                }))}
              value={selectedCounter?.nhanVienTruc?.id}
              idFormat={['NV', 4]}
              onSelect={(v) => {
                manuallySelectCounterAssignee(v);
              }}
            />
            <AppButton
              disabled={!selectedCounter?.nhanVienTruc?.id}
              size="large"
              type="delete"
              icon={<CloseCircleOutlined />}
              confirm={{
                title: 'Xác nhận đóng quầy',
                content: 'Bạn sẽ xóa nhân viên trực ra khỏi quầy',
              }}
              loading={updateCounterLoading}
              onClick={() => {
                manuallySelectCounterAssignee(null);
              }}
            >
              {selectedCounter?.nhanVienTruc?.id ? 'Đóng quầy' : 'Đang đóng'}
            </AppButton>
          </div>
        </div>
        <div className="flex gap-3">
          <Input
            size="large"
            className="flex-1"
            placeholder="Tìm kiếm mặt hàng"
            suffix={<SearchOutlined />}
          />
          <Button
            size="large"
            icon={<BarcodeOutlined />}
            onClick={() =>
              Modal.info({
                title: 'Quét mã QR/Barcode',
                icon: null,
                centered: true,
                width: 640,
                maskClosable: true,
                okText: 'Hoàn tất',
                content: (
                  <BarcodeScannerComponent
                    delay={5000}
                    onUpdate={(err, result) => {
                      if (result) {
                        message.success('Đã thêm ' + result.text);
                      } else setScannedCode('Đang nhận diện...');
                    }}
                  />
                ),
              })
            }
          >
            Quét mã QR/Barcode
          </Button>
        </div>
        <div className="grid gap-3  sm:grid-cols-3 xl:grid-cols-4">
          {!!productsLoading && <Loading />}
          {products?.map((p) => (
            <ProductCard
              disabled={!selectedCounter?.nhanVienTruc?.id}
              soLuong={
                (ton[p.id] || 0) -
                (items?.find((item) => item.id.toString() === p.id.toString())
                  ?.count || 0)
              }
              {...p}
              onAdd={(id, tenMH, count, giaBan, khuyenMai) =>
                setItems((prev) => {
                  let found = false;
                  const updatedList = prev.map((item) => {
                    if (item.id === id) {
                      found = true;
                      return { ...item, count: item.count + count };
                    }
                    return item;
                  });
                  if (found) {
                    return updatedList;
                  } else {
                    return prev.concat({
                      id,
                      tenMH,
                      count,
                      giaBan,
                      khuyenMai,
                      money: giaBan - khuyenMai,
                    });
                  }
                })
              }
            />
          ))}
        </div>
      </div>
      <Affix offsetTop={68}>
        <div className="bg-white rounded-lg shadow-lg-soft p-4 flex flex-col gap-2 w-full lg:w-96 self-start pb-8">
          {false && (
            <>
              <SelectInput placeholder="Khách hàng thành viên" />
              <div className="flex items-center gap-2">
                <UserOutlined className="text-5xl p-3 opacity-80" />
                <div className="flex flex-col">
                  <span className="font-bold text-xl">Nguyễn Thành Trung</span>
                  <span>Thành viên Trung Thành</span>
                </div>
              </div>
              {false && (
                <AppButton
                  type="add"
                  icon={<UserAddOutlined />}
                  className="mx-4"
                >
                  Tạo khách hàng
                </AppButton>
              )}
              {true && (
                <Collapse defaultActiveKey={['1']}>
                  <Panel header="Thông tin khách hàng">
                    <div className="flex tracking-wide">
                      <CustomerDetailsCol label="TUỔI">28</CustomerDetailsCol>
                      <VerticalDivider />
                      <Popover
                        content={
                          <div>
                            <ChildDetail
                              name="Ngô Công Hậu"
                              dob={moment()}
                              male
                            />
                            <HorizontalDivider />
                            <ChildDetail name="Ngô Công Hậu" dob={moment()} />
                            <HorizontalDivider />
                            <ChildDetail
                              name="Ngô Công Hậu"
                              dob={moment()}
                              male
                            />
                          </div>
                        }
                        title="Các con"
                        placement="left"
                      >
                        <div className="flex-1">
                          <CustomerDetailsCol label="SỐ CON">
                            3
                          </CustomerDetailsCol>
                        </div>
                      </Popover>
                      <VerticalDivider />
                      <CustomerDetailsCol label="LẦN MUA">9</CustomerDetailsCol>
                    </div>
                    <div className="mx-4 mt-4">
                      <AppButton type="edit" className="w-full">
                        Chỉnh sửa
                      </AppButton>
                    </div>
                  </Panel>
                </Collapse>
              )}
            </>
          )}
          <AppTable
            data={items}
            columns={billColumns}
            selectable={false}
            size="small"
            bordered={false}
            minCols={3}
            defaultPageSize={4}
          />
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between font-semibold text-2xl px-2 mt-4">
              <span>Tổng cộng</span>
              <span>{currency(total)}</span>
            </div>
            <div className="flex items-center justify-between px-2">
              <span>Tiền gốc</span>
              <span>{currency(rawPrice)}</span>
            </div>
            <div className="flex items-center justify-between px-2">
              <span>Giảm giá</span>
              <span>{currency(discount)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AppButton
              type="delete"
              size="large"
              className="mt-3"
              disabled={!items.length}
              onClick={() => setItems([])}
            >
              Hủy
            </AppButton>
            <AppButton
              type="done"
              size="large"
              className="mt-3 flex-1"
              onClick={() => {
                setShowPaymentModal(true);
              }}
              disabled={!items.length}
            >
              Thanh toán
            </AppButton>
          </div>
        </div>
      </Affix>
      <Modal
        visible={momoModal}
        width={1080}
        centered
        okText="Hoàn tất"
        maskClosable={false}
        onCancel={() => {
          setMomoModal(null);
        }}
        onOk={() => {}}
      >
        <iframe
          className="w-full h-full"
          style={{
            height: 'calc(100vh - 256px)',
          }}
          title="payment-url"
          src={momoModal?.url}
        />
      </Modal>
      <Modal
        visible={showPaymentModal}
        centered
        onCancel={() => {
          setShowPaymentModal(false);
        }}
        okText="Chọn"
        width={312}
        title="Chọn hình thức thanh toán"
        onOk={() => {
          const selectedMethod =
            paymentMethodRef.current.elements['payment-method'].value;
          if (selectedMethod === '2') {
            const info = 'KidsShop Mua Hang';
            const uuid = uuidv4();
            const signature = sha256.hmac(
              process.env.REACT_APP_MOMO_SECRET,
              `accessKey=${process.env.REACT_APP_MOMO_ACCESS}&amount=${total}&extraData=&ipnUrl=https://momo.vn&orderId=${uuid}&orderInfo=${info}&partnerCode=${process.env.REACT_APP_MOMO_PARTNER_CODE}&redirectUrl=https://momo.vn&requestId=${uuid}&requestType=captureWallet`
            );
            momoAPI
              .post('https://test-payment.momo.vn/v2/gateway/api/create', {
                partnerCode: process.env.REACT_APP_MOMO_PARTNER_CODE,
                requestType: 'captureWallet',
                ipnUrl: 'https://momo.vn',
                redirectUrl: 'https://momo.vn',
                orderId: uuid,
                amount: total,
                lang: 'vi',
                orderInfo: info,
                requestId: uuid,
                extraData: '',
                signature: signature,
              })
              .then(({ data }) => {
                setMomoModal({ url: data.payUrl });
              })
              .catch((err) => fireError(err));
          }
        }}
      >
        <form ref={paymentMethodRef} className="mb-3">
          <Radio.Group name="payment-method">
            <div className="flex flex-col gap-3">
              <Radio value={1}>Thanh toán bằng tiền mặt</Radio>
              <Radio value={2}>Thanh toán với Momo</Radio>
              <Radio value={3} disabled>
                Thanh toán qua thẻ tín dụng
              </Radio>
            </div>
          </Radio.Group>
        </form>
      </Modal>
    </div>
  );
}
