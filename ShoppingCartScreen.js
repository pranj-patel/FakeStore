import React from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';

const ShoppingCartScreen = ({ route, navigation }) => {
  // Extract cartItems from route.params or use an empty array as default
  const cartItems = route.params?.cartItems || [];

  // Function to handle removing an item from the cart
  const handleRemoveItem = (itemId) => {
    // Filter out the item with the given itemId from cartItems
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    // Update the cartItems in route.params to reflect the updated cart state
    navigation.setParams({ cartItems: updatedCartItems });
  };

  // Calculate total price of all items in the cart
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping Cart</Text>
      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text>{item.title}</Text>
              <Text>Quantity: {item.quantity}</Text>
              <Text>Price: ${item.price.toFixed(2)}</Text>
              <Button
                title="Remove"
                onPress={() => handleRemoveItem(item.id)}
                color="red"
              />
            </View>
          )}
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
              // Implement your checkout logic here (navigate to payment screen, etc.)
              // For demonstration, show an alert message
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
    justifyContent: 'space-between',
    alignItems: 'center',
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