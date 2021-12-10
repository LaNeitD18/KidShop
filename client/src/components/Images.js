import { Image } from "antd";
import classNames from "classnames";
import { useState, useLayoutEffect } from "react";
import { IoExpandOutline, IoContractOutline } from "react-icons/io5";
import { LoadingOutlined } from "@ant-design/icons";
import fallback from "../assets/fallback.jpg";
import placeholder from "../assets/placeholder.jpg";

export function ExpandableImage({ src, height = 400, loading }) {
  const [contain, setContain] = useState(false);

  return (
    <div className="flex flex-col">
      {loading && (
        <div
          className="bg-black z-10 opacity-0 hover:opacity-100 bg-opacity-10 flex items-center justify-center transition-all"
          style={{ height: height, marginTop: -height }}
        >
          <LoadingOutlined className="text-6lg" />
        </div>
      )}
      {(!loading || !src) && (
        <Image
          height={height}
          src={src || placeholder}
          fallback={fallback}
          preview={false}
          style={{
            border: `solid 1px #D1D5DB`,
            backgroundColor: "transparent",
          }}
          className={classNames("transition-all  shadow-inner", {
            "object-contain": contain,
            "object-cover": !contain,
          })}
        />
      )}
      {!!src && (
        <div
          onClick={() => setContain((prev) => !prev)}
          className="bg-black z-10 opacity-0 hover:opacity-100 bg-opacity-10 flex items-center justify-center transition-all"
          style={{ height: height, marginTop: -height }}
        >
          {contain ? (
            <IoExpandOutline className="text-white text-5xl" />
          ) : (
            <IoContractOutline className="text-white text-5xl" />
          )}
        </div>
      )}
    </div>
  );
}
