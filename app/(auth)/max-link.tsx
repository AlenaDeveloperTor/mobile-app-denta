import { Button } from '@/components/common/Button';
import { MAX_BOT_DEEP_LINK } from '@/config/env';
import { styles } from '@/styles/maxLink';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Linking, Text, View } from 'react-native';

export default function MaxLinkScreen() {
  const { phone, deep_link, session_id } = useLocalSearchParams<{
    phone?: string;
    deep_link?: string;
    session_id?: string;
  }>();
  // Ссылка от сервера, либо запасная из .env
  const botLink = deep_link && deep_link.length > 0 ? deep_link : MAX_BOT_DEEP_LINK;

  const openBot = async () => {
    if (!botLink) {
      return;
    }
    try {
      await Linking.openURL(botLink); // откроет MAX и перейдёт в чат с ботом
    } catch (error) {
      console.warn('Не удалось открыть MAX:', error);
    }
  };

  const continueToVerify = () => {
    router.push({
      pathname: '/(auth)/verify',
      params: { phone: phone ?? '', session_id: session_id ?? '' },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="chatbubbles-outline" size={48} color="#FFFFFF" />
      </View>
      <Text style={styles.title}>Подтвердите номер в MAX</Text>
      <Text style={styles.subtitle}>
        Откройте бота в мессенджере MAX и нажмите «Поделиться контактом». Код подтверждения
        придёт в чат с ботом.
      </Text>

      <Button title="Открыть бота в MAX" onPress={openBot} />
      <Button title="Продолжить" variant="secondary" onPress={continueToVerify} />
    </View>
  );
}
