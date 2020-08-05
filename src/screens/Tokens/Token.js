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
import PaymentVISA from '../../UI/PaymentVISA';
import Cons from '../../shared/Constants';
import globalStyles from '../../UI/Style';
import { useSelector } from 'react-redux';
import Keypad from '../../UI/Keypad';
import { httpUrl } from '../../../urlServer';
import { ListItem } from 'react-native-elements';
import bayer_test from '../../assets/images/global/bayer.png';
import pfizer_test from '../../assets/images/global/pfizer.png';


const token = (props) => {

    const user = useSelector(state => state.user);
    const [balance, setBalance] = useState(-1);
    const [tabView, setTabView] = useState(true);
    const [earnTokens, setEarnTokens] = useState([]);
    const [amount, setAmount] = useState('0');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchTokenBalance();
        fetchEarnTokens();
    }, []);

    // Load <balance> every time the screen is shown (in focus)
    useEffect(() => {
        const focusListener = props.navigation.addListener("didFocus", () => {
            fetchTokenBalance();
        });
        return () => focusListener.remove();
    }, []);

    const fetchTokenBalance = async () => {
        await axios.get(`${httpUrl}/token/get/balance`, {
            params: { recipient: user.eth_address },
            headers: { authorization: user.token }
        }).then(res => {
            // Convert string into Float of 2 decimals
            const amount = Math.round(parseFloat(res.data) * 100) / 100;
            setBalance(amount);
        }).catch(err => {
            console.log('Error in Token.js -> fetchTokenBalance(): ', err);
            //Alert.alert(`Balance can't be checked right now`);
            setBalance(-2);
        });
    }

    const fetchEarnTokens = async () => {
        await axios.get(`${httpUrl}/token/earnTokens`, {
            params: { recipient: user.eth_address },
            headers: { authorization: user.token }
        }).then(res => {
            setEarnTokens(res.data);
        }).catch(err => {
            console.log('Error in Token.js -> fetchEarnTokens(): ', err);
        });
    }

    const fetchBuyTokens = async (amount) => {
        setIsLoading(true);
        await axios.get(`${httpUrl}/token/buyTokens`, {
            params: {
                recipient: user.eth_address,
                amount: amount,
            },
            headers: { authorization: user.token }
        }).then(() => {
            fetchTokenBalance();
            setAmount('0');
            Alert.alert('Amount successfully transferred.');
        }).catch(err => {
            console.log('Error in Token.js -> buyTokens(): ', err);
        }).then(() => {
            setIsLoading(false)
        });
    }

    const toggleTabView = val => (val !== tabView) ? setTabView(!tabView) : null;

    const getRemainingDays = (date) => {
        const today = moment().tz('Europe/Madrid');
        const end_date = moment(date).tz('Europe/Madrid');
        const remainingDays = end_date.diff(today, 'days');

        if (remainingDays < 0)
            return <Text>Status:      <Text style={styles.closeText}>Closed</Text></Text>;
        else if (remainingDays <= 1)
            return <Text>Status:      <Text style={styles.closeSoonText}>Open (expires soon)</Text></Text>;
        else
            return <Text>Status:      <Text style={styles.openText}>Open ({remainingDays} days remaining)</Text></Text>;
    }

    const handlePurchase = () => {
        try {
            Alert.alert(
                "Please confirm the purchase",
                null,
                [{
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {
                        // Convert amount from String into 2-decimal Integer
                        let parsedAmount = Math.round(parseFloat(amount.replace(',', '.')) * 100) / 100;
                        fetchBuyTokens(parsedAmount);
                    }
                }],
                { cancelable: false }
            );
        } catch (err) {
            console.log('Error on Token.js -> handlePurchase(): ', err);
        }
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
            onPress={() => props.navigation.navigate('EarnTokensDetail', { item: val.item, balance: balance })}
            bottomDivider
            chevron
        />
    );

    //const addNumberHandler = (val) => console.log('Hey: ', val);

    /**
    * @dev Add number to the total amount. 
    * - Only one comma for decimals is allowed
    * - Only two decimals are allowed
    * - Maximum length for the total amount is 9 digits
    * @param num New number to be added to the right of the total amount 
    */
    const addNumberHandler = (num) => {
        if ((!amount.includes(',') || (amount.includes(',') && num !== ',')) && amount.length < 9) {
            if (amount === '0') setAmount(num);
            else if (amount.charAt(amount.length - 3) !== ',') setAmount(amount + num);
        }
    }

    /**
     * @dev Remove number from the total amount. 
     * - If a number has a preceding comma, it deletes number & comma
     */
    const removeNumberHandler = () => {
        if (amount.length > 1) {
            if (amount.charAt(amount.length - 2) === ',') setAmount(amount.slice(0, -2));
            else setAmount(amount.slice(0, -1));
        } else if (amount.length === 1) setAmount('0');
    }

    const renderPurchaseButton = () => (
        <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={((amount !== '0') && (amount !== ','))
                    ? globalStyles.button
                    : globalStyles.buttonDisabled}
                disabled={((amount !== '0') && (amount !== ','))
                    ? false
                    : true}
                onPress={() => handlePurchase()}>
                <Text style={styles.buttonText}> Buy Now </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.balanceContainer}>
                <Text style={styles.text}> Current Balance :
                    <Text style={styles.bold}>
                        {(balance === -1) ? ' ...' : (balance === -2) ? ' ?' : ` ${balance}`}
                    </Text>
                    <Text style={styles.textGrey}> PCTs</Text>
                </Text>
            </View>
            <View style={styles.tabViewContainer}>
                <View style={(tabView) ? styles.selectedView : null}>
                    <TouchableOpacity
                        onPress={() => toggleTabView(true)}>
                        <Text style={styles.selectedText}>{`Earn Tokens`}</Text>
                    </TouchableOpacity>
                </View>
                <View style={(!tabView) ? styles.selectedView : null}>
                    <TouchableOpacity
                        onPress={() => toggleTabView(false)}>
                        <Text style={styles.selectedText}>{`Buy Tokens`}</Text>
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
                : <View>
                    <View style={styles.balanceContainer}>
                        <Text style={styles.amountContainer}>{amount.replace(/\B(?=(\d{3})+(?!\d))/g, ".")} €</Text>
                    </View>
                    <Keypad
                        onAddNumber={addNumberHandler}
                        onRemoveNumber={removeNumberHandler} />
                    <PaymentVISA/>
                </View>
            }
            {(tabView) ? null : renderPurchaseButton()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    balanceContainer: {
        marginTop: 25,
        alignItems: 'center'
    },
    amountContainer: {
        justifyContent: 'center',
        fontSize: 36,
        color: Cons.COLORS.BLUE,
    },
    tabViewContainer: {
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
        marginTop: 25,
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
    buttonContainer: {
        position: 'absolute',
        justifyContent: 'flex-end',
        alignSelf: 'center',
        bottom: 35,
    },
    buttonText: {
        fontSize: 17,
        fontWeight: 'bold',
    },
});

export default token;
