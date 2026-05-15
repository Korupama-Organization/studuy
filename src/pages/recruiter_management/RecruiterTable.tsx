import { useState } from "react";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import UpdateRecruiterModal from "./UpdateRecruiterModal";
import type { Recruiter, UpdateProfilePayload } from "./Index";

interface RecruiterTableProps {
  recruiters: Recruiter[];
  isLoading: boolean;
  onUpdateRecruiter: (id: string, payload: UpdateProfilePayload) => Promise<void>;
  onDeleteRecruiter: (id: string) => Promise<void>;
  isCurrentRecruiter: (recruiter: Recruiter) => boolean;
}

export default function RecruiterTable({
  recruiters,
  isLoading,
  onUpdateRecruiter,
  onDeleteRecruiter,
  isCurrentRecruiter,
}: RecruiterTableProps) {
  const [selectedRecruiter, setSelectedRecruiter] = useState<Recruiter | null>(
    null,
  );
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [pendingDeleteRecruiter, setPendingDeleteRecruiter] =
    useState<Recruiter | null>(null);
  const [actionError, setActionError] = useState("");

  const handleClick = (recruiter: Recruiter) => {
    setSelectedRecruiter(recruiter);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (recruiter: Recruiter) => {
    if (isCurrentRecruiter(recruiter)) {
      setActionError("Bạn không thể xóa chính tài khoản đang đăng nhập.");
      return;
    }

    setPendingDeleteRecruiter(recruiter);
    setActionError("");
    setIsDeleteConfirmOpen(true);
  };

  const formatJoinDate = (value: string) => {
    if (typeof value !== "string" || !value.trim()) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getStatusStyles = (status: Recruiter["status"]) => {
    if (status === "active") {
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    }

    return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
  };

  const getStatusDot = (status: Recruiter["status"]) => {
    if (status === "active") {
      return "bg-emerald-500";
    }

    return "bg-slate-400";
  };

  const getRoleLabel = (role: string) => {
    if (!role) return "-";

    return role
      .replace(/_/g, " ")
      .replace(/\b\w/g, (match) => match.toUpperCase());
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDeleteRecruiter || !pendingDeleteRecruiter._id) return;

    try {
      await onDeleteRecruiter(pendingDeleteRecruiter._id);
      setIsDeleteConfirmOpen(false);
      setPendingDeleteRecruiter(null);
    } catch (deleteError) {
      setActionError(
        deleteError instanceof Error
          ? deleteError.message
          : "Xoa recruiter that bai.",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#EEF0FF] border-t-[#5B5BF6]" />
          <p className="text-sm text-slate-400">Loading recruiters...</p>
        </div>
      </div>
    );
  }

  if (!recruiters.length) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-2">
          <span className="material-symbols-outlined text-3xl text-slate-300">
            group_off
          </span>
          <p className="text-sm font-medium text-slate-400">
            No recruiters found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {actionError ? (
        <p className="mb-4 text-sm text-red-500">{actionError}</p>
      ) : null}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/80">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Họ tên
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Số điện thoại
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Vai trò
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Ngày tham gia
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {recruiters.map((recruiter) => {
              const isSelf = isCurrentRecruiter(recruiter);

              return (
                <tr
                  key={recruiter._id || recruiter.email}
                  className="transition hover:bg-slate-50/70">
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {recruiter.fullName || "-"}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                    {recruiter.email || "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                    {recruiter.phone || "-"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                    {getRoleLabel(recruiter.role)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(
                        recruiter.status,
                      )}`}>
                      <span
                        className={`h-2 w-2 rounded-full ${getStatusDot(recruiter.status)}`}
                      />
                      {recruiter.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                    {formatJoinDate(recruiter.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleClick(recruiter)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-[#5B5BF6]/25 hover:bg-[#EEF0FF] hover:text-[#5B5BF6]"
                        aria-label={`Chỉnh sửa ${recruiter.fullName}`}>
                        <span className="material-symbols-outlined text-[18px]">
                          edit
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(recruiter)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-slate-200 disabled:hover:bg-white disabled:hover:text-slate-500"
                        aria-label={
                          isSelf
                            ? "Không thể xóa tài khoản đang đăng nhập"
                            : `Xóa ${recruiter.fullName}`
                        }
                        disabled={isSelf}
                        title={
                          isSelf
                            ? "Không thể xóa chính tài khoản đang đăng nhập"
                            : `Xóa ${recruiter.fullName}`
                        }>
                        <span className="material-symbols-outlined text-[18px]">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <UpdateRecruiterModal
        key={selectedRecruiter?._id || selectedRecruiter?.email || "update-recruiter-modal"}
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        recruiter={selectedRecruiter || undefined}
        onUpdate={onUpdateRecruiter}
        onDelete={onDeleteRecruiter}
        isSelf={selectedRecruiter ? isCurrentRecruiter(selectedRecruiter) : false}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setPendingDeleteRecruiter(null);
        }}
        onConfirm={() => {
          void handleDeleteConfirm();
        }}
      />
    </div>
  );
}
