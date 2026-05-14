import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/Logo.png";
import { navItems } from "../data";

interface SidebarProps {
  variant?: "card" | "flush";
}

export default function Sidebar({ variant = "card" }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname.startsWith(path);
  const sidebarClass =
    variant === "flush"
      ? "hidden w-[280px] flex-shrink-0 bg-white px-7 py-8 lg:flex lg:min-h-dvh lg:flex-col lg:border-r lg:border-slate-200"
      : "hidden w-[260px] flex-shrink-0 rounded-[24px] border border-slate-100 bg-white px-5 py-6 shadow-[0_10px_30px_rgba(109,120,196,0.1)] lg:block";

  return (
    <aside className={sidebarClass}>
      <div className="mb-4 flex items-center gap-3">
        <img
          alt="SEeds logo"
          className="h-11 w-11 rounded-2xl object-cover"
          src={logo}
        />
        <div>
          <p className="bg-gradient-to-r from-[#5A63F6] via-[#8B5CF6] to-[#F758B1] bg-clip-text text-lg font-bold text-transparent">
            SEeds
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
        <span className="material-symbols-outlined text-[18px] text-slate-400">search</span>
        <input
          className="w-full border-none bg-transparent text-sm font-medium text-slate-600 placeholder:text-slate-400 focus:outline-none"
          placeholder="Tìm kiếm..."
          type="text"
        />
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              isActive(item.path)
                ? "bg-[#EEF0FF] text-[#5B5BF6] shadow-[0_8px_20px_rgba(91,91,246,0.12)]"
                : "text-slate-500 hover:bg-slate-100"
            }`}
            type="button"
          >
            <span className="material-symbols-outlined flex-shrink-0 text-[20px]">
              {item.icon}
            </span>
            <span className="whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom: Settings + Logout */}
      <div className="mt-auto pt-6 border-t border-slate-100 space-y-1" style={{ marginTop: "auto", paddingTop: "24px" }}>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-100 transition"
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          Cài đặt
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition"
          onClick={() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("currentUser");
            navigate("/login");
          }}
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
