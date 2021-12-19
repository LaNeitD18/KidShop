import { LoadingOutlined } from '@ant-design/icons';
export function FormGrid({ children, column = 1, loading }) {
  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <LoadingOutlined className="text-5xl" />
      </div>
    );
  switch (column) {
    case 2:
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 md:gap-x-10 xl:gap-x-14">
          {children}
        </div>
      );
    case 3:
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 md:gap-x-10 xl:gap-x-6">
          {children}
        </div>
      );
    default:
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div>{children}</div>
        </div>
      );
  }
}

export function Grid({ children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-5">
      {children}
    </div>
  );
}

export function OneColumnFormContainer({ children, ...rest }) {
  return (
    <div className="gap-6 md:gap-10 xl:gap-14 mt-7" {...rest}>
      {children}
    </div>
  );
}
