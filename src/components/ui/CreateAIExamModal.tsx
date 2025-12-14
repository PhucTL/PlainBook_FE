import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import type { LessonMatrix, ExamPart, ExamObjectives } from "@/types";
import { getAvailableLessons } from "@/services/aiExamServices";
import { showError } from "@/lib/toast";

export interface CreateAIExamFormData {
  school: string;
  grade: number;
  subject: string;
  examTitle: string;
  duration: number;
  examCode?: string;
  bookID: string;
  matrix: LessonMatrix[];
}

interface CreateAIExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAIExamFormData) => void | Promise<void>;
  isSubmitting?: boolean;
  defaultBookID?: string;
  defaultSubject?: string;
}

interface MatrixRow {
  lessonId: string;
  lessonName: string;
  part1: ExamObjectives;
  part2: ExamObjectives;
  part3: ExamObjectives;
}

export default function CreateAIExamModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  defaultBookID = "gdcd-12",
  defaultSubject = "GDCD",
}: CreateAIExamModalProps) {
  // Form state
  const [school, setSchool] = useState("THPT Nguyễn Du");
  const [grade, setGrade] = useState(12);
  const [subject, setSubject] = useState(defaultSubject);
  const [examTitle, setExamTitle] = useState("");
  const [duration, setDuration] = useState(45);
  const [examCode, setExamCode] = useState("");
  const [bookID, setBookID] = useState(defaultBookID);

  // Lessons state
  const [availableLessons, setAvailableLessons] = useState<Array<{
    lesson_id: string;
    lesson_name?: string;
    book_id: string;
  }>>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);

  // Matrix state
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [matrixRows, setMatrixRows] = useState<Record<string, MatrixRow>>({});

  // Fetch lessons when modal opens or bookID changes
  useEffect(() => {
    if (isOpen && bookID) {
      fetchLessons();
    }
  }, [isOpen, bookID]);

  const fetchLessons = async () => {
    setIsLoadingLessons(true);
    try {
      const response = await getAvailableLessons(bookID);
      if (response.success && response.data?.lessons) {
        setAvailableLessons(response.data.lessons);
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
      showError("Không thể tải danh sách bài học");
      setAvailableLessons([]);
    } finally {
      setIsLoadingLessons(false);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setSchool("THPT Nguyễn Du");
    setGrade(12);
    setSubject(defaultSubject);
    setExamTitle("");
    setDuration(45);
    setExamCode("");
    setBookID(defaultBookID);
    setSelectedLessons([]);
    setMatrixRows({});
  };

  // Toggle lesson selection
  const toggleLesson = (lessonId: string) => {
    if (selectedLessons.includes(lessonId)) {
      setSelectedLessons(selectedLessons.filter((id) => id !== lessonId));
      const newMatrix = { ...matrixRows };
      delete newMatrix[lessonId];
      setMatrixRows(newMatrix);
    } else {
      setSelectedLessons([...selectedLessons, lessonId]);
      // Initialize matrix row for this lesson
      const lesson = availableLessons.find((l) => l.lesson_id === lessonId);
      const lessonName = lesson?.lesson_name || lesson?.lesson_id || `Bài ${lessonId}`;
      setMatrixRows({
        ...matrixRows,
        [lessonId]: {
          lessonId,
          lessonName,
          part1: { KNOWLEDGE: 0, COMPREHENSION: 0, APPLICATION: 0 },
          part2: { KNOWLEDGE: 0, COMPREHENSION: 0, APPLICATION: 0 },
          part3: { KNOWLEDGE: 0, COMPREHENSION: 0, APPLICATION: 0 },
        },
      });
    }
  };

  // Update matrix value
  const updateMatrix = (
    lessonId: string,
    part: "part1" | "part2" | "part3",
    objective: keyof ExamObjectives,
    value: number
  ) => {
    setMatrixRows({
      ...matrixRows,
      [lessonId]: {
        ...matrixRows[lessonId],
        [part]: {
          ...matrixRows[lessonId][part],
          [objective]: Math.max(0, value), // Ensure >= 0
        },
      },
    });
  };

  // Calculate total questions
  const calculateTotal = () => {
    let total = 0;
    Object.values(matrixRows).forEach((row) => {
      ["part1", "part2", "part3"].forEach((part) => {
        const objectives = row[part as keyof typeof row] as ExamObjectives;
        total += objectives.KNOWLEDGE + objectives.COMPREHENSION + objectives.APPLICATION;
      });
    });
    return total;
  };

  // Convert matrixRows to API format
  const buildMatrix = (): LessonMatrix[] => {
    return selectedLessons.map((lessonId) => {
      const row = matrixRows[lessonId];
      const parts: ExamPart[] = [];

      // Add Part 1 if has questions
      const part1Total =
        row.part1.KNOWLEDGE + row.part1.COMPREHENSION + row.part1.APPLICATION;
      if (part1Total > 0) {
        parts.push({ part: 1, objectives: row.part1 });
      }

      // Add Part 2 if has questions
      const part2Total =
        row.part2.KNOWLEDGE + row.part2.COMPREHENSION + row.part2.APPLICATION;
      if (part2Total > 0) {
        parts.push({ part: 2, objectives: row.part2 });
      }

      // Add Part 3 if has questions
      const part3Total =
        row.part3.KNOWLEDGE + row.part3.COMPREHENSION + row.part3.APPLICATION;
      if (part3Total > 0) {
        parts.push({ part: 3, objectives: row.part3 });
      }

      return { lessonId, parts };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const matrix = buildMatrix();

    // Validation
    if (!examTitle.trim()) {
      alert("Vui lòng nhập tiêu đề đề thi");
      return;
    }

    if (selectedLessons.length === 0) {
      alert("Vui lòng chọn ít nhất 1 bài học");
      return;
    }

    if (calculateTotal() === 0) {
      alert("Vui lòng nhập số câu hỏi cho ít nhất 1 mục");
      return;
    }

    if (duration < 15 || duration > 180) {
      alert("Thời gian làm bài phải từ 15-180 phút");
      return;
    }

    const formData: CreateAIExamFormData = {
      school,
      grade,
      subject,
      examTitle,
      duration,
      examCode: examCode.trim() || undefined,
      bookID,
      matrix,
    };

    await onSubmit(formData);
  };

  const totalQuestions = calculateTotal();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo Đề Thi AI">
      <div className="max-h-[70vh] overflow-y-auto pr-2">
        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin cơ bản */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trường <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="VD: THPT Nguyễn Du"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Khối lớp <span className="text-red-500">*</span>
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            >
              {[10, 11, 12].map((g) => (
                <option key={g} value={g}>
                  Lớp {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Môn học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="VD: GDCD, Hóa học"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời gian (phút) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              min={15}
              max={180}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề đề thi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="VD: Kiểm tra học kỳ I"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mã đề (tùy chọn)
            </label>
            <input
              type="text"
              value={examCode}
              onChange={(e) => setExamCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="VD: 0335"
              maxLength={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Để trống để tự động tạo mã ngẫu nhiên
            </p>
          </div>
        </div>

        {/* Chọn bài học */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Chọn bài học <span className="text-red-500">*</span>
          </h3>
          <div className="border border-gray-300 rounded-lg p-4 max-h-40 overflow-y-auto">
            {isLoadingLessons ? (
              <p className="text-gray-500 text-sm">Đang tải bài học...</p>
            ) : availableLessons.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Không có bài học nào cho sách "{bookID}"
              </p>
            ) : (
              availableLessons.map((lesson) => (
                <label
                  key={lesson.lesson_id}
                  className="flex items-center space-x-2 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedLessons.includes(lesson.lesson_id)}
                    onChange={() => toggleLesson(lesson.lesson_id)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    {lesson.lesson_name || lesson.lesson_id}
                  </span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Ma trận đề thi */}
        {selectedLessons.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Ma trận đề thi
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                      Bài học
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">
                      Phần
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">
                      Nhận biết
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">
                      Thông hiểu
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-700">
                      Vận dụng
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedLessons.map((lessonId) => {
                    const row = matrixRows[lessonId];
                    return (
                      <React.Fragment key={lessonId}>
                        {/* Part 1 */}
                        <tr>
                          <td
                            rowSpan={3}
                            className="px-3 py-2 text-sm text-gray-900 border-r"
                          >
                            {row.lessonName}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-700">
                            Part 1 (Trắc nghiệm)
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              value={row.part1.KNOWLEDGE}
                              onChange={(e) =>
                                updateMatrix(
                                  lessonId,
                                  "part1",
                                  "KNOWLEDGE",
                                  Number(e.target.value)
                                )
                              }
                              className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-gray-900"
                              min={0}
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              value={row.part1.COMPREHENSION}
                              onChange={(e) =>
                                updateMatrix(
                                  lessonId,
                                  "part1",
                                  "COMPREHENSION",
                                  Number(e.target.value)
                                )
                              }
                              className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-gray-900"
                              min={0}
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              value={row.part1.APPLICATION}
                              onChange={(e) =>
                                updateMatrix(
                                  lessonId,
                                  "part1",
                                  "APPLICATION",
                                  Number(e.target.value)
                                )
                              }
                              className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-gray-900"
                              min={0}
                            />
                          </td>
                        </tr>

                        {/* Part 2 */}
                        <tr>
                          <td className="px-3 py-2 text-sm text-gray-700">
                            Part 2 (Đúng/Sai)
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              value={row.part2.KNOWLEDGE}
                              onChange={(e) =>
                                updateMatrix(
                                  lessonId,
                                  "part2",
                                  "KNOWLEDGE",
                                  Number(e.target.value)
                                )
                              }
                              className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-gray-900"
                              min={0}
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              value={row.part2.COMPREHENSION}
                              onChange={(e) =>
                                updateMatrix(
                                  lessonId,
                                  "part2",
                                  "COMPREHENSION",
                                  Number(e.target.value)
                                )
                              }
                              className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-gray-900"
                              min={0}
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              value={row.part2.APPLICATION}
                              onChange={(e) =>
                                updateMatrix(
                                  lessonId,
                                  "part2",
                                  "APPLICATION",
                                  Number(e.target.value)
                                )
                              }
                              className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-gray-900"
                              min={0}
                            />
                          </td>
                        </tr>

                        {/* Part 3 */}
                        <tr>
                          <td className="px-3 py-2 text-sm text-gray-700">
                            Part 3 (Tự luận)
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              value={row.part3.KNOWLEDGE}
                              onChange={(e) =>
                                updateMatrix(
                                  lessonId,
                                  "part3",
                                  "KNOWLEDGE",
                                  Number(e.target.value)
                                )
                              }
                              className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-gray-900"
                              min={0}
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              value={row.part3.COMPREHENSION}
                              onChange={(e) =>
                                updateMatrix(
                                  lessonId,
                                  "part3",
                                  "COMPREHENSION",
                                  Number(e.target.value)
                                )
                              }
                              className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-gray-900"
                              min={0}
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              value={row.part3.APPLICATION}
                              onChange={(e) =>
                                updateMatrix(
                                  lessonId,
                                  "part3",
                                  "APPLICATION",
                                  Number(e.target.value)
                                )
                              }
                              className="w-16 px-2 py-1 text-center border border-gray-300 rounded text-gray-900"
                              min={0}
                            />
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Tổng số câu hỏi:{" "}
              <span className="font-semibold text-blue-600">
                {totalQuestions}
              </span>
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || totalQuestions === 0}
          >
            {isSubmitting ? "Đang tạo..." : "Tạo đề thi"}
          </button>
        </div>
        </form>
      </div>
    </Modal>
  );
}
