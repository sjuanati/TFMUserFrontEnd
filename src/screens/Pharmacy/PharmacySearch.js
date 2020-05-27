// Libs
import React, { useState, useEffect } from 'react';
import { Spinner } from 'native-base';
import { Alert, 
        View, 
        Text, 
        Dimensions, 
        FlatList, 
        Platform, 
        StyleSheet,
        PixelRatio, 
        TouchableOpacity } from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
import { useSelector } from 'react-redux';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
//import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import { getDistance } from 'geolib';
import { check, request, PERMISSIONS } from 'react-native-permissions';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

// Global settings
import { httpUrl } from '../../../urlServer';
import Cons from '../../shared/Constants';
import CustomHeaderBack from '../../navigation/CustomHeaderBack';
import showToast from '../../shared/Toast';
import fontSize from '../../shared/FontSize';
import logger from '../../shared/logRecorder';

// Font size management
let FONT_SIZE = fontSize(20, PixelRatio.getFontScale());

const pharmacySearch = (props) => {

    const [pharmacies, setPharmacies] = useState([]);
    const [filteredPharmacies, setFilteredPharmacies] = useState([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isGPS, setIsGPS] = useState(false);
    const [showList, setShowList] = useState(true);
    const [currentPosition, setcurrentPosition] = useState({});
    const user = useSelector(state => state.user);

    useEffect(() => {
        requestLocationPermission();
    }, []);

    // Ask for GPS permission when in use. If granted, find current location
    // TODO: move it as stand-alone function to be called from any screen
    // TODO: control if user disables GPS while app is running.
    const requestLocationPermission = () => {
        console.log('Platform: ', Platform.OS);
        ((Platform.OS === 'android') ? check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION) : check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE))
            .then((res) => {
                console.log('Location response: ', res);
                switch (res) {
                    case 'granted':
                        setIsGPS(true);
                        locateCurrentPosition();
                        break;
                    case 'blocked':
                        // TODO: show instructions to activate it.
                        Alert.alert('Please activate GPS location to search pharmacies');
                        setIsLoading(false);
                        break;
                    case 'denied':
                        ((Platform.OS === 'ios') ? request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE) : request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION))
                            .then(() => {
                                setIsGPS(true);
                                locateCurrentPosition();
                            })
                            .catch(err => { console.log('KO: ', err); });
                        break;
                    case 'unavailable':
                        Alert.alert('GPS is currently unavailable on your device');
                        setIsLoading(false);
                        break;
                    default:
                        break;
                }
            })
    };

    // Find current user's location. If found, fetch pharmacies from DB
    const locateCurrentPosition = () => {
        Geolocation.getCurrentPosition(
            async position => {
                const currentPosition = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.035,
                };
                console.log('Current location:', currentPosition);
                setcurrentPosition(currentPosition);
                await fetchPharmacies(currentPosition);
            },
            error => {
                Alert.alert(error.message);
                console.log('Error on PharmacySearch.js -> locateCurrentPosition(): ', error);
                logger('ERR', 'FRONT-USER', `PharmacySearch.js -> locateCurrentPosition(): ${error}`, '');
                setIsGPS(false);
            },
            { enableHighAccuracy: true, timeout: 10000/*, maximumAge: 1000*/ }
        )
    };

    // Retrieve all pharmacies from DB
    const fetchPharmacies = async (currentPos) => {
        await axios.get(`${httpUrl}/pharmacy/get`, {
            timeout: 50000,
            headers: {
                authorization: user.token
            }
        })
            .then(response => {
                // Prevent app exceptions if timeout is returned without data
                if (response.data !== '') {
                    const data = response.data;
                    calculateDistance(data, currentPos);
                    setPharmacies(data);
                    setFilteredPharmacies(data);
                    setIsLoading(false);
                }
            })
            .catch(async error => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    showToast('Por favor, vuelve a entrar', 'default');
                    await AsyncStorage.clear();
                    props.navigation.navigate('StartScreen');
                } else if (error.response && error.response.status === 400) {
                    showToast('Ha ocurrido un error', 'danger')
                } else {
                    showToast('Ups... parece que no hay conexión', 'warning')
                }
                console.log('Error on PharmacySearch.js -> fetchPharmacies() : ', error);
                logger('ERR', 'FRONT-USER', `PharmacySearch.js -> fetchPharmacies(): ${error}`, '');
            })
    };

    // Calculate distance from current location to a given location and store in pharmacies' array
    const calculateDistance = (pharmacies, currentPos) => {
        for (let i = 0; i < pharmacies.length; i++) {
            (pharmacies[i].gps_latitude && pharmacies[i].gps_longitude) ?
                pharmacies[i].distance = getDistance(
                    { latitude: currentPos.latitude, longitude: currentPos.longitude },
                    { latitude: pharmacies[i].gps_latitude, longitude: pharmacies[i].gps_longitude })
                :
                pharmacies[i].distance = 99999998; //TODO: exclude pharmacies without distance?
        }
    };

    // Give format (km or m) to distance
    const formatDistance = (distance) => {
        if (distance >= 1000) {
            return `${(distance / 1000).toFixed(1)} km`;
        } else {
            return `${distance.toFixed(1)} m`;
        }
    };

    // Show list of pharmacies around
    const renderItemPharmaciesAround = (values) => {
        return (
            <ListItem
                title={values.item.pharmacy_desc}
                rightTitle={formatDistance(values.item.distance)}
                onPress={() => props.navigation.navigate('PharmacyDetails', { item: values.item })}
                bottomDivider
                chevron
            />
        )
    };

    const updateSearch = search => {
        setSearch(search);
        setFilteredPharmacies(pharmacies);
        filteredPharmacies
        const filter = pharmacies
            .filter((item) => {
                const lowerCaseItem = item.pharmacy_desc.toLowerCase()
                return lowerCaseItem.includes(search.toLowerCase())
            });
        setFilteredPharmacies(filter);
    };

    // TODO: debounce query to launch the search after a few milisecons after typing

    const { width, height } = Dimensions.get('window');

    return (
        <View style={styles.container}>
            <CustomHeaderBack {...props} />
            {(isLoading) ?
                <Spinner color='#F4B13E' /> :
                <View>
                    <View style={[((height < 685) ? styles.containerNoMapSmallScreen : styles.containerNoMapLargeScreen)]}>

                        <SearchBar
                            placeholder="Busca tu farmacia..."
                            onChangeText={updateSearch}
                            value={search}
                            autoCapitalize='none'
                            maxLength={100}
                            selectionColor={Cons.COLORS.ORANGE}
                            inputStyle={styles.searchFieldInput}
                            containerStyle={styles.searchFieldContainer}
                            platform={Platform.OS == 'ios' ? 'ios' : 'android'} />

                        <View style={styles.containerTabView}>
                            {/* <Text style = {styles.text}> Encontrar cerca: </Text> */}
                            <View style={styles.tabViewItem}>

                                {/* REFRESH BUTTON */}
                                <TouchableOpacity
                                    onPress={() => {
                                        setIsLoading(true);
                                        requestLocationPermission();
                                    }}>
                                    <Icon name="ios-refresh" size={25} color='grey' />
                                </TouchableOpacity>

                                {/* MAP BUTTON */}
                                <TouchableOpacity
                                    onPress={() => {
                                        if (isGPS) {
                                            const prev = !showList;
                                            setShowList(prev);
                                        }
                                    }}>
                                    <Text style={(showList) ? styles.unselectedButton : styles.selectedButton}> Mapa </Text>
                                </TouchableOpacity>

                                {/* LIST BUTTON */}
                                <TouchableOpacity
                                    onPress={() => {
                                        if (isGPS) {
                                            const prev = !showList;
                                            setShowList(prev);
                                        }
                                    }}>
                                    <Text style={(showList) ? styles.selectedButton : styles.unselectedButton}> Lista </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                    <View style={[((height < 685) ? styles.containerMapSmallScreen : styles.containerMapLargeScreen)]}>
                        {showList ?
                            <View>
                                <FlatList
                                    // Sort results by distance
                                    data={filteredPharmacies.sort((a, b) => {
                                        return a.distance - b.distance
                                    })}
                                    keyExtractor={(item) => item.pharmacy_id.toString()}
                                    renderItem={renderItemPharmaciesAround}
                                >
                                </FlatList>
                            </View>
                            :
                            <MapView
                                style={styles.map}
                                showsUserLocation={true}
                                provider={PROVIDER_GOOGLE}
                                showsMyLocationButton={true}
                                initialRegion={currentPosition}>
                                {filteredPharmacies.map((pharma) => {
                                    console.log(pharma.pharmacy_id)
                                    if (pharma.gps_latitude && pharma.gps_longitude) {
                                        return (<Marker
                                            key={pharma.pharmacy_id.toString()}
                                            tracksViewChanges={false} // To avoid CPU overload
                                            coordinate={{
                                                latitude: pharma.gps_latitude,
                                                longitude: pharma.gps_longitude,
                                            }}>
                                            <Callout
                                                onPress={() => props.navigation.navigate('PharmacyDetails', { item: pharma })}>
                                                <Text> {pharma.pharmacy_desc} </Text>
                                            </Callout>
                                        </Marker>)
                                    }
                                })}
                            </MapView>
                        }
                    </View>
                </View>
            }
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 0.9,
        flexDirection: 'column',
    },
    // WORKAROUND
    containerNoMapLargeScreen: {
        height: '18%',
    },
    containerMapLargeScreen: {
        height: '82%',
    },
    containerNoMapSmallScreen: {
        height: '25%',
    },
    containerMapSmallScreen: {
        height: '75%',
    },
    // END OF WORKAROUND
    map: {
        justifyContent: 'flex-end',
        height: '100%'
    },
    searchFieldInput: {
        marginStart: 25,
    },
    searchFieldContainer: {
        marginBottom: 10,
    },
    selectedButton: {
        fontSize: FONT_SIZE + 5,
        fontWeight: 'bold',
        color: Cons.COLORS.BLACK,
        marginRight: 10
    },
    unselectedButton: {
        fontSize: FONT_SIZE + 5,
        color: Cons.COLORS.DARK_GREY,
        marginRight: 10
    },
    text: {
        fontSize: FONT_SIZE,
        fontWeight: 'bold',
        color: Cons.COLORS.DARK_GREY,
        marginBottom: 15,
        marginLeft: 10,
    },
    containerTabView: {
        //flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    tabViewItem: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginRight: 10,
    },
    myPharmaciesList: {
        height: "25%",
        marginBottom: 20,
    },
    title: {
        fontWeight: "bold",
    },
    subtitle: {
        color: Cons.COLORS.DARK_GREY,
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default pharmacySearch;