import { servicesAPI } from '@/api/services';
import { Button } from '@/components/common/Button';
import { PromoSection } from '@/components/home/PromoSection';
import { VerticalBannerList } from '@/components/home/VerticalBannerList';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ОСНОВНОЙ КОМПОНЕНТ - Главный экран
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
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
        const [bannersRes, promosRes] = await Promise.allSettled([
          servicesAPI.getBanners(),
          servicesAPI.getPromos(),
        ]);
        if (!isMounted) return;

        if (bannersRes.status === 'fulfilled' && Array.isArray(bannersRes.value.data)) {
          setBanners(bannersRes.value.data);
        }
        if (promosRes.status === 'fulfilled' && Array.isArray(promosRes.value.data)) {
          setPromos(promosRes.value.data);
        }
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
        <ActivityIndicator size="large" color="#AAC6EE" />
      </View>
    );
  }

  // Если API вернул пустой список баннеров — показываем демо-баннеры, чтобы экран не пустовал
  const displayBanners = banners.length > 0 ? banners : DEFAULT_BANNERS;
  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Пациент';

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Приветствие с безопасным отступом от статус-бара */}
        <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top + 8, 20) }]}>
          <View>
            <Text style={styles.greeting}>Добро пожаловать,</Text>
            <Text style={styles.userName}>{displayName}!</Text>
          </View>
          <View style={styles.headerActions}>
            {/* Колокольчик уведомлений с бейджем непрочитанных */}
            <TouchableOpacity
              style={styles.bellIcon}
              onPress={() => router.push('/notifications')}
              hitSlop={8}
            >
              <Ionicons name="notifications-outline" size={28} color="#172933" />
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
              <Ionicons name="person-circle-outline" size={44} color="#172933" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Вертикальный список баннеров */}
        <VerticalBannerList banners={displayBanners} />

        {/* Акции (раздел скрывается, если акций нет) */}
        <PromoSection promos={promos} />
      </ScrollView>

      {/* Кнопка «Записаться» — прижата к нижней навигационной панели */}
      <View style={styles.stickyBottomBar}>
        <Button title="✏️ Записаться" onPress={() => openBooking()} />
      </View>
    </View>
  );
}

