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
      // Use A4 width and margins: left 30mm, right 15mm, top/bottom 20mm
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
      
      // Add pages and content, adding footer page numbers
      for (let page = 0; page < totalPages; page++) {
        // Calculate Y offset for this page (in mm)
        const yOffset = -(page * pdfHeight);

        // Add the image for this page view
        pdf.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, scaledHeight);

        // Add footer page number (centered, 10pt)
        pdf.setFont('helvetica');
        pdf.setFontSize(10);
        const pageLabel = `${page + 1} / ${totalPages}`;
        pdf.text(pageLabel, pdfWidth / 2, pdfHeight - 10, { align: 'center' });

        // Add a new page if more pages remain
        if (page < totalPages - 1) pdf.addPage();
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
    // Styling based on node type
    const styles = {
      SECTION: {
        title: { fontSize: '18px', fontWeight: 700, color: '#000000', marginBottom: '6px', textTransform: 'uppercase' as const },
      },
      SUBSECTION: {
        title: { fontSize: '16px', fontWeight: 700, color: '#000000', marginBottom: '5px' },
      },
      LIST_ITEM: {
        title: { fontSize: '13px', fontWeight: 'normal', color: '#000000', marginBottom: '3px' },
      },
    };

    const style = styles[node.type] || styles.LIST_ITEM;
    const isListItem = node.type === 'LIST_ITEM';

    return (
      <div 
        key={node.id} 
        style={{ 
          marginLeft: `${level * 15}px`,
          marginBottom: '8px',
          pageBreakInside: 'avoid',
        }}
      >
        <div style={style.title}>
          {isListItem && '- '}{node.title}
        </div>
        
        {node.content && (
          <div style={{
            color: '#000000',
            fontSize: '13pt',
            lineHeight: '1.3',
            marginTop: '3px',
            whiteSpace: 'pre-wrap',
            textAlign: 'justify' as const,
            textIndent: '12.7mm', // 1.27cm first-line indent
            marginLeft: isListItem ? '8px' : '0',
          }}>
            {node.content}
          </div>
        )}
        
        {node.description && (
          <div style={{
            color: '#000000',
            fontSize: '12pt',
            fontStyle: 'italic',
            marginTop: '2px',
            lineHeight: '1.3',
            textAlign: 'justify' as const,
            textIndent: '12.7mm',
            marginLeft: isListItem ? '8px' : '0',
          }}>
            {node.description}
          </div>
        )}

        {node.children && node.children.length > 0 && (
          <div style={{ marginTop: '6px' }}>
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
          padding: '20mm 15mm 20mm 30mm',
          fontFamily: 'Times New Roman, serif',
          color: '#000000',
          fontSize: '13pt',
          lineHeight: '1.3',
        }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '15px',
          }}>
            <h1 style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#000000',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
            }}>
              {templateName}
            </h1>
            <div style={{
              color: '#000000',
              fontSize: '12px',
              marginTop: '5px',
            }}>
              Ngày xuất: {new Date().toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </div>
          </div>

          {/* Content */}
          <div style={{ marginTop: '15px' }}>
            {nodes.map((node) => renderNodeContent(node, 0))}
          </div>
        </div>
      </div>
    </div>
  );
}
