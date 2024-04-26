import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CategoryScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products/categories');
      const data = await response.json();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('ProductListScreen', { category });
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleCategoryPress(item)}
      style={[
        styles.categoryItem,
        selectedCategory === item && { backgroundColor: '#f0f0f0' } // Change background color when selected
      ]}
      onPressIn={() => setSelectedCategory(item)} // Set selected category on press
      onPressOut={() => setSelectedCategory(null)} // Clear selected category on press out
    >
      <Text style={styles.categoryText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Categories</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoryList}
        />
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
  },
  categoryList: {
    flexGrow: 1,
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CategoryScreen;
