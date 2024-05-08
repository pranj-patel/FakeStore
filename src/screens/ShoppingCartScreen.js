import React from 'react';
import { View, Text, StyleSheet, FlatList, Button, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeItemFromCart, updateCartItemQuantity } from '../redux/cartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const ShoppingCartScreen = () => {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  const handleRemoveItem = (itemId) => {
    dispatch(removeItemFromCart(itemId));
    updateCartInStorage(cartItems.filter(item => item.id !== itemId)); // Update cart in AsyncStorage
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      dispatch(removeItemFromCart(itemId));
      updateCartInStorage(cartItems.filter(item => item.id !== itemId)); // Update cart in AsyncStorage
    } else {
      const updatedCartItems = cartItems.map(item => {
        if (item.id === itemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      dispatch(updateCartItemQuantity({ itemId, newQuantity }));
      dispatch({ type: 'UPDATE_CART_ITEMS', payload: updatedCartItems }); // Dispatch action to update cartItems
      updateCartInStorage(updatedCartItems); // Update cart in AsyncStorage
    }
  };
  

  // Function to update cart in AsyncStorage
  const updateCartInStorage = async (updatedCartItems) => {
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    } catch (error) {
      console.error('Error updating cart in AsyncStorage:', error);
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>Price: ${item.price.toFixed(2)}</Text>
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
  const totalItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0); // Calculate total quantity of items

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
