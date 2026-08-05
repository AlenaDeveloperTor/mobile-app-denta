import { servicesAPI } from '@/api/services';
import { BannerCarousel } from '@/components/home/BannerCarousel';
import { PromoSection } from '@/components/home/PromoSection';
import { ServiceCard } from '@/components/home/ServiceCard';
import { useAuthStore } from '@/store/useAuthStore';
import { styles } from '@/styles/home';
import type { Banner, Promo, Service } from '@/types/service';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// ОСНОВНОЙ КОМПОНЕНТ - Главный экран
export default function HomeScreen() {
  const { user } = useAuthStore();
  const [services, setServices] = useState<Service[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных с API
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [servicesRes, bannersRes, promosRes] = await Promise.all([
          servicesAPI.getServices(),
          servicesAPI.getBanners(),
          servicesAPI.getPromos(),
        ]);
        if (!isMounted) return;
        setServices(servicesRes.data);
        setBanners(bannersRes.data);
        setPromos(promosRes.data);
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

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
        <TouchableOpacity 
          style={styles.profileIcon}
          onPress={() => router.push('/profile')}
        >
          <Ionicons name="person-circle-outline" size={44} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Баннер-карусель */}
      <BannerCarousel banners={banners} />

      {/* Акции */}
      <PromoSection promos={promos} />

      {/* Услуги */}
      <View style={styles.servicesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📋 Наши услуги</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Смотреть все</Text>
          </TouchableOpacity>
        </View>
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </View>

      {/* Отступ внизу для удобства прокрутки */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

