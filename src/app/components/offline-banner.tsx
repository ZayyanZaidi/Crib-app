import { useNetInfo } from '@react-native-community/netinfo';
import { StyleSheet, Text, View } from 'react-native';

// A strip at the top of the screen while the phone has no connection.
export function OfflineBanner() {
  const { isConnected } = useNetInfo();

  // isConnected is null while NetInfo is still checking, so only false shows the banner.
  if (isConnected !== false) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>You are offline. Showing the homes loaded earlier.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: '#B45309', paddingVertical: 8, paddingHorizontal: 16 },
  text: { color: '#FFFFFF', textAlign: 'center', fontWeight: 'bold' },
});
