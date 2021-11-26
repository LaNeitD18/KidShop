import { Input, message, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import { fireError } from "../utils/feedback";
import { idString } from "../utils/string";
import { LoadingOutlined } from "@ant-design/icons";
import { IoCloudUploadOutline } from "react-icons/io5";

export function SelectInput({
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

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

export function UploadImageInput({ onValueChange, ...rest }) {
  const [progress, setProgress] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [value, setValue] = useState(null);

  useEffect(() => {
    onValueChange(value);
  }, [value, onValueChange]);

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Chỉ cho phép định dạng hình ảnh (jpeg/png)");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Kích thước tệp tin tối đa 2MB");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setFetching(true);
      setValue(null);
      setProgress(Math.round(info.file.percent));
      return;
    }
    if (info.file.status === "done") {
      setValue(info.file.response.data.url);
    } else {
      fireError(info.file.response);
    }
    setFetching(false);
    setProgress(0);
  };
  const handleChangeUrl = (e) => {
    setValue(e.target.value);
  };
  return (
    <Input
      size="large"
      placeholder={fetching ? `Đang tải lên ${progress}%` : "URL hình ảnh"}
      name="imgUrl"
      onChange={handleChangeUrl}
      value={value}
      disabled={fetching}
      addonAfter={
        <Upload
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          action="https://api.imgbb.com/1/upload?key=eee335b1602409f860ff2860d4919b8f"
          data={(file) => ({ image: file })}
        >
          <div className="flex items-center gap-2 hover:text-primary transition-all">
            {fetching ? (
              <LoadingOutlined className="text-lg" />
            ) : (
              <IoCloudUploadOutline className="text-lg" />
            )}
            {fetching ? "Đang upload" : "Upload ảnh"}
          </div>
        </Upload>
      }
      {...rest}
    />
  );
}
