import { servicesAPI } from '@/api/services';
import { VerticalBannerList } from '@/components/home/VerticalBannerList';
import { DEFAULT_BANNERS } from '@/data/banners';
import { useAuthStore } from '@/store/useAuthStore';
import { useBookingModalStore } from '@/store/useBookingModalStore';
import { useMessageStore } from '@/store/useMessageStore';
import { styles } from '@/styles/home';
import type { Banner } from '@/types/service';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GRADIENT, COLORS, FONT, RADIUS } from '@/constants/theme';

// ОСНОВНОЙ КОМПОНЕНТ - Главный экран
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const openBooking = useBookingModalStore((s) => s.open);
  const unreadCount = useMessageStore((s) => s.unreadCount);
  const loadUnreadCount = useMessageStore((s) => s.loadUnreadCount);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // Пульсация кнопки «Записаться» — мягкая, ненавязчивая
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.038,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.022,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Следующая пульсация через 4 секунды
        timer = setTimeout(pulse, 4000);
      });
    };

    // Первая пульсация с задержкой 2 сек после монтирования
    timer = setTimeout(pulse, 2000);

    return () => {
      clearTimeout(timer);
      pulseAnim.stopAnimation();
    };
  }, [pulseAnim]);

  // Загрузка данных с API
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const bannersRes = await servicesAPI.getBanners();
        if (!isMounted) return;

        if (Array.isArray(bannersRes.data)) {
          setBanners(bannersRes.data);
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

      </ScrollView>

      {/* Кнопка «Записаться» — прижата к нижней навигационной панели */}
      <View style={styles.stickyBottomBar}>
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            onPress={() => openBooking()}
            activeOpacity={0.82}
            style={{ borderRadius: RADIUS.pill, overflow: 'hidden' }}
          >
            <LinearGradient
              colors={GRADIENT.colors}
              start={GRADIENT.start}
              end={GRADIENT.end}
              style={{
                minHeight: 52,
                paddingVertical: 13,
                paddingHorizontal: 28,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 10,
                borderRadius: RADIUS.pill,
              }}
            >
              <Ionicons name="calendar-outline" size={20} color={COLORS.dark} />
              <Text
                style={{
                  color: COLORS.dark,
                  fontSize: 16,
                  fontFamily: FONT.medium,
                  letterSpacing: 0.4,
                }}
              >
                Записаться
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

