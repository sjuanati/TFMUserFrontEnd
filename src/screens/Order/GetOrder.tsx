/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
    Badge,
    Spinner,
    Header,
    Item,
    Text,
    Container,
    Toast,
    ListItem,
    Right,
    Body,
    Left,
    Icon,
    Input,
} from 'native-base';
import {
    View,
    FlatList,
    StyleSheet,
    PixelRatio,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { httpUrl } from '../../../urlServer';
import fontSize from '../../shared/FontSize';
import { useTypedSelector } from '../../store/reducers/reducer';
import handleAxiosErrors from '../../shared/handleAxiosErrors';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OrderStackParamList } from '../../navigation/StackNavigator';
import { Order, Filter } from '../../shared/Interfaces';

// Font size management
let FONT_SIZE = fontSize(20, PixelRatio.getFontScale());

type Props = {
    route: RouteProp<OrderStackParamList, 'Orders'>,
    navigation: StackNavigationProp<OrderStackParamList, 'Orders'>
};

const GetOrder = (props: Props) => {

    const [loading, setLoading] = useState<boolean>(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [originalOrders, setOriginalOrders] = useState<Order[]>([]);
    const user = useTypedSelector(state => state.user);
    const [filters, setFilters] = useState<Filter>({
        grey: true,
        red: true,
        yellow: true,
        green: true,
    });
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        startFunctions();
    }, []);

    useEffect(() => {
        const focusListener = props.navigation.addListener('focus', () => {
            startFunctions();
        });
        return focusListener;
    }, [props.navigation]);

    const startFunctions = async () => {
        try {
            await getOrders();
        } catch (err) {
            console.log('Error in GetOrder.tsx -> startFunctions(): ', err);
        }
    };

    const showToast = (text: string) => {
        Toast.show({
            text: text,
            position: 'bottom',
            buttonText: 'Okay',
        });
    };

    const findOrder = (text: string, arrayOrders: Order[], modFilters: Filter) => {
        return new Promise<Order[]>(async (resolve) => {
            if (text !== '') {
                const ordersToFilter = await applyFilter(modFilters, arrayOrders);
                const res = ordersToFilter.filter((ordr: Order) => {
                    let condition = new RegExp(text);
                    return condition.test(ordr.pharmacy_desc);
                });
                // let initialOrder = { order_id: 0, header: true };
                // res.unshift(initialOrder);
                setOrders(res);
                resolve(res);
            } else {
                let ordersList = await applyFilter(modFilters, arrayOrders);
                setOrders(() => ordersList);
                resolve(ordersList);
            }
        });
    };

    const applyFilter = async (filter: Filter, arrayOrders: Order[]) => {
        return new Promise<Order[]>((resolve) => {

            let finalArray: Order[] = [];
            if (filter.grey && filter.red && filter.yellow && filter.green) {
                finalArray = arrayOrders;
            } else if (!filter.grey && !filter.red && filter.yellow && !filter.green) {
                finalArray = arrayOrders.filter((ordr: Order) => ordr.status === 2 || ordr.status === 4);
            } else if (!filter.grey && !filter.red && !filter.yellow && filter.green) {
                finalArray = arrayOrders.filter((ordr: Order) => ordr.status === 5);
            } else if (!filter.grey && filter.red && !filter.yellow && !filter.green) {
                finalArray = arrayOrders.filter((ordr: Order) => ordr.status === 6);
            } else if (filter.grey && !filter.red && !filter.yellow && !filter.green) {
                finalArray = arrayOrders.filter((ordr: Order) => ordr.status === 1 || ordr.status === 3);
            } else if (!filter.grey && !filter.red && !filter.yellow && !filter.green) {
                finalArray = [];
            }
            resolve(finalArray);
        });
    };

    const getOrders = async () => {
        return new Promise((resolve) => {
            axios.get(`${httpUrl}/order/get/user`, {
                params: { user_id: user.id },
                headers: { authorization: user.token },
            }).then(async res => {
                if (res.status === 200 || res.status === 304) {
                    const ordrs = res.data;
                    const initialOrder = [{ order_id: 0, header: true }];
                    setOriginalOrders(() => [...initialOrder, ...ordrs]);
                    await findOrder(searchText, [...initialOrder, ...ordrs], filters);
                    setLoading(false);
                    resolve();
                } else {
                    showToast('Error found');
                }
            }).catch(async err => {
                handleAxiosErrors(props, err);
                setLoading(false);
            });
        });
    };

    const openOrder = async ({ item }: { item: any }) => {
        if (item) {
            props.navigation.navigate('OrderDetail', {
                order_id: item.order_id,
            });
        } else {
            console.log('Error opening order');
        }
    };

    const renderItem = (item: any) => {
        return (
            <View>
                {(item.item.header) ?
                    <ListItem itemDivider
                        id={item.item.order_id.toString()}>
                        <Left style={styles.flex06}>
                            <Text>Order</Text>
                        </Left>
                        <Body style={styles.flex04}>
                            <Text>Status</Text>
                        </Body>
                    </ListItem>
                    :
                    <ListItem
                        id={item.item.order_id.toString()}>
                        <Body style={[styles.paddingLeft5, styles.flex06]}>
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
                        <Body style={styles.flex04}>
                            <TouchableOpacity onPress={() => openOrder(item)}>
                                <StatusOrder status={item.item.status} />
                            </TouchableOpacity>
                        </Body>
                    </ListItem>
                }
            </View>
        );
    };

    const RenderDate = ({ date }: { date: Date }) => {
        return (
            <Text note>
                {('0' + date.getHours()).slice(-2)}:
                {('0' + date.getMinutes()).slice(-2)}
                {('0' + date.getDate()).slice(-2)}/
                {('0' + (date.getMonth() + 1).toString()).slice(-2)}/
                {(date.getFullYear())}
            </Text>
        );
    };

    const StatusOrder = ({ status }: { status: number }) => {
        if (status === 0) {
            return (<Text style={styles.statusGrey}>DRAFT</Text>);
        } else if (status === 1) {
            return (<Text style={styles.statusGrey}>REQUESTED</Text>);
        } else if (status === 2) {
            return (<Text style={styles.statusYellow}>CONFIRMED</Text>);
        } else if (status === 3) {
            return (<Text style={styles.statusGrey}>PICK UP READY</Text>);
        } else if (status === 4) {
            return (<Text style={styles.statusYellow}>IN TRANSIT</Text>);
        } else if (status === 5) {
            return (<Text style={styles.statusGreen}>DELIVERED</Text>);
        } else if (status === 6) {
            return (<Text style={styles.statusRed}>CANCELLED</Text>);
        } else {
            return (<Text />);
        }
    };

    const onRefresh = () => {
        setTimeout(async () => {
            await getOrders();
        }, 400);
    };

    const RenderOrders = () => (
        <Container>
            {(orders.length === 0 || orders.length === 1)
                ? <View style={styles.viewContent}>
                    <Text style={styles.noItems}>
                        No Orders found
                    </Text>
                </View>
                : <View style={styles.viewContent}>
                    <FlatList data={orders}
                        renderItem={renderItem}
                        keyExtractor={(item: Order) => item.order_id.toString()}
                        refreshControl={
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={onRefresh} />
                        } />
                </View>
            }
        </Container>
    );

    return (
        <Container>
            <Header noShadow style={styles.headerTitle}>
                <Left style={styles.left}>
                    <Text style={styles.titlePage}>
                        Orders
                    </Text>
                </Left>
                <Right />
            </Header>
            <Header noShadow searchBar rounded
                style={styles.header}>
                <Item>
                    <Item>
                        <Icon name="ios-search" />
                        <Input placeholder="Search pharmacy"
                            value={searchText}
                            onChangeText={(text) => {
                                setSearchText(text);
                                findOrder(text, originalOrders, filters);
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
                                const ordrs = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(ordrs);
                            } else {
                                let modFilters = { ...filters };
                                modFilters.yellow = true;
                                modFilters.green = true;
                                modFilters.red = true;
                                modFilters.grey = true;

                                setFilters(modFilters);
                                const ordrs = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(ordrs);
                            }
                        }}>
                            <Badge style={styles.badgeSelected}>
                                <Icon name="ellipsis1" type="AntDesign" style={styles.checkmark} />
                            </Badge>
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={async () => {
                            let modFilters = { ...filters };
                            modFilters.grey = true;

                            setFilters(modFilters);
                            const ordrs = await findOrder(searchText, originalOrders, modFilters);
                            setOrders(ordrs);
                        }}>
                            <Badge style={[styles.badgeSelected, styles.opacity]}>
                                <Icon name="ellipsis1" type="AntDesign" style={styles.checkmark} />
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
                                const ordrs = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(ordrs);
                            } else {
                                let modFilters = { ...filters };
                                modFilters.yellow = true;
                                modFilters.green = true;
                                modFilters.red = true;
                                modFilters.grey = true;

                                setFilters(modFilters);
                                const ordrs = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(ordrs);
                            }
                        }}>
                            <Badge warning style={styles.filterBadge}>
                                <Icon name="ellipsis1" type="AntDesign" style={styles.checkmark} />
                            </Badge>
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={async () => {
                            let modFilters = { ...filters };
                            modFilters.yellow = true;
                            modFilters.green = false;
                            modFilters.red = false;
                            modFilters.grey = false;

                            setFilters(modFilters);
                            const ordrs = await findOrder(searchText, originalOrders, modFilters);
                            setOrders(ordrs);
                        }}>
                            <Badge warning style={styles.filterBadgeNonSelected}>
                                <Icon name="ellipsis1" type="AntDesign" style={styles.checkmark} />
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
                                const ordrs = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(ordrs);
                            } else {
                                let modFilters = { ...filters };
                                modFilters.yellow = true;
                                modFilters.green = true;
                                modFilters.red = true;
                                modFilters.grey = true;

                                setFilters(modFilters);
                                const ordrs = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(ordrs);
                            }
                        }}>
                            <Badge success style={styles.filterBadge}>
                                <Icon name="checkmark" style={styles.checkmark} />
                            </Badge>
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={async () => {
                            let modFilters = { ...filters };
                            modFilters.yellow = false;
                            modFilters.green = true;
                            modFilters.red = false;
                            modFilters.grey = false;

                            setFilters(modFilters);
                            const ordrs = await findOrder(searchText, originalOrders, modFilters);
                            setOrders(ordrs);
                        }}>
                            <Badge success style={styles.filterBadgeNonSelected}>
                                <Icon name="checkmark" style={styles.checkmark} />
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
                                const ordrs = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(ordrs);
                            } else {
                                let modFilters = { ...filters };
                                modFilters.yellow = true;
                                modFilters.green = true;
                                modFilters.red = true;
                                modFilters.grey = true;

                                setFilters(modFilters);
                                const ordrs = await findOrder(searchText, originalOrders, modFilters);
                                setOrders(ordrs);
                            }
                        }}>
                            <Badge danger style={styles.filterBadge}>
                                <Icon name="close" style={styles.checkmark} />
                            </Badge>
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={async () => {
                            let modFilters = { ...filters };
                            modFilters.yellow = false;
                            modFilters.green = false;
                            modFilters.red = true;
                            modFilters.grey = false;

                            setFilters(modFilters);
                            const ordrs = await findOrder(searchText, originalOrders, modFilters);
                            setOrders(ordrs);
                        }}>
                            <Badge danger style={styles.filterBadgeNonSelected}>
                                <Icon name="close" style={styles.checkmark} />
                            </Badge>
                        </TouchableOpacity>
                }
            </Header>
            {(loading) ?
                <Spinner color="#F4B13E" /> :
                <RenderOrders />
            }
        </Container>
    );
};

const styles = StyleSheet.create({
    body: {
        height: 80,
        justifyContent: 'center',
    },
    right: {
        justifyContent: 'center',
        alignItems: 'center',
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
        alignItems: 'flex-start',
    },
    titlePage: {
        fontSize: FONT_SIZE + 10, //30,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    viewContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    noItems: {
        marginTop: 20,
        color: 'gray',
        fontSize: FONT_SIZE,
    },
    header: {
        marginStart: 5,
        backgroundColor: 'white',
        borderWidth: 0,
    },
    filterBadge: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 25,
        height: 25,
        marginHorizontal: 7,
        marginTop: 15,
    },
    filterBadgeNonSelected: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 25,
        height: 25,
        marginHorizontal: 7,
        marginTop: 15,
        opacity: 0.3,
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
    checkmark: {
        fontSize: 14,
        color: '#fff',
    },
    flex04: {
        flex: 0.4,
    },
    flex06: {
        flex: 0.6,
    },
    paddingLeft5: {
        paddingLeft: 5,
    },
    badgeSelected: {
        backgroundColor: 'grey',
        justifyContent: 'center',
        alignItems: 'center',
        width: 25,
        height: 25,
        marginHorizontal: 7,
        marginTop: 15,
    },
    opacity: {
        opacity: 0.5,
    },
});

export default GetOrder;
