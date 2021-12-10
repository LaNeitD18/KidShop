import classNames from 'classnames';

export function SingleLineSkeleton({ widthClassName = 'w-32' }) {
  return (
    <div
      className={classNames('h-4 bg-gray-100 rounded', {
        [widthClassName]: true,
      })}
    />
  );
}
