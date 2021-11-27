import React, { useEffect, useState } from 'react';
import AppButton from '../../../components/AppButton';
import { ContentHeader } from '../../../components/Content';
import AppTable from '../../../components/AppTable';
import useApiFeedback from '../../../hooks/useApiFeedback';
import { deleteWarehouse, fetchAllWarehouses } from '../../../api/warehouse';
import { message } from 'antd';
import CommonString from '../../../constants/string';

const columns = [
  {
    title: 'Mã phiếu nhập kho',
    id: true,
    idFormat: ['PNK', 4],
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

export default function ImportProductPage() {
  const [selectedRows, setSelectedRows] = useState([]);
  const { loading, apiCall, result } = useApiFeedback();
  const { loading: deleteLoading, apiCall: deleteCall } = useApiFeedback();

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
      <ContentHeader title="Quản lý nhập kho">
        <AppButton type="add" link="add" responsive>
          Tạo phiếu nhập kho
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
        itemName="phiếu nhập kho"
      />
    </div>
  );
}
