'use client';

import AnimatedSection from '@/components/animation/AnimatedSection';

interface Member {
  id: number;
  name: string;
  avatar: string;
}

interface WorkspaceCardProps {
  title: string;
  description: string;
  gradient: string;
  updatedAt: string;
  members: Member[];
  index?: number;
}

export default function WorkspaceCard({
  title,
  description,
  gradient,
  updatedAt,
  members,
  index = 0,
}: WorkspaceCardProps) {
  return (
    <AnimatedSection animation="fade-up" delay={index * 100}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
        {/* Gradient Header */}
        <div className={`h-32 bg-gradient-to-br ${gradient}`}></div>
        
        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
          
          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Cập nhật {updatedAt}</span>
            <div className="flex -space-x-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-700"
                  title={member.name}
                >
                  {member.avatar}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
