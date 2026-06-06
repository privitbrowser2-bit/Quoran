import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import QuranScreen from '../screens/QuranScreen';
import SurahDetailScreen from '../screens/SurahDetailScreen';
import TasbihScreen from '../screens/TasbihScreen';
import PrayerScreen from '../screens/PrayerScreen';
import AzkarScreen from '../screens/AzkarScreen';
import { Colors } from '../utils/colors';

const Stack = createStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: '#111827' },
  headerTintColor: Colors.gold,
  headerTitleStyle: { fontWeight: 'bold' as const },
  headerBackTitle: 'رجوع',
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Quran" component={QuranScreen} options={{ title: 'القرآن الكريم' }} />
        <Stack.Screen name="SurahDetail" component={SurahDetailScreen} options={({ route }: any) => ({ title: route.params?.surah?.name || 'السورة' })} />
        <Stack.Screen name="Tasbih" component={TasbihScreen} options={{ title: 'التسبيح والذكر' }} />
        <Stack.Screen name="Prayer" component={PrayerScreen} options={{ title: 'أوقات الصلاة' }} />
        <Stack.Screen name="AzkarMorning" component={AzkarScreen} options={{ title: 'أذكار الصباح' }} />
        <Stack.Screen name="AzkarEvening" component={AzkarScreen} options={{ title: 'أذكار المساء' }} />
        <Stack.Screen name="Azan" component={PrayerScreen} options={{ title: 'الأذان' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
