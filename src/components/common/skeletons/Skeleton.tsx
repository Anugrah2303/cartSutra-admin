interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

// Base shimmer block. Compose width/height/rounded via className.
const Skeleton = ({ className = "", style }: SkeletonProps) => (
  <div className={`skeleton-shimmer rounded-md ${className}`} style={style} />
);

export default Skeleton;