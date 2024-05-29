import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Image, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeItemFromCart, updateCartItemQuantity, storeApiData } from '../redux/cartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ShoppingCartScreen = () => {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  const handleRemoveItem = async (itemId) => {
    const updatedCartItems = cartItems.filter(item => item.id !== itemId);
    dispatch(removeItemFromCart(itemId));
    await updateCartInStorage(updatedCartItems);
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0);

    dispatch(updateCartItemQuantity({ itemId, newQuantity }));
    await updateCartInStorage(updatedCartItems);
  };

  const updateCartInStorage = async (updatedCartItems) => {
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      await syncCartWithServer(updatedCartItems);
    } catch (error) {
      console.error('Error updating cart in AsyncStorage:', error);
    }
  };

  const syncCartWithServer = async (items) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.put('http://localhost:3000/cart', { items }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status !== 200) {
        console.error('Error syncing cart with server:', response.status);
      }
    } catch (error) {
      console.error('Error syncing cart with server:', error);
    }
  };

  const placeOrder = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'Authentication token is missing.');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      Alert.alert('Error', 'Cart is empty.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/orders/neworder', { items: cartItems }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Order is placed successfully.');
        await AsyncStorage.removeItem('cartItems');
        dispatch(storeApiData([]));
        await fetchOrders(token);
      } else {
        Alert.alert('Error', 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again later.');
    }
  };

  const fetchOrders = async (token) => {
    try {
      const response = await axios.get('http://localhost:3000/orders/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      console.log('Orders data:', data); // Log the response data for debugging

      // Ensure data.orders is defined and is an array
      const orders = data.orders || [];

      const parsedOrders = orders.map(order => ({
        ...order,
        order_items: JSON.parse(order.order_items),
      }));

      const newOrders = parsedOrders.filter(order => order.is_paid === 0 && order.is_delivered === 0);
      dispatch({ type: 'SET_ORDER_COUNT', payload: newOrders.length });
    } catch (error) {
      console.error('Error fetching orders:', error.response ? error.response.data : error.message);
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>Price: ${Number(item.price).toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <Button title="-" onPress={() => handleQuantityChange(item.id, Math.max(0, item.quantity - 1))} />
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <Button title="+" onPress={() => handleQuantityChange(item.id, item.quantity + 1)} />
        </View>
        <Button title="Remove" onPress={() => handleRemoveItem(item.id)} color="red" />
      </View>
    </View>
  );

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping Cart</Text>
      {cartItems.length > 0 && (
        <View style={styles.totalInfoContainer}>
          <Text style={styles.totalText}>Total Items: {totalItemsCount}</Text>
          <Text style={styles.totalText}>Total Cost: ${totalPrice.toFixed(2)}</Text>
        </View>
      )}
      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCartItem}
        />
      ) : (
        <Text style={styles.emptyText}>Your cart is empty</Text>
      )}
      {cartItems.length > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: ${totalPrice.toFixed(2)}</Text>
          <Button
            title="Checkout"
            onPress={placeOrder}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    marginBottom: 5,
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  totalContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 10,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  totalInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

export default ShoppingCartScreen;
