import type { Service } from '@/types/service';
import { formatDuration, formatPrice } from '@/utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './ServiceCard.styles';
import { GRADIENT } from '@/constants/theme';

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const handleBooking = () => {
    router.push({
      pathname: '/modal',
      params: { type: 'booking', serviceId: service.id },
    });
  };

  return (
    <TouchableOpacity style={styles.serviceCard} onPress={handleBooking} activeOpacity={0.85}>
      <Image
        source={{ uri: service.image_url }}
        style={styles.serviceImage}
        resizeMode="cover"
      />
      <View style={styles.serviceContent}>
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <View style={styles.servicePrice}>
            <Text style={styles.servicePriceText}>от {formatPrice(service.price)}</Text>
          </View>
        </View>
        <Text style={styles.serviceDescription} numberOfLines={2}>
          {service.description}
        </Text>
        <View style={styles.serviceFooter}>
          <View style={styles.serviceDuration}>
            <Ionicons name="time-outline" size={16} color="#6B7A8F" />
            <Text style={styles.serviceDurationText}>{formatDuration(service.duration)}</Text>
          </View>
          <TouchableOpacity style={styles.bookingButton} onPress={handleBooking}>
            <LinearGradient
              colors={GRADIENT.colors}
              start={GRADIENT.start}
              end={GRADIENT.end}
              style={styles.bookingButtonGradient}
            >
              <Text style={styles.bookingButtonText}>Записаться</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
