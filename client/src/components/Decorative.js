import classNames from 'classnames';
import { GiPlainCircle } from 'react-icons/gi';

export function StatusIndicator({ active }) {
  return (
    <GiPlainCircle
      className={classNames('text-xs', {
        'text-green-500': active,
        'text-gray-300': !active,
      })}
    />
  );
}
