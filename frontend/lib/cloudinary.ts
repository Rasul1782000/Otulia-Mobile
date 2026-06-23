const CLOUD_NAME: string = (() => {
  try {
    const v = import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME;
    if (v && typeof v === 'string') return v;
  } catch {}
  try {
    const v = process.env?.VITE_CLOUDINARY_CLOUD_NAME || process.env?.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (v && typeof v === 'string') return v;
  } catch {}
  if (typeof __DEV__ !== 'undefined' || process.env.NODE_ENV !== 'production') {
    console.warn('[Cloudinary] CLOUD_NAME not found in env vars. Images will show placeholders.');
  }
  return '';
})();

const BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

const PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="%23f4f4f5" width="400" height="300"/><text fill="%23a1a1aa" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>';

// Mobile-optimized image sizes (2x for retina displays)
export const IMAGE_SIZES = {
  cardHorizontal: { w: 560, h: 352 },   // 280px card × 2 DPR
  cardVertical: { w: 750, h: 480 },     // ~375px full width × 2 DPR, h-60
  thumbnail: { w: 320, h: 320 },        // category/thumbnail
  hero: { w: 1120, h: 896 },            // hero banner × 2 DPR
  gallery: { w: 1500, h: 0 },           // full-screen gallery
  detail: { w: 750, h: 0 },             // detail page main image
} as const;

// Extract public_id from a full Cloudinary URL
function extractPublicIdFromUrl(url: string): string | null {
  if (!url.includes('res.cloudinary.com')) return null;
  // Match pattern: .../image/upload/[v1234567/]public_id.ext
  const match = url.match(/\/image\/upload\/(?:v\d+\/)?(.+?)$/);
  if (match) {
    // Remove file extension if present
    return match[1].replace(/\.(jpg|jpeg|png|webp|avif|gif)$/i, '');
  }
  return null;
}

// Build optimized Cloudinary URL with transformations
function buildOptimizedUrl(publicId: string, width?: number, height?: number): string {
  if (!publicId) return PLACEHOLDER;
  if (!CLOUD_NAME) return PLACEHOLDER;
  const parts = ['f_auto', 'q_auto:good', 'dpr_auto'];
  if (width) parts.push(`w_${width}`);
  if (height && height > 0) parts.push(`h_${height}`, 'c_fill', 'g_auto');
  else if (width) parts.push('c_scale');
  return `${BASE}/${parts.join(',')}/${publicId}`;
}

// Returns a small blurred placeholder version of an image (LQIP)
export function getBlurPlaceholderUrl(publicIdOrUrl: string | null | undefined, width = 20): string {
  if (!publicIdOrUrl) return PLACEHOLDER;
  const id = publicIdOrUrl.trim();
  const publicId = id.startsWith('http') ? extractPublicIdFromUrl(id) || id : id;
  if (!publicId) return PLACEHOLDER;
  // use very small size, low quality and blur effect
  const parts = ['f_auto', 'q_auto:low', `w_${width}`, 'e_blur:200', 'dpr_auto'];
  return `${BASE}/${parts.join(',')}/${publicId}`;
}

// Transform any image URL (raw Cloudinary or public_id) to optimized version
export function getOptimizedListingImage(src: string, width = 560, height?: number): string {
  if (!src) return PLACEHOLDER;
  // Already has transformation params? Return as-is
  if (src.includes('f_auto') || src.includes('q_auto')) return src;
  // Try to extract public_id from full Cloudinary URL
  const publicId = extractPublicIdFromUrl(src);
  if (publicId) return buildOptimizedUrl(publicId, width, height);
  // Not a Cloudinary URL or can't parse - return as-is
  return src;
}

export function getListingImage(publicId: string | null | undefined): string {
  if (!publicId || typeof publicId !== 'string' || !publicId.trim()) return PLACEHOLDER;
  return `${BASE}/f_auto,q_auto:good,w_560/${publicId.trim()}`;
}

export function getCloudinaryUrl(publicId: string | null | undefined, width = 560): string {
  if (!publicId || typeof publicId !== 'string' || !publicId.trim()) return PLACEHOLDER;
  return `${BASE}/f_auto,q_auto:good,w_${width},c_scale/${publicId.trim()}`;
}

export function getImageUrl(publicIdOrUrl: string | null | undefined, width = 560): string {
  if (!publicIdOrUrl || typeof publicIdOrUrl !== 'string' || !publicIdOrUrl.trim()) return PLACEHOLDER;
  const id = publicIdOrUrl.trim();
  if (id.startsWith('http://') || id.startsWith('https://')) {
    return getOptimizedListingImage(id, width);
  }
  return getCloudinaryUrl(id, width);
}

export function getThumbnailUrl(publicId: string | null | undefined, size = 320): string {
  if (!publicId) return PLACEHOLDER;
  const id = publicId.trim();
  if (id.startsWith('http://') || id.startsWith('https://')) {
    return getOptimizedListingImage(id, size, size);
  }
  return `${BASE}/f_auto,q_auto:good,w_${size},h_${size},c_fill,g_auto/${id}`;
}

export function getGalleryImageUrl(publicId: string | null | undefined, maxWidth = 1500): string {
  if (!publicId) return PLACEHOLDER;
  const id = publicId.trim();
  if (id.startsWith('http://') || id.startsWith('https://')) {
    return getOptimizedListingImage(id, maxWidth);
  }
  return `${BASE}/f_auto,q_auto:good,w_${maxWidth},c_scale/${id}`;
}

export function getHeroImageUrl(publicId: string | null | undefined): string {
  if (!publicId) return PLACEHOLDER;
  return `${BASE}/f_auto,q_auto:good,w_1120,h_896,c_fill,g_auto/${publicId.trim()}`;
}

export function getCategoryImageUrl(publicId: string | null | undefined): string {
  if (!publicId) return PLACEHOLDER;
  return `${BASE}/f_auto,q_auto:good,w_320,h_448,c_fill,g_auto/${publicId.trim()}`;
}

export function getOptimizedImageUrl(publicId: string | null | undefined, width?: number, height?: number, quality?: string, format?: string): string {
  if (!publicId) return PLACEHOLDER;
  const id = publicId.trim();
  if (id.startsWith('http://') || id.startsWith('https://')) {
    return getOptimizedListingImage(id, width, height);
  }
  const w = width || 560;
  const q = quality || 'auto';
  const f = format || 'auto';
  const parts = [`${BASE}/f_${f},q_${q},w_${w}`];
  if (height && height > 0) parts.push(`h_${height},c_fill,g_auto`);
  else parts.push('c_scale');
  return `${parts.join('/')}/${id}`;
}

export function extractPublicId(url: string): string | null {
  const match = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|webp|avif)/i);
  if (match) return match[1];
  const simpleMatch = url.match(/\/([^/]+)\.(jpg|jpeg|png|webp|avif)$/i);
  return simpleMatch ? simpleMatch[1] : null;
}

export function isCloudinaryUrl(url: string): boolean {
  return url.includes('res.cloudinary.com') || url.includes('cloudinary.com');
}

export const cloudinaryConfig = {
  cloudName: CLOUD_NAME,
  baseUrl: BASE,
};
