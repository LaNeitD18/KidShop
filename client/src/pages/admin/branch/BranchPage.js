import React, { useEffect, useState } from 'react';
import AppButton from '../../../components/AppButton';
import { ContentHeader } from '../../../components/Content';
import AppTable from '../../../components/AppTable';
import useApiFeedback from '../../../hooks/useApiFeedback';
import { deleteStore, getStoreList } from '../../../api/store';
import { message } from 'antd';
import { fireErrorModal } from '../../../utils/feedback';

const columns = [
  {
    title: 'Mã cửa hàng',
    id: true,
    idFormat: ['CH', 4],
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
    title: 'Chủ cửa hàng',
    dataIndex: ['chuCuaHang', 'hoTen'],
    searchable: true,
  },
  {
    createdTime: true,
    sortable: true,
  },
];

export default function BranchPage() {
  const [selectedRows, setSelectedRows] = useState([]);
  const { loading, apiCall, result } = useApiFeedback();
  const { loading: deleteLoading, apiCall: deleteCall } = useApiFeedback();

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
      <ContentHeader title="Quản lý các chi nhánh">
        <AppButton type="add" link="add" responsive>
          Thêm chi nhánh
        </AppButton>
        {!!selectedRows.length && (
          <AppButton
            type="delete"
            responsive
            onClick={handleDelete}
            loading={deleteLoading}
          >
            Xóa chi nhánh
          </AppButton>
        )}
      </ContentHeader>
      <AppTable
        loading={loading}
        columns={columns}
        data={result?.data}
        onSelectRows={setSelectedRows}
        itemName="chi nhánh"
      />
    </div>
  );
}
