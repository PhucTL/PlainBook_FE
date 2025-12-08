'use client';

import { useState } from 'react';
import AnimatedSection from '@/components/animation/AnimatedSection';
import Pagination from '@/components/ui/Pagination';
import { Search, Plus, Edit } from 'lucide-react';
import { useBooksService } from '@/services/bookServices';
import BookFormModal from '@/components/ui/BookFormModal';

interface Book {
  id: number;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  subject: {
    id: number;
    name: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    grade: {
      id: number;
      name: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export default function BookPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  return (
    <div className="flex flex-col">
      <MainContentSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        editingBook={editingBook}
        setEditingBook={setEditingBook}
      />
    </div>
  );
}

function MainContentSection({ 
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  showCreateModal,
  setShowCreateModal,
  editingBook,
  setEditingBook
}: { 
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
  editingBook: Book | null;
  setEditingBook: (book: Book | null) => void;
}) {
  return (
    <main className="flex-1 p-8">
      <HeaderSection setShowCreateModal={setShowCreateModal} />
      <SearchAndFilterSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <BooksTableSection 
        searchQuery={searchQuery}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setEditingBook={setEditingBook}
      />
      <BookFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        mode="create"
      />
      <BookFormModal
        isOpen={!!editingBook}
        onClose={() => setEditingBook(null)}
        book={editingBook}
        mode="edit"
      />
    </main>
  );
}

function HeaderSection({ setShowCreateModal }: { setShowCreateModal: (show: boolean) => void }) {
  return (
    <AnimatedSection animation="fade-up" className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Sách</h1>
          <p className="text-gray-600">Quản lý danh sách sách giáo khoa trong hệ thống.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Tạo sách mới
          </button>
        </div>
      </div>
    </AnimatedSection>
  );
}

function SearchAndFilterSection({
  searchQuery,
  setSearchQuery
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) {
  return (
    <AnimatedSection animation="fade-up" delay={100} className="mb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sách..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

function BooksTableSection({ 
  searchQuery,
  currentPage,
  setCurrentPage,
  setEditingBook
}: { 
  searchQuery: string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  setEditingBook: (book: Book) => void;
}) {
  const { data: booksData, isLoading, error } = useBooksService();

  const books: Book[] = Array.isArray(booksData?.data?.content) 
    ? booksData.data.content 
    : [];

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (book.subject?.name && book.subject.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredBooks.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <AnimatedSection animation="fade-up" delay={200}>
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </AnimatedSection>
    );
  }

  if (error) {
    return (
      <AnimatedSection animation="fade-up" delay={200}>
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <p className="text-red-600">Có lỗi xảy ra khi tải dữ liệu</p>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection animation="fade-up" delay={200}>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-700">
          <div className="col-span-4">TÊN SÁCH</div>
          <div className="col-span-3">MÔN HỌC</div>
          <div className="col-span-2">NGÀY TẠO</div>
          <div className="col-span-1">TRẠNG THÁI</div>
          <div className="col-span-2 text-right">HÀNH ĐỘNG</div>
        </div>

        <div className="divide-y divide-gray-200">
          {currentItems.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              Không tìm thấy sách nào
            </div>
          ) : (
            currentItems.map((book) => (
              <div
                key={book.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-4 font-medium text-gray-900">{book.name}</div>
                <div className="col-span-3 text-gray-600">{book.subject?.name || 'N/A'}</div>
                <div className="col-span-2 text-gray-600">{book.createdAt}</div>
                <div className="col-span-1">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      book.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {book.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setEditingBook(book)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </AnimatedSection>
  );
}
