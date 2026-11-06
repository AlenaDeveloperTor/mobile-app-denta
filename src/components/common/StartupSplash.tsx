import { FONT, COLORS } from '@/constants/theme';
import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';

interface StartupSplashProps {
  fontsLoaded: boolean;
  onAnimationComplete: () => void;
  onLayout: () => void;
}

export function StartupSplash({
  fontsLoaded,
  onAnimationComplete,
  onLayout,
}: StartupSplashProps) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.82)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textOffset = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.sequence([
        Animated.delay(100),
        Animated.parallel([
          Animated.spring(logoScale, {
            toValue: 1,
            speed: 14,
            bounciness: 8,
            useNativeDriver: true,
          }),
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 450,
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.sequence([
        Animated.delay(300),
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 450,
            useNativeDriver: true,
          }),
          Animated.timing(textOffset, {
            toValue: 0,
            duration: 450,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]);

    animation.start(({ finished }) => {
      if (finished) {
        onAnimationComplete();
      }
    });

    return () => animation.stop();
  }, [logoOpacity, logoScale, onAnimationComplete, textOffset, textOpacity]);

  return (
    <View style={styles.container} onLayout={onLayout} accessible accessibilityLabel="LabSmile">
      <Animated.View
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Image
          source={require('../../../assets/images/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
          accessibilityLabel="Логотип клиники LabSmile"
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.brand,
          {
            opacity: textOpacity,
            transform: [{ translateY: textOffset }],
          },
        ]}
      >
        <Text style={[styles.name, !fontsLoaded && styles.fallbackFont]}>LabSmile</Text>
        <Text style={[styles.tagline, !fontsLoaded && styles.fallbackFont]}>
          Вклад в качество жизни
        </Text>
      </Animated.View>
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
    width: 144,
    height: 144,
    borderRadius: 32,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  brand: {
    alignItems: 'center',
    marginTop: 24,
  },
  name: {
    color: COLORS.dark,
    fontFamily: FONT.medium,
    fontSize: 26,
    letterSpacing: 0.6,
  },
  tagline: {
    color: COLORS.textSecondary,
    fontFamily: FONT.regular,
    fontSize: 13,
    marginTop: 8,
  },
  fallbackFont: {
    fontFamily: undefined,
  },
});
