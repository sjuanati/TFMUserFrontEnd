import React, { useState, useEffect } from 'react';
import {
    Spinner, 
    Header,
    Text,
    Container,
    Body 
} from "native-base";
import { 
    View,
    Dimensions,
    Image,
    StyleSheet 
} from 'react-native';
import axios from 'axios';
import {encode as btoa} from 'base-64'
import { useSelector } from 'react-redux';
import { httpUrl } from '../../../urlServer';
import CustomHeaderBack from '../../navigation/CustomHeaderBack';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';

const { width } = Dimensions.get('window');
const SIZE = width;

const getOrderImage = ( props ) => {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState();
  const [orderUrl, setOrderUrl] = useState();
  const user = useSelector(state => state.user);

  useEffect(() => {
    startFunctions()
      .catch(error => {
        console.warn(JSON.stringify(error));
      });
  }, []);

  const startFunctions = async () => {
    try {
      let ordr = props.navigation.getParam('order');
      setOrder(ordr);
      await chargeImage(ordr, user.token);
    } catch (error) {
      throw error;
    }
  };

  const chargeImage = async (ordr, tkn) => {
    await axios.get(`${httpUrl}/order/getLinePhoto`, {
      params: { photo: ordr.photo},
      headers: { authorization: tkn }
    })
      .then(response => {
        let base64Flag = 'data:image/jpeg;base64,';
        let imageStr = response.data.Body.data;
        let binary = '';
        let bytes = new Uint8Array(imageStr);
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        let src = btoa(binary);
        setOrderUrl(base64Flag + src);
        setLoading(false);
      })
      .catch(error => console.warn('Error at Home.js -> fetchPharmacy() :', error))

    setLoading(false);
  };


  return (
    <Container>
      <CustomHeaderBack {...props} />
      {(loading) ?
        <Spinner color='#F4B13E' /> :
        <Container>
          <Header noShadow style={styles.headerTitle}>
            <Body>
              <Text>
                {order.item_desc}
              </Text>
            </Body>
          </Header>
        <View style={styles.containerImage}>
            <ReactNativeZoomableView
                maxZoom={1.6}
                minZoom={1}
                zoomStep={0.5}
                initialZoom={1}
                bindToBorders={true}
                captureEvent={true}>
                    {<Image 
                        source={{uri: orderUrl}}
                        style={styles.image}/>}
            </ReactNativeZoomableView>
          </View>
        </Container>
      }
    </Container>
  )
};

const styles = StyleSheet.create({
  headerTitle: {
    borderWidth: 0,
    alignItems: 'flex-start',
    backgroundColor: 'transparent'
  },
  containerImage: {
    width: SIZE, 
    height: SIZE, 
    marginTop: 120
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain'
  }
});

export default getOrderImage;