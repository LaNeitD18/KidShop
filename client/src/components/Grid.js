export function FormGrid({ children, column = 1 }) {
  switch (column) {
    case 2:
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 xl:gap-14">
          {children}
        </div>
      );
    default:
      return (
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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
