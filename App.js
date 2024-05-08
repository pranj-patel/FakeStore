import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import SplashScreen from './SplashScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import ProductListScreen from './src/screens/ProductListScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import ShoppingCartScreen from './src/screens/ShoppingCartScreen';
import { Provider, useSelector } from 'react-redux'; // Import useSelector
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './src/redux/cartSlice';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const store = configureStore({
  reducer: {
    cart: cartReducer,
    // Add other reducers here if needed
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
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Shopping Cart') {
                iconName = focused ? 'cart' : 'cart-outline';
              }

              return (
                <View style={{ position: 'relative' }}>
                  <Icon name={iconName} size={size} color={color} />
                </View>
              );
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
            tabBarActiveTintColor: '#3498db',
            tabBarInactiveTintColor: 'gray',
          })}
          tabBarOptions={false} // Disable tabBarOptions (deprecated)
        >
          <Tab.Screen
            name="Home"
            component={MainStack}
            options={{ tabBarLabel: 'Home' }}
          />
          <Tab.Screen
            name="Shopping Cart"
            component={ShoppingCartScreen}
            options={({ navigation }) => ({
              tabBarLabel: 'Cart',
              tabBarBadge: useSelector(state => state.cart.itemCount.toString()), // Use useSelector to get item count dynamically
            })}
          />

        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
