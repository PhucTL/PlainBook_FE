'use client';

import { useRef, useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

interface LessonPlanPDFExportProps {
  nodes: LessonPlanNode[];
  templateName?: string;
  className?: string;
}

export default function LessonPlanPDFExport({ 
  nodes, 
  templateName = 'Giáo án',
  className = '' 
}: LessonPlanPDFExportProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExportPDF = async () => {
    if (!contentRef.current || nodes.length === 0) return;

    setIsGenerating(true);
    try {
      // Make the content visible temporarily
      const contentElement = contentRef.current;
      contentElement.style.position = 'fixed';
      contentElement.style.left = '0';
      contentElement.style.top = '0';
      contentElement.style.width = '210mm';
      contentElement.style.height = 'auto';
      contentElement.style.zIndex = '9999';
      contentElement.style.backgroundColor = '#ffffff';
      contentElement.style.display = 'block';
      contentElement.style.visibility = 'visible';
      contentElement.style.opacity = '1';

      // Small delay to ensure rendering
      await new Promise(resolve => setTimeout(resolve, 100));

      // Generate canvas from the content
      const canvas = await html2canvas(contentElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: contentElement.scrollWidth,
        windowHeight: contentElement.scrollHeight,
      });

      // Hide the content again
      contentElement.style.position = 'absolute';
      contentElement.style.left = '-9999px';
      contentElement.style.zIndex = '-1';

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate dimensions (accounting for scale: 2)
      const imgWidthMM = imgWidth / 2 * 0.264583; // Convert px to mm
      const imgHeightMM = imgHeight / 2 * 0.264583;
      
      // Scale to fit page width
      const scale = pdfWidth / imgWidthMM;
      const scaledHeight = imgHeightMM * scale;
      
      // Calculate number of pages needed
      const totalPages = Math.ceil(scaledHeight / pdfHeight);
      
      // Add pages and content
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }
        
        // Calculate Y offset for this page
        const yOffset = -(page * pdfHeight);
        
        // Add the image
        pdf.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, scaledHeight);
      }

      // Save the PDF
      const fileName = `${templateName.replace(/\s+/g, '_')}_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Có lỗi xảy ra khi tạo file PDF. Vui lòng thử lại.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderNodeContent = (node: LessonPlanNode, level: number = 0) => {
    // Styling based on node type (without showing badge)
    const styles = {
      SECTION: {
        title: { fontSize: '18px', fontWeight: 'bold', color: '#1F2937', marginBottom: '8px' },
      },
      SUBSECTION: {
        title: { fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '6px' },
      },
      LIST_ITEM: {
        title: { fontSize: '14px', fontWeight: '500', color: '#4B5563', marginBottom: '4px' },
      },
    };

    const style = styles[node.type] || styles.LIST_ITEM;
    const isListItem = node.type === 'LIST_ITEM';

    return (
      <div 
        key={node.id} 
        style={{ 
          marginLeft: `${level * 20}px`,
          marginBottom: '10px',
          paddingBottom: '6px',
          pageBreakInside: 'avoid',
        }}
      >
        <h3 style={style.title}>
          {isListItem && '- '}{node.title}
        </h3>
        
        {node.content && (
          <div style={{
            color: '#4B5563',
            fontSize: '13px',
            lineHeight: '1.6',
            marginTop: '6px',
            whiteSpace: 'pre-wrap',
            marginLeft: isListItem ? '10px' : '0',
          }}>
            {node.content}
          </div>
        )}
        
        {node.description && (
          <div style={{
            color: '#9CA3AF',
            fontSize: '12px',
            fontStyle: 'italic',
            marginTop: '4px',
            lineHeight: '1.5',
            marginLeft: isListItem ? '10px' : '0',
          }}>
            {node.description}
          </div>
        )}

        {node.children && node.children.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            {node.children.map((child) => renderNodeContent(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      {/* Export Button */}
      <button
        onClick={handleExportPDF}
        disabled={isGenerating || nodes.length === 0}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Đang tạo PDF...
          </>
        ) : (
          <>
            <FileDown className="w-5 h-5" />
            Xuất PDF
          </>
        )}
      </button>

      {/* Hidden content for PDF generation */}
      <div 
        ref={contentRef} 
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '0',
          width: '210mm',
          backgroundColor: '#ffffff',
          zIndex: -1,
        }}
      >
        <div style={{ 
          padding: '15mm 20mm',
          fontFamily: 'Arial, sans-serif',
          color: '#000000',
        }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
            paddingBottom: '15px',
            borderBottom: '3px solid #3B82F6',
          }}>
            <h1 style={{
              fontSize: '26px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '10px',
              textTransform: 'uppercase',
            }}>
              {templateName}
            </h1>
            <div style={{
              display: 'inline-block',
              background: '#F3F4F6',
              padding: '8px 16px',
              borderRadius: '8px',
              color: '#374151',
              fontSize: '12px',
              fontWeight: '500',
            }}>
              📅 Ngày xuất: {new Date().toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </div>
          </div>

          {/* Content */}
          <div style={{ marginTop: '20px' }}>
            {nodes.map((node) => renderNodeContent(node, 0))}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: '40px',
            paddingTop: '15px',
            borderTop: '1px solid #E5E7EB',
            textAlign: 'center',
            color: '#9CA3AF',
            fontSize: '10px',
          }}>
            <p>© {new Date().getFullYear()} PlainBook - Hệ thống quản lý giáo án điện tử</p>
          </div>
        </div>
      </div>
    </div>
  );
}
