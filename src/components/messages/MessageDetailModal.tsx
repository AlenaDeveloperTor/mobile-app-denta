import { Button } from '@/components/common/Button';
import { useBookingModalStore } from '@/store/useBookingModalStore';
import { useMessageStore } from '@/store/useMessageStore';
import type { Message, MessageCategory } from '@/types/message';
import { formatDateTime } from '@/utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './MessageDetailModal.styles';

const CATEGORY_LABELS: Record<MessageCategory, string> = {
  general: 'Уведомление',
  promo: 'Акция',
  news: 'Новость',
  appointment: 'Запись',
};

interface MessageDetailModalProps {
  messageId?: string;
}

/**
 * Детальный просмотр сообщения (модалка).
 * Читает сообщение из стора по id и отмечает его прочитанным.
 * Может показывать вложенный баннер (акция/новость).
 */
export function MessageDetailModal({ messageId }: MessageDetailModalProps) {
  const messages = useMessageStore((s) => s.messages);
  const markAsRead = useMessageStore((s) => s.markAsRead);
  const openBooking = useBookingModalStore((s) => s.open);
  const [message, setMessage] = useState<Message | undefined>();

  useEffect(() => {
    const found = messages.find((m) => m.id === messageId);
    setMessage(found);
    if (found && !found.is_read) {
      markAsRead(found.id);
    }
  }, [messages, messageId, markAsRead]);

  const handleBannerPress = () => {
    router.back(); // закрыть детальный просмотр
    if (message?.category === 'promo') {
      openBooking();
    }
  };

  if (!message) {
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.notFound}>Сообщение не найдено</Text>
          <Button title="Закрыть" variant="secondary" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{CATEGORY_LABELS[message.category]}</Text>
            </View>
            <TouchableOpacity onPress={() => router.back()} style={styles.closeButton} hitSlop={10}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{message.title}</Text>
          <Text style={styles.date}>{formatDateTime(message.created_at)}</Text>

          {message.banner?.image_url ? (
            <View
              style={[styles.bannerWrap, { backgroundColor: message.banner.bg_color ?? '#007AFF' }]}
            >
              <Image
                source={{ uri: message.banner.image_url }}
                style={styles.bannerImage}
                resizeMode="cover"
              />
            </View>
          ) : null}

          <Text style={styles.body}>{message.body}</Text>

          {message.banner?.button_text ? (
            <Button title={message.banner.button_text} onPress={handleBannerPress} />
          ) : (
            <Button title="Закрыть" variant="secondary" onPress={() => router.back()} />
          )}
        </ScrollView>
      </View>
    </View>
  );
}
