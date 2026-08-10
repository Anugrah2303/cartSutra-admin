import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useLogout } from "../hooks/queries/auth.queries";

interface ProfileMenuProps {
  name: string;
  role: string;
  profileImg?: string
}

const ProfileMenu = ({ name, role, profileImg }: ProfileMenuProps) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const logout = useLogout;

  const initial = name?.charAt(0)?.toUpperCase() ?? "U";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => { setOpen(false); logout().then(() => navigate("/login")); };

  const menuItems = [
    { label: "Profile", icon: User, onClick: () => { setOpen(false); navigate("/admin/profile"); } },
    { label: "Settings", icon: Settings, onClick: () => { setOpen(false); navigate("/admin/settings"); } },
  ];

  return (
    <div className="relative" ref={containerRef}>
      <button onClick={() => setOpen((prev) => !prev)} className="flex items-center gap-2 border-l pl-4 cursor-pointer" style={{ borderColor: "var(--border-light)" }}>

        {
          profileImg ? 
          <img className="flex h-9 w-9 items-center justify-center rounded-full object-cover shrink-0" src={profileImg} />  
          : 
          <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white shrink-0" style={{ background: "var(--gradient-primary)" }}>{initial}</div>
        }
          
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{name}</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{role}</p>
        </div>

        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} style={{ color: "var(--text-muted)" }} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-md border py-1" style={{ borderColor: "var(--border-light)", backgroundColor: "var(--bg-card)", boxShadow: "var(--shadow-md)" }}>
          <div className="border-b px-3 py-2 sm:hidden" style={{ borderColor: "var(--border-light)" }}>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{name}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>{role}</p>
          </div>

          {menuItems.map((item) => (
            <button key={item.label} onClick={item.onClick} className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm cursor-pointer hover:bg-(--bg-soft)" style={{ color: "var(--text-primary)" }}>
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          ))}

          <div className="my-1 border-t" style={{ borderColor: "var(--border-light)" }} />

          <button onClick={handleLogout} className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm cursor-pointer hover:bg-(--bg-soft)" style={{ color: "var(--error)" }}>
            <LogOut className="h-4 w-4 shrink-0" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;