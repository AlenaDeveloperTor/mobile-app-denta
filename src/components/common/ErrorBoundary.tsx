import { COLORS, FONT } from '@/constants/theme';
import { captureException } from '@/utils/logger';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Отправляем ошибку в GlitchTip со стектрейсом компонента
    captureException(error, {
      tags: {
        layer: 'ui_error_boundary',
      },
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>⚠️</Text>
            </View>
            <Text style={styles.title}>Что-то пошло не так</Text>
            <Text style={styles.subtitle}>
              Произошла непредвиденная ошибка. Мы уже отправили отчёт техническим специалистам.
            </Text>

            {__DEV__ && this.state.error && (
              <View style={styles.debugBox}>
                <Text style={styles.debugText} numberOfLines={4}>
                  {this.state.error.toString()}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={this.handleReset}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Попробовать снова</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.blueTint,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconText: {
    fontSize: 28,
  },
  title: {
    fontFamily: FONT.medium,
    fontWeight: '700',
    fontSize: 20,
    color: COLORS.dark,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONT.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  debugBox: {
    width: '100%',
    backgroundColor: '#FFF1F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFA39E',
  },
  debugText: {
    fontFamily: FONT.regular,
    fontSize: 12,
    color: COLORS.error,
  },
  button: {
    width: '100%',
    backgroundColor: COLORS.dark,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FONT.medium,
    fontSize: 15,
    color: COLORS.white,
  },
});
