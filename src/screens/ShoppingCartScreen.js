// ShoppingCartScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeItemFromCart, updateCartItemQuantity} from '../redux/cartSlice';

const ShoppingCartScreen = () => {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  const handleRemoveItem = (itemId) => {
    dispatch(removeItemFromCart(itemId));
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    dispatch(updateCartItemQuantity({ itemId, newQuantity }));
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text>{item.title}</Text>
      <Text>Price: ${item.price.toFixed(2)}</Text>
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
