import type { Banner } from '@/types/service';
import React, { useState } from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './VerticalBannerList.styles';

const BANNER_LINK = 'https://labsmile22.ru/?ysclid=muejyoo3bu837002956';

interface VerticalBannerListProps {
  banners: Banner[];
}

interface BannerItemProps {
  item: Banner;
}

function BannerItem({ item }: BannerItemProps) {
  const [imageError, setImageError] = useState(false);

  const hasImage = Boolean(item.image_url) && !imageError;

  return (
    <View
      style={[styles.bannerCard, { backgroundColor: item.bg_color ?? '#007AFF' }]}
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
            <TouchableOpacity
              style={styles.bannerButton}
              onPress={() => Linking.openURL(BANNER_LINK)}
              activeOpacity={0.8}
            >
              <Text style={styles.bannerButtonText}>{item.button_text}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

export function VerticalBannerList({ banners }: VerticalBannerListProps) {
  if (banners.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {banners.map((item) => (
        <BannerItem
          key={String(item.id)}
          item={item}
        />
      ))}
    </View>
  );
}
