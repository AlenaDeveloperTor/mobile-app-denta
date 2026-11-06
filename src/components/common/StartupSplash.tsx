import { COLORS } from '@/constants/theme';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  View,
} from 'react-native';

interface StartupSplashProps {
  /** Сигнал о том, что ресурсы приложения (шрифты, проверка авторизации) готовы */
  isReady?: boolean;
  /** Колбэк завершения анимации выхода сплэша */
  onFinish?: () => void;
  /** Опциональный колбэк native layout */
  onLayout?: () => void;
}

export function StartupSplash({
  isReady = true,
  onFinish,
  onLayout,
}: StartupSplashProps) {
  // Общий контейнер (fade-out и легкий zoom-out при закрытии сплэша)
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const containerScale = useRef(new Animated.Value(1)).current;

  // Прыжок и перемещение зуба
  const jumpY = useRef(new Animated.Value(0)).current;
  // Быстрое вращение на 360°
  const rotateAnim = useRef(new Animated.Value(0)).current;
  // Масштаб самого зуба
  const toothScale = useRef(new Animated.Value(0.92)).current;
  // Сжатие и растяжение (squash & stretch) для живой физики
  const squashY = useRef(new Animated.Value(1)).current;
  const squashX = useRef(new Animated.Value(1)).current;

  // Элегантная волна/кольцо при приземлении зуба
  const ringScale = useRef(new Animated.Value(0.6)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;

  const isReadyRef = useRef(isReady);
  isReadyRef.current = isReady;

  const animationFinishedRef = useRef(false);
  const isDismissingRef = useRef(false);
  const idleLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  // Плавный выход из сплэша
  const dismissSplash = useRef(() => {
    if (isDismissingRef.current) return;
    isDismissingRef.current = true;

    if (idleLoopRef.current) {
      idleLoopRef.current.stop();
      idleLoopRef.current = null;
    }

    Animated.parallel([
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(containerScale, {
        toValue: 1.05,
        duration: 320,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish?.();
    });
  }).current;

  // Сразу при монтировании скрываем нативный системный сплэш,
  // так как этот компонент уже визуально дублирует фон и иконку
  useEffect(() => {
    void SplashScreen.hideAsync().catch(() => {});
  }, []);

  // Если флаг isReady изменился на true после завершения вступительной анимации
  useEffect(() => {
    if (isReady && animationFinishedRef.current && !isDismissingRef.current) {
      dismissSplash();
    }
  }, [dismissSplash, isReady]);

  // Главная хореография анимации
  useEffect(() => {
    // Входное появление зуба
    const entranceAnim = Animated.spring(toothScale, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    });

    // Последовательность прыжка и вращения
    const routineAnim = Animated.sequence([
      // Небольшая начальная пауза
      Animated.delay(180),

      // 1. Подготовка к прыжку (приседание / anticipation)
      Animated.parallel([
        Animated.timing(jumpY, {
          toValue: 7,
          duration: 110,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(squashY, {
          toValue: 0.92,
          duration: 110,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(squashX, {
          toValue: 1.07,
          duration: 110,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),

      // 2. Взлёт вверх с вертикальным вытягиванием (stretch)
      Animated.parallel([
        Animated.timing(jumpY, {
          toValue: -48,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(squashY, {
          toValue: 1.10,
          duration: 160,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(squashX, {
          toValue: 0.92,
          duration: 160,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),

      // 3. Быстрое плавное вращение на 360° на пике прыжка
      Animated.parallel([
        Animated.timing(squashY, {
          toValue: 1.0,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(squashX, {
          toValue: 1.0,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 460,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
      ]),

      // 4. Падение вниз
      Animated.timing(jumpY, {
        toValue: 0,
        duration: 230,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),

      // 5. Приземление (мягкое сжатие, пружинящий возврат и расходящаяся волна)
      Animated.parallel([
        Animated.sequence([
          Animated.parallel([
            Animated.timing(squashY, {
              toValue: 0.88,
              duration: 90,
              useNativeDriver: true,
            }),
            Animated.timing(squashX, {
              toValue: 1.11,
              duration: 90,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.spring(squashY, {
              toValue: 1.0,
              friction: 4,
              tension: 70,
              useNativeDriver: true,
            }),
            Animated.spring(squashX, {
              toValue: 1.0,
              friction: 4,
              tension: 70,
              useNativeDriver: true,
            }),
          ]),
        ]),
        // Волна/кольцо при касании поверхности
        Animated.sequence([
          Animated.timing(ringOpacity, {
            toValue: 0.45,
            duration: 40,
            useNativeDriver: true,
          }),
          Animated.parallel([
            Animated.timing(ringScale, {
              toValue: 1.75,
              duration: 520,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(ringOpacity, {
              toValue: 0,
              duration: 520,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]),

      // Небольшая пауза для закрепления эффекта
      Animated.delay(180),
    ]);

    entranceAnim.start();

    routineAnim.start(({ finished }) => {
      if (!finished) return;

      animationFinishedRef.current = true;

      // Если данные уже готовы — сразу плавно скрываем сплэш
      if (isReadyRef.current) {
        dismissSplash();
      } else {
        // Если данные еще загружаются (медленный интернет) — включаем мягкое покачивание
        idleLoopRef.current = Animated.loop(
          Animated.sequence([
            Animated.timing(jumpY, {
              toValue: -7,
              duration: 650,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(jumpY, {
              toValue: 0,
              duration: 650,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ])
        );
        idleLoopRef.current.start();
      }
    });

    return () => {
      entranceAnim.stop();
      routineAnim.stop();
      if (idleLoopRef.current) {
        idleLoopRef.current.stop();
      }
    };
  }, [dismissSplash, jumpY, ringOpacity, ringScale, rotateAnim, squashX, squashY, toothScale]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: containerOpacity,
          transform: [{ scale: containerScale }],
        },
      ]}
      onLayout={onLayout}
      accessible
      accessibilityLabel="Загрузка приложения LabSmile"
    >
      <View style={styles.centerContainer}>
        {/* Радиальная мягкая волна при приземлении */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.ring,
            {
              opacity: ringOpacity,
              transform: [{ scale: ringScale }],
            },
          ]}
        />

        {/* Анимированный подпрыгивающий и вращающийся зуб */}
        <Animated.View
          style={[
            styles.toothWrapper,
            {
              transform: [
                { translateY: jumpY },
                { rotate: spin },
                { scale: toothScale },
                { scaleX: squashX },
                { scaleY: squashY },
              ],
            },
          ]}
        >
          <Image
            source={require('../../../assets/images/splash-tooth.png')}
            style={styles.toothImage}
            resizeMode="contain"
            accessibilityLabel="Логотип клиники LabSmile"
          />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    zIndex: 9999,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
  },
  ring: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.blue,
  },
  toothWrapper: {
    width: 140,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toothImage: {
    width: 140,
    height: 120,
  },
});
