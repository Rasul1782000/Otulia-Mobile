import { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, Modal, StatusBar } from 'react-native';
import { X } from 'lucide-react-native';
import { getGalleryImageUrl } from '../lib/cloudinary';
import { CloudinaryImage } from '../types';
import { OptimizedImage } from './OptimizedImage';
import tw from 'twrnc';

const { width, height } = Dimensions.get('window');

interface ImageGalleryModalProps {
  visible: boolean;
  images: CloudinaryImage[];
  initialIndex: number;
  onClose: () => void;
}

export function ImageGalleryModal({ visible, images, initialIndex, onClose }: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const renderItem = ({ item }: { item: CloudinaryImage }) => (
    <View style={[tw`items-center justify-center`, { width, height }]}>
      <OptimizedImage
        src={getGalleryImageUrl(item.src)}
        alt={item.alt}
        priority="high"
        resizeMode="contain"
        style={[tw`w-full h-full`]}
        showPlaceholder={true}
      />
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={tw`flex-1 bg-black`}>
        <FlatList
          ref={flatListRef}
          data={images}
          renderItem={renderItem}
          keyExtractor={(_, i) => String(i)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />

        <View style={tw`absolute top-12 left-0 right-0 flex-row justify-between items-center px-6 z-10`}>
          <View style={tw`bg-white/20 px-3 py-1.5 rounded-full`}>
            <Text style={tw`text-white text-sm font-black`}>
              {currentIndex + 1} / {images.length}
            </Text>
          </View>
          <TouchableOpacity
            style={tw`bg-white/20 p-2 rounded-full`}
            onPress={onClose}
          >
            <X size={22} color="white" />
          </TouchableOpacity>
        </View>

        {images.length > 1 && (
          <View style={tw`absolute bottom-12 left-0 right-0 flex-row justify-center items-center gap-2 z-10`}>
            {images.map((_, i) => (
              <View
                key={i}
                style={[
                  tw`rounded-full`,
                  {
                    width: i === currentIndex ? 24 : 8,
                    height: 8,
                    backgroundColor: i === currentIndex ? '#c19b6c' : 'rgba(255,255,255,0.4)',
                  },
                ]}
              />
            ))}
          </View>
        )}
      </View>
    </Modal>
  );
}
