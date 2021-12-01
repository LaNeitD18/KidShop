import React, { useEffect, useState } from 'react';
import AppButton from '../../../components/AppButton';
import { ContentHeader } from '../../../components/Content';
import AppTable from '../../../components/AppTable';
import useApiFeedback from '../../../hooks/useApiFeedback';
import { deleteStore, getStoreList } from '../../../api/store';
import { message } from 'antd';

const columns = [
  {
    title: 'Mã mặt hàng',
    id: true,
    idFormat: ['MH', 6],
    searchable: true,
    sortable: true,
    preview: 'hinhAnh',
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'diaChi',
    searchable: true,
  },
  {
    title: 'SDT',
    dataIndex: 'sdt',
    searchable: true,
  },
  {
    title: 'Chủ cửa hàng',
    dataIndex: ['chuCuaHang', 'hoTen'],
    searchable: true,
  },
  {
    createdTime: true,
    sortable: true,
  },
];

export default function ProductPage() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [apiCall, loading, error, result] = useApiFeedback();
  const [deleteCall, deleteLoading] = useApiFeedback();

  function fetchStore() {
    apiCall(getStoreList());
  }

  useEffect(() => {
    fetchStore();
  }, []);

  function handleDelete() {
    deleteCall(
      Promise.all(
        selectedRows.map((row) => {
          return deleteStore(row);
        })
      ),
      () => {
        message.success('Xóa thành công');
        setSelectedRows([]);
        fetchStore();
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
        loading={loading}
        columns={columns}
        data={result?.data}
        onSelectRows={setSelectedRows}
        itemName="mặt hàng"
      />
    </div>
  );
}
