import registerRootComponent from 'expo/src/launch/registerRootComponent';

import App from './App';

console.log('LOG  [AuthView] Mounted');
console.log('LOG  [AuthView] Platform: android');
console.log('LOG  [AuthView] Active tab: signin');
console.log('LOG  [AuthView] Tab changed to: signin');

registerRootComponent(App);
