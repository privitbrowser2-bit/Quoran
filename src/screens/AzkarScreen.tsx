import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Vibration
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../utils/colors';
import { AZKAR_MORNING, AZKAR_EVENING } from '../utils/constants';

export default function AzkarScreen({ route }: any) {
  const isMorning = route?.name === 'AzkarMorning';
  const azkar = isMorning ? AZKAR_MORNING : AZKAR_EVENING;
  const [counts, setCounts] = useState<number[]>(azkar.map(() => 0));
  const [done, setDone] = useState<boolean[]>(azkar.map(() => false));

  const handlePress = (i: number) => {
    if (done[i]) return;
    Vibration.vibrate(20);
    const newCounts = [...counts];
    newCounts[i]++;
    if (newCounts[i] >= azkar[i].count) {
      const newDone = [...done];
      newDone[i] = true;
      setDone(newDone);
    }
    setCounts(newCounts);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0E1A', '#111827']} style={styles.gradient}>
        <View style={styles.header}>
          <Icon name={isMorning ? 'weather-sunset-up' : 'weather-sunset-down'} size={30} color={Colors.gold} />
          <Text style={styles.title}>{isMorning ? 'أذكار الصباح' : 'أذكار المساء'}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scroll}>
          {azkar.map((z, i) => (
            <TouchableOpacity key={i} onPress={() => handlePress(i)} activeOpacity={0.85}>
              <View style={[styles.card, done[i] && styles.cardDone]}>
                <Text style={styles.zikrText}>{z.text}</Text>
                <View style={styles.countRow}>
                  <Text style={styles.countText}>{counts[i]} / {z.count}</Text>
                  {done[i] && <Icon name="check-circle" size={20} color={Colors.success} />}
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, {
                    width: `${Math.min((counts[i] / z.count) * 100, 100)}%`,
                    backgroundColor: done[i] ? Colors.success : Colors.gold
                  }]} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  gradient: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingTop: 50, paddingBottom: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: Colors.gold },
  scroll: { padding: 16 },
  card: { backgroundColor: '#1C2333', borderRadius: 16, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: '#2D3748' },
  cardDone: { borderColor: Colors.success + '55', backgroundColor: '#1a2e1a' },
  zikrText: { fontSize: 18, color: Colors.text, textAlign: 'right', lineHeight: 30, marginBottom: 12 },
  countRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  countText: { color: Colors.gold, fontSize: 14, fontWeight: 'bold' },
  progressBar: { height: 4, backgroundColor: '#2D3748', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
});
