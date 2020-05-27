// Libs
import React from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { removeItem } from '../../store/actions/order';

// Components
import globalStyles from '../../UI/Style';
import CustomHeaderBack from '../../navigation/CustomHeaderBack';
import DeletePhoto from '../../shared/DeletePhoto';
import Cons from '../../shared/Constants';

const makeOrderDetail = (props) => {

    const item_id_tmp = props.navigation.getParam('item_id_tmp');
    const item_description = props.navigation.getParam('item_description');
    const itemPhoto = props.navigation.getParam('itemPhoto');
    const dispatch = useDispatch();

    const handleRemoveItem = () => {
        DeletePhoto([{itemPhoto: itemPhoto}])
        dispatch(removeItem(item_id_tmp));
        props.navigation.goBack()
    };

    const showPhoto = () => (
        <Image
            source={itemPhoto ? { uri: itemPhoto } : null}
            style={styles.photoOrder} />
    );

    const showOverview = () => (
        <View style={styles.container_body}>
            <Text style={styles.itemHeader}> Detalle Item {item_id_tmp}</Text>
        </View>
    );

    const showItem = () => (
        <View style={styles.text}>
            <Text> {item_description} </Text>
        </View>
    )

    const showButtons = () => (
        <View style={styles.container_bottom}>
            <TouchableOpacity
                style={globalStyles.button}
                onPress={() => handleRemoveItem()}>
                <Text style={globalStyles.buttonText}> Eliminar </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={globalStyles.button}
                onPress={() => props.navigation.goBack()}>
                <Text style={globalStyles.buttonText}> Volver </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>

            <CustomHeaderBack {...props} />

            {showOverview()}

            {showItem()}

            {showPhoto()}

            {showButtons()}

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    container_body: {
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: Cons.COLORS.WHITE,
        paddingBottom: 20,
    },
    container_bottom: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        marginBottom: 25,
    },
    text: {
        margin: 20,
        fontSize: 20,
    },
    itemHeader: {
        paddingTop: 10,
        paddingBottom: 5,
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',  // gray
        flexDirection: 'row',
    },
    photoOrder: {
        width: '100%',
        height: 200
    },
});

export default makeOrderDetail;
