const MAX_CONCURRENT = 6;
const PRIORITIES = { high: 0, normal: 1, low: 2 } as const;

interface QueueItem {
  id: string;
  uri: string;
  priority: keyof typeof PRIORITIES;
  resolve: (uri: string) => void;
  reject: (err: Error) => void;
  attempts?: number;
}

let active = 0;
const queue: QueueItem[] = [];
const cache = new Map<string, string>();

// Persistent cache using localStorage for cross-session image caching
function loadPersistedCache(): Set<string> {
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('otulia_img_cache');
      if (stored) return new Set(JSON.parse(stored));
    }
  } catch {}
  return new Set();
}

function persistCache(uris: Set<string>) {
  try {
    if (typeof localStorage !== 'undefined') {
      // Keep only last 200 entries to avoid bloat
      const arr = Array.from(uris).slice(-200);
      localStorage.setItem('otulia_img_cache', JSON.stringify(arr));
    }
  } catch {}
}

const loadedUris = loadPersistedCache();

function processNext() {
  if (active >= MAX_CONCURRENT || queue.length === 0) return;

  queue.sort((a, b) => PRIORITIES[a.priority] - PRIORITIES[b.priority]);
  const item = queue.shift()!;
  active++;

  // Use React Native Image.prefetch when running in RN, otherwise use browser Image
  const isReactNative = typeof navigator !== 'undefined' && (navigator as any).product === 'ReactNative';

  if (isReactNative) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const RN = require('react-native');
      RN.Image.prefetch(item.uri)
        .then((result: boolean) => {
          if (result) {
            cache.set(item.uri, item.uri);
            loadedUris.add(item.uri);
            if (loadedUris.size % 10 === 0) persistCache(loadedUris);
            active--;
            processNext();
            item.resolve(item.uri);
          } else {
            const attempts = (item.attempts || 0) + 1;
            if (attempts <= 2) {
              setTimeout(() => {
                queue.push({ ...item, attempts });
                active--;
                processNext();
              }, 250 * attempts);
              return;
            }
            active--;
            processNext();
            item.reject(new Error(`Failed to prefetch after ${attempts} attempts: ${item.uri}`));
          }
        })
        .catch((err: Error) => {
          const attempts = (item.attempts || 0) + 1;
          if (attempts <= 2) {
            setTimeout(() => {
              queue.push({ ...item, attempts });
              active--;
              processNext();
            }, 250 * attempts);
            return;
          }
          active--;
          processNext();
          item.reject(err);
        });
    } catch (e) {
      // Fallback to browser Image if require fails
      const img = new Image();
      img.onload = () => {
        cache.set(item.uri, item.uri);
        loadedUris.add(item.uri);
        if (loadedUris.size % 10 === 0) persistCache(loadedUris);
        active--;
        processNext();
        item.resolve(item.uri);
      };
      img.onerror = () => {
        const attempts = (item.attempts || 0) + 1;
        if (attempts <= 2) {
          setTimeout(() => {
            queue.push({ ...item, attempts });
            active--;
            processNext();
          }, 250 * attempts);
          return;
        }
        active--;
        processNext();
        item.reject(new Error(`Failed to load after ${attempts} attempts: ${item.uri}`));
      };
      img.src = item.uri;
    }
    return;
  }

  const img = new Image();
  img.onload = () => {
    cache.set(item.uri, item.uri);
    loadedUris.add(item.uri);
    if (loadedUris.size % 10 === 0) persistCache(loadedUris);
    active--;
    processNext();
    item.resolve(item.uri);
  };
  img.onerror = () => {
    // Retry up to 2 times with exponential backoff
    const attempts = (item.attempts || 0) + 1;
    if (attempts <= 2) {
      // requeue after delay
      setTimeout(() => {
        queue.push({ ...item, attempts });
        active--;
        processNext();
      }, 250 * attempts);
      return;
    }
    active--;
    processNext();
    item.reject(new Error(`Failed to load after ${attempts} attempts: ${item.uri}`));
  };
  img.src = item.uri;
}

let counter = 0;

export function enqueueImage(
  uri: string,
  priority: keyof typeof PRIORITIES = 'normal'
): Promise<string> {
  if (!uri) return Promise.reject(new Error('Empty URI'));
  if (uri.includes('placeholder') || uri.startsWith('data:')) return Promise.resolve(uri);
  if (cache.has(uri)) return Promise.resolve(uri);
  if (loadedUris.has(uri)) {
    cache.set(uri, uri);
    return Promise.resolve(uri);
  }

  return new Promise((resolve, reject) => {
    queue.push({ id: `img-${++counter}`, uri, priority, resolve, reject });
    processNext();
  });
}

export function preloadImages(uris: string[], priority: keyof typeof PRIORITIES = 'normal') {
  return Promise.allSettled(uris.map(uri => enqueueImage(uri, priority)));
}

export function clearImageCache() {
  cache.clear();
  queue.length = 0;
  loadedUris.clear();
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('otulia_img_cache');
    }
  } catch {}
}
