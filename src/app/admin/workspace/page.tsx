'use client';

import { useState } from 'react';
import AnimatedSection from '@/components/animation/AnimatedSection';
import { Search, Users, FileText, Activity, TrendingUp } from 'lucide-react';

export default function AdminWorkspacePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-8">
      {/* Header Section */}
      <AnimatedSection animation="fade-up" className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bảng điều khiển quản trị</h1>
        <p className="text-gray-600">Tổng quan về hoạt động hệ thống và quản lý người dùng.</p>
      </AnimatedSection>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Hoạt động Không gian làm việc"
          value="0"
          subtitle="Biểu đồ hoạt động"
          icon={Activity}
          color="blue"
        />
        <StatsCard
          title="Hiệu suất AI"
          value="0"
          subtitle="Biểu đồ hiệu suất"
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Người dùng A đã tạo không gian làm việc mới"
          value=""
          subtitle="2 phút trước"
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Người dùng B đã chỉnh sửa quyền truy cập"
          value=""
          subtitle="15 phút trước"
          icon={FileText}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Recent Activities */}
        <div className="lg:col-span-2">
          <RecentActivitiesSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        {/* Right Column - User Management */}
        <div>
          <UserManagementSection />
        </div>
      </div>
    </div>
  );
}

function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: string; 
  subtitle: string; 
  icon: any; 
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  }[color];

  return (
    <AnimatedSection animation="fade-up">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            {value && <p className="text-2xl font-bold text-gray-900">{value}</p>}
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

function RecentActivitiesSection({ 
  searchQuery, 
  setSearchQuery 
}: { 
  searchQuery: string; 
  setSearchQuery: (query: string) => void;
}) {
  const activities = [
    {
      id: 1,
      user: 'Người dùng A',
      action: 'đã tạo không gian làm việc mới',
      time: '2 phút trước',
      status: 'completed'
    },
    {
      id: 2,
      user: 'Người dùng B',
      action: 'đã chỉnh sửa quyền truy cập',
      time: '15 phút trước',
      status: 'completed'
    },
    {
      id: 3,
      user: 'Công cụ AI',
      action: 'xử lý thành công yêu cầu từ Không gian X',
      time: '1 giờ trước',
      status: 'completed'
    },
    {
      id: 4,
      user: 'Xử lý AI',
      action: 'thất bại trên Không gian Y',
      time: '3 giờ trước',
      status: 'failed'
    },
  ];

  return (
    <section>
      <AnimatedSection animation="fade-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Hoạt động gần đây</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Xem tất cả →
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm người dùng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {activities.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}

function UserManagementSection() {
  const users = [
    { id: 1, name: 'User Name', email: 'user.name@example.com', avatar: 'U' },
    { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com', avatar: 'JD' },
    { id: 3, name: 'Alex Smith', email: 'alex.smith@example.com', avatar: 'AS' },
  ];

  return (
    <section>
      <AnimatedSection animation="fade-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Quản lý Người dùng</h2>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm người dùng..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                {user.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <span className="text-xl">⋯</span>
              </button>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Quản lý tất cả người dùng
        </button>
      </AnimatedSection>
    </section>
  );
}
