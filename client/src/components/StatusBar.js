import classNames from 'classnames';
import { GiPlainCircle } from 'react-icons/gi';

export function StatusBar({ children, className }) {
  return (
    <div
      className={classNames('bg-normal py-2 px-4 border rounded', {
        [className]: true,
      })}
    >
      {children}
    </div>
  );
}

export function ActiveItem({ active, number, text }) {
  if (!number) return null;
  return (
    <span className="flex gap-2 items-center">
      <GiPlainCircle
        className={classNames('text-xs', {
          'text-green-500': active,
          'text-gray-300': !active,
        })}
      />
      <span style={{ marginBottom: 2 }}>
        {number} {text}
      </span>
    </span>
  );
}
