const PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="%23f4f4f5" width="400" height="300"/><text fill="%23a1a1aa" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle">No Image</text></svg>';

export const IMAGE_SIZES = {
  cardHorizontal: { w: 560, h: 352 },
  cardVertical: { w: 750, h: 480 },
  thumbnail: { w: 320, h: 320 },
  hero: { w: 1120, h: 896 },
  gallery: { w: 1500, h: 0 },
  detail: { w: 750, h: 0 },
} as const;

function resolve(src: string | null | undefined): string {
  if (!src || typeof src !== 'string' || !src.trim()) return PLACEHOLDER;
  return src.trim();
}

export function getBlurPlaceholderUrl(src: string | null | undefined, _width = 20): string {
  return resolve(src);
}

export function getOptimizedListingImage(src: string, _width = 560, _height?: number): string {
  return resolve(src);
}

export function getThumbnailUrl(src: string | null | undefined, _size = 320): string {
  return resolve(src);
}

export function getGalleryImageUrl(src: string | null | undefined, _maxWidth = 1500): string {
  return resolve(src);
}

export function getHeroImageUrl(src: string | null | undefined): string {
  return resolve(src);
}

export function getCategoryImageUrl(src: string | null | undefined): string {
  return resolve(src);
}
