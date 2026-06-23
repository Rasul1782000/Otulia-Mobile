const path = require('path');
const fs = require('fs');

function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '..', '.env');
    const content = fs.readFileSync(envPath, 'utf-8');
    const vars = {};
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

const env = loadEnv();

module.exports = {
  expo: {
    name: 'Otulia',
    slug: 'otulia-mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './images/assets/Otulia logo.jpeg',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './images/assets/Otulia logo.jpeg',
      resizeMode: 'contain',
      backgroundColor: '#000000',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.otulia.app',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './images/assets/Otulia logo.jpeg',
        backgroundColor: '#000000',
      },
      package: 'com.otulia.app',
    },
    web: {
      favicon: './images/assets/Otulia logo.jpeg',
    },
    extra: Object.fromEntries(
      Object.entries(env).filter(([k]) => k.startsWith('VITE_') || k.startsWith('EXPO_PUBLIC_'))
    ),
  },
};
