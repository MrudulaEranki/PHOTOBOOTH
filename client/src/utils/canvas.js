// Composite 4 photos into a strip on a canvas element
export function buildStrip(photos, layout) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const W = 600;
  const H = 450;

  // layout: 'vertical' = 4x1, 'grid' = 2x2
  if (layout === 'vertical') {
    canvas.width = W;
    canvas.height = H * 4;
    photos.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      ctx.drawImage(img, 0, i * H, W, H);
    });
  } else {
    canvas.width = W * 2;
    canvas.height = H * 2;
    photos.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      const col = i % 2;
      const row = Math.floor(i / 2);
      ctx.drawImage(img, col * W, row * H, W, H);
    });
  }

  return canvas;
}