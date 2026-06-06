import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Animated, Dimensions, StatusBar
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { Colors } from '../utils/colors';
import { ADMOB_IDS } from '../utils/constants';

const { width, height } = Dimensions.get('window');

const menuItems = [
  { icon: 'book-open-variant', title: 'القرآن الكريم', subtitle: '114 سورة', screen: 'Quran', color: ['#C8A951', '#8B6914'] },
  { icon: 'clock-outline', title: 'أوقات الصلاة', subtitle: 'تنبيهات تلقائية', screen: 'Prayer', color: ['#2D6A4F', '#52B788'] },
  { icon: 'counter', title: 'التسبيح والذكر', subtitle: 'عداد تلقائي', screen: 'Tasbih', color: ['#6B46C1', '#9F7AEA'] },
  { icon: 'weather-sunset-up', title: 'أذكار الصباح', subtitle: '30 ذكر', screen: 'AzkarMorning', color: ['#C05621', '#ED8936'] },
  { icon: 'weather-sunset-down', title: 'أذكار المساء', subtitle: '25 ذكر', screen: 'AzkarEvening', color: ['#2B6CB0', '#63B3ED'] },
  { icon: 'microphone', title: 'الأذان', subtitle: 'حسب موقعك', screen: 'Azan', color: ['#276749', '#68D391'] },
];

export default function HomeScreen({ navigation }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 20000, useNativeDriver: true })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E1A" />
      <LinearGradient colors={['#0A0E1A', '#111827', '#0A0E1A']} style={styles.gradient}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Header */}
          <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <Animated.View style={[styles.starPattern, { transform: [{ rotate: spin }] }]}>
              {[...Array(8)].map((_, i) => (
                <View key={i} style={[styles.starLine, { transform: [{ rotate: `${i * 45}deg` }] }]} />
              ))}
            </Animated.View>
            <Icon name="star-crescent" size={60} color={Colors.gold} style={styles.moonIcon} />
            <Text style={styles.appName}>قرآننا هداية</Text>
            <Text style={styles.appSubtitle}>﴿ وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ ﴾</Text>
          </Animated.View>

          {/* Banner Ad */}
          <View style={styles.adContainer}>
            <BannerAd unitId={ADMOB_IDS.BANNER} size={BannerAdSize.BANNER} />
          </View>

          {/* Menu Grid */}
          <View style={styles.grid}>
            {menuItems.map((item, i) => (
              <Animated.View key={i} style={[styles.cardWrapper, {
                opacity: fadeAnim,
                transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }]
              }]}>
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => navigation.navigate(item.screen)}
                  activeOpacity={0.85}
                >
                  <LinearGradient colors={item.color} style={styles.cardGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <View style={styles.cardIconBox}>
                      <Icon name={item.icon} size={32} color="#fff" />
                    </View>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>

          {/* Bottom Banner */}
          <View style={styles.adContainer}>
            <BannerAd unitId={ADMOB_IDS.BANNER} size={BannerAdSize.LARGE_BANNER} />
          </View>

        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  gradient: { flex: 1 },
  scroll: { paddingBottom: 30 },
  header: { alignItems: 'center', paddingTop: 50, paddingBottom: 20, position: 'relative' },
  starPattern: { position: 'absolute', top: 40, width: 120, height: 120, alignItems: 'center', justifyContent: 'center' },
  starLine: { position: 'absolute', width: 100, height: 1, backgroundColor: Colors.gold + '33' },
  moonIcon: { marginBottom: 10, textShadowColor: Colors.gold, textShadowRadius: 20 },
  appName: { fontSize: 28, fontWeight: 'bold', color: Colors.gold, textAlign: 'center', letterSpacing: 2 },
  appSubtitle: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', marginTop: 8, paddingHorizontal: 30, lineHeight: 22 },
  adContainer: { alignItems: 'center', marginVertical: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 12 },
  cardWrapper: { width: (width - 36) / 2 },
  card: { borderRadius: 20, overflow: 'hidden', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3 },
  cardGradient: { padding: 20, alignItems: 'center', minHeight: 140 },
  cardIconBox: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  cardSubtitle: { fontSize: 11, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 4 },
});
