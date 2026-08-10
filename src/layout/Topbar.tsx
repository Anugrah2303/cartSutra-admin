// src/layout/Topbar.tsx
import { useState } from "react";
import { Moon, Sun, Menu } from "lucide-react";
import ProfileMenu from "./ProfileMenu.tsx";
import GlobalSearch from "./GlobalSearch.tsx";
import NotificationBell from "./NotificationBell.tsx";
import type { UserIF } from "../interface/data/user.ts";
import { useGetUser } from "../hooks/queries/auth.queries.ts";

interface TopbarProps {
    onMenuClick: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
    const [isDark, setIsDark] = useState(false);
    const { data } = useGetUser<UserIF>();

    const toggleTheme = () => { setIsDark((prev) => { document.documentElement.classList.toggle("dark", !prev); return !prev; }); };

    return (
        <header className="flex h-16 items-center justify-between gap-2 border-b px-3 sm:px-6" style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-card)" }}>
            <button onClick={onMenuClick} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border lg:hidden" style={{ borderColor: "var(--border-light)", color: "var(--text-secondary)" }}>
                <Menu className="h-4.5 w-4.5" />
            </button>

            <GlobalSearch />

            <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                <button onClick={toggleTheme} className=" h-9 w-9 items-center justify-center rounded-lg border transition-colors sm:flex" style={{ borderColor: "var(--border-light)", color: "var(--text-secondary)" }}>
                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>

                <NotificationBell />

                <ProfileMenu name={data!.data.username} role={data!.data.role.toLowerCase()} profileImg={data!.data.avatar.URL} />
            </div>
        </header>
    );
};

export default Topbar;