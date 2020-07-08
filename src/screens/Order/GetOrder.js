import React, { useState, useEffect } from 'react';
import { Content, Badge, Spinner, Header, Item, Text, Container, Toast, ListItem, Right, Body, Left, Icon, Input } from "native-base";
import { View, StyleSheet, FlatList, PixelRatio, Platform, RefreshControl, TouchableOpacity } from 'react-native';
//import { SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { httpUrl } from '../../../urlServer';
import axios from 'axios';
import fontSize from '../../shared/FontSize';
import { useDispatch, useSelector } from 'react-redux';
import { setOrdersPage } from '../../store/actions/order'

// Font size management
let FONT_SIZE = fontSize(20, PixelRatio.getFontScale());

const getOrder = (props) => {

    const dispatch = useDispatch();
    const ordersPage = useSelector(state => state.order.ordersPage);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [originalOrders, setOriginalOrders] = useState([]);
    const user = useSelector(state => state.user);
    const [isActive, setIsActive] = useState(true);
    const [filters, setFilters] = useState({
        grey: true,
        red: true,
        yellow: true,
        green: true
    });
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        console.log(user);
        dispatch(setOrdersPage(true));
    }, []);

    useEffect(() => {
        if (ordersPage) {
            startFunctions()
                .catch(error => {
                    console.warn(JSON.stringify(error));
                });
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [ordersPage]);

    useEffect(() => {
        let interval = null;
        if (!isActive) {
            clearInterval(interval);
        } else {
            interval = setInterval(() => {
                startFunctions()
                    .catch(error => {
                        console.warn(JSON.stringify(error));
                    });
            }, 60000);
        }
        return () => clearInterval(interval);
    }, [isActive]);


    const startFunctions = async () => {
        try {
            await getOrders();
        } catch (error) {
            throw error;
        }
    };

    const showToast = (text) => {
        Toast.show({
            text: text,
            position: "bottom",
            buttonText: "Okay"
        });
    };

    const findOrder = (text, arrayOrders, modFilters) => {
        return new Promise(async (resolve, reject) => {
            if (text !== '') {
                let ordersToFilter = await applyFilter(modFilters, arrayOrders);
                let res = ordersToFilter.filter((ordr) => {
                    let condition = new RegExp(text);
                    return condition.test(ordr.pharmacy_desc)
                });
                let initialOrder = { order_id: 0, header: true };
                res.unshift(initialOrder);
                setOrders(res);
                resolve(res);
            } else {
                let ordersList = await applyFilter(modFilters, arrayOrders);
                setOrders(() => ordersList);
                resolve(ordersList);
            }
        });
    };

    const applyFilter = async (filters, arrayOrders) => {
        return new Promise((resolve, reject) => {

            let finalArray = [];
            if (filters.grey && filters.red && filters.yellow && filters.green) {
                finalArray = arrayOrders;
            } else if (!filters.grey && !filters.red && filters.yellow && !filters.green) {
                finalArray = arrayOrders.filter(ordr => ordr.status === 2 || ordr.status === 4);
            } else if (!filters.grey && !filters.red && !filters.yellow && filters.green) {
                finalArray = arrayOrders.filter(ordr => ordr.status === 5);
            } else if (!filters.grey && filters.red && !filters.yellow && !filters.green) {
                finalArray = arrayOrders.filter(ordr => ordr.status === 6);
            } else if (filters.grey && !filters.red && !filters.yellow && !filters.green) {
                finalArray = arrayOrders.filter(ordr => ordr.status === 1 || ordr.status === 3);
            } else if (!filters.grey && !filters.red && !filters.yellow && !filters.green) {
                finalArray = [];
            }

            let initialItem = finalArray.find((item) => item.order_id === 0);
            if (!initialItem)
                finalArray.unshift({ order_id: 0, header: true });
            resolve(finalArray);
        });
    };

    const getOrders = async () => {
        return new Promise((resolve, reject) => {
            axios.get(`${httpUrl}/order/get/user`, {
                params: {
                    user_id: user.id,
                },
                headers: { authorization: user.token }
            }).then(async res => {
                if (res.status === 200 || res.status === 304) {
                    let ordrs = res.data;

                    let initialOrder = [{ order_id: 0, header: true }];
                    setOriginalOrders(() => [...initialOrder, ...ordrs]);
                    await findOrder(searchText, [...initialOrder, ...ordrs], filters);
                    setLoading(false);
                    resolve();
                } else {
                    { showToast("Ha ocurrido un error") }
                }
            }).catch(async err => {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    showToast("Por favor, vuelve a entrar");
                    await AsyncStorage.clear();
                    props.navigation.navigate('StartScreen');
                } else if (err.response && err.response.status === 400) {
                    showToast("Ha ocurrido un error");
                } else {
                    showToast("Ups... parece que no hay conexión");
                }
                setLoading(false);
            });
        });
    };

    const openOrder = async ({ item }) => {
        if (item) {
            dispatch(setOrdersPage(false));
            props.navigation.navigate('OrderDetail', {
                order: item.order_id
            });
        } else {
            console.log('error opening order')
        }
    };

    const renderItem = (item) => {
        return (
            <View>
                {(item.item.header) ?
                    <ListItem itemDivider
                        style={{ marginLeft: 0 }}
                        id={item.item.order_id.toString()}>
                        <Left style={{ flex: 0.6 }}>
                            <Text>Pedido</Text>
                        </Left>
                        <Body style={{ flex: 0.4 }}>
                            <Text>Estado</Text>
                        </Body>
                    </ListItem>
                    :
                    <ListItem style={{ marginLeft: 0 }}
                        id={item.item.order_id.toString()}>
                        <Body style={{ flex: 0.6, paddingLeft: 5 }}>
                            <TouchableOpacity onPress={() => openOrder(item)}>
                                {(item.item.pharmacy_desc && item.item.pharmacy_desc) ?
                                    <Text>{item.item.pharmacy_desc}</Text> :
                                    <Text />
                                }
                                {
                                    (item.item.total_price) ?
                                        <Text note numberOfLines={1}>
                                            {item.item.total_price} € - <RenderDate date={new Date(item.item.creation_date)} />
                                        </Text> :
                                        <RenderDate date={new Date(item.item.creation_date)} />
                                }
                            </TouchableOpacity>
                        </Body>
                        <Body style={{ flex: 0.4 }}>
                            <TouchableOpacity onPress={() => openOrder(item)}>
                                <StatusOrder status={item.item.status} />
                            </TouchableOpacity>
                        </Body>
                    </ListItem>
                }
            </View>
        )
    };

    const RenderDate = ({ date }) => {
        return (
            <Text note>
                {("0" + date.getHours()).slice(-2)}:{("0" + date.getMinutes()).slice(-2)} {("0" + date.getDate()).slice(-2)}/{("0" + (date.getMonth() + 1).toString()).slice(-2)}/{(date.getFullYear())}
            </Text>
        )
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

    const onRefresh = () => {
        setIsActive(false);
        setTimeout(async () => {
            // setOrders([]);
            setIsActive(true);
            await getOrders();
        }, 400);
    };

    const RenderOrders = () => (
        <Container>
            {(orders.length === 0 || orders.length === 1) ?
                <View style={styles.viewContent}>
                    <Text style={styles.noItems}>
                        No hay ningún pedido
          </Text>
                </View>
                :
                <View style={styles.viewContent}>
                    <FlatList data={orders}
                        renderItem={renderItem}
                        keyExtractor={item => item.order_id.toString()}
                        refreshControl={
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={onRefresh}
                            />}>

                    </FlatList>
                </View>
            }
        </Container>
    );

    return (
        <Container>
            <Header noShadow style={styles.headerTitle}>
                <Left style={styles.left}>
                    <Text style={styles.titlePage}>
                        Pedidos
          </Text>
                </Left>
                <Right />
            </Header>
            <Header noShadow searchBar rounded
                style={styles.header}>
                <Item>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Farmacia ..."
                            value={searchText}
                            onChangeText={(text) => {
                                setSearchText(text);
                                findOrder(text, originalOrders, filters)
                            }} />
                    </Item>
                </Item>
                {
                    (filters.grey) ?
                        <TouchableOpacity onPress={async () => {
                            if (filters.grey && filters.yellow && filters.green && filters.red) {
                                let modFilters = { ...filters };
                                modFilters.yellow = false;
                                modFilters.green = false;
                                modFilters.red = false;

                                setFilters(modFilters);
                                let orders = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(orders);
                            } else {
                                let modFilters = { ...filters };
                                modFilters.yellow = true;
                                modFilters.green = true;
                                modFilters.red = true;
                                modFilters.grey = true;

                                setFilters(modFilters);
                                let orders = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(orders);
                            }
                        }}>
                            <Badge style={{ backgroundColor: 'grey', justifyContent: 'center', alignItems: 'center', width: 25, height: 25, marginHorizontal: 7, marginTop: 15 }}>
                                <Icon name="ellipsis1" type="AntDesign" style={{ fontSize: 14, color: "#fff" }} />
                            </Badge>
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={async () => {
                            let modFilters = { ...filters };
                            modFilters.grey = true;

                            setFilters(modFilters);
                            let orders = await findOrder(searchText, originalOrders, modFilters);
                            setOrders(orders);
                        }}>
                            <Badge style={{ backgroundColor: 'grey', justifyContent: 'center', alignItems: 'center', width: 25, height: 25, marginHorizontal: 7, marginTop: 15, opacity: 0.5 }}>
                                <Icon name="ellipsis1" type="AntDesign" style={{ fontSize: 14, color: "#fff" }} />
                            </Badge>
                        </TouchableOpacity>
                }
                {
                    (filters.yellow) ?
                        <TouchableOpacity onPress={async () => {
                            if (filters.grey && filters.yellow && filters.green && filters.red) {
                                let modFilters = { ...filters };
                                modFilters.grey = false;
                                modFilters.green = false;
                                modFilters.red = false;

                                setFilters(modFilters);
                                let orders = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(orders);
                            } else {
                                let modFilters = { ...filters };
                                modFilters.yellow = true;
                                modFilters.green = true;
                                modFilters.red = true;
                                modFilters.grey = true;

                                setFilters(modFilters);
                                let orders = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(orders);
                            }
                        }}>
                            <Badge warning style={styles.filterBadge}>
                                <Icon name="ellipsis1" type="AntDesign" style={{ fontSize: 14, color: "#fff" }} />
                            </Badge>
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={async () => {
                            let modFilters = { ...filters };
                            modFilters.yellow = true;
                            modFilters.green = false;
                            modFilters.red = false;
                            modFilters.grey = false;

                            setFilters(modFilters);
                            let orders = await findOrder(searchText, originalOrders, modFilters);
                            setOrders(orders);
                        }}>
                            <Badge warning style={styles.filterBadgeNonSelected}>
                                <Icon name="ellipsis1" type="AntDesign" style={{ fontSize: 14, color: "#fff" }} />
                            </Badge>
                        </TouchableOpacity>
                }
                {
                    (filters.green) ?
                        <TouchableOpacity onPress={async () => {
                            if (filters.grey && filters.yellow && filters.green && filters.red) {
                                let modFilters = { ...filters };
                                modFilters.grey = false;
                                modFilters.yellow = false;
                                modFilters.red = false;

                                setFilters(modFilters);
                                let orders = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(orders);
                            } else {
                                let modFilters = { ...filters };
                                modFilters.yellow = true;
                                modFilters.green = true;
                                modFilters.red = true;
                                modFilters.grey = true;

                                setFilters(modFilters);
                                let orders = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(orders);
                            }
                        }}>
                            <Badge success style={styles.filterBadge}>
                                <Icon name="checkmark" style={{ fontSize: 14, color: "#fff" }} />
                            </Badge>
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={async () => {
                            let modFilters = { ...filters };
                            modFilters.yellow = false;
                            modFilters.green = true;
                            modFilters.red = false;
                            modFilters.grey = false;

                            setFilters(modFilters);
                            let orders = await findOrder(searchText, originalOrders, modFilters);
                            setOrders(orders);
                        }}>
                            <Badge success style={styles.filterBadgeNonSelected}>
                                <Icon name="checkmark" style={{ fontSize: 14, color: "#fff" }} />
                            </Badge>
                        </TouchableOpacity>
                }
                {
                    (filters.red) ?
                        <TouchableOpacity onPress={async () => {
                            if (filters.grey && filters.yellow && filters.green && filters.red) {
                                let modFilters = { ...filters };
                                modFilters.grey = false;
                                modFilters.yellow = false;
                                modFilters.green = false;

                                setFilters(modFilters);
                                let orders = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(orders);
                            } else {
                                let modFilters = { ...filters };
                                modFilters.yellow = true;
                                modFilters.green = true;
                                modFilters.red = true;
                                modFilters.grey = true;

                                setFilters(modFilters);
                                let orders = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(orders);
                            }
                        }}>
                            <Badge danger style={styles.filterBadge}>
                                <Icon name="close" style={{ fontSize: 14, color: "#fff" }} />
                            </Badge>
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={async () => {
                            let modFilters = { ...filters };
                            modFilters.yellow = false;
                            modFilters.green = false;
                            modFilters.red = true;
                            modFilters.grey = false;

                            setFilters(modFilters);
                            let orders = await findOrder(searchText, originalOrders, modFilters);
                            setOrders(orders);
                        }}>
                            <Badge danger style={styles.filterBadgeNonSelected}>
                                <Icon name="close" style={{ fontSize: 14, color: "#fff" }} />
                            </Badge>
                        </TouchableOpacity>
                }
            </Header>
            {(loading) ?
                <Spinner color='#F4B13E' /> :
                <RenderOrders />
            }
        </Container>
    )
};

const styles = StyleSheet.create({
    body: {
        height: 80,
        justifyContent: 'center',
    },
    right: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    left: {
        flex: 1,
        justifyContent: 'center',
    },
    headerTitle: {
        marginStart: 5,
        marginTop: 5,
        backgroundColor: 'white',
        borderWidth: 0,
        height: 55,
        alignItems: 'flex-start'
    },
    titlePage: {
        fontSize: FONT_SIZE + 10, //30,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    viewContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    noItems: {
        color: 'gray',
        fontSize: FONT_SIZE - 8, //12
    },
    header: {
        marginStart: 5,
        backgroundColor: 'white',
        borderWidth: 0
    },
    filterBadge: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 25,
        height: 25,
        marginHorizontal: 7,
        marginTop: 15
    },
    filterBadgeNonSelected: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 25,
        height: 25,
        marginHorizontal: 7,
        marginTop: 15,
        opacity: 0.3
    },
    statusGrey: {
        color: 'grey', 
        fontSize: 13,
    },
    statusYellow: {
        color: '#f0ad4e', 
        fontSize: 13,
    },
    statusGreen: {
        color: '#5cb85c', 
        fontSize: 13,
    },
    statusRed: {
        color: '#d9534f', 
        fontSize: 13,
    },
});

export default getOrder;