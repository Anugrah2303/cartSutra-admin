import Skeleton from "./Skeleton";
import Card from "../Card";

const SkeletonCategoryTree = () => (
  <Card title="Category Tree">
    <div className="flex flex-col gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i % 3 === 0 ? "w-32" : i % 3 === 1 ? "w-40 ml-4" : "w-28 ml-8"}`} />
      ))}
    </div>
  </Card>
);

export default SkeletonCategoryTree;