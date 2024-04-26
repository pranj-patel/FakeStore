import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShoppingCartScreen = ({ route, navigation }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const storedCartItems = await AsyncStorage.getItem('cartItems');
        if (storedCartItems) {
          setCartItems(JSON.parse(storedCartItems));
        }
      } catch (error) {
        console.error('Error loading cart items from AsyncStorage:', error);
      }
    };

    loadCartItems();
  }, []);

  const handleRemoveItem = async (itemId) => {
    const updatedCartItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCartItems);
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    } catch (error) {
      console.error('Error saving cart items to AsyncStorage:', error);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCartItems);
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    } catch (error) {
      console.error('Error saving cart items to AsyncStorage:', error);
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.itemDetails}>
        <Text>{item.title}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, Math.max(item.quantity - 1, 0))}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <Text>Price: ${(item.price * item.quantity).toFixed(2)}</Text>
      </View>
      <Button title="Remove" onPress={() => handleRemoveItem(item.id)} color="red" />
    </View>
  );

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping Cart</Text>
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
            title="Proceed to Checkout"
            onPress={() => {
              alert('Proceed to checkout!');
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  quantityButton: {
    backgroundColor: '#DDDDDD',
    padding: 8,
    borderRadius: 5,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#555555',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  totalContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#DDDDDD',
    paddingTop: 10,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ShoppingCartScreen;
