import React, { useEffect, useState } from 'react';
import AppButton from '../../../components/AppButton';
import { ContentHeader } from '../../../components/Content';
import AppTable from '../../../components/AppTable';
import useApiFeedback from '../../../hooks/useApiFeedback';
import { deleteStore, getStoreList } from '../../../api/store';
import { message } from 'antd';
import { useRoles } from '../../../context/RolesContext';
import { useParams } from 'react-router-dom';
import { getBills } from '../../../api/bill';

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

export default function StoreDashboard() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [billCall, billLoading, billError, { data: bills }] = useApiFeedback();
  const [deleteCall, deleteLoading] = useApiFeedback();

  const [roles, updateRoles] = useRoles();

  const { storeId } = useParams();

  function fetchStore() {
    billCall(getBills(storeId));
  }

  useEffect(() => {
    fetchStore();
  }, []);

  console.log(bills);

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
      <ContentHeader title="Danh sách hóa đơn">
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
        loading={billLoading}
        columns={columns}
        data={bills}
        onSelectRows={setSelectedRows}
        itemName="chi nhánh"
      />
    </div>
  );
}
