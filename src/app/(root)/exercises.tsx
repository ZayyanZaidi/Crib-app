import { Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  LayoutAnimation,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Exercise 1: Double Tap to Like
function DoubleTapToLike() {
  const [likes, setLikes] = useState(0);
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const lastTapRef = useRef(0);

  const handleTap = () => {
    const now = Date.now();
    const delay = now - lastTapRef.current;

    if (delay < 300) {
      // Double tap detected
      setLikes((prev) => prev + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Reset animation
      scale.setValue(0.5);
      opacity.setValue(1);

      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          delay: 500,
          useNativeDriver: true,
        })
      ]).start();

      lastTapRef.current = 0; // Prevent triple tap issues
    } else {
      lastTapRef.current = now;
    }
  };

  return (
    <View style={styles.exerciseContainer}>
      <Text style={styles.exerciseTitle}>Exercise 1: Double Tap to Like</Text>

      <View style={styles.imageWrapper}>
        <Pressable onPress={handleTap} style={styles.imagePressable}>
          <Image
            source="https://picsum.photos/400/300"
            style={styles.image}
            contentFit="cover"
          />
          <Animated.View style={[styles.heartOverlay, { opacity, transform: [{ scale }] }]}>
            <Ionicons name="heart" size={100} color="#DC2626" />
          </Animated.View>
        </Pressable>
      </View>
      <Text style={styles.likesText}>Likes: {likes}</Text>
    </View>
  );
}

// Exercise 2: Shake on a Wrong PIN
function ShakePin() {
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const handleCheck = () => {
    if (pin === '1234') {
      setStatus('success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      setStatus('error');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      shakeAnimation.setValue(0);
      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true })
      ]).start();
    }
  };

  return (
    <View style={styles.exerciseContainer}>
      <Text style={styles.exerciseTitle}>Exercise 2: Shake on a Wrong PIN</Text>

      <View style={styles.pinContainer}>
        <Animated.View style={[{ transform: [{ translateX: shakeAnimation }] }]}>
          <TextInput
            style={[
              styles.pinInput,
              status === 'error' && styles.pinInputError,
              status === 'success' && styles.pinInputSuccess,
            ]}
            value={pin}
            onChangeText={(text) => {
              setPin(text);
              if (status !== 'idle') setStatus('idle');
            }}
            keyboardType="number-pad"
            placeholder="Enter PIN"
            secureTextEntry
            maxLength={4}
          />
        </Animated.View>

        <Pressable style={styles.checkButton} onPress={handleCheck}>
          <Text style={styles.checkButtonText}>Check</Text>
        </Pressable>
      </View>

      {status === 'success' && (
        <Text style={styles.successText}>Unlocked</Text>
      )}
    </View>
  );
}

// Exercise 3: Sort in a Bottom Sheet
const INITIAL_PRODUCTS = [
  { id: '1', name: 'Coffee Maker', price: 99 },
  { id: '2', name: 'Laptop', price: 999 },
  { id: '3', name: 'Headphones', price: 199 },
  { id: '4', name: 'Book', price: 15 },
  { id: '5', name: 'Desk Chair', price: 150 },
];

function SortBottomSheet() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [sheetVisible, setSheetVisible] = useState(false);

  const handleSort = (type: 'priceAsc' | 'priceDesc' | 'name') => {
    setSheetVisible(false);

    // Slight delay to allow modal to start closing before animating layout
    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      setProducts((prev) => {
        const newProducts = [...prev];
        if (type === 'priceAsc') {
          newProducts.sort((a, b) => a.price - b.price);
        } else if (type === 'priceDesc') {
          newProducts.sort((a, b) => b.price - a.price);
        } else if (type === 'name') {
          newProducts.sort((a, b) => a.name.localeCompare(b.name));
        }
        return newProducts;
      });
    }, 100);
  };

  return (
    <View style={styles.exerciseContainer}>
      <Text style={styles.exerciseTitle}>Exercise 3: Sort in a Bottom Sheet</Text>

      <View style={styles.sortHeader}>
        <Text style={styles.listTitle}>Products</Text>
        <Pressable style={styles.sortButton} onPress={() => setSheetVisible(true)}>
          <Text style={styles.sortButtonText}>Sort</Text>
        </Pressable>
      </View>

      <View style={styles.productList}>
        {products.map((product) => (
          <View key={product.id} style={styles.productItem}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>${product.price}</Text>
          </View>
        ))}
      </View>

      <Modal
        visible={sheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalDismiss} onPress={() => setSheetVisible(false)} />
          <View style={styles.bottomSheet}>
            <Text style={styles.sheetTitle}>Sort by</Text>

            <Pressable style={styles.sheetOption} onPress={() => handleSort('priceAsc')}>
              <Text style={styles.sheetOptionText}>Price: low to high</Text>
            </Pressable>

            <Pressable style={styles.sheetOption} onPress={() => handleSort('priceDesc')}>
              <Text style={styles.sheetOptionText}>Price: high to low</Text>
            </Pressable>

            <Pressable style={styles.sheetOption} onPress={() => handleSort('name')}>
              <Text style={styles.sheetOptionText}>Name</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function ExercisesScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <Stack.Screen options={{ title: 'Exercises', headerBackTitle: 'Profile' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <DoubleTapToLike />
        <View style={styles.divider} />
        <ShakePin />
        <View style={styles.divider} />
        <SortBottomSheet />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  exerciseContainer: { marginBottom: 16 },
  exerciseTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 24 },

  // Exercise 1
  imageWrapper: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  imagePressable: { flex: 1, position: 'relative' },
  image: { width: '100%', height: '100%' },
  heartOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  likesText: { fontSize: 16, marginTop: 12, color: '#374151', fontWeight: '500' },

  // Exercise 2
  pinContainer: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  pinInput: {
    width: 150,
    height: 48,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  pinInputError: { borderColor: '#DC2626', borderWidth: 2 },
  pinInputSuccess: { borderColor: '#059669', borderWidth: 2 },
  checkButton: {
    backgroundColor: '#0E4D92',
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
  checkButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  successText: { color: '#059669', fontSize: 16, fontWeight: 'bold', marginTop: 12 },

  // Exercise 3
  sortHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  listTitle: { fontSize: 16, fontWeight: '600', color: '#374151' },
  sortButton: {
    backgroundColor: '#E0ECF8',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  sortButtonText: { color: '#0E4D92', fontWeight: '600', fontSize: 14 },
  productList: { gap: 8 },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  productName: { fontSize: 16, color: '#111827' },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#0E4D92' },

  // Bottom Sheet
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalDismiss: { flex: 1 },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40, // safe area padding
  },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  sheetOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sheetOptionText: { fontSize: 16, color: '#374151' },
});
