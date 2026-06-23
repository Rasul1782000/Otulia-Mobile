import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function loadEnvFile(filePath: string): Record<string, string> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const vars: Record<string, string> = {};
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      vars[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
    }
    return vars;
  } catch {
    return {};
  }
}

export default defineConfig(() => {
  const env = loadEnvFile(path.resolve(__dirname, '..', '.env'));

  const defines: Record<string, string> = {};
  for (const key in env) {
    defines[`process.env.${key}`] = JSON.stringify(env[key]);
    if (key.startsWith('VITE_') || key.startsWith('EXPO_PUBLIC_')) {
      defines[`import.meta.env.${key}`] = JSON.stringify(env[key]);
    }
  }

  return {
    define: defines,
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'react-native-web-stubs',
        enforce: 'pre',
        resolveId(id) {
          if (id === 'lucide-react-native/dist/esm/context.mjs') {
            return path.resolve(__dirname, 'react-native-stubs/lucide-context.mjs');
          }
          return null;
        },
        transform(code, id) {
          if (id.includes('NativeSvgRenderableModule') || id.includes('NativeSvgViewModule')) {
            return {
              code: `const TurboModuleRegistry = { getEnforcing: () => ({}), get: () => ({}) };\nexport default TurboModuleRegistry;`,
              map: null,
            };
          }
          return null;
        },
      },
    ],
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, '.') },
        { find: 'react-native/Libraries/Utilities/codegenNativeComponent', replacement: path.resolve(__dirname, 'react-native-stubs/codegenNativeComponent.ts') },
        { find: 'react-native', replacement: 'react-native-web' },
      ],
      conditions: ['react-native'],
    },
    optimizeDeps: {
      exclude: ['react-native-svg', 'lucide-react-native'],
    },
    server: {
      hmr: env.DISABLE_HMR !== 'true',
      watch: env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:5001',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
