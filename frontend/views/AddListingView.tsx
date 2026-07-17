import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { ArrowLeft, Camera, X, Check, MapPin, DollarSign, Image as ImageIcon, Upload, RotateCw } from 'lucide-react-native';
import { ViewState, Listing, ListingImage } from '../types';
import { useTheme, colors } from '../theme';
import tw from 'twrnc';

interface AddListingViewProps {
  onViewChange: (v: ViewState) => void;
}

export function AddListingView({ onViewChange }: AddListingViewProps) {
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<ListingImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bg = isDark ? colors.dark.bg : colors.light.bg;
  const surface = isDark ? colors.dark.surface : colors.light.surface;
  const border = isDark ? colors.dark.border : colors.light.border;
  const text = isDark ? colors.dark.text : colors.light.text;
  const textMuted = isDark ? colors.dark.textMuted : colors.light.textMuted;

  const steps = [
    'Basic Info',
    'Location & Price',
    'Images',
    'Review',
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 4000));
      Alert.alert(
        'Success!',
        'Your listing has been created successfully.',
        [
          {
            text: 'OK',
            onPress: () => onViewChange('home'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={tw`px-6 mb-6`}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-2`}>
        {steps.map((step, index) => {
          const isActive = currentStep === index + 1;
          const isCompleted = currentStep > index + 1;
          return (
            <TouchableOpacity
              key={step}
              onPress={() => setCurrentStep(index + 1)}
              style={tw`px-4 py-2 rounded-full flex-row items-center gap-2`}
            >
              <View style={tw`w-8 h-8 rounded-full items-center justify-center`}>
                <Text style={tw`text-sm font-bold`}>
                  {isCompleted || isActive ? (
                    <Check size={14} color="white" />
                  ) : (
                    <Text style={{ color: textMuted }}>{index + 1}</Text>
                  )}
                </Text>
              </View>
              <Text style={{ color: isActive || isCompleted ? colors.gold : textMuted }}>{step}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderStep1 = () => (
    <View style={tw`px-6`}>
      <View style={tw`mb-6`}>
        <Text style={tw`text-2xl font-black mb-2`}>Basic Information</Text>
        <Text style={[tw`text-sm`, { color: textMuted }]}>Start with a catchy title and description</Text>
      </View>

      <View style={tw`mb-6`}>
        <Text style={[tw`text-sm font-bold mb-2`, { color: text }]}>Title</Text>
        <TextInput
          style={tw`h-12 rounded-xl px-4 text-base font-normal bg-white border border-gray-200`}
          placeholder="E.g., Luxury Bentley Continental"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />
        <View style={tw`flex-row justify-between mt-1`}>
          <Text style={[tw`text-xs`, { color: textMuted }]}>What makes this item special?</Text>
          <Text style={[tw`text-xs`, { color: textMuted }]}>{title.length}/100</Text>
        </View>
      </View>

      <View>
        <Text style={[tw`text-sm font-bold mb-2`, { color: text }]}>Description</Text>
        <TextInput
          style={tw`h-32 rounded-xl px-4 py-3 text-base font-normal bg-white border border-gray-200`
          }
          placeholder="Describe the item in detail..."
          value={description}
          onChangeText={setDescription}
          multiline={true}
          textAlignVertical="top"
          maxLength={500}
        />
        <View style={tw`flex-row justify-between mt-1`}>
          <Text style={[tw`text-xs`, { color: textMuted }]}>Include key features and condition</Text>
          <Text style={[tw`text-xs`, { color: textMuted }]}>{description.length}/500</Text>
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={tw`px-6`}>
      <View style={tw`mb-6`}>
        <Text style={tw`text-2xl font-black mb-2`}>Location & Pricing</Text>
        <Text style={[tw`text-sm`, { color: textMuted }]}>Set the location and your asking price</Text>
      </View>

      <View style={tw`mb-6`}>
        <Text style={[tw`text-sm font-bold mb-2`, { color: text }]}>Location</Text>
        <View style={tw`h-12 rounded-xl px-4 flex-row items-center justify-center bg-white border border-gray-200`}>
          <MapPin size={18} color={colors.gold} style={tw`mr-3`} />
          <TextInput
            style={tw`flex-1`
            }
            placeholder="Enter address or city..."
            value={location}
            onChangeText={setLocation}
          />
        </View>
      </View>

      <View>
        <Text style={[tw`text-sm font-bold mb-2`, { color: text }]}>Asking Price</Text>
        <View style={tw`h-12 rounded-xl px-4 flex-row items-center bg-white border border-gray-200`}>
          <DollarSign size={18} color={colors.gold} style={tw`mr-3`} />
          <TextInput
            style={tw`flex-1 text-lg font-bold`
            }
            placeholder="0.00"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={tw`px-6`}>
      <View style={tw`mb-6`}>
        <Text style={tw`text-2xl font-black mb-2`}>Add Photos</Text>
        <Text style={[tw`text-sm`, { color: textMuted }]}>Show your item from its best angle - up to 10 photos</Text>
      </View>

      <View style={tw`flex-row flex-wrap gap-3`}>
        {images.map((image, index) => (
          <View
            key={index}
            style={tw`w-[118px] h-[118px] rounded-xl relative bg-gray-100 border-2 border-dashed border-gray-300`}
          >
            <ImageIcon size={24} color={colors.gold} style={tw`absolute inset-0 m-auto`} />
            <TouchableOpacity
              style={tw`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 items-center justify-center`}
              onPress={() => {
                setImages(images.filter((_, i) => i !== index));
              }}
            >
              <X size={12} color="white" />
            </TouchableOpacity>
          </View>
        ))}

        {images.length < 10 && (
          <TouchableOpacity
            style={tw`w-[118px] h-[118px] rounded-xl border-2 border-dashed border-gray-300 items-center justify-center`}
            onPress={() => Alert.alert('Photo Upload', 'Photo picker would open here')}
          >
            <View style={tw`w-10 h-10 rounded-full bg-gray-50 items-center justify-center`}>
              <Camera size={20} color={colors.gold} />
            </View>
            <Text style={[tw`text-xs mt-2`, { color: textMuted }]}>Add Photo</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={tw`px-6`}>
      <View style={tw`mb-6`}>
        <Text style={tw`text-2xl font-black mb-2`}>Review Your Listing</Text>
        <Text style={[tw`text-sm`, { color: textMuted }]}>Check all details before publishing</Text>
      </View>

      <View style={tw`rounded-2xl overflow-hidden border border-gray-200`}>
        <View style={tw`p-4 bg-gray-50 border-b border-gray-200`}>
          <Text style={tw`text-lg font-bold`}>Summary</Text>
        </View>

        <View style={tw`p-5 gap-4`}>
          <View>
            <Text style={[tw`text-xs font-bold uppercase mb-1`, { color: textMuted }]}>Title</Text>
            <Text style={tw`text-sm font-normal`}>{title || 'Not provided'}</Text>
          </View>

          {description && (
            <View>
              <Text style={[tw`text-xs font-bold uppercase mb-1`, { color: textMuted }]}>Description</Text>
              <Text style={tw`text-sm font-normal`}>{description.substring(0, 50)}...</Text>
            </View>
          )}

          {location && (
            <View>
              <Text style={[tw`text-xs font-bold uppercase mb-1`, { color: textMuted }]}>Location</Text>
              <Text style={tw`text-sm font-normal`}>{location}</Text>
            </View>
          )}

          {price && (
            <View>
              <Text style={[tw`text-xs font-bold uppercase mb-1`, { color: textMuted }]}>Price</Text>
              <Text style={tw`text-sm font-normal`}>${price}</Text>
            </View>
          )}

          {images.length > 0 && (
            <View>
              <Text style={[tw`text-xs font-bold uppercase mb-1`, { color: textMuted }]}>Photos</Text>
              <Text style={tw`text-sm font-normal`}>{images.length} photo{images.length !== 1 ? 's' : ''} uploaded</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return title.trim().length > 0 && description.trim().length > 0;
      case 2: return location.trim().length > 0 && price.trim().length > 0;
      case 3: return images.length > 0;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1`}>
      <View style={[tw`flex-1`, { backgroundColor: bg }]}>
        <View style={[tw`px-6 pt-16 pb-6 flex-row items-center justify-between`, { borderBottomWidth: 1, borderBottomColor: border }]}>
          <TouchableOpacity
            style={tw`p-2.5 rounded-full`}
            onPress={() => onViewChange('home')}
          >
            <ArrowLeft size={20} color={colors.gold} />
          </TouchableOpacity>
          <Text style={tw`text-xl font-black`}>New Listing</Text>
          <View style={tw`w-8`}>
          </View>
        </View>

        {renderStepIndicator()}

        <View style={tw`flex-1`}>{renderContent()}</View>

        <View style={[tw`px-6 pb-8 pt-4`, { backgroundColor: surface, borderTopWidth: 1, borderTopColor: border }]}>
          <View style={tw`flex-row gap-4`}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={tw`flex-1 h-12 rounded-full bg-gray-100 items-center justify-center`}
                onPress={() => setCurrentStep(currentStep - 1)}
              >
                <Text style={tw`text-sm font-bold`}>Back</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={tw`flex-1 h-12 rounded-full items-center justify-center`}
              onPress={() => {
                if (currentStep < 4) {
                  setCurrentStep(currentStep + 1);
                } else {
                  handleSubmit();
                }
              }}
              disabled={!canProceed() || isSubmitting}
            >
              <View
                style={[tw`flex-1 rounded-full items-center justify-center w-full h-full`,
                { backgroundColor: !canProceed() || isSubmitting ? colors.goldLight : colors.gold, opacity: !canProceed() || isSubmitting ? 0.5 : 1 }
                ]}>
                <Text style={tw`text-sm font-bold text-white`}>{isSubmitting ? 'Creating...' : currentStep === 4 ? 'Create Listing' : 'Next'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
