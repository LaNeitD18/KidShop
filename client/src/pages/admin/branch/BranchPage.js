import React, { useEffect, useState } from 'react';
import AppButton from '../../../components/AppButton';
import { ContentHeader } from '../../../components/Content';
import AppTable from '../../../components/AppTable';
import useApiFeedback from '../../../hooks/useApiFeedback';
import { deleteStore, getStoreList } from '../../../api/store';
import { message } from 'antd';
import { useRoles } from '../../../context/RolesContext';

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
  const [storeListCall, storeListLoading, error, storeList] = useApiFeedback();
  const [deleteCall, deleteLoading] = useApiFeedback();

  const [roles, updateRoles] = useRoles();

  function fetchStore() {
    storeListCall(getStoreList());
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
        updateRoles();
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
        loading={storeListLoading}
        columns={columns}
        data={storeList?.data}
        onSelectRows={setSelectedRows}
        itemName="chi nhánh"
      />
    </div>
  );
}
