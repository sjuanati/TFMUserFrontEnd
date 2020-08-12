import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    FlatList,
    StyleSheet,
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { httpUrl } from '../../../urlServer';
import { ListItem } from 'react-native-elements';

//const box_width = 50;

const getOrderTrace = (props) => {

    //const order_id = props.navigation.getParam('order_id');
    const { order_id } = props.route.params;
    const user = useSelector(state => state.user);
    const [order, setOrder] = useState([]);

    useEffect(() => {
        fetchOrderTrace();
    }, []);

    const fetchOrderTrace = async () => {
        await axios.get(`${httpUrl}/trace/order`, {
            params: { order_id: order_id },
            headers: { authorization: user.token }
        }).then(res => {
            setOrder(res.data);
        }).catch(err => {
            console.log('Error in GetOrderTrace.js -> getOrderTrace() -> fetchOrderTrace(): ', err);
        });
    }

    const showTrimmedHash = (hash) => {
        return hash.slice(0, 25) + '...' + hash.slice(-5);
    }

    const showChecksum = (checksum, error) => {
        switch (checksum) {
            case 'OK':
                return <Text style={styles.textValidated}>Validated </Text>
            case 'NOK':
                return <Text style={styles.textNotValidated}>Not Validated  <Text style={styles.unbold}>({error})</Text></Text>
            case 'PENDING':
                return <Text style={styles.textPending}>Pending </Text>
            default:
                return <Text style={styles.textNotValidated}>Unknown </Text>
        }
    }

    // Render list of Order items
    const renderOrderItems = (values) => (
        <ListItem
            title={<Text style={styles.textHeader}>{values.item.status_desc}</Text>}
            subtitle={
                <View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowHeader}> Date: </Text>
                        <Text style={styles.rowValue}>{moment.unix(values.item.order_date).format('DD-MM-YYYY H:mm:ss')} </Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowHeader}> Checksum: </Text>
                        <Text style={styles.rowValue}>{showChecksum(values.item.checksum, values.item.error)} </Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowHeader}> Hash: </Text>
                        <Text style={styles.rowValue}>{showTrimmedHash(values.item.db_hash)} </Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowHeader}> Signed by: </Text>
                        <Text style={styles.rowValue}>
                            {(values.item.order_status < 2) ? values.item.name : 'Pharmacy ' + values.item.pharmacy_desc}
                        </Text>
                    </View>
                </View>}
            bottomDivider
        />
    );

    // Build list of Order items
    const renderOrderTrace = () => (
        <FlatList
            data={order}
            keyExtractor={(item) => item.trace_id.toString()}
            renderItem={renderOrderItems}
        />
    )

    return (
        <View style={styles.container}>
            {renderOrderTrace()}
        </View>
    )
}

export default getOrderTrace;


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    rowContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    rowHeader: {
        color: 'grey',
        width: 83,
    },
    rowValue: {
        width: 300
    },
    // box: {
    //     width: box_width,
    //     height: box_width,
    //     borderRadius: box_width / 2,
    //     backgroundColor: 'green',
    // },
    textHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    textValidated: {
        color: 'green',
        fontWeight: 'bold'
    },
    textNotValidated: {
        color: 'red',
        fontWeight: 'bold'
    },
    textPending: {
        color: 'orange',
        fontWeight: 'bold'
    },
    unbold: {
        fontWeight: 'normal'
    }
});