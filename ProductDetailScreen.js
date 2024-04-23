import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Image, TouchableOpacity } from 'react-native';

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async (productId) => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        const data = await response.json();

        // Ensure the 'image' field is available in the product object
        const productWithImage = {
          ...data,
          image: data.image ? data.image : 'https://via.placeholder.com/200',
        };

        setProduct(productWithImage);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct(productId);
  }, [productId]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleAddToCart = () => {
    if (product) {
      // Retrieve the existing cartItems from route.params or initialize as an empty array
      const cartItems = route.params?.cartItems || [];
      
      // Check if the product is already in the cart based on its id
      const isProductInCart = cartItems.some(item => item.id === product.id);

      if (!isProductInCart) {
        // Add the product to the cartItems array
        const updatedCartItems = [...cartItems, { ...product, quantity: 1 }];
        // Navigate to ShoppingCartScreen and pass updated cartItems
        navigation.navigate('ShoppingCartScreen', { cartItems: updatedCartItems });
      } else {
        // Alert user that the product is already in the cart
        alert('This product is already in your cart.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : product ? (
        <>
          <Text style={styles.title}>{product.title}</Text>
          {product.image && (
            <Image source={{ uri: product.image }} style={styles.productImage} />
          )}
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.backButton]}
              onPress={handleBackPress}
            >
              <Text style={styles.buttonText}>Back to Products</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.addToCartButton]}
              onPress={handleAddToCart}
            >
              <Text style={styles.buttonText}>Add to Shopping Cart</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.errorText}>Product not found</Text>
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
    marginBottom: 10,
    textAlign: 'center',
    backgroundColor: '#007BFF',
    color: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
  },
  price: {
    fontSize: 20,
    marginBottom: 10,
    color: '#007BFF',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#007BFF',
  },
  addToCartButton: {
    backgroundColor: '#007BFF',
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    marginBottom: 20,
    borderRadius: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default ProductDetailScreen;
