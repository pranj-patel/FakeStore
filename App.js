import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { TabActions } from '@react-navigation/native';

import SplashScreen from './SplashScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import ProductListScreen from './src/screens/ProductListScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import ShoppingCartScreen from './src/screens/ShoppingCartScreen';
import MyOrdersScreen from './src/screens/MyOrdersScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import cartReducer from './src/redux/cartSlice';
import authReducer from './src/redux/authSlice';
import ordersReducer from './src/redux/ordersSlice';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    orders: ordersReducer,
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

const AppContent = ({ navigationRef }) => {
  const [showSplash, setShowSplash] = useState(true);
  const Auth = useSelector(state => state.auth);
  const itemCount = useSelector(state => state.cart.itemCount);
  const newOrdersCount = useSelector(state => state.orders.newOrdersCount);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showSplash && !Auth.token && navigationRef.current) {
      navigationRef.current.navigate('User Profile');
    }
  }, [showSplash, Auth.token, navigationRef]);

  if (showSplash) {
    return <SplashScreen />;
  }

  const handleTabPress = (route, navigation) => {
    if (!Auth.token && ['Home', 'Shopping Cart', 'My Orders'].includes(route.name)) {
      Alert.alert(
        'Please Sign In',
        'You need to sign in to access this page.',
        [{ text: 'Sign In', onPress: () => navigation.dispatch(TabActions.jumpTo('User Profile')) }]
      );
      return false;
    }
    return true;
  };

  return (
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
      screenListeners={({ navigation, route }) => ({
        tabPress: e => {
          e.preventDefault();
          if (handleTabPress(route, navigation)) {
            navigation.navigate(route.name);
          }
        },
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
        options={{
          tabBarLabel: 'Cart',
          tabBarBadge: itemCount > 0 ? itemCount.toString() : undefined,
        }}
      />
      <Tab.Screen
        name="My Orders"
        component={MyOrdersScreen}
        options={{
          tabBarLabel: 'Orders',
          tabBarBadge: newOrdersCount > 0 ? newOrdersCount.toString() : undefined,
        }}
      />
      <Tab.Screen
        name="User Profile"
        component={UserProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  const navigationRef = useRef(null);

  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <AppContent navigationRef={navigationRef} />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
