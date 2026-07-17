// Fix vite.config.ts to load environment variables properly
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

function loadEnv(filePath: string): Record<string, string> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const vars: Record<string, string> = {};
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      vars[key] = value;
    }
    return vars;
  } catch (e) {
    return {};
  }
}

export default defineConfig(() => {
  const env = loadEnv(path.resolve(__dirname, '..', '.env'));

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
