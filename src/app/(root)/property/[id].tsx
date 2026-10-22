import Ionicons from '@expo/vector-icons/Ionicons';
import { useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { createBooking } from '@/api/bookings';
import { FavouriteButton } from '@/components/favourite-button';
import { ErrorView, LoadingView } from '@/components/state-views';
import { useBookings } from '@/hooks/use-bookings';
import { useProperty } from '@/hooks/use-property';
import { formatPrice } from '@/lib/format';

function getTomorrowLocalDateString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function PropertyDetailsScreen() {
  // [id] in the file name becomes the "id" parameter: /property/2 -> id = "2"
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: property, isPending, isError, error, refetch } = useProperty(id);
  const { data: bookings = [] } = useBookings();
  const queryClient = useQueryClient();

  // Contact host modal state
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  // Booking visit state
  const [isBooking, setIsBooking] = useState(false);

  const tomorrowStr = getTomorrowLocalDateString();
  const isAlreadyBooked = bookings.some(
    (b) => Number(b.home_id) === Number(property?.id) && b.visit_date === tomorrowStr
  );

  if (isPending) {
    return <LoadingView />;
  }

  if (isError) {
    return <ErrorView message={error.message} onRetry={refetch} />;
  }

  if (!property) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <Text style={styles.notFound}>Property not found</Text>
        <Pressable style={styles.button} onPress={() => router.replace('/')}>
          <Text style={styles.buttonText}>Go to Home</Text>
        </Pressable>
      </View>
    );
  }

  // If this screen was opened from a link, there is no screen behind it.
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${property.title} in ${property.city} for ${formatPrice(property.price)}`,
      });
    } catch {
      // Some platforms/browsers cannot invoke native sharing.
      Alert.alert('Sharing unavailable', 'Sharing works on mobile devices (Expo Go / standalone builds).');
    }
  };

  const handleSendMessage = () => {
    if (!contactMessage.trim()) {
      Alert.alert('Missing Message', 'Please enter a message for the host.');
      return;
    }

    // Closes modal and returns to the details of the SAME property (no navigation away)
    setIsContactModalVisible(false);
    setContactMessage('');
    Alert.alert('Message Sent', `Your message regarding "${property.title}" has been sent to the host.`);
  };

  const handleBookVisit = async () => {
    try {
      setIsBooking(true);
      await createBooking(property.id, tomorrowStr);
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
      Alert.alert(
        'Visit Booked',
        `Your visit to "${property.title}" has been booked for tomorrow (${tomorrowStr}).`
      );
    } catch (err: any) {
      if (
        err?.code === '23505' ||
        err?.message?.includes('23505') ||
        err?.message?.toLowerCase().includes('unique')
      ) {
        Alert.alert('Already Booked', "You've already booked a visit to this home for tomorrow.");
      } else {
        Alert.alert('Booking Error', err?.message || 'Could not book a visit. Please try again.');
      }
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Set this screen's header title and add a button on the right */}
      <Stack.Screen
        options={{
          title: property.title,
          headerRight: () => (
            <Pressable onPress={handleShare} hitSlop={8} accessibilityLabel="Share">
              <Ionicons name="share-social-outline" size={22} color="#0E4D92" />
            </Pressable>
          ),
        }}
      />

      <Image
        source={property.image_url}
        style={styles.image}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      <View style={styles.titleRow}>
        <Text style={styles.title}>{property.title}</Text>
        <FavouriteButton property={property} />
      </View>
      <Text style={styles.city}>{property.city}</Text>
      <Text style={styles.price}>{formatPrice(property.price)}</Text>

      <View style={styles.facts}>
        <Fact label="Bedrooms" value={property.bedrooms} />
        <Fact label="Bathrooms" value={property.bathrooms} />
        <Fact label="Area (sq ft)" value={property.area} />
      </View>

      <Text style={styles.description}>{property.description}</Text>

      <View style={styles.actions}>
        {isAlreadyBooked ? (
          <View style={[styles.button, styles.bookedButton]}>
            <Text style={styles.bookedButtonText}>✓ Visit booked for tomorrow</Text>
          </View>
        ) : (
          <Pressable
            style={[styles.button, styles.primaryButton, isBooking && styles.buttonDisabled]}
            onPress={handleBookVisit}
            disabled={isBooking}
          >
            {isBooking ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Book a visit for tomorrow</Text>
            )}
          </Pressable>
        )}

        <Pressable
          style={[styles.button, styles.secondaryButton]}
          onPress={() => setIsContactModalVisible(true)}
        >
          <Text style={styles.secondaryButtonText}>Contact host</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.outlineButton]} onPress={goBack}>
          <Text style={styles.outlineButtonText}>Back to list</Text>
        </Pressable>
      </View>

      {/* Contact Host Modal */}
      <Modal
        visible={isContactModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsContactModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeading}>Contact Host</Text>
              <Pressable onPress={() => setIsContactModalVisible(false)} hitSlop={8}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </Pressable>
            </View>

            <Text style={styles.modalPropertyTitle} numberOfLines={2}>
              Property: {property.title}
            </Text>

            <TextInput
              style={styles.messageInput}
              multiline
              numberOfLines={4}
              placeholder="Write your message to the host here..."
              placeholderTextColor="#9CA3AF"
              value={contactMessage}
              onChangeText={setContactMessage}
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setIsContactModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalSendButton]}
                onPress={handleSendMessage}
              >
                <Text style={styles.modalSendText}>Send</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function Fact({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factValue}>{value}</Text>
      <Text style={styles.factLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 16, gap: 8, paddingBottom: 32 },
  image: { width: '100%', height: 220, borderRadius: 12, backgroundColor: '#E5E7EB' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  title: { flex: 1, fontSize: 24, fontWeight: 'bold', color: '#111827' },
  city: { fontSize: 16, color: '#4B5563' },
  price: { fontSize: 20, fontWeight: 'bold', color: '#0E4D92', marginTop: 4 },
  facts: { flexDirection: 'row', gap: 8, marginVertical: 12 },
  fact: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  factValue: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  factLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  description: { fontSize: 15, lineHeight: 22, color: '#374151' },
  actions: { marginTop: 16, gap: 10 },
  button: {
    alignSelf: 'stretch',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: { backgroundColor: '#0E4D92' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  bookedButton: {
    backgroundColor: '#DEF7EC',
    borderWidth: 1,
    borderColor: '#31C48D',
  },
  bookedButtonText: {
    color: '#03543F',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#E0ECF8',
  },
  secondaryButtonText: { color: '#0E4D92', fontWeight: 'bold', fontSize: 16 },
  outlineButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  outlineButtonText: { color: '#374151', fontWeight: '600', fontSize: 16 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  notFound: { fontSize: 18, color: '#374151' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeading: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  modalPropertyTitle: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
  messageInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    fontSize: 15,
    color: '#111827',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButton: {
    backgroundColor: '#F3F4F6',
  },
  modalCancelText: { color: '#374151', fontWeight: '600' },
  modalSendButton: {
    backgroundColor: '#0E4D92',
  },
  modalSendText: { color: '#FFFFFF', fontWeight: 'bold' },
});
