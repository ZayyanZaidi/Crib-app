import * as Linking from 'expo-linking';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
  // The link a phone would receive, for example from a WhatsApp message.
  // In Expo Go it starts with exp://, in a real build with crib://
  const testLink = Linking.createURL('property/3');

  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>Deep link test</Text>
      <Text style={styles.link} selectable>
        {testLink}
      </Text>
      <Pressable style={styles.button} onPress={() => Linking.openURL(testLink)}>
        <Text style={styles.buttonText}>Open property 3 from a link</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, gap: 12, backgroundColor: '#F9FAFB' },
  heading: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  link: { fontFamily: 'monospace', color: '#374151' },
  button: {
    backgroundColor: '#0E4D92',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold' },
});
