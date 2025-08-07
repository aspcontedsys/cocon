import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tedsys.cocon',
  appName: 'cocon',
  webDir: 'www',
  plugins: {
    FirebaseMessaging: {
      presentationOptions: ["alert", "badge", "sound"],
    },
  },
};

export default config;
