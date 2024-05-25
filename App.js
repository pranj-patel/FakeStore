import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import SplashScreen from './SplashScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import ProductListScreen from './src/screens/ProductListScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import ShoppingCartScreen from './src/screens/ShoppingCartScreen';
import MyOrdersScreen from './src/screens/MyOrdersScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import cartReducer from './src/redux/cartSlice';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

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

const TabIcon = ({ route, focused, color, size }) => {
  let iconName;

  if (route.name === 'Home') {
    iconName = focused ? 'home' : 'home-outline';
  } else if (route.name === 'Shopping Cart') {
    iconName = focused ? 'cart' : 'cart-outline';
  } else if (route.name === 'My Orders') {
    iconName = focused ? 'list' : 'list-outline';
  } else if (route.name === 'User Profile') {
    iconName = focused ? 'person' : 'person-outline';
  }

  return (
    <View style={{ position: 'relative' }}>
      <Icon name={iconName} size={size} color={color} />
    </View>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => (
              <TabIcon route={route} focused={focused} color={color} size={size} />
            ),
            tabBarLabel: ({ focused, color }) => {
              let label;

              if (route.name === 'Home') {
                label = 'Home';
              } else if (route.name === 'Shopping Cart') {
                label = 'Cart';
              } else if (route.name === 'My Orders') {
                label = 'Orders';
              } else if (route.name === 'User Profile') {
                label = 'Profile';
              }

              return <Text style={{ color }}>{label}</Text>;
            },
            tabBarActiveTintColor: '#3498db',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen
            name="Home"
            component={MainStack}
            options={{ tabBarLabel: 'Home' }}
          />
          <Tab.Screen
            name="Shopping Cart"
            component={ShoppingCartScreen}
            options={() => {
              const itemCount = useSelector(state => state.cart.itemCount);
              return {
                tabBarLabel: 'Cart',
                tabBarBadge: itemCount > 0 ? itemCount.toString() : undefined,
              };
            }}
          />
          <Tab.Screen
            name="My Orders"
            component={MyOrdersScreen}
            options={{ tabBarLabel: 'Orders' }}
          />
          <Tab.Screen
            name="User Profile"
            component={UserProfileScreen}
            options={{ tabBarLabel: 'Profile' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
