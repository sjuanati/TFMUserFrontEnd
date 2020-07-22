import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Alert,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import tz from 'moment-timezone';
import Cons from '../../shared/Constants';
import { useSelector } from 'react-redux';
import { httpUrl } from '../../../urlServer';
import { ListItem } from 'react-native-elements';

import bayer_test from '../../assets/images/global/bayer.png';
import pfizer_test from '../../assets/images/global/pfizer.png';


const token = (props) => {

    const user = useSelector(state => state.user);
    const [balance, setBalance] = useState(-1);
    const [tabView, setTabView] = useState(true);
    const [earnTokens, setEarnTokens] = useState([]);
    

    useEffect(() => {
        fetchTokenBalance();
        fetchEarnTokens();
    }, []);

    const fetchTokenBalance = async () => {
        await axios.get(`${httpUrl}/token/get/balance`, {
            params: { recipient: user.eth_address },
            headers: { authorization: user.token }
        }).then(res => {
            setBalance(res.data);
        }).catch(err => {
            console.log('Error in Token.js -> fetchTokenBalance(): ', err);
            Alert.alert(`Balance can't be checked right now`);
            setBalance(-2);
        });
    }

    const fetchEarnTokens = async () => {
        await axios.get(`${httpUrl}/token/earnTokens`, {
            params: { recipient: user.eth_address },
            headers: { authorization: user.token }
        }).then(res => {
            setEarnTokens(res.data);
            console.log('Earn tokens :', res.data);
        }).catch(err => {
            console.log('Error in Token.js -> fetchEarnTokens(): ', err);
        });
    }

    const toggleTabView = (val) => (val !== tabView) ? setTabView(!tabView) : null;

    const getRemainingDays = (date) => {
        const today = moment().tz('Europe/Madrid');
        const end_date = moment(date).tz('Europe/Madrid');
        const remainingDays = end_date.diff(today, 'days');
        
        if (remainingDays < 0) 
            return <Text>Status:      <Text style={styles.closeText}>Closed</Text></Text>;
        else if (remainingDays <= 1) 
            return <Text>Status:      <Text style={styles.closeSoonText}>Open (expires soon)</Text></Text>;
        else 
            return <Text>Status:      <Text style={styles.openText}>Open ({remainingDays} days)</Text></Text>;

    }

    const renderItems = (val) => (
        <ListItem
            title={val.item.earn_desc}
            subtitle={
                <View>
                    <Text>Reward:    <Text style={styles.bold}>{val.item.earn_qty}</Text> PCT</Text>
                    {getRemainingDays(val.item.validity_end_date)}
                </View>
            }
            leftAvatar={{
                source: (val.item.photo === 'bayer') ? bayer_test : pfizer_test,
                size: 'medium'
            }}
            onPress={() => props.navigation.navigate('EarnTokensDetail', { item: val.item })}
            bottomDivider
            chevron
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.containerBalance}>
                <Text style={styles.text}> Current Balance :
                    <Text style={styles.bold}>
                        {(balance === -1) ? ' ...' : (balance === -2) ? ' ?' : ` ${balance}`}
                    </Text>
                    <Text style={styles.textGrey}> PCT</Text>
                </Text>
            </View>
            <View style={styles.containerTabView}>
                <View style={(tabView) ? styles.selectedView : null}>
                    <TouchableOpacity
                        onPress={() => toggleTabView(true)}>
                        <Text style={styles.selectedText}>{`Earn Tokens`}</Text>
                    </TouchableOpacity>
                </View>
                <View style={(!tabView) ? styles.selectedView : null}>
                    <TouchableOpacity
                        onPress={() => toggleTabView(false)}>
                        <Text style={styles.selectedText}>{`Spend Tokens`}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {(tabView)
                ? <View style={styles.sectionList}>
                    <FlatList
                        data={earnTokens}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItems}
                    />
                </View>
                : <View style={styles.sectionList}>
                    <FlatList
                        data={[]}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItems}
                    />
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    containerBalance: {
        paddingTop: 25,
        alignItems: 'center'
    },
    containerTabView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 30,
    },
    selectedView: {
        borderBottomWidth: 3,
        borderBottomColor: Cons.COLORS.GREEN
    },
    selectedText: {
        fontSize: 20,
        paddingBottom: 5,
        fontWeight: 'bold'
    },
    sectionList: {
        paddingTop: 25,
    },
    text: {
        fontSize: 18,
    },
    bold: {
        fontWeight: 'bold',
    },
    textGrey: {
        color: 'grey',
    },
    openText: {
        color: 'green',
    },
    closeText: {
        color: 'red',
    },
    closeSoonText: {
        color: '#E08119',
    },
});

export default token;
