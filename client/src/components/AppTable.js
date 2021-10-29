import { Table, Input, Button } from 'antd';
import { useCallback, useRef, useState } from 'react';
import Moment from 'react-moment';
import { withKeys } from '../utils/get';
import { SearchOutlined } from '@ant-design/icons';
import { useResponsive } from './Media';

export const useAppTable = (columns) => {
  const media = useResponsive();

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 100,
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const searchInput = useRef();

  const AppTable = useCallback(() => {
    const rowSelection = {
      onChange: (selectedRowKeys) => {
        setSelectedRows(selectedRowKeys);
      },
    };

    const getColumns = () => {
      const getProps = ({
        id,
        createdTime,
        searchable,
        sortable,
        title,
        dataIndex,
        render,
      }) => {
        if (id) {
          title = title || 'ID';
          dataIndex = dataIndex || 'id';
          render = render
            ? render
            : (id) => <a className="font-semibold">{id}</a>;
        }
        if (createdTime) {
          title = title || 'Ngày tạo';
          dataIndex = dataIndex || 'createdTime';
          render = render
            ? render
            : (createdTime) => (
                <Moment parse="DDMMYYYY" fromNow>
                  {createdTime}
                </Moment>
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
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              };

              const handleReset = (clearFilters) => {
                clearFilters();
                setSearchText('');
              };

              return (
                <div className="p-4 w-56 md:w-96">
                  <Input
                    ref={(node) => {
                      searchInput.current = node;
                    }}
                    placeholder={`Tìm kiếm ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                      setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
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
                  color: filtered ? '#1DA57A' : undefined,
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
            ? (a, b) => a[dataIndex].toString().localeCompare(b[dataIndex])
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
      if (!media.isLg) return cols.slice(0, 2);
      return cols;
    };

    return (
      <div>
        <p className="">Tổng cộng: 100</p>
        <Table
          dataSource={withKeys(data)}
          columns={responsiveColumn(getColumns())}
          rowSelection={{
            ...rowSelection,
          }}
          pagination={pagination}
          loading={loading}
        />
      </div>
    );
  }, [data, columns, pagination, loading, media.isLg]);

  return {
    setData,
    selectedRows,
    AppTable,
  };
};
