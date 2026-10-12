import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT } from '@/constants/theme';
import { useAppointmentStore } from '@/store/useAppointmentStore';
import { useBookingModalStore } from '@/store/useBookingModalStore';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const hasAppointments = useAppointmentStore((state) => state.appointments.length > 0);
  const openBooking = useBookingModalStore((state) => state.open);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.dark,
        tabBarInactiveTintColor: COLORS.blue,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: 'rgba(170,198,238,0.25)',
          borderTopWidth: 1,
          shadowColor: '#172933',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 8,
          height: 62 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 6),
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontFamily: FONT.regular,
          fontSize: 11,
          lineHeight: 14,
        },
        tabBarItemStyle: {
          minHeight: 48,
        },
        headerStyle: {
          backgroundColor: COLORS.white,
          shadowColor: '#172933',
          shadowOpacity: 0.06,
        },
        headerTitleStyle: {
          fontFamily: FONT.medium,
          color: COLORS.dark,
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Главная',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Мои записи',
          headerRight: hasAppointments
            ? () => (
                <TouchableOpacity
                  onPress={() => openBooking()}
                  accessibilityRole="button"
                  accessibilityLabel="Записаться"
                  hitSlop={10}
                  style={{ padding: 8, marginRight: 4 }}
                >
                  <Ionicons name="add-circle-outline" size={26} color={COLORS.dark} />
                </TouchableOpacity>
              )
            : undefined,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}