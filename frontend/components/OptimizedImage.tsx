import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Image, ImageStyle, StyleProp, ActivityIndicator, Text } from 'react-native';
import { enqueueImage } from '../lib/imageQueue';
import { getOptimizedListingImage, IMAGE_SIZES, getBlurPlaceholderUrl } from '../lib/cloudinary';
import { colors } from '../theme';
import tw from 'twrnc';

interface OptimizedImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  priority?: 'high' | 'normal' | 'low';
  showPlaceholder?: boolean;
  showAlt?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

const PLACEHOLDER_BG = '#f4f4f5';

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  style,
  resizeMode = 'cover',
  priority = 'normal',
  showPlaceholder = true,
  showAlt = false,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);
  const viewRef = useRef<View>(null);
  const mountedRef = useRef(true);

  // Apply Cloudinary transformations with mobile-optimized sizes
  const optimizedSrc = useMemo(() => {
    if (!src) return '';
    let targetW: number;
    let targetH: number | undefined;
    if (width) {
      targetW = width * 2;
      targetH = height ? height * 2 : undefined;
    } else if (priority === 'high') {
      targetW = IMAGE_SIZES.hero.w;
      targetH = IMAGE_SIZES.hero.h;
    } else if (priority === 'low') {
      targetW = IMAGE_SIZES.thumbnail.w;
      targetH = IMAGE_SIZES.thumbnail.h;
    } else {
      targetW = IMAGE_SIZES.cardHorizontal.w;
      targetH = IMAGE_SIZES.cardHorizontal.h;
    }
    return getOptimizedListingImage(src, targetW, targetH);
  }, [src, width, height, priority]);

  const placeholderSrc = useMemo(() => {
    if (!src) return '';
    try {
      return getBlurPlaceholderUrl(src, 20);
    } catch {
      return '';
    }
  }, [src]);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  const onLayout = useCallback(() => {
    if (!inView) {
      setInView(true);
    }
  }, [inView]);

  useEffect(() => {
    if (!inView || !optimizedSrc || loaded || error) return;

    let cancelled = false;

    enqueueImage(optimizedSrc, priority)
      .then(() => {
        if (!cancelled && mountedRef.current) {
          setLoaded(true);
          onLoad?.();
        }
      })
      .catch((err) => {
        if (!cancelled && mountedRef.current) {
          setError(true);
          onError?.(err);
        }
      });

    return () => { cancelled = true; };
  }, [inView, optimizedSrc, priority, loaded, error, onLoad, onError]);

  // fallback: if optimizedSrc is present but image element itself loads later,
  // update loaded state on native Image onLoad as an extra signal
  const handleNativeLoad = useCallback(() => {
    if (!loaded) setLoaded(true);
    onLoad?.();
  }, [loaded, onLoad]);

  const showContent = loaded && !error;
  const showLoading = inView && !loaded && !error;
  const showError = error;

  return (
    <View
      ref={viewRef}
      onLayout={onLayout}
      style={[{ backgroundColor: PLACEHOLDER_BG }, style]}
    >
      {/* placeholder (low-res blurred) */}
      {!loaded && placeholderSrc && showPlaceholder && (
        <Image
          source={{ uri: placeholderSrc }}
          style={[
            tw`absolute inset-0 w-full h-full`,
            { opacity: loaded ? 0 : 1 },
            style,
          ]}
          resizeMode={resizeMode}
          blurRadius={2}
        />
      )}

      {/* main image */}
      {optimizedSrc && (
        <Image
          source={{ uri: optimizedSrc }}
          style={[
            tw`w-full h-full`,
            { opacity: loaded ? 1 : 0 },
            style,
          ]}
          resizeMode={resizeMode}
          onLoad={handleNativeLoad}
          onError={(e) => { setError(true); onError?.(new Error('native image load error')); }}
        />
      )}

      {showLoading && !showPlaceholder && (
        <View style={tw`absolute inset-0 items-center justify-center`}>
          <ActivityIndicator size="small" color={colors.gold} />
          {showAlt && alt && (
            <Text style={tw`text-[10px] text-zinc-400 mt-1 font-bold`} numberOfLines={1}>
              {alt}
            </Text>
          )}
        </View>
      )}

      {showError && (
        <View style={tw`absolute inset-0 items-center justify-center bg-zinc-100`}>
          <Text style={tw`text-[10px] text-zinc-400 font-bold`}>
            {alt || 'Image'}
          </Text>
        </View>
      )}
    </View>
  );
}
