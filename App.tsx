import React, { useEffect } from 'react';
import { I18nManager } from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';
import AppNavigator from './src/navigation/AppNavigator';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function App() {
  useEffect(() => {
    mobileAds().initialize();
  }, []);

  return <AppNavigator />;
}
