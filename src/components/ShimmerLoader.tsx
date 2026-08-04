import Skeleton from 'react-loading-skeleton';

const ShimmerLoader = ({ height = '100%', width = '100%' }) => {
  return (
    <Skeleton height={height} width={width} />
  );
};
