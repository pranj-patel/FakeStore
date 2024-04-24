import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import SplashScreen from './SplashScreen';
import CategoryScreen from './CategoryScreen';
import ProductListScreen from './ProductListScreen';
import ProductDetailScreen from './ProductDetailScreen';
import ShoppingCartScreen from './ShoppingCartScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainStack = () => (
  <Stack.Navigator initialRouteName="CategoryScreen">
    <Stack.Screen
      name="CategoryScreen"
      component={CategoryScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ProductListScreen"
      component={ProductListScreen}
      options={({ route }) => ({ title: route.params?.category || 'Products' })}
    />
    <Stack.Screen
      name="ProductDetailScreen"
      component={ProductDetailScreen}
      options={{ title: 'Product Details' }}
    />
  </Stack.Navigator>
);

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false); // Hide the splash screen after 1 second
    }, 1000);

    return () => clearTimeout(timer); // Cleanup the timer on unmounting
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Shopping Cart') {
              iconName = focused ? 'cart' : 'cart-outline';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarLabel: ({ focused, color }) => {
            let label;

            if (route.name === 'Home') {
              label = 'Home';
            } else if (route.name === 'Shopping Cart') {
              label = 'Cart';
            }

            return <Text style={{ color }}>{label}</Text>;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'blue',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Home" component={MainStack} />
        <Tab.Screen name="Shopping Cart" component={ShoppingCartScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
