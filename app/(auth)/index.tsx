import { Button } from '@/components/common/Button';
import { PrivacyPolicyModal } from '@/components/modals/PrivacyPolicyModal';
import { styles } from '@/styles/welcome';
import { APP_NAME } from '@/utils/constants';
import { openPrivacyPolicy } from '@/utils/policy';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import Logo from '../../assets/images/logo_main.svg';

export default function WelcomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenPolicy = async () => {
    await openPrivacyPolicy(() => {
      setModalVisible(true);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <Logo width={240} height={72} />
      </View>

      {/* <Text style={styles.title}>{APP_NAME}</Text> */}

      <Text style={styles.subtitle}>
        Запись к стоматологу, бонусная программа и акции — в одном приложении.
      </Text>

      <Button title="Авторизоваться" onPress={() => router.push('/(auth)/phone')} />

      <Text style={styles.hint}>
        Продолжая, вы соглашаетесь с{' '}
        <Text style={styles.hintLink} onPress={handleOpenPolicy}>
          условиями обработки данных
        </Text>
      </Text>

      <PrivacyPolicyModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
