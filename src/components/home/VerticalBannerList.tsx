import { useBookingModalStore } from '@/store/useBookingModalStore';
import type { Banner } from '@/types/service';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './VerticalBannerList.styles';

interface VerticalBannerListProps {
  banners: Banner[];
}

interface BannerItemProps {
  item: Banner;
  onPress: () => void;
}

function BannerItem({ item, onPress }: BannerItemProps) {
  const [imageError, setImageError] = useState(false);

  const hasImage = Boolean(item.image_url) && !imageError;

  return (
    <TouchableOpacity
      style={[styles.bannerCard, { backgroundColor: item.bg_color ?? '#007AFF' }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {hasImage && (
        <Image
          source={{ uri: item.image_url }}
          style={styles.bannerImage}
          resizeMode="cover"
          onError={(e) => {
            console.warn('[BannerItem] Ошибка загрузки изображения:', item.image_url, e.nativeEvent.error);
            setImageError(true);
          }}
          onLoad={() => {
            console.log('[BannerItem] Изображение загружено успешно:', item.image_url);
          }}
        />
      )}
      <View style={styles.bannerOverlay}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>{item.title}</Text>
          {Boolean(item.subtitle) && (
            <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
          )}
          {Boolean(item.button_text) && (
            <View style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>{item.button_text}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function VerticalBannerList({ banners }: VerticalBannerListProps) {
  const openBooking = useBookingModalStore((s) => s.open);

  if (banners.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {banners.map((item) => (
        <BannerItem
          key={String(item.id)}
          item={item}
          onPress={() => openBooking()}
        />
      ))}
    </View>
  );
}
