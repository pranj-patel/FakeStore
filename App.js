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
import { useSelector } from 'react-redux';

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
  const cartItemsCount = useSelector(state => state.cart.items.reduce((count, item) => count + item.quantity, 0));

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

            return (
              <View style={{ position: 'relative' }}>
                <Icon name={iconName} size={size} color={color} />
                {route.name === 'Shopping Cart' && cartItemsCount > 0 && (
                  <View style={{
                    position: 'absolute',
                    backgroundColor: 'red',
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    top: -5,
                    right: -10,
                  }}>
                    <Text style={{ color: 'white', fontSize: 12 }}>{cartItemsCount}</Text>
                  </View>
                )}
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
        })}
        tabBarOptions={{
          activeTintColor: '#3498db',
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
