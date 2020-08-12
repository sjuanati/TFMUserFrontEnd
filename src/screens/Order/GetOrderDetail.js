import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Alert,
    FlatList,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import {
    Col,
    Grid,
    Toast,
    Button,
    Spinner,
    ListItem,
    Container,
} from "native-base";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { httpUrl } from '../../../urlServer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import handleAxiosErrors from '../../shared/handleAxiosErrors';

const getOrderDetail = (props) => {

    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState([]);
    const [orderTraceStatus, setOrderTraceStatus] = useState('PENDING');
    const user = useSelector(state => state.user);

    useEffect(() => {
        startFunctions()
            .catch(error => {
                console.warn(JSON.stringify(error));
            });
    }, []);

    const startFunctions = async () => {
        try {
            //const order_id = props.navigation.getParam('order');
            const { order_id } = props.route.params;
            await getOrder(user.id, order_id, user.token);
            await fetchOrderTraceGlobal(order_id);
            setLoading(false);
        } catch (error) {
            throw error;
        }
    };

    const fetchOrderTraceGlobal = async (order_id) => {
        await axios.get(`${httpUrl}/trace/order/global`, {
            params: { order_id: order_id },
            headers: { authorization: user.token }
        }).then(res => {
            setOrderTraceStatus(res.data);
        }).catch(err => {
            console.log('Error in GetOrderDetail.js -> fetchOrderTraceGlobal() : ', err);
        });
    }

    const getOrder = async (user_id, order_id, token) => {
        axios.get(`${httpUrl}/order/get/item/user`, {
            params: {
                user_id: user_id,
                order_id: order_id,
            },
            headers: { authorization: token }
        }).then(async res => {
            if (res.status === 200 || res.status === 304) {
                let order = res.data;
                setOrder(ordr => [...ordr, ...order]);
                setLoading(false);
            } else {
                showToast("Ha ocurrido un error")
            }
        }).catch(async err => {
            handleAxiosErrors(props, err);
            setLoading(false);
        });
    };

    const cancelOrder = async () => {
        Alert.alert(
            "Do you want to cancel the order?",
            null,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        axios.post(`${httpUrl}/order/changeOrderStatus`, {
                            status: 6,
                            order_id: order[0].order_id,
                            user_id: order[0].user_id,
                            pharmacy_id: order[0].pharmacy_id,
                            eth_address: user.eth_address,
                        }, {
                            headers: { authorization: user.token }
                        }).then(async res => {
                            if (res.status === 200 && res.data.order) {
                                let ordr = res.data.order;
                                setOrder(ordr);
                                setOrderTraceStatus('PENDING');
                            } else {
                                { showToast("Ha ocurrido un error") }
                            }
                        }).catch(async err => {
                            handleAxiosErrors(props, err);
                        });
                    }
                }
            ],
            { cancelable: false }
        );
    };

    const showToast = (text) => {
        Toast.show({
            text: text,
            position: "bottom",
            buttonText: "Okay"
        });
    };

    const StatusOrder = ({ status }) => {
        if (status === 0) {
            return (<Text style={styles.statusGrey}>DRAFT</Text>)
        } else if (status === 1) {
            return (<Text style={styles.statusGrey}>REQUESTED</Text>)
        } else if (status === 2) {
            return (<Text style={styles.statusYellow}>CONFIRMED</Text>)
        } else if (status === 3) {
            return (<Text style={styles.statusGrey}>PICK UP READY</Text>)
        } else if (status === 4) {
            return (<Text style={styles.statusYellow}>IN TRANSIT</Text>)
        } else if (status === 5) {
            return (<Text style={styles.statusGreen}>DELIVERED</Text>)
        } else if (status === 6) {
            return (<Text style={styles.statusRed}>CANCELLED</Text>)
        } else {
            return (<Text />)
        }
    };

    const renderItem = ({ item, index }) => {
        item.screen = 'GetOrderDetail'
        return (
            <ListItem
                id={item.order_item}
                onPress={() => props.navigation.navigate('ProductDetail', item)}
                bottomDivider
                chevron
            >
                <View>
                    <Text style={styles.subtitleText}>Item {index + 1}: </Text>
                    <Text>{item.product_desc}</Text>
                    <Text style={styles.subtitleText}>{item.price} € </Text>
                </View>
            </ListItem>
        )
    };

    const RenderList = () => {
        return (
            <FlatList
                data={order}
                renderItem={renderItem}
                keyExtractor={item => item.order_item.toString()}>
            </FlatList>
        );
    };

    const openTrace = (item) => {
        props.navigation.navigate('OrderTrace', {
            order_id: item
        });
    }

    const showOrderTraceStatus = () => {
        switch (orderTraceStatus) {
            case 'PENDING':
                return (
                    <Ionicons
                        name='ios-ellipsis-horizontal-circle-outline'
                        size={25}
                        color='orange'
                    />)
            case 'OK':
                return (
                    <Ionicons
                        name='ios-checkmark-circle-outline'
                        size={25}
                        color='green'
                    />)
            case 'NOK':
                return (
                    <Ionicons
                        name='close-circle-outline'
                        size={25}
                        color='red'
                    />)
            default:
                return (
                    <Ionicons
                        name='alert-circle-outline'
                        size={25}
                        color='red'
                    />)
        }
    }

    const RenderPage = () => (
        <View>
            <View style={styles.headerContainer}>
                <Text style={styles.titleText}> Order </Text>
            </View>
            <View style={styles.sectionContainer}>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Reference: </Text>
                    <Text style={styles.rowValue}> #{order[0].order_id_app} </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Pharmacy: </Text>
                    <Text style={styles.rowValue}> {order[0].pharmacy_desc} </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Status: </Text>
                    <Text style={styles.rowValue}> <StatusOrder status={order[0].status} /> </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Price: </Text>
                    <Text style={styles.rowValue}> {order[0].total_price} € </Text>
                </View>
                <View style={styles.rowContainer}>
                    <Text style={styles.rowHeader}> Trace: </Text>
                    {showOrderTraceStatus()}

                    <TouchableOpacity
                        style={styles.buttonDetails}
                        onPress={() => openTrace(order[0].order_id)}
                    >
                        <Text style={[styles.rowValue, styles.buttonText]}> Details </Text>
                    </TouchableOpacity>
                </View>
                <RenderList />
            </View>
            {(order[0].status === 1 || order[0].status === 2)
                ? <View>
                    <Grid>
                        <Col size={1} />
                        <Col size={2} style={styles.colButton}>
                            <Button block bordered rounded danger
                                style={styles.buttonCanceled}
                                onPress={cancelOrder}>
                                <Text numberOfLines={1}>
                                    Cancel Order
                                </Text>
                            </Button>
                        </Col>
                        <Col size={1} />
                    </Grid>
                </View>
                : null
            }
        </View>
    );

    return (
        <Container>
            {(loading || !order[0])
                ? <Spinner color='#F4B13E' />
                : <RenderPage />
            }
        </Container>
    )
};

const styles = StyleSheet.create({
    headerContainer: {
        margin: 15,
        borderBottomWidth: 0.3,
        borderColor: 'orange',
    },
    rowContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    rowHeader: {
        color: 'grey',
        width: 110,
        fontSize: 16,
    },
    rowValue: {
        fontSize: 16,
    },
    sectionContainer: {
        marginLeft: 25,
        marginTop: 5,
    },
    titleText: {
        fontSize: 26,
        fontWeight: 'bold',
    },
    buttonText: {
        color: 'white'
    },
    buttonDetails: {
        backgroundColor: '#00A591',
        marginLeft: 10,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 15,
        justifyContent: 'center'
    },
    button: {
        backgroundColor: '#F4B13E'
    },
    startCols: {
        justifyContent: 'center'
    },
    status: {
        alignItems: 'center',
        fontSize: 20
    },
    colButton: {
        paddingHorizontal: '2%',
        marginTop: '2%'
    },
    buttonCanceled: {
        marginTop: '2%'
    },
    buttonDelivered: {
        marginTop: '2%'
    },
    statusGrey: {
        color: 'grey',
        fontSize: 16,
    },
    statusYellow: {
        color: '#f0ad4e',
        fontSize: 16,
    },
    statusGreen: {
        color: '#5cb85c',
        fontSize: 16,
    },
    statusRed: {
        color: '#d9534f',
        fontSize: 16,
    },
    subtitleText: {
        color: 'grey',
        fontSize: 16,
    }
});

export default getOrderDetail;