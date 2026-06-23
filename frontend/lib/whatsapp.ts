import { Linking, Alert } from 'react-native';

const WA_NUMBER: string = (() => {
  try {
    if (typeof window !== 'undefined' && (window as any).__env__?.VITE_WHATSAPP_NUMBER) {
      return (window as any).__env__.VITE_WHATSAPP_NUMBER;
    }
    if (import.meta.env?.VITE_WHATSAPP_NUMBER) {
      return import.meta.env.VITE_WHATSAPP_NUMBER;
    }
  } catch {}
  return '';
})();

export function openWhatsApp(message?: string, phone?: string): void {
  const number = phone || WA_NUMBER;
  const url = `https://wa.me/${number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message || '')}`;
  Linking.openURL(url).catch(() => {
    Alert.alert('WhatsApp', 'WhatsApp is not installed on this device.');
  });
}

export function getWhatsAppNumber(): string {
  return WA_NUMBER;
}
