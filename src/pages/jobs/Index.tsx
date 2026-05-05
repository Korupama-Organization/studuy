const jobRows = Array.from({ length: 6 }).map((_, index) => ({
  id: `JOB-00${index + 1}`,
  title: "Middle Back End Developer (Java)",
  salary: "1000-2000 USD",
  createdAt: "22/10/2025",
  createdBy: "Adam",
  status: "Opening",
}));

const navItems = [
  { label: "Dashboard", icon: "grid_view" },
  { label: "Leads List", icon: "fact_check" },
  { label: "Recruiters", icon: "badge" },
  { label: "Jobs", icon: "work" },
  { label: "Settings", icon: "settings" },
];

export default function JobsPage() {
  return (
    <div className="min-h-dvh bg-[#F4F6FB] text-slate-900 font-['Inter']">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#E8E9FF] blur-[90px]"></div>
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#EDEEFF] blur-[120px]"></div>
      </div>

      <div className="relative mx-auto flex min-h-dvh w-full max-w-[1280px] gap-5 px-4 py-6 lg:px-6">
        <aside className="hidden w-[220px] flex-shrink-0 rounded-[24px] border border-slate-100 bg-white px-5 py-6 shadow-[0_10px_30px_rgba(109,120,196,0.1)] lg:block">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5B5BF6] text-white">
              <span className="text-xl font-bold">AI</span>
            </div>
            <div>
              <p className="text-lg font-bold">AI Chan</p>
              <p className="text-xs text-slate-400">Recruitment</p>
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

        <div className="hidden w-px flex-shrink-0 border-l-2 border-dashed border-[#B9C2FF]/70 lg:block"></div>

        <main className="flex flex-1 flex-col gap-6">
          <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_10px_24px_rgba(109,120,196,0.12)]">
              <span className="material-symbols-outlined text-slate-400">
                search
              </span>
              <input
                className="w-full border-none bg-transparent text-sm font-medium text-slate-600 placeholder:text-slate-400 focus:outline-none"
                placeholder="Search here..."
                type="text"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm"
                type="button">
                <span className="material-symbols-outlined text-[18px]">
                  tune
                </span>
              </button>
              <button
                className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm"
                type="button">
                Newest
                <span className="material-symbols-outlined text-[18px]">
                  expand_more
                </span>
              </button>
              <button
                className="rounded-2xl bg-[#5B5BF6] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(91,91,246,0.35)]"
                type="button">
                + New
              </button>
              <div className="hidden items-center gap-3 pl-2 lg:flex">
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm"
                  type="button">
                  <span className="material-symbols-outlined text-[18px]">
                    lock
                  </span>
                </button>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm"
                  type="button">
                  <span className="material-symbols-outlined text-[18px]">
                    notifications
                  </span>
                </button>
                <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm">
                  <img
                    alt="User avatar"
                    className="h-8 w-8 rounded-full object-cover"
                    src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=facearea&w=80&h=80"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      Evan Yates
                    </p>
                    <p className="text-[10px] text-slate-400">HR Manager</p>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-slate-400">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
          </header>

          <section className="flex flex-col gap-4">
            {jobRows.map((job) => (
              <article
                key={job.id}
                className="rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-[0_10px_24px_rgba(109,120,196,0.12)]">
                <div className="grid gap-4 text-sm text-slate-500 sm:grid-cols-2 lg:grid-cols-[120px_1.7fr_1fr_1fr_1fr_120px] lg:items-center">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-300">
                      Job ID
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {job.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-300">
                      Job title
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {job.title}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-300">
                      Salary
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {job.salary}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-300">
                      Created At
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {job.createdAt}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-300">
                      Created By
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {job.createdBy}
                    </p>
                  </div>
                  <div className="flex items-center justify-start lg:justify-end">
                    <span className="rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold text-emerald-600">
                      {job.status}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
            <button
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#5B5BF6] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(91,91,246,0.35)]"
              type="button">
              <span className="material-symbols-outlined text-[18px]">
                chevron_left
              </span>
              Previous
            </button>
            <div className="mx-auto flex items-center gap-2 rounded-2xl bg-white px-2 py-2 shadow-sm">
              {["1", "2", "3", "4"].map((page) => (
                <button
                  key={page}
                  className={`h-9 w-9 rounded-xl text-sm font-semibold transition ${
                    page === "3"
                      ? "bg-[#5B5BF6] text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                  type="button">
                  {page}
                </button>
              ))}
            </div>
            <button
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#5B5BF6] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(91,91,246,0.35)] sm:justify-self-end"
              type="button">
              Next
              <span className="material-symbols-outlined text-[18px]">
                chevron_right
              </span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
