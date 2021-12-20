import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
} from 'antd';
import {
  UserOutlined,
  UserAddOutlined,
  ManOutlined,
  WomanOutlined,
  SearchOutlined,
  BarcodeOutlined,
  QrcodeOutlined,
} from '@ant-design/icons';
import { MdOutlineCake } from 'react-icons/md';
import { IoIosCash } from 'react-icons/io';
import { BsCheckCircleFill } from 'react-icons/bs';
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
import { getStoreList } from '../../api/store';
import { getCounterList } from '../../api/counter';
import { arrayFind } from '../../utils/array';

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
  },
  {
    title: 'Số lượng',
  },
  {
    title: 'Thành tiền',
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
  const [total, setTotal] = useState(150000);
  const [selectedStore, setSelectedStore] = useState();
  const [selectedCounter, setSelectedCounter] = useState();
  const [assignedUser, setAssignerUser] = useState();
  const [getStoresCall, getStoresLoading, getStoresError, { data: stores }] =
    useApiFeedback();
  const paymentMethodRef = useRef(null);
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

  useEffect(() => {
    getStoresCall(getStoreList(), (res) => {
      console.log('get store list', res);
      setSelectedStore(res.data[0]);
    });
  }, []);

  useEffect(() => {
    if (selectedStore?.dsQuay?.length > 0)
      setSelectedCounter(selectedStore.dsQuay[0]);
  }, [selectedStore]);

  return (
    <div className="flex mb-10 gap-3 flex-col lg:flex-row">
      <div className="flex-1 flex flex-col items-stretch gap-3">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch">
          <div className="flex gap-3 flex-1">
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
              disabled={!selectedStore}
              className="flex-1"
              placeholder="Quầy"
            />
          </div>
          <div className="flex flex-1 gap-3">
            <SelectInput className="flex-1" placeholder="Nhân viên trực" />
            <div className="flex items-center gap-2 shadow rounded-lg px-3 bg-primary text-white">
              <BsCheckCircleFill />
              <span className="font-semibold">Quầy mở</span>
            </div>
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
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg-soft p-4 flex flex-col gap-2 w-full lg:w-96 self-start pb-8">
        <SelectInput placeholder="Khách hàng thành viên" />
        <div className="flex items-center gap-2">
          <UserOutlined className="text-5xl p-3 opacity-80" />
          <div className="flex flex-col">
            <span className="font-bold text-xl">Nguyễn Thành Trung</span>
            <span>Thành viên Trung Thành</span>
          </div>
        </div>
        {false && (
          <AppButton type="add" icon={<UserAddOutlined />} className="mx-4">
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
                      <ChildDetail name="Ngô Công Hậu" dob={moment()} male />
                      <HorizontalDivider />
                      <ChildDetail name="Ngô Công Hậu" dob={moment()} />
                      <HorizontalDivider />
                      <ChildDetail name="Ngô Công Hậu" dob={moment()} male />
                    </div>
                  }
                  title="Các con"
                  placement="left"
                >
                  <div className="flex-1">
                    <CustomerDetailsCol label="SỐ CON">3</CustomerDetailsCol>
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
        <AppTable
          columns={billColumns}
          selectable={false}
          size="small"
          bordered={false}
          minCols={3}
        />
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between font-semibold text-2xl px-2 mt-4">
            <span>Tổng cộng</span>
            <span>{currency(total)}</span>
          </div>
          <div className="flex items-center justify-between px-2">
            <span>Tiền gốc</span>
            <span>{currency(1250000)}</span>
          </div>
          <div className="flex items-center justify-between px-2">
            <span>Giảm giá</span>
            <span>{currency(250000)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AppButton type="cancel" size="large" className="mt-3">
            Hủy
          </AppButton>
          <AppButton
            type="done"
            size="large"
            className="mt-3 flex-1"
            onClick={() => {
              setShowPaymentModal(true);
            }}
          >
            Thanh toán
          </AppButton>
        </div>
      </div>
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
