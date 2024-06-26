import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../redux/cartSlice'; // Importing addItemToCart action
import axios from 'axios';

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch(); 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/${productId}`);
        const data = await response.json();

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

    fetchProduct();

    navigation.setOptions({
      headerShown: false,
    });

    return () => {
      navigation.setOptions({
        headerShown: true,
      });
    };
  }, [productId, navigation]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleAddToCart = async () => {
    if (product) {
      try {
        const storedCartItems = await AsyncStorage.getItem('cartItems');
        const cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];

        const existingItemIndex = cartItems.findIndex(item => item.id === product.id);

        if (existingItemIndex === -1) {
          // If the product is not in the cart, add it with quantity 1
          const updatedCartItems = [...cartItems, { ...product, quantity: 1 }];
          await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        } else {
          // If the product is already in the cart, update its quantity
          cartItems[existingItemIndex].quantity++;
          await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
        }

        // Dispatch action to add item to Redux store
        dispatch(addItemToCart({ ...product, quantity: 1 }));
  
        // Navigate to the shopping cart page
        navigation.navigate('Shopping Cart');
      } catch (error) {
        console.error('Error adding item to cart:', error);
      }
    }
  };

  const AddCartServer = async (product) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.put(`http://localhost:3000/cart`, {
        items: product
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        console.log('Success', 'Item added to Cart successfully.');
      } else {
        console.log('Error', 'Failed to Add');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false} // Disable vertical scroll indicator
      scrollEnabled={!loading} // Disable scrolling while loading
      keyboardShouldPersistTaps="handled" // Allow tapping on components without dismissing keyboard
    >
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : product ? (
        <>
          <Text style={styles.title}>{product.title}</Text>
          {product.image && (
            <Image source={{ uri: product.image }} style={styles.productImage} />
          )}
          <Text style={styles.price}>Price: ${product.price.toFixed(2)}</Text>
          <Text style={styles.rating}>Rating: {product.rating.rate} ({product.rating.count} reviews)</Text>
          <Text style={styles.sold}>Sold: {product.rating.count}</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <ScrollView style={styles.descriptionScrollView}>
              <Text style={styles.descriptionText}>{product.description}</Text>
            </ScrollView>
          </View>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    minHeight: Platform.OS === 'ios' ? '100%' : undefined, // Ensure full height on iOS
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    backgroundColor: '#3498db',
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
  rating: {
    fontSize: 16,
    marginBottom: 10,
    color: '#001d3d',
    textAlign: 'center',
  },
  sold: {
    fontSize: 16,
    marginBottom: 20,
    color: '#001d3d',
    textAlign: 'center',
  },
  descriptionContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 5,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionScrollView: {
    maxHeight: 150,
  },
  descriptionText: {
    fontSize: 16,
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
    backgroundColor: '#3498db',
  },
  addToCartButton: {
    backgroundColor: '#3498db',
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
