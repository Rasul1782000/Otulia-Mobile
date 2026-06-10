import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { EyeOff, Eye, User as UserIcon } from 'lucide-react-native';
import { ViewState } from '../types';
import { colors } from '../theme';
import Svg, { Rect, Path } from 'react-native-svg';
import tw from 'twrnc';
import { login, register, googleLogin, setAuthToken } from '../lib/api';

function MailIcon({ size = 16, color = '#a1a1aa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Rect width={20} height={16} x={2} y={4} rx={2} />
      <Path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </Svg>
  );
}

function LockIcon({ size = 16, color = '#a1a1aa' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Rect width={18} height={11} x={3} y={11} rx={2} ry={2} />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Svg>
  );
}

function AppleIcon({ size = 20, color = '#000000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 256 315">
      <Path 
        d="M213.803 167.03c.442 47.58 41.74 63.413 42.147 63.615-.35 1.116-6.599 22.563-21.757 44.716-13.104 19.153-26.705 38.235-48.13 38.63-21.05.388-27.82-12.483-51.888-12.483-24.073 0-31.58 12.085-51.517 12.87-20.68.783-36.428-20.71-49.64-39.793C5.834 240.52-12.277 178.26 10.51 138.745c11.305-19.622 31.49-32.043 53.434-32.358 16.58-.322 32.19 11.156 42.316 11.156 10.125 0 29.01-13.85 49.27-11.755 8.472.35 32.285 3.414 47.59 25.832-1.224.76-28.51 16.602-28.217 49.41M175.17 74.194c9.066-10.993 15.172-26.248 13.5-41.512-13.112.53-29.06 8.706-38.467 19.705-8.44 9.74-15.825 25.307-13.826 40.228 14.62 1.138 29.728-7.427 38.793-18.42" 
        fill={color}
      />
    </Svg>
  );
}

function FacebookIcon({ size = 20, color = '#1877F2' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </Svg>
  );
}

function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </Svg>
  );
}

interface AuthViewProps {
  onViewChange: (v: ViewState) => void;
  onLoginSuccess?: (user: any) => void;
}

export function AuthView({ onViewChange, onLoginSuccess }: AuthViewProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleAppleLogin = async () => {
    setMessage(null);
    try {
      const appleClientId = import.meta.env.VITE_APPLE_CLIENT_ID;
      if (!appleClientId) {
        setMessage({ type: 'error', text: 'Apple login is not configured.' });
        return;
      }
      setMessage({ type: 'success', text: 'Apple sign-in coming soon.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Apple login failed.' });
    }
  };

  const handleFacebookLogin = async () => {
    setMessage(null);
    try {
      const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID;
      if (!facebookAppId) {
        setMessage({ type: 'error', text: 'Facebook login is not configured.' });
        return;
      }
      setMessage({ type: 'success', text: 'Facebook sign-in coming soon.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Facebook login failed.' });
    }
  };

  const handleGoogleLogin = async () => {
    setMessage(null);
    setLoading(true);
    try {
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!googleClientId) {
        setMessage({ type: 'error', text: 'Google login is not configured.' });
        setLoading(false);
        return;
      }
      const response = await googleLogin({
        email: email.trim() || 'google.user@example.com',
        full_name: fullName.trim() || 'Google User',
        googleId: 'google_' + Date.now(),
      });
      if (response.success) {
        if (response.token) setAuthToken(response.token);
        if (onLoginSuccess) {
          onLoginSuccess({
            id: String(response.user.id),
            name: response.user.full_name,
            email: response.user.email,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256',
            isVerified: true,
            type: 'buyer',
          });
        }
        setMessage({ type: 'success', text: 'Signed in with Google.' });
        setTimeout(() => onViewChange('home'), 600);
      } else {
        setMessage({ type: 'error', text: response.message || 'Google login failed.' });
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Google login failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setMessage(null);
    if (activeTab === 'signup' && !fullName.trim()) {
      setMessage({ type: 'error', text: 'Full name is required.' });
      return;
    }
    if (!email.trim() || !password.trim()) {
      setMessage({ type: 'error', text: 'Email and password are required.' });
      return;
    }

    setLoading(true);
    try {
      if (activeTab === 'signin') {
        const response = await login({ email: email.trim(), password: password.trim() });
        if (response.success) {
          setMessage({ type: 'success', text: response.message || 'Signed in successfully.' });
          if (response.token) setAuthToken(response.token);
          
          if (onLoginSuccess) {
            onLoginSuccess({
              id: String(response.user.id),
              name: response.user.full_name,
              email: response.user.email,
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256',
              isVerified: true,
              type: 'buyer',
            });
          }
          
          setTimeout(() => {
            onViewChange('home');
          }, 600);
        } else {
          setMessage({ type: 'error', text: response.message || 'Login failed.' });
        }
      } else {
        const response = await register({
          full_name: fullName.trim(),
          email: email.trim(),
          password: password.trim(),
        });
        
        if (response.success) {
          setMessage({ type: 'success', text: 'Account created! Logging you in...' });
          if (response.token) setAuthToken(response.token);
          
          if (onLoginSuccess) {
            onLoginSuccess({
              id: String(response.user.id),
              name: response.user.full_name,
              email: response.user.email,
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256',
              isVerified: true,
              type: 'buyer',
            });
          }
          
          setTimeout(() => {
            onViewChange('home');
          }, 600);
        } else {
          setMessage({ type: 'error', text: response.message || 'Registration failed.' });
        }
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={tw`flex-1`}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Full-screen background */}
      <View style={[StyleSheet.absoluteFill]}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800' }}
          style={tw`w-full h-full`}
          resizeMode="cover"
        />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.55)' }]} />
      </View>

      {/* Centered scroll content */}
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`flex-grow justify-center px-5 py-8`}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Card */}
        <View style={[tw`bg-white rounded-3xl shadow-2xl`, { elevation: 24, padding: 20 }]}>

          {/* Logo inside card */}
          <View style={tw`items-center mb-4`}>
            <Image
              source={require('../images/assets/Otulia logo.jpeg')}
              style={tw`w-14 h-14 mb-1`}
              resizeMode="contain"
            />
            <Text style={[tw`text-xl font-black`, { letterSpacing: 7, color: '#000000' }]}>OTULIA</Text>
            <Text style={[tw`text-[8px] font-black mt-0.5`, { letterSpacing: 2.5, color: '#000000', fontWeight: '900' }]}>ALL IN ONE LUXURY MARKETPLACE</Text>
          </View>

          {/* Message Banner */}
          {message && (
            <View style={[
              tw`p-3 rounded-xl mb-4 border flex-row items-center gap-2`,
              message.type === 'error' 
                ? { backgroundColor: '#fef2f2', borderColor: '#fee2e2' }
                : { backgroundColor: '#f0fdf4', borderColor: '#dcfce7' }
            ]}>
              <View style={[
                tw`w-2 h-2 rounded-full`, 
                message.type === 'error' ? { backgroundColor: '#ef4444' } : { backgroundColor: '#22c55e' }
              ]} />
              <Text style={[
                tw`text-[10px] font-black flex-1`, 
                message.type === 'error' ? { color: '#991b1b' } : { color: '#166534' }
              ]}>
                {message.text}
              </Text>
            </View>
          )}

          {/* Tabs */}
          <View style={tw`flex-row mb-4 relative`}>
            <TouchableOpacity style={tw`flex-1 pb-2.5 items-center`} onPress={() => { setActiveTab('signin'); setMessage(null); }}>
              <Text style={[tw`text-sm font-black`, activeTab === 'signin' ? { color: '#18181b' } : { color: '#a1a1aa' }]}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tw`flex-1 pb-2.5 items-center`} onPress={() => { setActiveTab('signup'); setMessage(null); }}>
              <Text style={[tw`text-sm font-black`, activeTab === 'signup' ? { color: '#18181b' } : { color: '#a1a1aa' }]}>Sign Up</Text>
            </TouchableOpacity>
            <View style={[tw`absolute bottom-0 left-0 right-0 h-[1px]`, { backgroundColor: '#f4f4f5' }]} />
            <View style={[tw`absolute bottom-0 w-1/2 h-[2px]`, { backgroundColor: colors.gold }, activeTab === 'signup' ? { left: '50%' } : { left: 0 }]} />
          </View>

          {activeTab === 'signup' && (
            <>
              <Text style={tw`text-[10px] font-black text-zinc-900 mb-1.5`}>Full Name</Text>
              <View style={tw`flex-row items-center border border-zinc-100 rounded-xl px-3 py-2.5 gap-2 bg-zinc-50 mb-3`}>
                <UserIcon size={14} color="#a1a1aa" />
                <TextInput
                  placeholder="Enter your full name"
                  placeholderTextColor="#a1a1aa"
                  value={fullName}
                  onChangeText={setFullName}
                  style={tw`flex-1 text-xs text-zinc-900 font-black`}
                  autoCapitalize="words"
                />
              </View>
            </>
          )}

          {/* Email */}
          <Text style={tw`text-[10px] font-black text-zinc-900 mb-1.5`}>Email Address</Text>
          <View style={tw`flex-row items-center border border-zinc-100 rounded-xl px-3 py-2.5 gap-2 bg-zinc-50`}>
            <MailIcon size={14} />
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#a1a1aa"
              value={email}
              onChangeText={setEmail}
              style={tw`flex-1 text-xs text-zinc-900 font-black`}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <Text style={tw`text-[10px] font-black text-zinc-900 mb-1.5 mt-3`}>Password</Text>
          <View style={tw`flex-row items-center border border-zinc-100 rounded-xl px-3 py-2.5 gap-2 bg-zinc-50`}>
            <LockIcon size={14} />
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#a1a1aa"
              value={password}
              onChangeText={setPassword}
              style={tw`flex-1 text-xs text-zinc-900 font-black`}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? <Eye size={14} color="#a1a1aa" /> : <EyeOff size={14} color="#a1a1aa" />}
            </TouchableOpacity>
          </View>

          {activeTab === 'signin' && (
            <TouchableOpacity style={tw`self-end mt-2`}>
              <Text style={tw`text-[10px] font-black text-zinc-900 underline`}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          {/* Submit */}
          <TouchableOpacity
            style={[tw`rounded-xl py-3 items-center mt-4 shadow-md flex-row justify-center gap-2`, { backgroundColor: '#111113' }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading && <ActivityIndicator size="small" color="#ffffff" />}
            <Text style={tw`text-white text-sm font-black`}>
              {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={tw`flex-row items-center my-4`}>
            <View style={tw`flex-1 h-[1px] bg-zinc-100`} />
            <Text style={tw`text-[9px] text-zinc-400 px-3 font-black`}>or continue with</Text>
            <View style={tw`flex-1 h-[1px] bg-zinc-100`} />
          </View>

          {/* Social */}
          <View style={tw`flex-row justify-center gap-3`}>
            <TouchableOpacity style={tw`w-11 h-11 rounded-full border border-zinc-100 items-center justify-center bg-white shadow-sm`} onPress={handleGoogleLogin} disabled={loading}>
              <GoogleIcon size={16} />
            </TouchableOpacity>
            <TouchableOpacity style={tw`w-11 h-11 rounded-full border border-zinc-100 items-center justify-center bg-white shadow-sm`} onPress={handleAppleLogin} disabled={loading}>
              <AppleIcon size={17} />
            </TouchableOpacity>
            <TouchableOpacity style={tw`w-11 h-11 rounded-full border border-zinc-100 items-center justify-center bg-white shadow-sm`} onPress={handleFacebookLogin} disabled={loading}>
              <FacebookIcon size={17} />
            </TouchableOpacity>
          </View>

          {activeTab === 'signup' && (
            <Text style={tw`text-[8px] text-zinc-400 text-center mt-4 font-black px-4`}>
              By creating an account, you agree to our{' '}
              <Text style={tw`text-zinc-600 underline`}>Terms of Service</Text> and{' '}
              <Text style={tw`text-zinc-600 underline`}>Privacy Policy</Text>.
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

