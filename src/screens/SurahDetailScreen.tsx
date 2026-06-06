import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  ActivityIndicator, TouchableOpacity
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { getQuranSurah } from '../services/quranService';
import { Colors } from '../utils/colors';
import { ADMOB_IDS } from '../utils/constants';

const rewarded = RewardedAd.createForAdRequest(ADMOB_IDS.REWARDED);

export default function SurahDetailScreen({ route }: any) {
  const { surah } = route.params;
  const [ayahs, setAyahs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(22);

  useEffect(() => {
    getQuranSurah(surah.number).then(data => {
      if (data) setAyahs(data.ayahs);
      setLoading(false);
    });
    rewarded.load();
    rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setTimeout(() => rewarded.show(), 3000);
    });
  }, []);

  if (loading) return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={Colors.gold} />
      <Text style={styles.loadingText}>جارٍ تحميل السورة...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0E1A', '#111827']} style={styles.header}>
        <Text style={styles.surahName}>{surah.name}</Text>
        <Text style={styles.surahInfo}>{surah.englishName} • {surah.numberOfAyahs} آية • {surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</Text>
        <View style={styles.fontControls}>
          <TouchableOpacity onPress={() => setFontSize(f => Math.max(16, f - 2))} style={styles.fontBtn}>
            <Icon name="format-font-size-decrease" size={20} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.fontLabel}>حجم الخط</Text>
          <TouchableOpacity onPress={() => setFontSize(f => Math.min(32, f + 2))} style={styles.fontBtn}>
            <Icon name="format-font-size-increase" size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>
        {surah.number !== 9 && (
          <Text style={styles.bismillah}>﴿ بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ﴾</Text>
        )}
      </LinearGradient>
      <FlatList
        data={ayahs}
        keyExtractor={a => a.number.toString()}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.ayahCard}>
            <Text style={[styles.ayahText, { fontSize }]}>{item.text}</Text>
            <View style={styles.ayahNum}>
              <Text style={styles.ayahNumText}>{item.numberInSurah}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0E1A' },
  loadingText: { color: Colors.gold, marginTop: 12, fontSize: 16 },
  header: { paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16, alignItems: 'center' },
  surahName: { fontSize: 26, fontWeight: 'bold', color: Colors.gold },
  surahInfo: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  fontControls: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 },
  fontBtn: { padding: 8, backgroundColor: '#1C2333', borderRadius: 8 },
  fontLabel: { color: Colors.textSecondary, fontSize: 13 },
  bismillah: { fontSize: 18, color: Colors.gold, marginTop: 12, textAlign: 'center' },
  list: { flex: 1 },
  ayahCard: { padding: 16, marginHorizontal: 12, marginVertical: 4, backgroundColor: '#1C2333', borderRadius: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  ayahText: { flex: 1, color: Colors.text, textAlign: 'right', lineHeight: 40 },
  ayahNum: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.gold + '33', alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  ayahNumText: { color: Colors.gold, fontSize: 12, fontWeight: 'bold' },
});
