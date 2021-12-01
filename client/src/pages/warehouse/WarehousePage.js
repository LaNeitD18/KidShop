import React, { useEffect, useState } from 'react';
import AppButton from '../../components/AppButton';
import { ContentHeader } from '../../components/Content';
import AppTable from '../../components/AppTable';
import useApiFeedback from '../../hooks/useApiFeedback';
import { deleteWarehouse, fetchAllWarehouses } from '../../api/warehouse';
import { message } from 'antd';
import CommonString from '../../constants/string';

const columns = [
  {
    title: 'Mã kho',
    id: true,
    idFormat: ['K', 4],
    searchable: true,
    sortable: true,
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
    title: 'Quản lý kho',
    dataIndex: ['quanLyKho', 'hoTen'],
    searchable: true,
  },
  {
    createdTime: true,
    sortable: true,
  },
];

export default function WarehousePage() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [apiCall, loading, error, result] = useApiFeedback();
  const [deleteCall, deleteLoading] = useApiFeedback();

  function fetchWarehouses() {
    apiCall(fetchAllWarehouses());
  }

  useEffect(() => {
    fetchWarehouses();
  }, []);

  function handleDelete() {
    deleteCall(
      Promise.all(
        selectedRows.map((row) => {
          return deleteWarehouse(row);
        })
      ),
      () => {
        message.success('Xóa thành công');
        setSelectedRows([]);
        fetchWarehouses();
      }
    );
  }

  return (
    <div>
      <ContentHeader title={CommonString.WAREHOUSE_TITLE}>
        <AppButton type="add" link="add" responsive>
          {CommonString.WAREHOUSE_ADD}
        </AppButton>
        {!!selectedRows.length && (
          <AppButton
            type="delete"
            responsive
            onClick={handleDelete}
            loading={deleteLoading}
          >
            {CommonString.WAREHOUSE_DELETE}
          </AppButton>
        )}
      </ContentHeader>
      <AppTable
        loading={loading}
        columns={columns}
        data={result?.data}
        onSelectRows={setSelectedRows}
        itemName="kho"
      />
    </div>
  );
}
