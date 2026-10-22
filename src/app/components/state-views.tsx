import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

// The three screens a list shows when it has no rows to draw:
// still loading, something went wrong, or nothing matched.

export function LoadingView() {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#0E4D92" />
    </View>
  );
}

type ErrorViewProps = { message: string; onRetry: () => void };

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Could not load homes</Text>
      <Text style={styles.message}>{message}</Text>
      <Pressable style={styles.button} onPress={onRetry}>
        <Text style={styles.buttonText}>Try again</Text>
      </Pressable>
    </View>
  );
}

type EmptyViewProps = { title: string; message: string };

export function EmptyView({ title, message }: EmptyViewProps) {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#111827', textAlign: 'center' },
  message: { color: '#6B7280', textAlign: 'center' },
  button: {
    marginTop: 8,
    backgroundColor: '#0E4D92',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold' },
});
