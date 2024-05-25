import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newName, setNewName] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const navigation = useNavigation();

  const fetchUser = async () => {
    const storedName = await AsyncStorage.getItem('name');
    const storedEmail = await AsyncStorage.getItem('email');
    const storedToken = await AsyncStorage.getItem('token');

    if (storedName && storedEmail && storedToken) {
      setName(storedName);
      setEmail(storedEmail);
      setToken(storedToken);
      setUser({ name: storedName, email: storedEmail });
    } else {
      // Redirect to sign-in or sign-up screen if not authenticated
      navigation.navigate('User Profile'); // Navigate to your sign-in screen
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const signIn = async () => {
    try {
      const response = await axios.post('http://localhost:3000/users/signin', { email, password });
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('email', response.data.email);
      await AsyncStorage.setItem('name', response.data.name);
      await AsyncStorage.setItem('id', response.data.id);
      setUser(response.data);
      navigation.navigate('CategoryScreen');
    } catch (error) {
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  const signUp = async () => {
    try {
      const response = await axios.post('http://localhost:3000/users/signup', { name, email, password });
      await AsyncStorage.setItem('email', response.data.email);
      await AsyncStorage.setItem('name', response.data.name);
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('id', response.data.id);
      setUser(response.data);
      navigation.navigate('CategoryScreen');
    } catch (error) {
      Alert.alert('Error', 'Sign up failed');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('email');
    await AsyncStorage.removeItem('name');
    setUser(null);
  };

  const handleUpdateProfile = async () => {
    if (!newName || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/users/update', {
        name: newName,
        password,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        await AsyncStorage.setItem('name', newName);
        setName(newName);
        setUser(prevUser => ({
          ...prevUser,
          name: newName,
        }));
        Alert.alert('Success', 'Profile updated successfully.');
        setIsUpdating(false);
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <View style={styles.userInfoContainer}>
          {!isUpdating ? (
            <View>
              <Text style={styles.userInfoText}>User Name: <Text style={styles.userInfoValue}>{user.name}</Text></Text>
              <Text style={styles.userInfoText}>Email: <Text style={styles.userInfoValue}>{user.email}</Text></Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => setIsUpdating(true)}>
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={logout}>
                  <Text style={styles.buttonText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.updateContainer}>
              <TextInput
                style={styles.input}
                placeholder="New User Name"
                value={newName}
                onChangeText={setNewName}
              />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.confirmButton} onPress={handleUpdateProfile}>
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setIsUpdating(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          {isSignUp && (
            <TextInput
              placeholder="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
          )}
          <TouchableOpacity style={styles.button} onPress={isSignUp ? signUp : signIn}>
            <Text style={styles.buttonText}>{isSignUp ? "Sign Up" : "Sign In"}</Text>
          </TouchableOpacity>
          <Text style={styles.toggleText} onPress={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Already have an account? Sign In" : "New customer? Sign Up"}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  userInfoContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  userInfoText: {
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  userInfoValue: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  toggleText: {
    marginTop: 15,
    textAlign: 'center',
    color: 'blue',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '48%',
  },
  confirmButton: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '48%',
  },
  cancelButton: {
    backgroundColor: '#DC3545',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '48%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  updateContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 6,
  },
});

export default UserProfileScreen;
