import React, { useEffect, useState } from 'react';
import AppButton from '../../../components/AppButton';
import { ContentHeader } from '../../../components/Content';
import AppTable from '../../../components/AppTable';
import useApiFeedback from '../../../hooks/useApiFeedback';
import { message } from 'antd';
import { useRoles } from '../../../context/RolesContext';
import { deleteUser, getUserList } from '../../../api/user';

const columns = [
  {
    title: 'Mã nhân viên',
    id: true,
    idFormat: ['NV', 4],
    searchable: true,
    sortable: true,
  },
  {
    title: 'Họ tên',
    dataIndex: 'hoTen',
    searchable: true,
    sortable: true,
  },
  {
    title: 'SDT',
    dataIndex: 'sdt',
    searchable: true,
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'diaChi',
    searchable: true,
  },
  {
    title: 'Giới tính',
    dataIndex: 'gioiTinh',
    searchable: true,
  },
  {
    createdTime: true,
    sortable: true,
  },
];

export default function EmployeePage() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [userListCall, userListLoading, error, userList] = useApiFeedback();
  const [deleteCall, deleteLoading] = useApiFeedback();

  const [roles, updateRoles] = useRoles();

  function fetchUser() {
    userListCall(getUserList());
  }

  useEffect(() => {
    fetchUser();
  }, []);

  function handleDelete() {
    deleteCall(
      Promise.all(
        selectedRows.map((row) => {
          return deleteUser(row);
        })
      ),
      () => {
        updateRoles();
        message.success('Xóa thành công');
        setSelectedRows([]);
        fetchUser();
      }
    );
  }

  return (
    <div>
      <ContentHeader title="Quản lý nhân viên">
        <AppButton type="add" link="add" responsive>
          Thêm nhân viên
        </AppButton>
        {!!selectedRows.length && (
          <AppButton
            type="delete"
            responsive
            onClick={handleDelete}
            loading={deleteLoading}
          >
            Xóa nhân viên
          </AppButton>
        )}
      </ContentHeader>
      <AppTable
        loading={userListLoading}
        columns={columns}
        data={userList?.data}
        onSelectRows={setSelectedRows}
        itemName="nhân viên"
      />
    </div>
  );
}
