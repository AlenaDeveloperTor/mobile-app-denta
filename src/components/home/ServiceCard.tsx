import type { Service } from '@/types/service';
import { formatDuration, formatPrice } from '@/utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './ServiceCard.styles';

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
    <TouchableOpacity style={styles.serviceCard} onPress={handleBooking} activeOpacity={0.8}>
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
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.serviceDurationText}>{formatDuration(service.duration)}</Text>
          </View>
          <TouchableOpacity style={styles.bookingButton} onPress={handleBooking}>
            <Text style={styles.bookingButtonText}>Записаться</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
