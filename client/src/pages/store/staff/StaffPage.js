import React, { useEffect, useState } from 'react';
import AppButton from '../../../components/AppButton';
import { ContentHeader } from '../../../components/Content';
import AppTable from '../../../components/AppTable';
import useApiFeedback from '../../../hooks/useApiFeedback';
import { message } from 'antd';
import { useRoles } from '../../../context/RolesContext';
import { deleteUser, getUserList } from '../../../api/user';
import { SelectInput } from '../../../components/Inputs';
import { assignUser, getStore } from '../../../api/store';
import { useParams } from 'react-router-dom';

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
    title: 'Giới tính',
    dataIndex: 'gioiTinh',
    searchable: true,
  },
  {
    title: 'Trạng thái',
  },
];

export default function StaffPage() {
  const { storeId } = useParams();
  const [selectedRows, setSelectedRows] = useState([]);
  const [user, setUser] = useState();
  const [userListCall, userListLoading, error, { data: userList }] =
    useApiFeedback();
  const [removeCall, removeLoading] = useApiFeedback();

  const [storeCall, storeLoading, storeError, { data: store }] =
    useApiFeedback();

  const [assignCall, assignLoading] = useApiFeedback();

  const dsNhanVien = store?.dsNhanVien;

  function fetchUser() {
    userListCall(getUserList());
  }

  function fetchStore() {
    storeCall(getStore(storeId));
  }

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchStore();
  }, [storeId]);

  function handleDelete() {
    removeCall(
      Promise.all(
        selectedRows.map((row) => {
          return assignUser(-1, row);
        })
      ),
      () => {
        fetchStore();
        fetchUser();
        setUser(null);
        message.success('Bỏ thành công');
        setSelectedRows([]);
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
              data={userList
                ?.filter((u) => !u?.cuaHang?.id)
                .map((u) => ({
                  value: u.id,
                  label: u.hoTen,
                }))}
              size="normal"
              style={{ minWidth: '256px' }}
              placeholder="Chọn nhân viên"
              value={user}
              onSelect={(v) => setUser(v)}
            />
            <AppButton
              loading={assignLoading}
              type="add"
              link="add"
              onClick={() => {
                assignCall(assignUser(storeId, user), () => {
                  fetchStore();
                  fetchUser();
                  setUser(null);
                });
              }}
            >
              Thêm
            </AppButton>
          </div>
        )}
        {!!selectedRows.length && (
          <AppButton
            type="delete"
            onClick={handleDelete}
            loading={removeLoading}
          >
            Xóa khỏi cửa hàng
          </AppButton>
        )}
      </ContentHeader>
      <AppTable
        loading={storeLoading}
        columns={columns}
        data={dsNhanVien}
        onSelectRows={setSelectedRows}
        itemName="nhân viên"
      />
    </div>
  );
}
