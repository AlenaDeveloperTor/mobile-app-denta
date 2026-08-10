import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { MessageCard } from '@/components/messages/MessageCard';
import { useMessageStore } from '@/store/useMessageStore';
import { styles } from '@/styles/notifications';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

export default function NotificationsScreen() {
  const { messages, loading, load, markAsRead, markAllRead } = useMessageStore();

  useEffect(() => {
    if (messages.length === 0) {
      load();
    }
  }, [messages.length, load]);

  const openMessage = (id: string) => {
    markAsRead(id);
    router.push({
      pathname: '/modal',
      params: { type: 'message', messageId: id },
    });
  };

  if (loading && messages.length === 0) {
    return <LoadingSpinner />;
  }

  const hasUnread = messages.some((m) => !m.is_read);

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <MessageCard message={item} onPress={() => openMessage(item.id)} />
      )}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Уведомления</Text>
          {hasUnread ? (
            <TouchableOpacity onPress={markAllRead} hitSlop={8}>
              <Text style={styles.markAll}>Прочитать все</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyBox}>
          <Ionicons name="notifications-off-outline" size={56} color="#C7C7CC" />
          <Text style={styles.emptyTitle}>Уведомлений пока нет</Text>
        </View>
      }
    />
  );
}
