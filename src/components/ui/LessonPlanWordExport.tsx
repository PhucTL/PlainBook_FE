'use client';

import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { Document, Paragraph, TextRun, AlignmentType, HeadingLevel, convertInchesToTwip, Footer, PageNumber } from 'docx';
import { saveAs } from 'file-saver';
import * as docx from 'docx';

interface LessonPlanNode {
  id: number;
  lessonPlanTemplateId: number;
  parentId: number | null;
  title: string;
  content: string;
  description: string | null;
  fieldType: string | null;
  type: 'SECTION' | 'SUBSECTION' | 'LIST_ITEM';
  orderIndex: number;
  metadata: any;
  status: 'ACTIVE' | 'INACTIVE';
  children: LessonPlanNode[];
}

interface LessonPlanWordExportProps {
  nodes: LessonPlanNode[];
  templateName?: string;
  className?: string;
}

export default function LessonPlanWordExport({ 
  nodes, 
  templateName = 'Giáo án',
  className = '' 
}: LessonPlanWordExportProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportWord = async () => {
    if (nodes.length === 0) return;

    setIsGenerating(true);
    try {
      const docElements: any[] = [];

      // Header - Title (uppercase, centered)
      docElements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: templateName.toUpperCase(),
              bold: true,
              size: 36, // ~18pt
              font: 'Times New Roman',
              color: '000000',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 120, after: 200 },
        })
      );

      // Header - Date
      const dateStr = new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      docElements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Ngày xuất: ${dateStr}`,
              size: 26,
              font: 'Times New Roman',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        })
      );

      // Recursive function to add nodes to document
      const addNodeToDoc = (node: LessonPlanNode, level: number) => {
        const indentLeftTwips = level * convertInchesToTwip(0.5); // 0.5in per level
        const isListItem = node.type === 'LIST_ITEM';

        // Title
        const titleRuns: TextRun[] = [];
        if (isListItem) {
          titleRuns.push(new TextRun({ text: '- ', size: 26, font: 'Times New Roman' }));
        }

        titleRuns.push(
          new TextRun({
            text: node.title,
            bold: node.type === 'SECTION' || node.type === 'SUBSECTION',
            allCaps: node.type === 'SECTION',
            size: node.type === 'SECTION' ? 32 : 28,
            font: 'Times New Roman',
            color: '000000',
          })
        );

        docElements.push(
          new Paragraph({
            children: titleRuns,
            indent: { left: indentLeftTwips },
            spacing: { after: 120, before: 0 },
            alignment: AlignmentType.LEFT,
          })
        );

        // Content
        if (node.content) {
          const contentIndent = indentLeftTwips + (isListItem ? convertInchesToTwip(0.25) : 0);
          docElements.push(
            new Paragraph({
              children: [
                new TextRun({ text: node.content, size: 26, font: 'Times New Roman' }),
              ],
              indent: { left: contentIndent, firstLine: convertInchesToTwip(0.5) },
              spacing: { after: 100, before: 0 },
              alignment: AlignmentType.JUSTIFIED,
            })
          );
        }

        // Description
        if (node.description) {
          const descIndent = indentLeftTwips + (isListItem ? convertInchesToTwip(0.25) : 0);
          docElements.push(
            new Paragraph({
              children: [
                new TextRun({ text: node.description, italics: true, color: '666666', size: 24, font: 'Times New Roman' }),
              ],
              indent: { left: descIndent, firstLine: convertInchesToTwip(0.5) },
              spacing: { after: 150, before: 0 },
              alignment: AlignmentType.JUSTIFIED,
            })
          );
        }

        // Process children
        if (node.children && node.children.length > 0) {
          node.children.forEach(child => addNodeToDoc(child, level + 1));
        }
      };

      // Add all root nodes
      nodes.forEach(node => addNodeToDoc(node, 0));

      // Create footer with page number
      const footer = new Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ children: [PageNumber.CURRENT], size: 20, font: 'Times New Roman' })],
          }),
        ],
      });

      // Create document with A4-like margins: top/bottom 20mm, left 30mm, right 15mm
      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: convertInchesToTwip(20 / 25.4),
                  right: convertInchesToTwip(15 / 25.4),
                  bottom: convertInchesToTwip(20 / 25.4),
                  left: convertInchesToTwip(30 / 25.4),
                },
              },
            },
            footers: { default: footer },
            children: docElements,
          },
        ],
      });

      // Generate and save
      const blob = await docx.Packer.toBlob(doc);
      const fileName = `${templateName.replace(/\s+/g, '_')}_${dateStr.replace(/\//g, '-')}.docx`;
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Error generating Word file:', error);
      alert('Có lỗi xảy ra khi tạo file Word. Vui lòng thử lại.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={className}>
      <button
        onClick={handleExportWord}
        disabled={isGenerating || nodes.length === 0}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Đang tạo Word...
          </>
        ) : (
          <>
            <FileText className="w-5 h-5" />
            Xuất Word
          </>
        )}
      </button>
    </div>
  );
}
