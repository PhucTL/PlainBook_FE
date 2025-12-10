'use client';

import { useState, useMemo } from 'react';
import AnimatedSection from '@/components/animation/AnimatedSection';
import Pagination from '@/components/ui/Pagination';
import Modal from '@/components/ui/Modal';
import { Search, Filter, Loader2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useSlideTemplatesService } from '@/services/slideTemplateServices';

interface SlideTemplate {
  id: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;
  previewUrl?: string;
}

export default function AdminSlidePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ACTIVE' | 'INACTIVE' | 'ALL'>('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [viewingSlide, setViewingSlide] = useState<SlideTemplate | null>(null);

  // Build API params
  const apiParams = useMemo(() => {
    const params: any = {
      page: currentPage - 1, // API uses 0-based indexing
      size: pageSize,
    };
    
    if (searchQuery) {
      params.search = searchQuery;
    }
    
    if (statusFilter !== 'ALL') {
      params.status = statusFilter;
    }
    
    return params;
  }, [currentPage, pageSize, searchQuery, statusFilter]);

  const { data: slidesData, isLoading } = useSlideTemplatesService(apiParams);
  
  const slides: SlideTemplate[] = slidesData?.data?.content || [];
  const totalPages = slidesData?.data?.totalPages || 1;
  const totalElements = slidesData?.data?.totalElements || 0;

  return (
    <main className="flex-1 p-8">
      {/* Header */}
      <AnimatedSection animation="fade-up" className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Slide Bài giảng</h1>
            <p className="text-gray-600">Danh sách tất cả slide bài giảng trong hệ thống.</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm slide..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 ${
              showFilters ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            Bộ lọc
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
              <div className="flex gap-2">
                {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === status 
                        ? status === 'ALL' ? 'bg-blue-600 text-white' 
                          : status === 'ACTIVE' ? 'bg-green-600 text-white'
                          : 'bg-gray-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'ALL' ? 'Tất cả' : status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatedSection>

      {/* Slides Grid */}
      <AnimatedSection animation="fade-up" delay={100}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Tất cả Slide ({totalElements})</h2>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            Đang tải...
          </div>
        ) : slides.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
            Không tìm thấy slide template nào
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slides.map((slide: SlideTemplate) => (
                <div 
                  key={slide.id} 
                  onClick={() => setViewingSlide(slide)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden cursor-pointer group"
                >
                  {/* Thumbnail */}
                  <div className="h-48 bg-linear-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                    {slide.thumbnailUrl ? (
                      <img src={slide.thumbnailUrl} alt={slide.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold opacity-20">
                        {slide.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm flex items-center gap-1 ${
                          slide.status === 'ACTIVE'
                            ? 'bg-green-500/80 text-white'
                            : 'bg-gray-500/80 text-white'
                        }`}
                      >
                        {slide.status === 'ACTIVE' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {slide.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </div>

                    {/* View Icon on Hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="p-3 bg-white rounded-full">
                        <Eye className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{slide.name}</h3>
                    {slide.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{slide.description}</p>
                    )}
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Tạo: {new Date(slide.createdAt).toLocaleDateString('vi-VN')}</span>
                      {slide.updatedAt && (
                        <span>Cập nhật: {new Date(slide.updatedAt).toLocaleDateString('vi-VN')}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </AnimatedSection>

      {/* Detail Modal */}
      {viewingSlide && (
        <Modal isOpen={true} onClose={() => setViewingSlide(null)} title="Chi tiết Slide Template" size="lg">
          <div className="space-y-4">
            {viewingSlide.thumbnailUrl && (
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <img src={viewingSlide.thumbnailUrl} alt={viewingSlide.name} className="w-full h-64 object-cover" />
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Tên slide:</h3>
              <p className="text-gray-700">{viewingSlide.name}</p>
            </div>

            {viewingSlide.description && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Mô tả:</h3>
                <p className="text-gray-700">{viewingSlide.description}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Trạng thái:</h3>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  viewingSlide.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {viewingSlide.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
              </span>
            </div>

            <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
              <div>Tạo lúc: {new Date(viewingSlide.createdAt).toLocaleString('vi-VN')}</div>
              {viewingSlide.updatedAt && <div>Cập nhật: {new Date(viewingSlide.updatedAt).toLocaleString('vi-VN')}</div>}
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}
