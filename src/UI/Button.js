import React from 'react';
import {Text, TouchableOpacity} from 'react-native';

import globalStyles from './Style'

const button = (params) => {

    return (
        <TouchableOpacity
        style =  {globalStyles.button}
        onPress={() => params.nav.navigate(params.target)}>
            <Text style={[globalStyles.buttonText, params.style]}> {params.desc} </Text>
        </TouchableOpacity>
    )
}

export default button;
