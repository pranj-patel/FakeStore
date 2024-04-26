import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableHighlight, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProductListScreen = ({ route }) => {
  const { category } = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/category/${category}`);
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();

    // Customize navigation options to hide default header
    navigation.setOptions({
      headerShown: false,
    });

    // Clean up to restore default header on component unmount (if necessary)
    return () => {
      navigation.setOptions({
        headerShown: true,
      });
    };
  }, [category, navigation]);

  const handleProductPress = (productId) => {
    navigation.navigate('ProductDetailScreen', { productId });
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderProductItem = ({ item }) => (
    <TouchableHighlight
      onPress={() => handleProductPress(item.id)}
      underlayColor="#E0E0E0" // Color when pressed
      style={styles.productItem}
    >
      <>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productTitle}>{item.title}</Text>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        </View>
      </>
    </TouchableHighlight>
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{category}</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.productList}
        />
      )}
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  titleContainer: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  productList: {
    paddingBottom: 20,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2, // Add border width
    borderColor: '#CCCCCC', // Add border color,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#888888',
  },
  backButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default ProductListScreen;
