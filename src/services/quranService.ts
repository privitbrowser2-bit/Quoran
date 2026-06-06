import axios from 'axios';
import { QURAN_API, AZAN_API } from '../utils/constants';

export const getQuranSurah = async (surahNumber: number) => {
  try {
    const res = await axios.get(`${QURAN_API}/surah/${surahNumber}/ar.alafasy`);
    return res.data.data;
  } catch (e) {
    return null;
  }
};

export const getAllSurahs = async () => {
  try {
    const res = await axios.get(`${QURAN_API}/surah`);
    return res.data.data;
  } catch (e) {
    return [];
  }
};

export const getPrayerTimes = async (lat: number, lng: number) => {
  try {
    const date = new Date();
    const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const res = await axios.get(
      `${AZAN_API}/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=5`
    );
    return res.data.data.timings;
  } catch (e) {
    return null;
  }
};

export const getAyahAudio = (surah: number, ayah: number) => {
  const surahStr = String(surah).padStart(3, '0');
  const ayahStr = String(ayah).padStart(3, '0');
  return `https://verses.quran.com/Alafasy/mp3/${surahStr}${ayahStr}.mp3`;
};
