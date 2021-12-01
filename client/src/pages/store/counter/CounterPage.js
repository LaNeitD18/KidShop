import React, { useEffect, useState } from 'react';
import AppButton from '../../../components/AppButton';
import { ContentHeader } from '../../../components/Content';
import useApiFeedback from '../../../hooks/useApiFeedback';
import { ActiveItem, StatusBar } from '../../../components/StatusBar';

import { Grid } from '../../../components/Grid';
import { message } from 'antd';
import { CounterCard } from '../../../components/Card';
import { getCounterList } from '../../../api/counter';
import { useParams } from 'react-router-dom';

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

export default function CounterPage() {
  const [apiCall, loading, error, result] = useApiFeedback();
  const [deleteCall, deleteLoading] = useApiFeedback();

  const { storeId } = useParams();

  useEffect(() => {
    apiCall(getCounterList());
  }, []);

  const storeCounters = result?.data?.filter(
    (d) => d?.cuaHang?.id?.toString() === storeId?.toString()
  );

  return (
    <div className="pb-16">
      <ContentHeader title="Quản lý các quầy" className="mb-1">
        <AppButton type="add" link="add" responsive>
          Thêm quầy
        </AppButton>
      </ContentHeader>
      {!!storeCounters?.length && (
        <StatusBar className="-mt-1 gap-x-5 gap-y-2 mb-5">
          <ActiveItem
            active
            number={storeCounters?.filter((r) => r?.dangHoatDong)?.length}
            text="đang hoạt động"
          />
          <ActiveItem
            number={storeCounters?.filter((r) => !r?.dangHoatDong).length}
            text="đang đóng"
          />
        </StatusBar>
      )}

      <Grid>
        {storeCounters?.map((r) => (
          <CounterCard
            id={r?.id}
            name={r?.tenQuay}
            employeeName={r?.nhanVienTruc?.hoTen}
            active={r?.dangHoatDong}
          />
        ))}
      </Grid>
    </div>
  );
}
