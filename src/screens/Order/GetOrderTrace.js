import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    FlatList,
    StyleSheet
} from 'react-native';
import { ListItem } from 'react-native-elements';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { httpUrl } from '../../../urlServer';
import CustomHeaderBack from '../../navigation/CustomHeaderBack';

const box_width = 50;

const getOrderTrace = (props) => {

    const order_id = props.navigation.getParam('order_id');
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
            console.log('Erroriki: ', err);
        });
    }

    // Render list of Order items
    const renderOrderItems = (values) => (
        <ListItem
            //title={values.item.trace_id}
            subtitle={
                <View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowHeader}> Status: </Text>
                        <Text style={styles.rowValue}> {values.item.order_status} </Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowHeader}> Trace ID: </Text>
                        <Text style={styles.rowValue}> {values.item.trace_id} </Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowHeader}> Order ID: </Text>
                        <Text style={styles.rowValue}> {values.item.order_id} </Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowHeader}> Timestamp: </Text>
                        <Text style={styles.rowValue}> {values.item.order_date} </Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowHeader}> Item: </Text>
                        <Text style={styles.rowValue}> {values.item.order_item} </Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowHeader}> Pharmacy: </Text>
                        <Text style={styles.rowValue}> {values.item.pharmacy_id} </Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowHeader}> DB Hash: </Text>
                        <Text style={styles.rowValue}> {values.item.hash} </Text>
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={styles.rowHeader}> Eth Hash: </Text>
                        <Text style={styles.rowValue}> ... </Text>
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
            <CustomHeaderBack {...props} />
            <Text> Hallo!! {order_id}</Text>
            <View style={styles.box}></View>
            <View style={styles.box}></View>
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
        //marginTop: 10,
    },
    rowHeader: {
        color: 'grey',
        width: 80,
        //fontSize: 16,
    },
    rowValue: {
        //fontSize: 16,
        width: 300
    },
    box: {
        width: box_width,
        height: box_width,
        borderRadius: box_width / 2,
        backgroundColor: 'green',
    }
});