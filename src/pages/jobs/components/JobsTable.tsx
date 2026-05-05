import { jobRows } from "../data";

export default function JobsTable() {
  return (
    <div className="flex flex-col gap-4">
      <div className="hidden flex-col gap-4 lg:flex">
        {jobRows.map((job) => (
          <div
            key={job.id}
            className="grid grid-cols-6 items-start gap-4 rounded-2xl border border-slate-100 bg-white px-6 py-4 text-sm shadow-sm transition hover:shadow-md"
            style={{ gridTemplateColumns: "100px 1.7fr 1fr 1fr 1fr 120px" }}>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Job ID
              </p>
              <p className="mt-1 font-semibold text-slate-900">{job.id}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Job Title
              </p>
              <p className="mt-1 text-slate-700">{job.title}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Salary
              </p>
              <p className="mt-1 text-slate-700">{job.salary}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Created At
              </p>
              <p className="mt-1 text-slate-700">{job.createdAt}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Created By
              </p>
              <p className="mt-1 text-slate-700">{job.createdBy}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Status
              </p>
              <span className="mt-1 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                {job.status}
              </span>
            </div>
          </div>
        ))}
      </div>


      <div className="lg:hidden flex flex-col gap-4">
        {jobRows.map((job) => (
          <div
            key={job.id}
            className="border border-slate-100 rounded-xl p-4 space-y-3 bg-white shadow-sm">
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
    </div>
  );
}
