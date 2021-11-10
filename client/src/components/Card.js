import { RowJustifyBetween } from '../components/Layout';
import { BsBarChartLine } from 'react-icons/bs';
import { MdPointOfSale } from 'react-icons/md';
import { GiPlainCircle } from 'react-icons/gi';
import { Card } from 'antd';
import classNames from 'classnames';
import { SingleLineSkeleton } from './Skeleton';

export function CounterCard({ active, employeeName }) {
  return (
    <Card
      className="hover:shadow-lg-soft transition-all"
      style={
        active
          ? {
              border: 'solid 1px #1DA57A',
            }
          : {}
      }
      title={
        <span className="font-semibold flex items-center gap-2">
          <GiPlainCircle
            className={classNames('text-sm', {
              'text-green-500': active,
              'text-gray-300': !active,
            })}
            style={{ marginTop: 2 }}
          />
          Tên quầy
        </span>
      }
      extra={
        <a className="font-semibold" href="#">
          Sửa
        </a>
      }
      actions={[
        <span
          key="report"
          className="w-full flex items-center gap-2 justify-center font-semibold"
        >
          <BsBarChartLine />
          Báo cáo
        </span>,
        <span
          key="counter"
          className="w-full flex items-center gap-2 justify-center font-semibold"
        >
          <MdPointOfSale />
          Đến quầy
        </span>,
      ]}
    >
      <div className="flex flex-col gap-4">
        <RowJustifyBetween>
          <span>Trạng thái</span>
          {active ? (
            <span className="font-semibold">Đang hoạt động</span>
          ) : (
            <span className="font-semibold">Đang đóng</span>
          )}
        </RowJustifyBetween>
        <RowJustifyBetween>
          <span>Nhân viên trực</span>
          {active ? (
            <span className="font-semibold">{employeeName}</span>
          ) : (
            <SingleLineSkeleton />
          )}
        </RowJustifyBetween>
      </div>
    </Card>
  );
}
