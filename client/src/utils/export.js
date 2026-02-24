import jsPDF from 'jspdf';
import { buildStrip } from './canvas';

export function downloadPNG(photos, layout) {
  const canvas = buildStrip(photos, layout);
  const link = document.createElement('a');
  link.download = 'photobooth.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export function downloadJPEG(photos, layout) {
  const canvas = buildStrip(photos, layout);
  const link = document.createElement('a');
  link.download = 'photobooth.jpg';
  link.href = canvas.toDataURL('image/jpeg', 0.95);
  link.click();
}

export function downloadPDF(photos, layout) {
  const canvas = buildStrip(photos, layout);
  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height],
  });
  pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
  pdf.save('photobooth.pdf');
}