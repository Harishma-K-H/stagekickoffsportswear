import { notify } from '@components/Common/Toastify';
import { type Options } from 'react-to-pdf';
import toPDF from 'react-to-pdf';

interface GeneratePDFOptions {
  contentRef: React.RefObject<HTMLElement>;
  fileName?: string;
  customOptions?: Partial<Options>;
}

export const generatePDF = async ({
  contentRef,
  fileName = 'document.pdf',
  customOptions = {},
}: GeneratePDFOptions): Promise<void> => {
  if (!contentRef.current) return;

  const defaultOptions: any = {
    filename: fileName,
    page: {
      margin: 15,
      format: 'a4',
    },
    canvas: {
      useCORS: true,
      scale: 2,
    },
    ...customOptions,
  };

  try {
    await toPDF(contentRef, defaultOptions);
  } catch (error) {
    console.error('Failed to download PDF:', error);
    notify('Failed to download PDF', 'error');
  }
};
