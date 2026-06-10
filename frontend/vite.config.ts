import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, 'env'), '');
  for (const key in env) {
    process.env[key] = env[key];
  }

  return {
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
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
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
