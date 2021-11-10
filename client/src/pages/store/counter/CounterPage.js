import React, { useEffect, useState } from 'react';
import AppButton from '../../../components/AppButton';
import { ContentHeader } from '../../../components/Content';
import useApiFeedback from '../../../hooks/useApiFeedback';
import { deleteStore, getStoreList } from '../../../api/store';
import { ActiveItem, StatusBar } from '../../../components/StatusBar';

import { Grid } from '../../../components/Grid';
import { message } from 'antd';
import { CounterCard } from '../../../components/Card';

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

const sample = [1, 2, 3, 4, 5, 6, 7, 8];

export default function CounterPage() {
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
    <div className="pb-16">
      <ContentHeader title="Quản lý các quầy" className="mb-1">
        <AppButton type="add" link="add" responsive>
          Thêm quầy
        </AppButton>
        {!!selectedRows.length && (
          <AppButton
            type="delete"
            responsive
            onClick={handleDelete}
            loading={deleteLoading}
          >
            Xóa quầy đã chọn
          </AppButton>
        )}
      </ContentHeader>
      <StatusBar className="-mt-1 flex items-center gap-5 mb-5">
        <ActiveItem active number={2} text="đang hoạt động" />
        <ActiveItem number={1} text="đang đóng" />
      </StatusBar>

      <Grid>
        {sample.map((i) => (
          <CounterCard active={i % 2} />
        ))}
      </Grid>
    </div>
  );
}
