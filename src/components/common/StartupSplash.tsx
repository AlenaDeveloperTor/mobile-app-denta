import { COLORS } from '@/constants/theme';
import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';

interface StartupSplashProps {
  onLayout: () => void;
}

export function StartupSplash({ onLayout }: StartupSplashProps) {
  const firstRingScale = useRef(new Animated.Value(0.68)).current;
  const firstRingOpacity = useRef(new Animated.Value(0.35)).current;
  const secondRingScale = useRef(new Animated.Value(0.68)).current;
  const secondRingOpacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const createPulse = (scale: Animated.Value, opacity: Animated.Value) =>
      Animated.loop(
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1.35,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 1800,
            useNativeDriver: true,
          }),
        ]),
        { resetBeforeIteration: true },
      );

    const firstPulse = createPulse(firstRingScale, firstRingOpacity);
    const secondPulse = Animated.sequence([
      Animated.delay(900),
      createPulse(secondRingScale, secondRingOpacity),
    ]);

    firstPulse.start();
    secondPulse.start();

    return () => {
      firstPulse.stop();
      secondPulse.stop();
    };
  }, [firstRingOpacity, firstRingScale, secondRingOpacity, secondRingScale]);

  return (
    <View style={styles.container} onLayout={onLayout} accessible accessibilityLabel="LabSmile">
      <View style={styles.logo}>
        <Animated.View
          style={[
            styles.ring,
            {
              opacity: firstRingOpacity,
              transform: [{ scale: firstRingScale }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.ring,
            {
              opacity: secondRingOpacity,
              transform: [{ scale: secondRingScale }],
            },
          ]}
        />
        <Image
          source={require('../../../assets/images/splash-logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
          accessibilityLabel="Логотип клиники LabSmile"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  logo: {
    width: 250,
    height: 169,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  ring: {
    position: 'absolute',
    top: 17,
    left: 80,
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1.5,
    borderColor: COLORS.blue,
  },
});
