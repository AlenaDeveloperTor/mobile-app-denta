import { useBookingModalStore } from '@/store/useBookingModalStore';
import type { Banner } from '@/types/service';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './BannerCarousel.styles';

const { width } = Dimensions.get('window');

interface BannerCarouselProps {
  banners: Banner[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const openBooking = useBookingModalStore((s) => s.open);
  const flatListRef = useRef<FlatList<Banner>>(null);

  // Автопрокрутка каждые 5 секунд
  useEffect(() => {
    if (banners.length <= 1) {
      return;
    }
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % banners.length;
      setActiveIndex(nextIndex);
      // Безопасный скролл с проверкой валидности индекса
      if (flatListRef.current && nextIndex < banners.length) {
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
          viewPosition: 0,
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex, banners.length]);

  if (banners.length === 0) {
    return null;
  }

  const handleBannerPress = () => {
    openBooking();
  };

  // getItemLayout: вычисляет размер и позицию каждого элемента
  // Обязателен для scrollToIndex
  const getItemLayout = (_data: ArrayLike<Banner> | null | undefined, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  // Обработчик ошибок при скролле (например, если индекс вне границ)
  const handleScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    console.warn('scrollToIndex failed:', info);
    // Fallback: используем scrollToOffset вместо scrollToIndex
    const offset = info.index * width;
    flatListRef.current?.scrollToOffset({ offset, animated: true });
  };

  const renderBanner = ({ item }: { item: Banner }) => (
    <TouchableOpacity
      style={[styles.bannerSlide, { backgroundColor: item.bg_color ?? '#007AFF' }]}
      onPress={handleBannerPress}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image_url }} style={styles.bannerImage} resizeMode="cover" />
      <View style={styles.bannerOverlay}>
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerTitle}>{item.title}</Text>
          <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
          <View style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>{item.button_text}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDot = (index: number) => (
    <View
      key={index}
      style={[
        styles.dot,
        { backgroundColor: index === activeIndex ? '#AAC6EE' : 'rgba(170,198,238,0.3)' },
      ]}
    />
  );

  return (
    <View style={styles.carouselWrapper}>
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderBanner}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
        style={styles.carousel}
      />
      <View style={styles.dotsContainer}>
        {banners.map((_, index) => renderDot(index))}
      </View>
    </View>
  );
}
