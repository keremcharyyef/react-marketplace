import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types';
import { useApp } from '../../context/AppContext';
import { CURRENT_USER } from '../../data/mockData';
import { generateId } from '../../utils/helpers';

type Nav = NativeStackNavigationProp<AuthStackParamList>;

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { dispatch } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    dispatch({
      type: 'LOGIN',
      user: {
        ...CURRENT_USER,
        id: generateId(),
        name: name || CURRENT_USER.name,
        email: email || CURRENT_USER.email,
        university: university || CURRENT_USER.university,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.nav}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
            </TouchableOpacity>
          </View>

          <View style={styles.titleSection}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join your campus marketplace</Text>
          </View>

          {[
            { label: 'Full Name', value: name, setter: setName, placeholder: 'Jordan Lee', icon: 'person-outline', keyboard: 'default' as const },
            { label: 'University Email', value: email, setter: setEmail, placeholder: 'you@university.edu', icon: 'mail-outline', keyboard: 'email-address' as const },
            { label: 'University', value: university, setter: setUniversity, placeholder: 'State University', icon: 'school-outline', keyboard: 'default' as const },
            { label: 'Password', value: password, setter: setPassword, placeholder: '••••••••', icon: 'lock-closed-outline', keyboard: 'default' as const },
          ].map(field => (
            <View key={field.label} style={styles.field}>
              <Text style={styles.label}>{field.label}</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name={field.icon as any} size={18} color="#aaa" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={field.value}
                  onChangeText={field.setter}
                  placeholder={field.placeholder}
                  placeholderTextColor="#bbb"
                  keyboardType={field.keyboard}
                  autoCapitalize={field.keyboard === 'email-address' ? 'none' : 'words'}
                  secureTextEntry={field.label === 'Password'}
                />
              </View>
            </View>
          ))}

          <Text style={styles.terms}>
            By signing up, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>

          <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
            <Text style={styles.registerBtnText}>Create Account</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { flexGrow: 1, paddingHorizontal: 24 },
  nav: { paddingTop: 12, marginBottom: 24 },
  titleSection: { marginBottom: 28 },
  title: { fontSize: 28, fontWeight: '800', color: '#1a1a1a' },
  subtitle: { fontSize: 15, color: '#888', marginTop: 6 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#1a1a1a' },
  terms: { fontSize: 13, color: '#888', textAlign: 'center', lineHeight: 20, marginBottom: 24, marginTop: 8 },
  termsLink: { color: '#4CAF50', fontWeight: '600' },
  registerBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  registerBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  footer: { flexDirection: 'row', justifyContent: 'center', paddingBottom: 24 },
  footerText: { fontSize: 15, color: '#888' },
  loginLink: { fontSize: 15, color: '#4CAF50', fontWeight: '700' },
});
