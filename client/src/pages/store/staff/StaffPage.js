import React, { useEffect, useState } from 'react';
import AppButton from '../../../components/AppButton';
import { ContentHeader } from '../../../components/Content';
import AppTable from '../../../components/AppTable';
import useApiFeedback from '../../../hooks/useApiFeedback';
import { message } from 'antd';
import { useRoles } from '../../../context/RolesContext';
import { deleteUser, getUserList } from '../../../api/user';
import { SelectInput } from '../../../components/Inputs';

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
];

export default function StaffPage() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [userListCall, userListLoading, error, { data: userList }] =
    useApiFeedback();
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
      <ContentHeader
        title="Quản lý nhân viên cửa hàng"
        className="flex-col lg:flex-row items-stretch"
      >
        {!selectedRows.length && (
          <div className="flex gap-3 items-center">
            <SelectInput
              data={userList?.map((u) => ({
                value: u.id,
                label: u.hoTen,
              }))}
              size="normal"
              style={{ minWidth: '256px' }}
              placeholder="Chọn nhân viên"
            />
            <AppButton type="add" link="add">
              Thêm
            </AppButton>
          </div>
        )}
        {!!selectedRows.length && (
          <AppButton
            type="delete"
            onClick={handleDelete}
            loading={deleteLoading}
          >
            Xóa khỏi cửa hàng
          </AppButton>
        )}
      </ContentHeader>
      <AppTable
        loading={userListLoading}
        columns={columns}
        data={userList}
        onSelectRows={setSelectedRows}
        itemName="nhân viên"
      />
    </div>
  );
}
