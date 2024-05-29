import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet, FlatList, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { setNewOrdersCount } from '../redux/ordersSlice';

const MyOrdersScreen = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const dispatch = useDispatch();

    const loadOrders = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/orders/all', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data;
            const parsedOrders = data.orders.map(order => ({
                ...order,
                order_items: JSON.parse(order.order_items),
            }));

            setOrders(parsedOrders);
            categorizeOrders(parsedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error.response?.data || error.message);
            Alert.alert('Error', 'Failed to load orders. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadOrders();
        }, [])
    );

    useEffect(() => {
        loadOrders();
    }, []);

    const categorizeOrders = (orders) => {
        const newOrders = orders.filter(order => order.is_paid === 0 && order.is_delivered === 0);
        const paidOrders = orders.filter(order => order.is_paid === 1 && order.is_delivered === 0);
        const deliveredOrders = orders.filter(order => order.is_delivered === 1);
        
        dispatch(setNewOrdersCount(newOrders.length));

        return { newOrders, paidOrders, deliveredOrders };
    };

    const handlePayOrder = async (orderId) => {
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:3000/orders/updateorder', {
                "orderID": orderId,
                "isPaid": 1,
                "isDelivered": 0
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                Alert.alert('Success', 'Your order is paid.');
                loadOrders();
            } else {
                throw new Error('Failed to pay order');
            }
        } catch (error) {
            console.error('Error paying order:', error.response?.data || error.message);
            Alert.alert('Error', 'Failed to pay order. Please try again later.');
        }
    };

    const handleReceiveOrder = async (orderId) => {
        const token = await AsyncStorage.getItem('token');
        try {
            const response = await axios.post('http://localhost:3000/orders/updateorder', {
                "orderID": orderId,
                "isPaid": 1,
                "isDelivered": 1
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                Alert.alert('Success', 'Your order is delivered.');
                loadOrders();
            } else {
                throw new Error('Failed to receive order');
            }
        } catch (error) {
            console.error('Error receiving order:', error.response?.data || error.message);
            Alert.alert('Error', 'Failed to receive order. Please try again later.');
        }
    };

    const renderOrderItem = ({ item }) => (
        <View style={styles.orderContainer}>
            <TouchableOpacity
                style={styles.orderHeader}
                onPress={() => toggleOrderExpanded(item.id)}
            >
                <Text style={styles.orderHeaderText}>Order ID: {item.id}</Text>
                <Text style={styles.orderHeaderText}>Items: {item.order_items.length}</Text>
                <Text style={styles.orderHeaderText}>Total Price: ${(item.total_price / 100).toFixed(2)}</Text>
                <TouchableOpacity
                    style={styles.caretButton}
                    onPress={() => toggleOrderExpanded(item.id)}
                >
                    <Icon name={expandedOrderId === item.id ? 'angle-down' : 'angle-right'} size={20} />
                </TouchableOpacity>
            </TouchableOpacity>
            {expandedOrderId === item.id && (
                <View style={styles.orderDetails}>
                    {item.order_items.map((product, index) => (
                        <View key={index} style={styles.productItem}>
                            <Image
                                source={{ uri: product.image }}
                                style={styles.productImage}
                            />
                            <View style={styles.productInfo}>
                                <Text>{product.title}</Text>
                                <Text>Quantity: {product.quantity}</Text>
                            </View>
                        </View>
                    ))}
                    {item.is_paid === 0 && (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handlePayOrder(item.id)}
                        >
                            <Text style={styles.actionButtonText}>Pay</Text>
                        </TouchableOpacity>
                    )}
                    {item.is_paid === 1 && item.is_delivered === 0 && (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleReceiveOrder(item.id)}
                        >
                            <Text style={styles.actionButtonText}>Receive</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );

    const toggleOrderExpanded = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const toggleCategoryExpanded = (category) => {
        setExpandedCategory(expandedCategory === category ? null : category);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>My Orders</Text>
            </View>
            <OrderTab
                title="New Orders"
                orders={orders.filter(order => order.is_paid === 0 && order.is_delivered === 0)}
                expanded={expandedCategory === 'new'}
                toggleExpanded={() => toggleCategoryExpanded('new')}
                renderItem={renderOrderItem}
            />
            <OrderTab
                title="Paid Orders"
                orders={orders.filter(order => order.is_paid === 1 && order.is_delivered === 0)}
                expanded={expandedCategory === 'paid'}
                toggleExpanded={() => toggleCategoryExpanded('paid')}
                renderItem={renderOrderItem}
            />
            <OrderTab
                title="Delivered Orders"
                orders={orders.filter(order => order.is_delivered === 1)}
                expanded={expandedCategory === 'delivered'}
                toggleExpanded={() => toggleCategoryExpanded('delivered')}
                renderItem={renderOrderItem}
            />
        </ScrollView>
    );
};

const OrderTab = ({ title, orders, expanded, toggleExpanded, renderItem }) => (
    <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tabHeader} onPress={toggleExpanded}>
            <Text style={styles.tabHeaderText}>{title}</Text>
            <Icon name={expanded ? 'angle-down' : 'angle-right'} size={20} />
        </TouchableOpacity>
        {expanded && (
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.categoryList}
            />
        )}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    titleContainer: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#3498db',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    tabContainer: {
        marginBottom: 20,
    },
    tabHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#D8D8D8',
        marginBottom: 10,
    },
    tabHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3E323A',
        textTransform: 'uppercase',
    },
    categoryList: {
        flexGrow: 1,
    },
    orderContainer: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 10,
        padding: 10,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    caretButton: {
        padding: 5,
    },
    orderDetails: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    productImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        marginRight: 10,
    },
    productInfo: {
        flex: 1,
    },
    actionButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MyOrdersScreen;
