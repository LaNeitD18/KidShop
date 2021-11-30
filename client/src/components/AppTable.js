import { Table, Input, Button, Popover, Image } from 'antd';
import { useRef } from 'react';
import Moment from 'react-moment';
import { autoSorter, withKeys } from '../utils/array';
import { SearchOutlined } from '@ant-design/icons';
import { useResponsive } from './Media';
import { extractNumber, idString } from '../utils/string';
import { Link } from 'react-router-dom';
import { BsBarChartLine } from 'react-icons/bs';
import { TextButton } from './AppButton';

export default function AppTable({
  columns = [],
  data = [],
  onSelectRows = () => {},
  loading,
  itemName = 'dòng',
  minCols = 2,
}) {
  const media = useResponsive();

  const searchInput = useRef();

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      onSelectRows(selectedRowKeys);
    },
  };

  const getColumns = () => {
    const getProps = ({
      id,
      link,
      idFormat,
      createdTime,
      searchable,
      sortable,
      preview,
      title,
      dataIndex,
      render,
    }) => {
      if (id) {
        title = title || 'ID';
        dataIndex = dataIndex || 'id';
        render = render
          ? render
          : (id) =>
              preview ? (
                <Popover
                  placement="right"
                  title="Tên mặt hàng"
                  content={
                    <div className="flex flex-col gap-2">
                      <Image
                        width={200}
                        height={200}
                        src="https://miro.medium.com/max/2755/1*9JkkcXOhMK_aM5F6ISjMVQ.png"
                        placeholder={true}
                        preview={false}
                        className="object-cover rounded-sm"
                      />
                      <TextButton icon={<BsBarChartLine />}>
                        Xem thống kê
                      </TextButton>
                    </div>
                  }
                >
                  <Link to={link || `./edit/${id}`} className="font-semibold">
                    {idFormat ? idString(id, idFormat) : id}
                  </Link>
                </Popover>
              ) : (
                <Link to={link || `./edit/${id}`} className="font-semibold">
                  {idFormat ? idString(id, idFormat) : id}
                </Link>
              );
      }
      if (createdTime) {
        title = title || 'Ngày tạo';
        dataIndex = dataIndex || 'taoLuc';
        render = render
          ? render
          : (createdTime) => <Moment fromNow>{createdTime}</Moment>;
      }
      if (link && !id && !createdTime) {
        render = render
          ? render
          : (value) => (
              <Link to={link} className="font-semibold">
                {value}
              </Link>
            );
      }
      let searchProps = {};

      if (searchable) {
        searchProps = {
          filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
          }) => {
            const handleSearch = (selectedKeys, confirm, dataIndex) => {
              confirm();
            };

            const handleReset = (clearFilters) => {
              clearFilters();
            };

            return (
              <div className="p-4 w-56 md:w-96">
                <Input
                  ref={(node) => {
                    searchInput.current = node;
                  }}
                  placeholder={`Tìm kiếm ${title}`}
                  value={
                    idFormat ? extractNumber(selectedKeys[0]) : selectedKeys[0]
                  }
                  onChange={(e) => {
                    setSelectedKeys(e.target.value ? [e.target.value] : []);
                  }}
                  onPressEnter={() => {
                    handleSearch(selectedKeys, confirm, dataIndex);
                  }}
                  style={{ marginBottom: '0.75rem', display: 'block' }}
                />
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleReset(clearFilters)}
                  >
                    Xóa
                  </Button>
                  <Button
                    className="flex-1"
                    type="primary"
                    onClick={() =>
                      handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    icon={<SearchOutlined />}
                  >
                    Tìm
                  </Button>
                </div>
              </div>
            );
          },
          filterIcon: (filtered) => (
            <SearchOutlined
              className="text-xl p-2"
              style={{
                color: filtered ? '#2EAADC' : undefined,
              }}
            />
          ),
          onFilter: (value, record) =>
            record[dataIndex]
              ? record[dataIndex]
                  .toString()
                  .toLowerCase()
                  .includes(value.toLowerCase())
              : '',
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => searchInput.current.select(), 100);
            }
          },
        };
      }

      return {
        title,
        dataIndex,
        render,
        sorter: sortable
          ? (a, b) => autoSorter(a[dataIndex], b[dataIndex])
          : undefined,
        ...searchProps,
      };
    };

    return columns.map((col) => ({
      ...col,
      ...getProps(col),
    }));
  };

  const responsiveColumn = (cols) => {
    if (!media.isLg) return cols.slice(0, minCols);
    return cols;
  };

  return (
    <div>
      <Table
        bordered
        dataSource={withKeys(data)}
        columns={responsiveColumn(getColumns())}
        rowSelection={{
          ...rowSelection,
        }}
        loading={loading}
        pagination={{
          defaultPageSize: 7,
          pageSizeOptions: [7, 15, 20, 50],
          showTotal: (total, range) =>
            `${range[0]} đến ${range[1]} trong ${total} ${itemName}`,
        }}
      />
    </div>
  );
}
