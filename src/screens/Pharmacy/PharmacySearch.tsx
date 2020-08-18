/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Spinner } from 'native-base';
import {
    Alert,
    View,
    Text,
    Dimensions,
    FlatList,
    Platform,
    StyleSheet,
    PixelRatio,
    TouchableOpacity,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList, Pharma } from '../../navigation/StackNavigator';
import { ListItem, SearchBar } from 'react-native-elements';
import { useTypedSelector } from '../../store/reducers/reducer';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
//import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import { getDistance } from 'geolib';
import { check, request, PERMISSIONS } from 'react-native-permissions';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import handleAxiosErrors from '../../shared/handleAxiosErrors';
import { httpUrl } from '../../../urlServer';
import Cons from '../../shared/Constants';
import fontSize from '../../shared/FontSize';

// Font size management
let FONT_SIZE = fontSize(20, PixelRatio.getFontScale());

type Props = {
    route: RouteProp<HomeStackParamList, 'PharmacySearch'>,
    navigation: StackNavigationProp<HomeStackParamList, 'PharmacySearch'>
};

interface Position {
    latitude: number;
    longitude: number;
}

interface Pharmacy {
    pharmacy_id: number;
    pharmacy_desc: string;
    gps_latitude: number;
    gps_longitude: number;
    distance: number;
}

const PharmacySearch = (props: Props) => {

    const [pharmacies, setPharmacies] = useState([]);
    const [filteredPharmacies, setFilteredPharmacies] = useState([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isGPS, setIsGPS] = useState(false);
    const [showList, setShowList] = useState(true);
    const [currentPosition, setcurrentPosition] = useState({});
    const user = useTypedSelector(state => state.user);
    // const LATITUDE_DELTA = 0.1;
    // const LONGITUDE_DELTA = 0.04;

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
            });
    };

    // Find current user's location. If found, fetch pharmacies from DB
    const locateCurrentPosition = () => {
        Geolocation.getCurrentPosition(
            async position => {
                const curPosition = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.035,
                };
                console.log('Current location:', curPosition);
                setcurrentPosition(curPosition);
                await fetchPharmacies(curPosition);
            },
            error => {
                Alert.alert(error.message);
                console.log('Error on PharmacySearch.js -> locateCurrentPosition(): ', error);
                setIsGPS(false);
            },
            { enableHighAccuracy: true, timeout: 10000/*, maximumAge: 1000*/ }
        );
    };

    // Retrieve all pharmacies from DB
    const fetchPharmacies = async (currentPos: Position) => {
        await axios.get(`${httpUrl}/pharmacy/get`, {
            timeout: 50000,
            headers: {
                authorization: user.token,
            },
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
            .catch(async err => {
                handleAxiosErrors(props, err);
                console.log('Error on PharmacySearch.js -> fetchPharmacies() : ', err);
            });
    };

    // Calculate distance from current location to a given location and store in pharmacies' array
    const calculateDistance = (pharma: [Pharmacy], currentPos: Position) => {
        for (let i = 0; i < pharma.length; i++) {
            (pharma[i].gps_latitude && pharma[i].gps_longitude)
                ? pharma[i].distance = getDistance(
                    { latitude: currentPos.latitude, longitude: currentPos.longitude },
                    { latitude: pharma[i].gps_latitude, longitude: pharma[i].gps_longitude })
                : pharma[i].distance = -1;
        }
    };

    // Give format (km or m) to distance
    const formatDistance = (distance: number) => {
        if (distance >= 1000) {
            return `${(distance / 1000).toFixed(1)} km`;
        } else if (distance > 0) {
            return `${distance.toFixed(1)} m`;
        } else {
            return 'N/A';
        }
    };

    // Show list of pharmacies around
    const renderItemPharmaciesAround = ({ item }: { item: Pharma }) => {
        console.log('values:', item);
        return (
            <ListItem
                title={item.pharmacy_desc}
                rightTitle={formatDistance(item.distance)}
                onPress={() => props.navigation.navigate('PharmacyDetails', { item: item })}
                //onPress={() => props.navigation.navigate('PharmacyDetails', item)}
                bottomDivider
                chevron />
        );
    };

    const updateSearch = (val: string) => {
        setSearch(search);
        setFilteredPharmacies(pharmacies);
        filteredPharmacies;
        const filter = pharmacies
            .filter((item: Pharmacy) => {
                const lowerCaseItem = item.pharmacy_desc.toLowerCase();
                return lowerCaseItem.includes(val.toLowerCase());
            });
        setFilteredPharmacies(filter);
    };

    // TODO: debounce query to launch the search after a few milisecons after typing

    const { height } = Dimensions.get('window');

    return (
        <View style={styles.container}>
            {(isLoading)
                ? <Spinner color="#F4B13E" />
                : <View>
                    <View style={[((height < 685) ? styles.containerNoMapSmallScreen : styles.containerNoMapLargeScreen)]}>
                        <SearchBar
                            placeholder="Search your pharmacy"
                            onChangeText={updateSearch}
                            value={search}
                            autoCapitalize="none"
                            maxLength={100}
                            //selectionColor={Cons.COLORS.ORANGE}
                            inputStyle={styles.searchFieldInput}
                            containerStyle={styles.searchFieldContainer}
                            platform={Platform.OS === 'ios' ? 'ios' : 'android'} />
                        <View style={styles.containerTabView}>
                            <View style={styles.tabViewItem}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setIsLoading(true);
                                        requestLocationPermission();
                                    }}>
                                    <Icon name="ios-refresh" size={25} color="grey" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (isGPS) {
                                            const prev = !showList;
                                            setShowList(prev);
                                        }
                                    }}>
                                    <Text style={(showList) ? styles.unselectedButton : styles.selectedButton}> Map </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (isGPS) {
                                            const prev = !showList;
                                            setShowList(prev);
                                        }
                                    }}>
                                    <Text style={(showList) ? styles.selectedButton : styles.unselectedButton}> List </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={[((height < 685) ? styles.containerMapSmallScreen : styles.containerMapLargeScreen)]}>
                        {showList
                            ? <View>
                                <FlatList
                                    // Sort results by distance
                                    data={filteredPharmacies.sort((a: Pharmacy, b: Pharmacy) => {
                                        return a.distance - b.distance;
                                    })}
                                    keyExtractor={(item: Pharmacy) => item.pharmacy_id.toString()}
                                    renderItem={renderItemPharmaciesAround} />
                            </View>
                            : <MapView
                                style={styles.map}
                                showsUserLocation={true}
                                provider={PROVIDER_GOOGLE}
                                showsMyLocationButton={true}
                                initialRegion={currentPosition}>
                                {filteredPharmacies.map((pharma: Pharmacy) => {
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
                                        </Marker>);
                                    }
                                })}
                            </MapView>
                        }
                    </View>
                </View>
            }
        </View>
    );
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
        height: '100%',
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
        marginRight: 10,
    },
    unselectedButton: {
        fontSize: FONT_SIZE + 5,
        color: Cons.COLORS.DARK_GREY,
        marginRight: 10,
    },
    text: {
        fontSize: FONT_SIZE,
        fontWeight: 'bold',
        color: Cons.COLORS.DARK_GREY,
        marginBottom: 15,
        marginLeft: 10,
    },
    containerTabView: {
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
        height: '25%',
        marginBottom: 20,
    },
    title: {
        fontWeight: 'bold',
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
        justifyContent: 'center',
    },
});

export default PharmacySearch;
