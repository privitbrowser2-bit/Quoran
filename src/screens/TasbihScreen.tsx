import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Vibration, Animated, ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { Colors } from '../utils/colors';
import { ADMOB_IDS, TASBIH_LIST } from '../utils/constants';

const interstitial = InterstitialAd.createForAdRequest(ADMOB_IDS.INTERSTITIAL);

export default function TasbihScreen() {
  const [selected, setSelected] = useState(0);
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const current = TASBIH_LIST[selected];

  const handlePress = () => {
    Vibration.vibrate(30);
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.93, useNativeDriver: true, speed: 50 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }),
    ]).start();
    Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 100, useNativeDriver: false }),
      Animated.timing(glowAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
    ]).start();

    const newCount = count + 1;
    setCount(newCount);
    setTotal(total + 1);

    if (newCount >= current.count) {
      setCount(0);
      interstitial.load();
      interstitial.addAdEventListener(AdEventType.LOADED, () => interstitial.show());
    }
  };

  const reset = () => { setCount(0); Vibration.vibrate([0, 50, 50, 50]); };

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(200,169,81,0)', 'rgba(200,169,81,0.4)'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0E1A', '#111827']} style={styles.gradient}>
        {/* Tasbih selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selector} contentContainerStyle={styles.selectorContent}>
          {TASBIH_LIST.map((t, i) => (
            <TouchableOpacity key={i} onPress={() => { setSelected(i); setCount(0); }} style={[styles.chip, selected === i && { backgroundColor: t.color }]}>
              <Text style={[styles.chipText, selected === i && { color: '#fff' }]}>{t.translation}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Counter */}
        <View style={styles.centerArea}>
          <Text style={styles.tasbihText}>{current.text}</Text>
          <Text style={styles.targetText}>الهدف: {current.count}</Text>

          <Animated.View style={[styles.glowRing, { backgroundColor: glowColor }]}>
            <Animated.View style={[styles.counterBtn, { transform: [{ scale: scaleAnim }] }]}>
              <TouchableOpacity onPress={handlePress} activeOpacity={1}>
                <LinearGradient
                  colors={[current.color, current.color + 'AA']}
                  style={styles.counterInner}
                >
                  <Text style={styles.countNum}>{count}</Text>
                  <Text style={styles.countLabel}>اضغط للتسبيح</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{total}</Text>
              <Text style={styles.statLabel}>إجمالي</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{Math.floor(total / current.count)}</Text>
              <Text style={styles.statLabel}>دورات</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.resetBtn} onPress={reset}>
            <Icon name="refresh" size={20} color={Colors.textSecondary} />
            <Text style={styles.resetText}>إعادة تعيين</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  gradient: { flex: 1 },
  selector: { maxHeight: 60, marginTop: 50 },
  selectorContent: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1C2333', borderWidth: 1, borderColor: '#2D3748' },
  chipText: { color: Colors.textSecondary, fontSize: 13 },
  centerArea: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 40 },
  tasbihText: { fontSize: 22, color: Colors.gold, textAlign: 'center', marginBottom: 8, fontWeight: 'bold' },
  targetText: { fontSize: 14, color: Colors.textSecondary, marginBottom: 30 },
  glowRing: { borderRadius: 120, padding: 10 },
  counterBtn: { width: 200, height: 200, borderRadius: 100, overflow: 'hidden', elevation: 10 },
  counterInner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  countNum: { fontSize: 64, fontWeight: 'bold', color: '#fff' },
  countLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  stats: { flexDirection: 'row', gap: 40, marginTop: 30 },
  statItem: { alignItems: 'center' },
  statNum: { fontSize: 28, fontWeight: 'bold', color: Colors.gold },
  statLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  resetBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 20, padding: 10 },
  resetText: { color: Colors.textSecondary, fontSize: 14 },
});
