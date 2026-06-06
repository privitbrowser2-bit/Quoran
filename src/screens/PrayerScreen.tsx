import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  ActivityIndicator, PermissionsAndroid, Platform
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from 'react-native-geolocation-service';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { getPrayerTimes } from '../services/quranService';
import { Colors } from '../utils/colors';
import { ADMOB_IDS } from '../utils/constants';

const PRAYERS_AR = ['الفجر', 'الشروق', 'الظهر', 'العصر', 'المغرب', 'العشاء'];
const PRAYER_KEYS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const PRAYER_ICONS = ['weather-sunset-up', 'weather-sunny', 'weather-partly-cloudy', 'weather-sunset', 'weather-sunset-down', 'weather-night'];

export default function PrayerScreen() {
  const [times, setTimes] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const now = new Date();

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = async () => {
    try {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      }
      Geolocation.getCurrentPosition(
        async pos => {
          const t = await getPrayerTimes(pos.coords.latitude, pos.coords.longitude);
          setTimes(t);
          setLoading(false);
        },
        () => {
          getPrayerTimes(30.0444, 31.2357).then(t => { setTimes(t); setLoading(false); });
          setCity('القاهرة');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } catch {
      setLoading(false);
    }
  };

  if (loading) return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={Colors.gold} />
      <Text style={styles.loadingText}>جارٍ تحديد الموقع...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0E1A', '#111827']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Icon name="map-marker" size={20} color={Colors.gold} />
            <Text style={styles.city}>{city || 'موقعك الحالي'}</Text>
          </View>
          <Text style={styles.date}>
            {now.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>

          <BannerAd unitId={ADMOB_IDS.BANNER} size={BannerAdSize.BANNER} />

          <View style={styles.cards}>
            {PRAYER_KEYS.map((key, i) => (
              <View key={i} style={styles.card}>
                <LinearGradient colors={['#1C2333', '#111827']} style={styles.cardGrad}>
                  <Icon name={PRAYER_ICONS[i]} size={28} color={Colors.gold} />
                  <Text style={styles.prayerName}>{PRAYERS_AR[i]}</Text>
                  <Text style={styles.prayerTime}>{times?.[key] || '--:--'}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>

          <BannerAd unitId={ADMOB_IDS.BANNER} size={BannerAdSize.LARGE_BANNER} />
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  gradient: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0E1A' },
  loadingText: { color: Colors.gold, marginTop: 12, fontSize: 16 },
  scroll: { padding: 16, paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 },
  city: { fontSize: 18, color: Colors.text, fontWeight: 'bold' },
  date: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 16 },
  cards: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 },
  card: { width: '47%', borderRadius: 16, overflow: 'hidden' },
  cardGrad: { padding: 20, alignItems: 'center', gap: 8 },
  prayerName: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  prayerTime: { fontSize: 22, fontWeight: 'bold', color: Colors.gold },
});
