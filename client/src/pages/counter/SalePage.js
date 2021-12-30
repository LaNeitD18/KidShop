import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLayoutContext } from "../../context/LayoutContext";
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
} from "antd";
import {
  UserOutlined,
  UserAddOutlined,
  ManOutlined,
  WomanOutlined,
  SearchOutlined,
  BarcodeOutlined,
  QrcodeOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import { IoIosCash } from "react-icons/io";
import { BsCheckCircleFill } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { SelectInput } from "../../components/Inputs";
import AppButton from "../../components/AppButton";
import { HorizontalDivider, VerticalDivider } from "../../components/Divider";
import {
  currency,
  currencyShort,
  date,
  extractNumber,
  idString,
} from "../../utils/string";
import moment from "moment";
import Moment from "react-moment";
import AppTable from "../../components/AppTable";
import { StatusIndicator } from "../../components/Decorative";
import { ProductCard } from "../../components/Card";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { fireError, fireSuccessModal } from "../../utils/feedback";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { sha256 } from "js-sha256";
import useApiFeedback from "../../hooks/useApiFeedback";
import { getStore, getStoreList } from "../../api/store";
import { editCounter, getCounter, getCounterList } from "../../api/counter";
import { arrayFind } from "../../utils/array";
import { getProductList } from "../../api/product";
import Loading from "../../components/Loading";
import { fetchExportReceipt, fetchExportReceipts } from "../../api/warehouse";
import { createBill, getBills } from "../../api/bill";
import useLocalStorage from "../../hooks/useLocalStorage";
import Bill from "../../components/Bill";
import { useRoles } from "../../context/RolesContext";
import Search from "antd/lib/input/Search";
import { fetchCustomers } from "../../api/customer";

const momoAPI = axios.create({
  baseURL: "https://test-payment.momo.vn/v2/gateway/api/create",
  headers: { "Access-Control-Allow-Origin": true },
});

export default function SalePage() {
  const [layout, setLayout] = useLayoutContext();
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
  const [billCall, billLoad, billErr, bill] = useApiFeedback();
  const [roles] = useRoles();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [khId, setKhId] = useState(null);

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
    setFilteredProducts(products);
  }, [products]);

  const fetchAllStore = () => {
    if (roles?.bh) {
      getStoresCall(getStore(roles?.bh), (res) => {
        setSelectedStore(res.data);
      });
    }
  };
  useEffect(() => {
    fetchAllStore();
  }, [roles?.bh]);

  const fetchTon = async () => {
    const tonResult = {};
    if (selectedStore?.id) {
      const exps = await fetchExportReceipts("store", selectedStore?.id);
      exps.data.forEach(async (exp) => {
        const receipt = await fetchExportReceipt(exp.id);
        if (receipt.data.trangThai?.toString() === "2") {
          receipt.data.dsCTPhieuXuat.forEach((item, i, arr) => {
            tonResult[item.matHang.id] =
              parseInt(tonResult[item.matHang.id] || 0) + item.soLuong;
          });
        }
      });

      const listBills = await getBills(selectedStore?.id);
      for (const bill of listBills.data) {
        bill?.dsCTHoaDon.forEach((item, i) => {
          tonResult[item.matHang.id] =
            parseInt(tonResult[item.matHang.id] || 0) - item.soLuong;
          if (tonResult[item.matHang.id] < 0) {
            tonResult[item.matHang.id] = 0;
          }
        });
      }

      setTon(tonResult);
    }
  };
  useEffect(() => {
    setSelectedCounter(getCounterData);
  }, [getCounterData]);

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

  const searchProducts = (e) => {
    const searchText = e.target.value;
    if (searchText !== "") {
      const newData = products.filter((prod) => {
        const itemData = prod.tenMH
          ? prod.tenMH.toUpperCase()
          : "".toUpperCase();
        const textData = searchText?.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredProducts(newData);
    } else {
      setFilteredProducts(products);
    }
  };

  const renderProductCard = (p) => (
    <ProductCard
      disabled={!selectedCounter?.nhanVienTruc?.id}
      soLuong={
        (ton[p.id] || 0) -
        (items?.find((item) => item.id.toString() === p.id.toString())?.count ||
          0)
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
  );

  return (
    <div className="flex mb-10 gap-3 flex-col lg:flex-row">
      <div className="flex-1 flex flex-col items-stretch gap-3">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch">
          <div className="flex gap-3 flex-1 flex-col lg:flex-row">
            <SelectInput
              disabled
              value={selectedStore?.id}
              data={[
                {
                  value: selectedStore?.id,
                  label: selectedStore?.diaChi,
                },
              ]}
              idFormat={["CH", 4]}
              className="flex-1"
              placeholder="Cửa hàng"
            />
            <SelectInput
              style={{ minWidth: "144px" }}
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
              idFormat={["Q", 4]}
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
              idFormat={["NV", 4]}
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
                title: "Xác nhận đóng quầy",
                content: "Bạn sẽ xóa nhân viên trực ra khỏi quầy",
              }}
              loading={updateCounterLoading}
              onClick={() => {
                manuallySelectCounterAssignee(null);
              }}
            >
              {selectedCounter?.nhanVienTruc?.id ? "Đóng quầy" : "Đang đóng"}
            </AppButton>
          </div>
        </div>
        <div className="flex gap-3">
          <Input
            size="large"
            className="flex-1"
            placeholder="Tìm kiếm mặt hàng"
            suffix={<SearchOutlined />}
            onChange={(e) => searchProducts(e)}
          />
          <Button
            size="large"
            icon={<BarcodeOutlined />}
            onClick={() =>
              Modal.info({
                title: "Quét mã QR/Barcode",
                icon: null,
                centered: true,
                width: 640,
                maskClosable: true,
                okText: "Hoàn tất",
                content: (
                  <BarcodeScannerComponent
                    delay={5000}
                    onUpdate={(err, resultObj) => {
                      if (resultObj) {
                        console.log("result", resultObj);
                        const { text: result } = resultObj;
                        const foundProduct = filteredProducts?.find(
                          (p) =>
                            p.id.toString() === extractNumber(result).toString()
                        );
                        if (foundProduct) {
                          console.log("found product", foundProduct);
                          const { id, tenMH, count, giaBan, khuyenMai } =
                            foundProduct;
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
                                count: 1,
                                giaBan,
                                khuyenMai,
                                money: giaBan - khuyenMai,
                              });
                            }
                          });
                        }
                      }
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
          {filteredProducts?.map((p) => renderProductCard(p))}
        </div>
      </div>
      <Bill
        total={total}
        items={items}
        discount={discount}
        onCancel={setItems}
        onChange={(v) => {
          setKhId(v.khId);
        }}
        onOk={() => setShowPaymentModal(true)}
      />
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
            height: "calc(100vh - 256px)",
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
            paymentMethodRef.current.elements["payment-method"].value;
          if (selectedMethod === "2") {
            const info = "KidsShop Mua Hang";
            const uuid = uuidv4();
            const signature = sha256.hmac(
              process.env.REACT_APP_MOMO_SECRET,
              `accessKey=${process.env.REACT_APP_MOMO_ACCESS}&amount=${total}&extraData=&ipnUrl=https://momo.vn&orderId=${uuid}&orderInfo=${info}&partnerCode=${process.env.REACT_APP_MOMO_PARTNER_CODE}&redirectUrl=https://momo.vn&requestId=${uuid}&requestType=captureWallet`
            );
            momoAPI
              .post("https://test-payment.momo.vn/v2/gateway/api/create", {
                partnerCode: process.env.REACT_APP_MOMO_PARTNER_CODE,
                requestType: "captureWallet",
                ipnUrl: "https://momo.vn",
                redirectUrl: "https://momo.vn",
                orderId: uuid,
                amount: total,
                lang: "vi",
                orderInfo: info,
                requestId: uuid,
                extraData: "",
                signature: signature,
              })
              .then(({ data }) => {
                setMomoModal({ url: data.payUrl });
              })
              .catch((err) => fireError(err));
          } else {
            console.log("idkhachhang", khId);
            billCall(
              createBill({
                idNguoiLap: selectedCounter?.nhanVienTruc?.id,
                idQuay: selectedCounter?.id,
                tongHoaDon: total,
                idKhachHang: khId,
                dsCTHoaDon: items.map((item) => {
                  return {
                    idMatHang: item.id,
                    soLuong: item.count,
                    tongTien: item.giaBan * item.count,
                    giamGia: item.khuyenMai * item.count,
                  };
                }),
              }),
              async () => {
                message.success("Đã tạo hóa đơn thành công");
                await fetchTon();
                setItems([]);
              }
            );
          }
          setShowPaymentModal(false);
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
