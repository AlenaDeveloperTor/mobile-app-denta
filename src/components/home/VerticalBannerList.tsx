import { useBookingModalStore } from '@/store/useBookingModalStore';
import type { Banner } from '@/types/service';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './VerticalBannerList.styles';

interface VerticalBannerListProps {
  banners: Banner[];
}

export function VerticalBannerList({ banners }: VerticalBannerListProps) {
  const openBooking = useBookingModalStore((s) => s.open);

  if (banners.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {banners.map((item) => (
        <TouchableOpacity
          key={String(item.id)}
          style={[styles.bannerCard, { backgroundColor: item.bg_color ?? '#007AFF' }]}
          onPress={() => openBooking()}
          activeOpacity={0.9}
        >
          {Boolean(item.image_url) && (
            <Image
              source={{ uri: item.image_url }}
              style={styles.bannerImage}
              resizeMode="cover"
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
      ))}
    </View>
  );
}
