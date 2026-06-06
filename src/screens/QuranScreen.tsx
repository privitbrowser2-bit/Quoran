import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, TextInput
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { getAllSurahs } from '../services/quranService';
import { Colors } from '../utils/colors';
import { ADMOB_IDS } from '../utils/constants';

export default function QuranScreen({ navigation }: any) {
  const [surahs, setSurahs] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllSurahs().then(data => {
      setSurahs(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (!text) { setFiltered(surahs); return; }
    setFiltered(surahs.filter((s: any) =>
      s.name.includes(text) || s.englishName.toLowerCase().includes(text.toLowerCase())
    ));
  };

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('SurahDetail', { surah: item })}
    >
      <LinearGradient colors={['#1C2333', '#111827']} style={styles.itemGrad}>
        <View style={styles.numBox}>
          <Text style={styles.numText}>{item.number}</Text>
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.surahName}>{item.name}</Text>
          <Text style={styles.surahEn}>{item.englishName} • {item.numberOfAyahs} آية</Text>
        </View>
        <Text style={styles.revelationType}>
          {item.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading) return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={Colors.gold} />
      <Text style={styles.loadingText}>جارٍ تحميل القرآن الكريم...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A0E1A', '#111827']} style={styles.header}>
        <Text style={styles.title}>القرآن الكريم</Text>
        <View style={styles.searchBox}>
          <Icon name="magnify" size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث عن سورة..."
            placeholderTextColor={Colors.textSecondary}
            value={search}
            onChangeText={handleSearch}
          />
        </View>
        <BannerAd unitId={ADMOB_IDS.BANNER} size={BannerAdSize.BANNER} />
      </LinearGradient>
      <FlatList
        data={filtered}
        keyExtractor={i => i.number.toString()}
        renderItem={renderItem}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1A' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0E1A' },
  loadingText: { color: Colors.gold, marginTop: 12, fontSize: 16 },
  header: { paddingTop: 50, paddingBottom: 10, paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.gold, textAlign: 'center', marginBottom: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C2333', borderRadius: 12, paddingHorizontal: 12, marginBottom: 10 },
  searchInput: { flex: 1, color: Colors.text, fontSize: 16, padding: 10, textAlign: 'right' },
  list: { flex: 1 },
  item: { marginHorizontal: 12, marginVertical: 4, borderRadius: 14, overflow: 'hidden' },
  itemGrad: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  numBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.gold + '33', alignItems: 'center', justifyContent: 'center' },
  numText: { color: Colors.gold, fontWeight: 'bold', fontSize: 14 },
  itemInfo: { flex: 1, marginHorizontal: 12 },
  surahName: { fontSize: 18, color: Colors.text, fontWeight: 'bold', textAlign: 'right' },
  surahEn: { fontSize: 12, color: Colors.textSecondary, marginTop: 2, textAlign: 'right' },
  revelationType: { fontSize: 11, color: Colors.gold, backgroundColor: Colors.gold + '22', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
});
