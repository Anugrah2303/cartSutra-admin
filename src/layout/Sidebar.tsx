import { useEffect } from "react";
import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import { X } from "lucide-react";
import { useLogout } from "../hooks/queries/auth.queries";
import { useNavBadges } from "../hooks/queries/navBadges.queries";
import { NAV_ITEMS } from "../constants/navLinks";
import { LogOut } from "lucide-react";
import { useGetSettings } from "../hooks/queries/setting.queries";
import Skeleton from "../components/common/skeletons/Skeleton";

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {

    const { data, isLoading } = useGetSettings();

    const navigate = useNavigate();
    const location = useLocation();
    const logout = useLogout;

    const badges = useNavBadges();

    // close the drawer whenever the route changes (mobile nav click)
    useEffect(() => {
        onClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    const handleLogout = () => {
        logout().then(() => navigate("/login"))
    }

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col justify-between overflow-y-auto hide-scrollbar transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`} style={{ backgroundColor: "var(--sidebar-bg)", borderRight: "1px solid var(--sidebar-border)", }} >
                <div>
                    <div className="flex items-center justify-between gap-3 px-6 py-6">
                        <div className="flex items-center gap-3">
                            <Link to={"/admin"} className="flex h-9 w-9 items-center justify-center rounded-lg" >
                                {
                                    isLoading && data ? <Skeleton className="h-9 w-9 rounded-lg" />
                                        : data?.success ? <img src={data?.data.logo.URL} alt="logo" className="h-full w-full object-cover scale-[2] -mb-1" /> : <Skeleton className="h-9 w-9 rounded-lg" />
                                }
                            </Link>
                            <div>
                                <p className="text-base font-semibold" style={{ color: "var(--sidebar-title-hover)" }}> cartSutra</p>
                                <p className="text-xs" style={{ color: "var(--sidebar-icon)" }}> Marketplace admin </p>
                            </div>
                        </div>

                        <button onClick={onClose} className="rounded-md p-1.5 cursor-pointer hover:bg-(--sidebar-item-hover) lg:hidden">
                            <X className="h-5 w-5" style={{ color: "var(--sidebar-icon)" }} />
                        </button>
                    </div>

                    <nav className="mt-2 flex flex-col gap-1 px-3">
                        {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
                            const count = badges[path] ?? 0;
                            const badge = count > 0 ? (count > 99 ? "99+" : String(count)) : null;

                            return (
                                <NavLink key={path} to={path} end={path === "/admin"} className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors" style={({ isActive }) => ({
                                    backgroundColor: isActive ? "var(--sidebar-item-active)" : "transparent",
                                    color: isActive ? "var(--sidebar-title-active)" : "var(--sidebar-title)",
                                    fontWeight: isActive ? 500 : 400,
                                })}>
                                    {({ isActive }) => (
                                        <>
                                            <span className="flex items-center gap-3">
                                                <Icon className="h-4.5 w-4.5" style={{ color: isActive ? "var(--sidebar-icon-active)" : "var(--sidebar-icon)" }} />
                                                {label}
                                            </span>
                                            {badge ? (
                                                <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold text-white" style={{ backgroundColor: "var(--color-primary)" }} > {badge}</span>
                                            ) : null}
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                <div className="px-3 pb-6">
                    <button className="mt-1 cursor-pointer flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-(--sidebar-item-hover)" style={{ color: "var(--sidebar-title)" }} onClick={handleLogout}>
                        <LogOut className="h-4.5 w-[h-4.5]" style={{ color: "var(--sidebar-icon)" }} />
                        Log out
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;