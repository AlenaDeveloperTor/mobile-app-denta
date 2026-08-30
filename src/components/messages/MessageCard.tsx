import type { Message, MessageCategory } from '@/types/message';
import { formatDate } from '@/utils/formatters';
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './MessageCard.styles';

const CATEGORY_ICONS: Record<
  MessageCategory,
  { name: keyof typeof Ionicons.glyphMap; color: string }
> = {
  promo: { name: 'pricetag', color: '#FF6B35' },
  system: { name: 'notifications', color: '#007AFF' },
  info: { name: 'information-circle', color: '#2E7D32' },
};

interface MessageCardProps {
  message: Message;
  onPress: () => void;
}

export function MessageCard({ message, onPress }: MessageCardProps) {
  const icon = CATEGORY_ICONS[message.category] ?? CATEGORY_ICONS.system;
  const unread = !message.is_read;

  return (
    <TouchableOpacity
      style={[styles.card, unread && styles.cardUnread]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconCircle, { backgroundColor: `${icon.color}22` }]}>
        <Ionicons name={icon.name} size={22} color={icon.color} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, unread && styles.titleUnread]} numberOfLines={1}>
          {message.title}
        </Text>
        <Text style={styles.body} numberOfLines={2}>
          {message.body}
        </Text>
        <Text style={styles.time}>{formatDate(message.created_at)}</Text>
      </View>

      {unread ? <View style={styles.unreadDot} /> : null}
    </TouchableOpacity>
  );
}
