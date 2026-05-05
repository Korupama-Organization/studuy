import Sidebar from "./components/Sidebar";
import TopHeader from "./components/TopHeader";
import JobsTable from "./components/JobsTable";
import Pagination from "./components/Pagination";

export default function JobsPage() {
  return (
    <div className="min-h-dvh bg-[#F4F6FB] text-slate-900 font-['Inter']">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-[#E8E9FF] blur-[90px]"></div>
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#EDEEFF] blur-[120px]"></div>
      </div>

      <div className="relative mx-auto flex min-h-dvh w-full max-w-[1280px] gap-5 px-4 py-6 lg:px-6">
        <Sidebar />

        <main className="flex flex-1 flex-col gap-6">
          <TopHeader />
          <JobsTable />
          <Pagination />
        </main>
      </div>
    </div>
  );
}
