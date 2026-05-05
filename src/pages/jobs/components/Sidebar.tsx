import logo from "../../../assets/Logo.png";
import { navItems } from "../data";

export default function Sidebar() {
  return (
    <aside className="hidden w-[220px] flex-shrink-0 rounded-[24px] border border-slate-100 bg-white px-5 py-6 shadow-[0_10px_30px_rgba(109,120,196,0.1)] lg:block">
      <div className="mb-10 flex items-center gap-3">
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
      <nav className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              item.label === "Jobs"
                ? "bg-[#EEF0FF] text-[#5B5BF6] shadow-[0_8px_20px_rgba(91,91,246,0.12)]"
                : "text-slate-500 hover:bg-slate-100"
            }`}
            type="button">
            <span className="material-symbols-outlined text-[20px]">
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
