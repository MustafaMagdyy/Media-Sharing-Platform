import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useUser } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import { logoutUser } from '../services/api';

const Header = () => {
  const { user, setUser } = useUser();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Media Sharing Platform</Text>
      <View style={styles.nav}>
        {user ? (
          <>
            <Text>Welcome, {user.name}</Text>
            <Button title="Logout" onPress={handleLogout} />
          </>
        ) : (
          <>
            <Button title="Login" onPress={() => navigation.navigate('Login')} />
            <Button title="Signup" onPress={() => navigation.navigate('Signup')} />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#333',
    padding: 16,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    marginBottom: 8,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default Header;
