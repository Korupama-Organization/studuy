import { columns, jobRows } from "../data";

export default function JobsTable() {
  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-white shadow-[0_10px_24px_rgba(109,120,196,0.12)] overflow-hidden">
      <div
        className="hidden grid-cols-6 gap-4 border-b border-slate-100 px-6 py-4 lg:grid"
        style={{ gridTemplateColumns: "100px 1.7fr 1fr 1fr 1fr 120px" }}>
        {columns.map((col) => (
          <div key={col.key}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              {col.label}
            </p>
          </div>
        ))}
      </div>

      {jobRows.map((job, index) => (
        <div
          key={job.id}
          className={`hidden grid-cols-6 gap-4 px-6 py-4 items-center text-sm transition hover:bg-slate-50 lg:grid ${
            index !== jobRows.length - 1 ? "border-b border-slate-100" : ""
          }`}
          style={{ gridTemplateColumns: "100px 1.7fr 1fr 1fr 1fr 120px" }}>
          <div>
            <p className="font-semibold text-slate-900">{job.id}</p>
          </div>
          <div>
            <p className="text-slate-700">{job.title}</p>
          </div>
          <div>
            <p className="text-slate-700">{job.salary}</p>
          </div>
          <div>
            <p className="text-slate-700">{job.createdAt}</p>
          </div>
          <div>
            <p className="text-slate-700">{job.createdBy}</p>
          </div>
          <div className="flex justify-end">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
              {job.status}
            </span>
          </div>
        </div>
      ))}

      <div className="lg:hidden flex flex-col gap-4 p-4">
        {jobRows.map((job) => (
          <div
            key={job.id}
            className="border border-slate-100 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">
                  Job ID
                </p>
                <p className="font-semibold text-slate-900">{job.id}</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                {job.status}
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">
                Job title
              </p>
              <p className="text-slate-700">{job.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">
                  Salary
                </p>
                <p className="text-slate-700">{job.salary}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">
                  Created At
                </p>
                <p className="text-slate-700">{job.createdAt}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">
                  Created By
                </p>
                <p className="text-slate-700">{job.createdBy}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
