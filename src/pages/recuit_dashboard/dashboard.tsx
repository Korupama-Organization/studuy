import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import { motion } from 'framer-motion';
import { 
  dashboardService, 
  DashboardStats, 
  ApplicationStat, 
  RecentApplication, 
  UpcomingInterview 
} from '../../services/dashboardService';
import { 
  hasValidStoredAccessToken, 
  clearAuthSession, 
  AuthUser 
} from '../../services/auth';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartData, setChartData] = useState<ApplicationStat[]>([]);
  const [applications, setApplications] = useState<RecentApplication[]>([]);
  const [interviews, setInterviews] = useState<UpcomingInterview[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // // Auth guard: kiểm tra token, nếu không có thì redirect về login
  // useEffect(() => {
  //   if (!hasValidStoredAccessToken()) {
  //     navigate('/login', { replace: true });
  //     return;
  //   }

  //   // Đọc thông tin user đã lưu từ localStorage
  //   try {
  //     const storedUser = localStorage.getItem('currentUser');
  //     if (storedUser) {
  //       setCurrentUser(JSON.parse(storedUser) as AuthUser);
  //     }
  //   } catch {
  //     // ignore parse errors
  //   }
  // }, [navigate]);

  // Fetch dashboard data từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, chartRes, appData, interviewData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getChartData(),
          dashboardService.getRecentApplications(),
          dashboardService.getUpcomingInterviews()
        ]);
        
        setStats(statsData);
        setChartData(chartRes);
        setApplications(appData);
        setInterviews(interviewData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login', { replace: true });
  };

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

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 lg:w-72 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex">
        <div className="px-6 py-8">
          {/* Logo Area */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
              S
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-gray-900 leading-none">SEeds</h1>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">Enterprise</p>
            </div>
          </div>

          {/* Search */}
          <div className="bg-gray-100 rounded-xl flex items-center px-4 py-2.5 mb-8">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Tìm kiếm..." className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 placeholder-gray-400" />
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-2">
            <motion.a 
              href="#" 
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 bg-indigo-500 text-white px-4 py-3 rounded-xl shadow-sm shadow-indigo-200 font-bold text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              Main Dashboard
            </motion.a>
            <motion.a 
              href="#" 
              whileHover={{ x: 4, backgroundColor: 'rgba(249, 250, 251, 1)' }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 text-gray-500 hover:text-indigo-600 px-4 py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              Nhân viên
            </motion.a>
            <motion.a 
              href="#" 
              whileHover={{ x: 4, backgroundColor: 'rgba(249, 250, 251, 1)' }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 text-gray-500 hover:text-indigo-600 px-4 py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              Thông tin công ty
            </motion.a>
            <motion.a 
              href="#" 
              whileHover={{ x: 4, backgroundColor: 'rgba(249, 250, 251, 1)' }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 text-gray-500 hover:text-indigo-600 px-4 py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Bài tuyển dụng
            </motion.a>
            <motion.a 
              href="#" 
              whileHover={{ x: 4, backgroundColor: 'rgba(249, 250, 251, 1)' }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 text-gray-500 hover:text-indigo-600 px-4 py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
              Phỏng vấn
            </motion.a>
          </nav>
        </div>

        {/* Bottom Nav */}
        <div className="px-6 py-8 border-t border-gray-100">
          <motion.a 
            href="#" 
            whileHover={{ x: 4, color: '#111827' }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 text-gray-500 px-4 py-2 font-semibold text-sm transition-colors mb-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Cài đặt
          </motion.a>
          <motion.button 
            onClick={handleLogout}
            whileHover={{ x: 4, color: '#ef4444' }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 text-red-500 px-4 py-2 font-semibold text-sm transition-colors w-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Đăng xuất
          </motion.button>
        </div>
      </aside>

      {/* Middle Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10 px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">Tổng quan doanh nghiệp</h2>
            <p className="text-xs font-medium text-gray-500 mt-1">
              Chào mừng trở lại, {currentUser?.fullName || 'quản trị viên'}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </motion.button>
            <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 leading-none">
                  {currentUser?.fullName || 'User'}
                </p>
                <p className="text-[11px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md mt-1 inline-block">
                  {currentUser?.role || 'HR'}
                </p>
              </div>
              <div className="w-11 h-11 rounded-full shadow-sm bg-indigo-500 text-white flex items-center justify-center font-bold text-lg">
                {currentUser?.fullName?.charAt(0)?.toUpperCase() || 'U'}
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
                <span className="bg-emerald-50 text-emerald-500 text-xs font-bold px-2 py-1 rounded-lg">{stats?.candidates.trend}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-1">Ứng viên tiềm năng</p>
                <h3 className="text-3xl font-black text-gray-900">{stats?.candidates.value.toLocaleString()}</h3>
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
                <h3 className="text-3xl font-black text-gray-900">{stats?.positions.value}</h3>
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
                <h3 className="text-3xl font-black text-gray-900">{stats?.cvsReceived.value}</h3>
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
                <h3 className="text-3xl font-black text-gray-900">{stats?.hired.value}</h3>
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
                  <div key={index} className="flex flex-col items-center flex-1">
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
                    <span className={`text-[10px] uppercase mt-3 font-bold ${index === 2 ? 'text-indigo-500' : 'text-gray-400'}`}>
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
                  <span className="text-3xl font-black text-gray-900">1,204</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Tổng</span>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-8 h-2 rounded-full bg-indigo-500"></span>
                    <span className="text-xs font-bold text-gray-500 uppercase">Đã nộp</span>
                  </div>
                  <p className="text-sm font-black text-gray-900 ml-10">782 (65%)</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-8 h-2 rounded-full bg-indigo-300"></span>
                    <span className="text-xs font-bold text-gray-500 uppercase">Phỏng vấn</span>
                  </div>
                  <p className="text-sm font-black text-gray-900 ml-10">310 (25%)</p>
                </div>
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
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Người phụ trách</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ngày nộp</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 text-sm">{app.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-medium">{app.position}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <img src={app.recruiterAvatar} className="w-6 h-6 rounded-full" alt="" />
                          <span className="text-xs font-bold text-gray-700">{app.recruiter}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-400">{app.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          app.status === 'Review' ? 'bg-indigo-50 text-indigo-500' :
                          app.status === 'Interview' ? 'bg-emerald-50 text-emerald-500' :
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
            
            {applications.length === 0 && (
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
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <div>
                <p className="text-sm text-gray-900 leading-snug">
                  <span className="font-black">Thành Lê</span> <span className="font-medium text-gray-600">nộp CV cho</span> <span className="font-black text-indigo-500">Frontend</span>
                </p>
                <p className="text-[10px] font-bold text-gray-400 mt-2">12 phút trước</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100">
            <h3 className="text-[10px] font-black text-gray-500 tracking-widest uppercase mb-6">Phỏng vấn sắp tới</h3>
            
            <div className="space-y-4">
              {interviews.map((interview) => (
                <motion.div 
                  key={interview.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="bg-gray-50 border border-gray-100 rounded-3xl p-5 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-indigo-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg">
                      {interview.tag}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500">{interview.time}</span>
                  </div>
                  <h4 className="text-sm font-black text-gray-900 mb-3 leading-snug">
                    Phỏng vấn {interview.candidateName}
                  </h4>
                  <div className="flex items-center gap-2">
                    <img src={interview.interviewerAvatar} alt="Interviewer" className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-[11px] font-bold text-gray-500">{interview.interviewer}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;