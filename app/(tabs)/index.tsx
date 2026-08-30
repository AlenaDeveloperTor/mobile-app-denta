import { Button } from '@/components/common/Button';
import { BannerCarousel } from '@/components/home/BannerCarousel';
import { PromoSection } from '@/components/home/PromoSection';
import { DEFAULT_BANNERS } from '@/data/banners';
import { useAuthStore } from '@/store/useAuthStore';
import { useBookingModalStore } from '@/store/useBookingModalStore';
import { useMessageStore } from '@/store/useMessageStore';
import { styles } from '@/styles/home';
import type { Banner, Promo } from '@/types/service';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// ОСНОВНОЙ КОМПОНЕНТ - Главный экран
export default function HomeScreen() {
  const { user } = useAuthStore();
  const openBooking = useBookingModalStore((s) => s.open);
  const unreadCount = useMessageStore((s) => s.unreadCount);
  const loadUnreadCount = useMessageStore((s) => s.loadUnreadCount);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных с API
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        // const [bannersRes, promosRes] = await Promise.all([
        //   servicesAPI.getBanners(),
        //   servicesAPI.getPromos(),
        // ]);
        // if (!isMounted) return;
        // setBanners(bannersRes.data);
        // setPromos(promosRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Загрузка счётчика непрочитанных (для бейджа на колокольчике)
  useEffect(() => {
    loadUnreadCount();
  }, [loadUnreadCount]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Если API ещё не вернул баннеры — показываем заглушки, чтобы карусель работала
  const carouselBanners = banners.length > 0 ? banners : DEFAULT_BANNERS;

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Приветствие */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.greeting}>Добро пожаловать,</Text>
          <Text style={styles.userName}>
            {user?.first_name || 'Пациент'} {user?.last_name || ''}!
          </Text>
        </View>
        <View style={styles.headerActions}>
          {/* Колокольчик уведомлений с бейджем непрочитанных */}
          <TouchableOpacity
            style={styles.bellIcon}
            onPress={() => router.push('/notifications')}
            hitSlop={8}
          >
            <Ionicons name="notifications-outline" size={28} color="#007AFF" />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileIcon}
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="person-circle-outline" size={44} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Баннер-карусель */}
      <BannerCarousel banners={carouselBanners} />

      {/* Кнопка «Записаться» — прилипает к карусели, открывает модалку записи */}
      <View style={styles.bookSection}>
        <Button title="✏️ Записаться" onPress={() => openBooking()} />
      </View>

      {/* Акции (раздел скрывается, если акций нет) */}
      <PromoSection promos={promos} />

      {/* Отступ внизу для удобства прокрутки */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

