import { useState } from "react";
import UpdateJobModal from "./UpdateJobModal";
import type { SaveJobPayload } from "../Index";

interface JobRow {
  id: string;
  slug: string;
  title: string;
  summary: string;
  shortDescription?: string;
  jobDescription?: string;
  locations: string[];
  workModel: string;
  level: string;
  jobType: string;
  headcount: number;
  roleType: string;
  requiredEducation: string;
  minMonthsExperience: number;
  salary?: string;
  client?: string;
  createdAt: string;
  createdBy: string;
  status: string;
}

interface JobsTableProps {
  jobs: JobRow[];
  isLoading: boolean;
  onUpdateJob: (id: string, payload: SaveJobPayload) => Promise<void>;
  onDeleteJob: (id: string) => Promise<void>;
}

export default function JobsTable({ jobs, isLoading, onUpdateJob, onDeleteJob }: JobsTableProps) {
  const [selectedJob, setSelectedJob] = useState<JobRow | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const handleJobClick = (job: JobRow) => {
    setSelectedJob(job);
    setIsUpdateModalOpen(true);
  };

  if (isLoading) {
    return <p className="text-sm text-slate-500">Dang tai jobs...</p>;
  }

  if (!jobs.length) {
    return <p className="text-sm text-slate-500">Khong co job nao.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="hidden flex-col gap-4 lg:flex">
        {jobs.map((job) => (
          <div
            key={job.slug || job.id}
            onClick={() => handleJobClick(job)}
            className="rounded-2xl border border-slate-100 bg-white p-5 text-sm shadow-sm transition hover:shadow-md cursor-pointer hover:border-slate-200">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Job ID</p>
                  <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                    {job.slug || job.id}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{job.title || "-"}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{job.summary || "No description"}</p>
              </div>
              <div className="flex-shrink-0">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  job.status === "published"
                    ? "bg-emerald-100 text-emerald-600"
                    : job.status === "draft"
                    ? "bg-slate-100 text-slate-600"
                    : "bg-amber-100 text-amber-600"
                }`}>
                  {job.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 pt-3 border-t border-slate-100">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Role Type</p>
                <p className="text-slate-700 font-medium capitalize">{job.roleType || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Locations</p>
                <p className="text-slate-700">{job.locations?.join(", ") || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Work Model</p>
                <p className="text-slate-700 capitalize">{job.workModel || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Level</p>
                <p className="text-slate-700 capitalize">{job.level || "-"}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 pt-3 border-t border-slate-100">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Job Type</p>
                <p className="text-slate-700 capitalize">{job.jobType || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Headcount</p>
                <p className="text-slate-700">{job.headcount || 0} positions</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Experience</p>
                <p className="text-slate-700">{job.minMonthsExperience > 0 ? `${job.minMonthsExperience} months` : "0 months"}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Created At</p>
                <p className="text-slate-700">{job.createdAt}</p>
              </div>
            </div>

            {job.requiredEducation && (
              <div className="pt-3 mt-3 border-t border-slate-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Required Education</p>
                <p className="text-slate-600 text-xs line-clamp-2">{job.requiredEducation}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="lg:hidden flex flex-col gap-4">
        {jobs.map((job) => (
          <div
            key={job.slug || job.id}
            onClick={() => handleJobClick(job)}
            className="border border-slate-100 rounded-xl p-4 bg-white shadow-sm cursor-pointer transition hover:shadow-md hover:border-slate-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-400">Job ID</p>
                <p className="font-semibold text-slate-900">{job.slug || job.id}</p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                job.status === "published"
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-slate-100 text-slate-600"
              }`}>
                {job.status}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{job.title || "-"}</h3>
            <p className="text-xs text-slate-500 line-clamp-2 mb-3">{job.summary || "No description"}</p>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-400">Role Type</p>
                <p className="text-slate-700 text-xs capitalize">{job.roleType || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-400">Level</p>
                <p className="text-slate-700 text-xs capitalize">{job.level || "-"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-400">Locations</p>
                <p className="text-slate-700 text-xs">{job.locations?.join(", ") || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-400">Work Model</p>
                <p className="text-slate-700 text-xs capitalize">{job.workModel || "-"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-400">Job Type</p>
                <p className="text-slate-700 text-xs capitalize">{job.jobType || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-400">Headcount</p>
                <p className="text-slate-700 text-xs">{job.headcount || 0} positions</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-400">Experience</p>
                <p className="text-slate-700 text-xs">{job.minMonthsExperience > 0 ? `${job.minMonthsExperience} months` : "0 months"}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase text-slate-400">Created At</p>
                <p className="text-slate-700 text-xs">{job.createdAt}</p>
              </div>
            </div>

            {job.requiredEducation && (
              <div className="pt-2 mt-2 border-t border-slate-100">
                <p className="text-[10px] font-semibold uppercase text-slate-400">Required Education</p>
                <p className="text-slate-600 text-xs line-clamp-2">{job.requiredEducation}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <UpdateJobModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        job={selectedJob || undefined}
        onUpdate={onUpdateJob}
        onDelete={onDeleteJob}
      />
    </div>
  );
}
