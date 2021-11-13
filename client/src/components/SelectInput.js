import { Select } from 'antd';
import { idString } from '../utils/string';

export default function SelectInput({
  data,
  onSelect,
  idFormat,
  allowClear = true,
  showSearch = true,
  showId = true,
  ...rest
}) {
  const options = data?.map((d) => ({
    value: d.value.toString(),
    label: showId ? `${d.label} (${idString(d.value, idFormat)})` : d.label,
  }));
  return (
    <Select
      size="large"
      showSearch={showSearch}
      placeholder="Chọn..."
      optionFilterProp="label"
      options={options}
      onSelect={onSelect}
      allowClear={allowClear}
      {...rest}
    />
  );
}
