import Skeleton from "./Skeleton";
import SkeletonCircle from "./SkeletonCircle";

const FullPageAuthSkeleton = () => {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "var(--bg-main)" }}>
      {/* Sidebar shell */}
      <aside
        className="hidden w-64 shrink-0 flex-col gap-2 px-3 py-6 md:flex"
        style={{ backgroundColor: "var(--sidebar-bg)", borderRight: "1px solid var(--sidebar-border)" }}
      >
        <div className="flex items-center gap-3 px-3 pb-6">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-2.5 w-24" />
          </div>
        </div>

        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
            <Skeleton className="h-4.5 w-4.5 rounded" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </aside>

      {/* Main shell */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {/* Topbar shell */}
        <header
          className="flex h-16 items-center justify-between border-b px-6"
          style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-card)" }}
        >
          <Skeleton className="h-9 w-full max-w-sm rounded-lg" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="flex items-center gap-2 border-l pl-4" style={{ borderColor: "var(--border-light)" }}>
              <SkeletonCircle size="h-9 w-9" />
              <div className="hidden flex-col gap-1.5 sm:flex">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-2.5 w-14" />
              </div>
            </div>
          </div>
        </header>

        {/* Content shell */}
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-64" />
            </div>
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border p-5"
                style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-card)" }}
              >
                <Skeleton className="h-3 w-20 mb-3" />
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>

          <div
            className="rounded-2xl border p-5"
            style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-card)" }}
          >
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default FullPageAuthSkeleton;