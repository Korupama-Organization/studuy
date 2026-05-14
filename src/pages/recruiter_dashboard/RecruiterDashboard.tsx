import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecruiterDashboard.css';
import { motion } from 'framer-motion';
import RecruiterSidebar from '../../components/recruiter/RecruiterSidebar';
import { 
  dashboardService, 
  DashboardData,
  DashboardApiError
} from '../../services/dashboardService';
import { 
  hasValidStoredAccessToken, 
  clearAuthSession, 
  AuthUser 
} from '../../services/auth';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const RecruiterDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Auth guard: kiểm tra token, nếu không có thì redirect về login
  useEffect(() => {
    if (!hasValidStoredAccessToken()) {
      navigate('/login', { replace: true });
      return;
    }

    // Đọc thông tin user đã lưu từ localStorage
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser) as AuthUser);
      }
    } catch {
      // ignore parse errors
    }
  }, [navigate]);

  // Fetch dashboard data từ backend API
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dashboardData = await dashboardService.getDashboard('week');
      setData(dashboardData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      // Nếu lỗi xác thực (401/403), redirect về login
      if (err instanceof DashboardApiError && err.isAuthError) {
        clearAuthSession();
        navigate('/login', { replace: true });
        return;
      }
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu dashboard.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login', { replace: true });
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Error state — hiển thị lỗi và nút thử lại
  if (error || !data) {
    const isNoCompanyError = error?.includes('chưa thuộc công ty');

    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white p-10 rounded-[40px] border border-gray-100 shadow-2xl shadow-indigo-100 text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-orange-50 flex items-center justify-center text-orange-500 mb-8 mx-auto">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          
          <h3 className="text-2xl font-black text-gray-900 mb-4">
            {isNoCompanyError ? 'Thiết lập tài khoản' : 'Không thể tải dữ liệu'}
          </h3>
          
          <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
            {error || 'Đã xảy ra lỗi không xác định khi truy cập hệ thống.'}
            {isNoCompanyError && <span className="block mt-2">Vui lòng liên hệ quản trị viên để được gán vào một công ty trước khi sử dụng Dashboard.</span>}
          </p>
          
          <div className="flex flex-col gap-3">
            <motion.button
              onClick={fetchData}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-indigo-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-600 transition-all"
            >
              Thử tải lại trang
            </motion.button>
            
            <button
              onClick={handleLogout}
              className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all"
            >
              Đăng xuất
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const { stats, chartData, recentApplications, upcomingInterviews, statusOverview, notifications, company, recruiter } = data;

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      <RecruiterSidebar
        company={company}
        activePath="/recruiter/dashboard"
        onLogout={handleLogout}
      />

      {/* Middle Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10 px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">Tổng quan doanh nghiệp</h2>
            <p className="text-xs font-medium text-gray-500 mt-1">
              Chào mừng trở lại, {recruiter.fullName || currentUser?.fullName || 'quản trị viên'}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              {notifications.length > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
            </motion.button>
            <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 leading-none">
                  {recruiter.fullName || currentUser?.fullName || 'User'}
                </p>
                <p className="text-[11px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md mt-1 inline-block">
                  {recruiter.jobTitle || currentUser?.role || 'HR'}
                </p>
              </div>
              <div className="w-11 h-11 rounded-full shadow-sm bg-indigo-500 text-white flex items-center justify-center font-bold text-lg overflow-hidden">
                {recruiter.avatarUrl ? (
                    <img src={recruiter.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                    (recruiter.fullName || currentUser?.fullName || 'U').charAt(0).toUpperCase()
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full space-y-8 pb-20">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <motion.div 
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-40 cursor-default"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stats.candidates.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-100 text-gray-500'}`}>{stats.candidates.trend}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-1">Ứng viên tiềm năng</p>
                <h3 className="text-3xl font-black text-gray-900">{stats.candidates.value.toLocaleString()}</h3>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-40 cursor-default"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-1">Vị trí</p>
                <h3 className="text-3xl font-black text-gray-900">{stats.positions.value}</h3>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-40 cursor-default"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-1">CV Đã nhận</p>
                <h3 className="text-3xl font-black text-gray-900">{stats.cvsReceived.value}</h3>
              </div>
            </motion.div>

            {/* Card 4 */}
            <motion.div 
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-40 cursor-default"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-1">Đã tuyển</p>
                <h3 className="text-3xl font-black text-gray-900">{stats.hired.value}</h3>
              </div>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Bar Chart */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-lg font-black text-gray-900">Thống kê hồ sơ</h3>
                <div className="bg-gray-100 p-1 rounded-xl text-xs font-bold text-indigo-500 flex">
                  <span className="bg-white px-4 py-1.5 rounded-lg shadow-sm">Tháng</span>
                </div>
              </div>
              
              {/* Dummy Bar Chart */}
              <div className="flex items-end justify-between h-48 px-4 gap-4">
                {chartData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 h-full justify-end">
                    <div className="flex items-end gap-1 w-full justify-center h-full">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${item.secondaryCount}%` }}
                        className="w-2 bg-indigo-100 rounded-t-full"
                      />
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${item.count}%` }}
                        className="w-2 bg-indigo-500 rounded-t-full"
                      />
                    </div>
                    <span className={`text-[10px] uppercase mt-3 font-bold text-gray-400`}>
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Donut Chart */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-8 items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900 mb-8">Trạng thái hồ sơ</h3>
                {/* Dummy Donut */}
                <div className="relative w-40 h-40 rounded-full border-[12px] border-indigo-500 border-r-indigo-200 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-gray-900">{statusOverview.total.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Tổng</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {statusOverview.items.slice(0, 3).map((item, index) => (
                    <div key={item.key}>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`w-8 h-2 rounded-full ${index === 0 ? 'bg-indigo-500' : index === 1 ? 'bg-indigo-300' : 'bg-emerald-400'}`}></span>
                        <span className="text-xs font-bold text-gray-500 uppercase">{item.label}</span>
                    </div>
                    <p className="text-sm font-black text-gray-900 ml-10">{item.count} ({item.percentage}%)</p>
                    </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between">
              <h3 className="text-base font-black text-gray-900 uppercase tracking-wide">Ứng tuyển gần đây</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-xl flex items-center px-3 py-2 w-64">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input type="text" placeholder="Tìm kiếm..." className="bg-transparent border-none outline-none text-xs ml-2 w-full text-gray-700 placeholder-gray-400" />
              </div>
            </div>
            
            {/* Table Area */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ứng viên</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vị trí</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày nộp</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 text-sm flex items-center gap-3">
                        <img src={app.recruiterAvatar} className="w-8 h-8 rounded-full bg-gray-100" alt="" />
                        {app.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-medium">{app.position}</td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-400">{app.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          app.status === 'Review' ? 'bg-indigo-50 text-indigo-500' :
                          app.status === 'Interview' ? 'bg-emerald-50 text-emerald-500' :
                          app.status === 'Hired' ? 'bg-blue-50 text-blue-500' :
                          app.status === 'Offered' ? 'bg-purple-50 text-purple-500' :
                          'bg-orange-50 text-orange-500'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {recentApplications.length === 0 && (
              <div className="p-10 text-center text-gray-400 font-medium text-sm">
                Chưa có dữ liệu ứng viên mới.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-80 bg-white border-l border-gray-200 shadow-[-10px_0_30px_rgba(0,0,0,0.02)] hidden xl:block flex-shrink-0">
        <div className="p-8">
          <h2 className="text-sm font-black text-gray-900 tracking-[0.2em] uppercase mb-10">Hoạt động</h2>
          
          <div className="mb-10">
            <h3 className="text-[10px] font-black text-gray-500 tracking-widest uppercase mb-6">Thông báo</h3>
            <div className="space-y-6">
                {notifications.map((notification) => (
                <div key={notification.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0 overflow-hidden">
                        {notification.candidate?.avatarUrl ? (
                            <img src={notification.candidate.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        )}
                    </div>
                    <div>
                    <p className="text-sm text-gray-900 leading-snug">
                        <span className="font-black">{notification.candidate?.fullName || 'Ứng viên'}</span> <span className="font-medium text-gray-600">nộp CV cho</span> <span className="font-black text-indigo-500">{notification.job?.roleType || notification.job?.title || 'Vị trí'}</span>
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 mt-2">{notification.createdAt ? dayjs(notification.createdAt).fromNow() : 'Mới đây'}</p>
                    </div>
                </div>
                ))}
                {notifications.length === 0 && (
                    <p className="text-xs text-gray-400 font-medium">Không có thông báo mới.</p>
                )}
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100">
            <h3 className="text-[10px] font-black text-gray-500 tracking-widest uppercase mb-6">Phỏng vấn sắp tới</h3>
            
            <div className="space-y-4">
              {upcomingInterviews.map((interview) => (
                <motion.div 
                  key={interview.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-gray-50 border border-gray-100 rounded-3xl p-5 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-indigo-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg max-w-[120px] truncate">
                      {interview.tag}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500">{interview.time}</span>
                  </div>
                  <h4 className="text-sm font-black text-gray-900 mb-3 leading-snug">
                    Phỏng vấn {interview.candidateName}
                  </h4>
                  <div className="flex items-center gap-2">
                    <img src={interview.interviewerAvatar} alt="Candidate" className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-[11px] font-bold text-gray-500">{interview.candidateName}</span>
                  </div>
                </motion.div>
              ))}
              {upcomingInterviews.length === 0 && (
                <p className="text-xs text-gray-400 font-medium">Không có lịch phỏng vấn sắp tới.</p>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default RecruiterDashboard;