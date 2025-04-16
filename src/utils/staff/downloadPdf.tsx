import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const handleDownloadPDF: ({
  type,
  contentRef,
  invoiceId,
}: {
  type: 'INVOICE' | 'ORDER';
  contentRef: any;
  invoiceId: string;
}) => Promise<void> = async ({ type, contentRef, invoiceId }) => {
  if (!contentRef.current) return;

  try {
    const canvas = await html2canvas(contentRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm
    const margin = 5; // ~15px in mm (adjusted for simplicity)

    // Adjusted width and height with margins (10mm total: 5mm left + 5mm right, 5mm top + 5mm bottom)
    const usableWidth = pdfWidth - 2 * margin; // 210 - 10 = 200mm
    const usableHeight = pdfHeight - 2 * margin; // 297 - 10 = 287mm

    const imgWidth = usableWidth; // Width within margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

    let heightLeft = imgHeight;
    let position = margin; // Start 5mm from top

    // Add first page with margins
    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight); // Left margin: 5mm, Top margin: 5mm
    heightLeft -= usableHeight;

    // Handle multi-page content
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + margin; // Adjust position for next page
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= usableHeight;
    }

    const fileName = invoiceId
      ? `${type}_${invoiceId}_${dayjs().format('YYYYMMDD')}.pdf`
      : `${type}_${dayjs().format('YYYYMMDD')}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
  }
};

export { handleDownloadPDF };
