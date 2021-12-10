import React, { useEffect, useState } from 'react';
import AppButton from '../../../components/AppButton';
import { ContentHeader } from '../../../components/Content';
import AppTable from '../../../components/AppTable';
import useApiFeedback from '../../../hooks/useApiFeedback';
import { deleteStore, getStoreList } from '../../../api/store';
import { message } from 'antd';
import { deleteProduct, getProductList } from '../../../api/product';
import { currenyInt } from '../../../utils/string';

const columns = [
  {
    title: 'Mã MH',
    id: true,
    idFormat: ['MH', 6],
    searchable: true,
    sortable: true,
    preview: 'hinhAnh',
  },
  {
    title: 'Tên MH',
    dataIndex: 'tenMH',
    searchable: true,
    sortable: true,
  },
  {
    title: 'Giá nhập',
    dataIndex: 'giaNhap',
    sortable: true,
    render: (val) => currenyInt(val),
  },
  {
    title: 'Giá bán',
    dataIndex: 'giaBan',
    sortable: true,
    render: (val) => currenyInt(val),
  },
  {
    title: 'Nhà SX',
    dataIndex: ['nhaSX', 'tenNSX'],
    searchable: true,
    sortable: true,
  },
  {
    title: 'Nhà CC',
    dataIndex: ['nhaCC', 'tenNCC'],
    searchable: true,
    sortable: true,
  },
  {
    title: 'Đơn vị',
    dataIndex: 'donVi',
    searchable: true,
    sortable: true,
  },
  {
    title: 'Màu',
    dataIndex: 'mauSac',
    searchable: true,
    sortable: true,
  },
  {
    title: 'Size',
    dataIndex: 'kichThuoc',
    searchable: true,
    sortable: true,
  },
];

export default function ProductPage() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [apiCall, loading, error, productList] = useApiFeedback();
  const [deleteCall, deleteLoading] = useApiFeedback();

  function fetchProductList() {
    apiCall(getProductList());
  }

  useEffect(() => {
    fetchProductList();
  }, []);

  function handleDelete() {
    deleteCall(
      Promise.all(
        selectedRows.map((row) => {
          return deleteProduct(row);
        })
      ),
      () => {
        message.success('Xóa thành công');
        setSelectedRows([]);
        fetchProductList();
      }
    );
  }

  return (
    <div>
      <ContentHeader title="Quản lý các mặt hàng">
        <AppButton type="add" link="add" responsive>
          Thêm mặt hàng
        </AppButton>
        {!!selectedRows.length && (
          <AppButton
            type="delete"
            responsive
            onClick={handleDelete}
            loading={deleteLoading}
          >
            Xóa mặt hàng
          </AppButton>
        )}
      </ContentHeader>
      <AppTable
        size="small"
        loading={loading}
        columns={columns}
        data={productList?.data}
        onSelectRows={setSelectedRows}
        itemName="mặt hàng"
        defaultPageSize={10}
        minCols={4}
      />
    </div>
  );
}
