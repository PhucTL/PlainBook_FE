'use client';

import AnimatedSection from '@/components/animation/AnimatedSection';
import WorkspaceCard from '@/components/ui/SlideAndVideoCard';
import { workspaceConfig } from '@/config/workspaceConfig';
import { Plus } from 'lucide-react';

export default function WorkspacePage() {
  return (
    <div className="p-8">
        {/* Welcome Section */}
        <AnimatedSection animation="fade-up" className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chào mừng trở lại!</h1>
          <p className="text-gray-600">Đây là không gian làm việc và các kết quả AI của bạn.</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <WorkspacesSection />
            <AIResultsSection />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <QuickAccessSection />
            <RecentActivitiesSection />
          </div>
        </div>
    </div>
  );
}

function QuickAccessSection() {
  const { title, items } = workspaceConfig.quickAccess;

  return (
    <section>
      <AnimatedSection animation="fade-up">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
        <div className="grid grid-cols-2 gap-3">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-center"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
              </button>
            );
          })}
        </div>
      </AnimatedSection>
    </section>
  );
}

function WorkspacesSection() {
  const { title, viewAllLink, items } = workspaceConfig.workspaces;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <AnimatedSection animation="fade-right">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </AnimatedSection>
        <AnimatedSection animation="fade-left">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
            {viewAllLink}
            <span>→</span>
          </button>
        </AnimatedSection>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((workspace, index) => (
          <WorkspaceCard key={workspace.id} {...workspace} index={index} />
        ))}
      </div>

      <AnimatedSection animation="fade-up" delay={200}>
        <button className="mt-6 w-full py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors text-gray-600 hover:text-blue-600 font-medium flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          Tạo Dự Án Mới
        </button>
      </AnimatedSection>
    </section>
  );
}

function RecentActivitiesSection() {
  const { title, items } = workspaceConfig.recentActivities;

  return (
    <section>
      <AnimatedSection animation="fade-up">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
        <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
          {items.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    {activity.action} <span className="font-medium">"{activity.title}"</span>.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </AnimatedSection>
    </section>
  );
}

function AIResultsSection() {
  const { title, viewAllLink, items } = workspaceConfig.aiResults;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <AnimatedSection animation="fade-right">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </AnimatedSection>
        <AnimatedSection animation="fade-left">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
            {viewAllLink}
            <span>→</span>
          </button>
        </AnimatedSection>
      </div>

      <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
        {items.map((result, index) => {
          const Icon = result.icon;
          return (
            <AnimatedSection key={result.id} animation="fade-up" delay={index * 50}>
              <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900">{result.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{result.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.actions.map((action, idx) => {
                      const ActionIcon = action.icon;
                      return (
                        <button
                          key={idx}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          title={action.label}
                        >
                          <ActionIcon className="w-4 h-4 text-gray-600" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          );
        })}
      </div>
    </section>
  );
}
