import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import  AsyncStorage from '@react-native-community/async-storage';
import { StyleSheet, View, ImageBackground, LogBox, Text, SafeAreaView, StatusBar, useColorScheme, Image, ScrollView, Dimensions, useWindowDimensions, Alert as Alert2, PermissionsAndroid} from 'react-native';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { ActivityIndicator, HelperText, Appbar, Badge, TextInput, Button, IconButton, Divider, Searchbar, TouchableRipple, List, BottomNavigation, Banner, Avatar as Avatar1, FAB} from 'react-native-paper';
import { NativeBaseProvider, Radio, Skeleton, useToast, Stack as Stack2, Icon, MaterialIcons, Avatar, Center, CheckIcon, Pressable, Link, VStack, Box, Heading, FormControl, Input, Button as Button2, Modal, HStack, Text as Text2, WarningOutlineIcon, Alert, CloseIcon, Checkbox, Select, IconButton as IconButton2} from 'native-base';
import {theme, darkTheme} from './theme';
import {TabView, SceneMap, TabBar } from "react-native-tab-view";
import MapView, {Marker} from 'react-native-maps';
import Geolocation from "@react-native-community/geolocation";
import Geocoder from 'react-native-geocoding';
import MapViewDirections from 'react-native-maps-directions';
import { hydrate } from 'react-dom';
import axios from 'axios';
// ignoring all unnecessary warnings
LogBox.ignoreAllLogs();
LogBox.ignoreLogs(['NativeBase:']);

const AuthContext = React.createContext(); //authentication context
const ThemeContext = React.createContext({});

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const App = ({ navigation }) => {
  const [dark, setDarkMode] = React.useState(false);
  const colorScheme = useColorScheme();
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type){
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
          case 'SIGN_IN':
            return {
              ...prevState,
              isSignout: false,
              userToken: action.token,
            };
            case 'SIGN_OUT':
              return {
                ...prevState,
                isSignout: true,
                userToken: null
              };
              case 'SIGN_UP':
                return {
                  ...prevState,
                  isSignout: false,
                  userToken: action.token
                }
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null
    }
  );

const onSync = React.useCallback(() => {
// sync server, theme, location etc
 colorScheme === 'dark' ? setDarkMode(true) : null;

}, []);

  React.useEffect(() => {
    // hide splashscreen, if available
    const sessionAuth = async () => {
      let userToken;
      let user_id;

      try {
        userToken = "user";
        user_id = "user_id";

        if(userToken !== null && user_id !== null){
          // verify validity of token from database
          // recreate a new token
        }
      } catch(e){
        console.log(e);
      }

      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    sessionAuth();

    const checkTheme = async() => {
      let mode = await AsyncStorage.getItem("theme");
      if(mode === 'dark'){
        setDarkMode(true);
      } else {
        setDarkMode(false);
      }
    }

    checkTheme();

    async function requestLocation(){
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          title: "Location Permission",
          message: "Allow FuelTrack to access your location",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "Ok"
        }
      );
    }

    requestLocation();

    let timer = setInterval(function(){onSync}, 1000);

    return () => {
      clearInterval(timer);
    }

  }, []);

  
const authContext = React.useMemo(
  () => ({
    signIn: async (data) => {
      dispatch({type: 'SIGN_IN', token: data.email});
      await AsyncStorage.setItem('userToken', data.email);
      await AsyncStorage.setItem('user_id', data.password);
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem('userToken');
        dispatch({type: 'SIGN_OUT'});
      } catch(e) {
        console.log(e);
      }
    },
    signUp: async (data) => {
      dispatch({type: 'SIGN_IN', token: data.token});
      await AsyncStorage.setItem('userToken', data.token);
      await AsyncStorage.setItem('user_id', data.id);
    },
    changeTheme: async() => {
      let mode = await AsyncStorage.getItem("theme");
      if(mode === 'dark'){
        setDarkMode(false);
        await AsyncStorage.setItem("theme", "light");
      } else {
        setDarkMode(true);
        await AsyncStorage.setItem("theme", "dark");
      }
    }
  }),
  []
);

  const drawerWidth = (Dimensions.get('window').width) * 0.8;
  const height = (Dimensions.get('window').height);
  return (
    <ThemeContext.Provider value={dark ? darkTheme : theme}>
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.isLoading ? (
          <Stack.Navigator>
            <Stack.Screen name="Welcome" component={WelcomePage} options={{headerShown: false}} />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator initialRouteName='Info'>
            <Stack.Screen name='Info' component={InfoPage} options={{headerShown: false}} />
          <Stack.Screen name="Home" component={HomePage} options={{headerShown: false}} />
        </Stack.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
    </ThemeContext.Provider>
  )

}

const WelcomePage = ({ navigation }) => {
const themeFromContext = React.useContext(ThemeContext);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'indigo'}} >
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} >
      <StatusBar barStyle='light-content' backgroundColor="indigo" />
   <ActivityIndicator size={30} animating={true} color={themeFromContext.colors.success} />
    </View>
  </SafeAreaView>
  )
}


const InfoPage = ({ navigation }) => {
  const themeFromContext = React.useContext(ThemeContext);
  const height = (Dimensions.get('window').height);
    return (
      <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeFromContext.colors.background}} >
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeFromContext.colors.background}} >
      <StatusBar barStyle={themeFromContext.status}  backgroundColor={themeFromContext.colors.background} />
      <Image source={require('./assets/logo.png')} style={{width: 200, height: 200, borderRadius: 150, marginTop: height * 0.2,}} />
      <NativeBaseProvider  >
      <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290" justifyContent="center" safeAreaBottom="5">
        <Heading size="sm" fontWeight="600" color={themeFromContext.colors.foreground} _dark={{
        color: "white"
      }}>
       FuelTrack is a free crowdsourcing platform for drivers. It monitors gas stations with fuel, as well as the 
       demand for that fuel.
        </Heading>
        <VStack space={3} mt="5">


          <Button2 onPress={() => {navigation.navigate("Home")}}  mt="5" bg="orange.700" style={{ height: 45}} size="md" colorScheme="indigo">
            Get Started
          </Button2>
        </VStack>
      </Box>
    </Center>
    </NativeBaseProvider>
    </View>
    </SafeAreaView>
    )
  }

const HomePage = ({ navigation }) => {
  const themeFromContext = React.useContext(ThemeContext);
  const [traffic, setTraffic] = React.useState(false);
  const { changeTheme } = React.useContext(AuthContext);
  const [add, setAdd] = React.useState(false);
  const [demand, setDemand] = React.useState(false);
  const [yesfuel, setYesFuel] = React.useState(false);
  const [region, setRegion] = React.useState({
    latitude: -1.3056259012239455,
    longitude: 36.82388797402382,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1
  });

  const [markregion, setMarkRegion] = React.useState({
    latitude: null,
    longitude: null,
    uuid: null,
    fuel: false,
    demand: null,
    name: null,
  });

  const [changeview, setChangeView] = React.useState(false);

  const API = "....";
  Geocoder.init(API);

  const [markers, setMarkers] = React.useState([]);
  const [lowd, setLowD] = React.useState([]);
  const [normald, setNormalD] = React.useState([]);
  const [highd, setHighD] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [name, setName] = React.useState(null);
  const [filter, setFilter] = React.useState(null);
  const [temp, setTemp] = React.useState(null);
  const [mounted_, setMounted] = React.useState(false);
  const [ctx, setContext] = React.useState(false);
  const [direction, setDirection] = React.useState(false);
  const [min, setMin] = React.useState(false);
  const [distance, setDistance] = React.useState(null);
  const [duration, setDuration] = React.useState(null);
  const [stroke, setStroke] = React.useState("cyan");
  const [fuel, setFuel] = React.useState("");
  const [station, setStation] = React.useState("");
  const [alert, setAlert] = React.useState(false);

  const geolocate = async() => {
    Geolocation.getCurrentPosition(async position => {
      setRegion({
        latitude: parseFloat(position.coords.latitude),
        longitude: position.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      if(position.coords.latitude != null){
        await Geocoder.from(parseFloat(position.coords.latitude), parseFloat(position.coords.longitude)).then(
           json => {
            var addressComp = json.results[0].formatted_address;
            if(addressComp != null){
              setName(addressComp);
            }
          }
        )
      }
    }, error => console.log(error),);
  };

  async function fetchData(){
    var uri = "https://fluxservice.herokuapp.com/fuel/all";
    try{
      await axios.post(uri).then(function(response){
       if(response.status === 200){
         let data = response.data.data;
         setMarkers(data);
       }
     }).catch(function(error){
       console.log(error);
     })
   } catch(e){
     console.log(e);
   }
  }

  const engine = React.useCallback(() => {
    fetchData();
}, []);

  React.useEffect(() => {
    geolocate();
    fetchData();
    const checkAlert = async() => {
      let al = await AsyncStorage.getItem("alert");
      if(al != null){
        setAlert(false);
      } else {
        setAlert(true);
      }
    }

    checkAlert();
    var timer = setInterval(function(){engine()}, 10000);

    return () => {
      clearInterval(timer);
    }
  }, []);

  const addData = () => {
    axios.post("https://fluxservice.herokuapp.com/fuel/newMarker", {
      latitude: region.latitude,
      longitude: region.longitude,
      name: name,
      fuel: yesfuel,
      demand: demand,
      station: station,
      fuelType: fuel
    }).then(function(response){
      if(response.status === 200){
        console.log("done");
        closeNewInfo();
      }
    })
  }
    const addNewInfo = () => {
      Alert2.alert(
        "New Information",
        "Are you near a gas station?",
        [
          {
            text: "No",
            style: "cancel"
          },
          { text: "Yes", onPress: () => setAdd(true) }
        ]
      );
      }

      const closeNewInfo = () => {
        setAdd(false);
        setYesFuel(false);
      }

      const toggleStroke = () => {
        let i = Math.floor(Math.random() * 7);
        let colors = ["red", "green", "cyan", "pink", "orange", "blue", "yellow"];
        setStroke(colors[i]);
      }

      const clearCanvas = () => {
        setDirection(false);
      }

      const handleCloseAlert = async () => {
        await AsyncStorage.setItem("alert", "Closed");
        setAlert(false);
      }
  const height = (Dimensions.get('window').height);
  return (
    <SafeAreaView style={{flex: 1,}}>
      <StatusBar barStyle={themeFromContext.status}  backgroundColor={themeFromContext.colors.background} />

 <View style={{height: add || ctx ? height * 0.5 : height, backgroundColor: themeFromContext.colors.background}}>
   <MapView
    style={styles.map} customMapStyle={themeFromContext.maptheme} showsTraffic={traffic} initialRegion={changeview ? markregion : region} showsIndoorLevelPicker={true} showsPointsOfInterest={false} showsUserLocation={true} showsIndoors={true} >
      { direction ? (
        <MapViewDirections
        origin={{latitude: region.latitude, longitude: region.longitude}}
        destination={{latitude: markregion.latitude, longitude: markregion.longitude}}
        apikey={API}
        strokeWidth={8}
        strokeColor={stroke}
        onReady={(data) => {
          setDistance(Math.round(data.distance));
          setDuration(Math.round(data.duration));
        }}
        />
      ) : null}
      {filter === null ? (
              markers.map((mark, idx) => {
                return (
                  <Marker onPress={async () => {
                    let addr;
                    await Geocoder.from(mark.latitude, mark.longitude).then(json => {
                      addr = json.results[0].formatted_address;

                    })
                    setMarkRegion({
                      latitude: mark.latitude,
                      longitude: mark.longitude,
                      uuid: mark.uuid,
                      fuel: mark.fuel,
                      demand: mark.demand,
                      name: addr,
                      station: mark.station,
                      fuelType: mark.fuelType
                    });
        
                    setContext(true);
                  }} key={idx} coordinate = {{latitude: mark.latitude,longitude: mark.longitude}}
                  pinColor = {mark.demand === 'Low' ? "green" : mark.demand === 'Normal' ? "yellow" : "red"} // any color
                  style={{height: 100, width: 100, backgroundColor: themeFromContext.colors.background}}
                  collapsable={false}>
                    
                  </Marker>
                )
              })
      ) : filter === 'Low' ? (
        lowd.map((mark, idx) => {
          return (
            <Marker onPress={() => {
              setMarkRegion({
                latitude: mark.latitude,
                longitude: mark.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
              });
  
              setChangeView(true);
            }} key={idx} coordinate = {{latitude: mark.latitude,longitude: mark.longitude}}
            pinColor = {mark.demand === 'Low' ? "green" : mark.demand === 'Normal' ? "yellow" : "red"} // any color
            style={{height: 100, width: 100, backgroundColor: themeFromContext.colors.background}}
            collapsable={false}>
              
            </Marker>
          )
        })
      ) : filter === 'Normal' ? (
        normald.map((mark, idx) => {
          return (
            <Marker onPress={() => {
              setMarkRegion({
                latitude: mark.latitude,
                longitude: mark.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
              });
  
              setChangeView(true);
            }} key={idx} coordinate = {{latitude: mark.latitude,longitude: mark.longitude}}
            pinColor = {mark.demand === 'Low' ? "green" : mark.demand === 'Normal' ? "yellow" : "red"} // any color
            style={{height: 100, width: 100, backgroundColor: themeFromContext.colors.background}}
            collapsable={false}>
              
            </Marker>
          )
        })
      ) : (
        highd.map((mark, idx) => {
          return (
            <Marker onPress={() => {
              setMarkRegion({
                latitude: mark.latitude,
                longitude: mark.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
              });
  
              setChangeView(true);
            }} key={idx} coordinate = {{latitude: mark.latitude,longitude: mark.longitude}}
            pinColor = {mark.demand === 'Low' ? "green" : mark.demand === 'Normal' ? "yellow" : "red"} // any color
            style={{height: 100, width: 100, backgroundColor: themeFromContext.colors.background}}
            collapsable={false}>
              
            </Marker>
          )
        })
      )}

      <NativeBaseProvider>
      <Center>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton color={themeFromContext.colors.foreground}/>
          <Modal.Header bg={themeFromContext.colors.background}><Text style={{color: themeFromContext.colors.foreground,}} >Filter</Text></Modal.Header>
          <Modal.Body bg={themeFromContext.colors.background}>
          <FormControl>
                    <FormControl.Label ><Text style={{color: themeFromContext.colors.foreground }} >Filter by fuel demand</Text></FormControl.Label> 
                <Radio.Group name="myRadioGroup3" onChange={(value) => {
                  setTemp(value);
                }} accessibilityLabel="Choose Filter Level">
                <Radio value="High" my={1}>
                 <Text style={{color: themeFromContext.colors.foreground, marginLeft: 10}} >High</Text>
                </Radio>
                <Radio value="Normal" my={1}>
                  <Text style={{color: themeFromContext.colors.foreground, marginLeft: 10}} >Normal</Text>
                </Radio>
                <Radio  value="Low" my={1}>
                  <Text style={{color: themeFromContext.colors.foreground, marginLeft: 10}} >Low</Text>
                </Radio>
              </Radio.Group>
                    </FormControl>
          </Modal.Body>
          <Modal.Footer bg={themeFromContext.colors.background}>
            <Button2.Group space={2}>
              <Button2 variant="ghost" colorScheme="blueGray" onPress={() => {
              setShowModal(false);
            }}>
                <Text style={{color: themeFromContext.colors.foreground}} >Cancel</Text>
              </Button2>
              <Button2 onPress={() => {
                setFilter(temp);
              setShowModal(false);
            }}>
                Filter
              </Button2>
            </Button2.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
      </NativeBaseProvider>
   </MapView>
   <View style={styles.trafficBtn}>
     <FAB onPress={() => {setTraffic(!traffic)}} small={true} uppercase={false} style={{backgroundColor: "white"}} icon="car" label='Traffic' color="black" />
   </View>
   <View style={styles.themeBtn}>
     <FAB onPress={changeTheme} disabled={add} uppercase={false} small={true} style={{backgroundColor: "white"}} icon="theme-light-dark" label='Theme' color="black" />
   </View>
    {!ctx ? (
         <View style={styles.addBtn}>
         <FAB style={{backgroundColor: "white"}} onPress={() => {add ? closeNewInfo() : addNewInfo()}} small={true} uppercase={false} label={add ? "Close Panel" : "Add New"} icon={add ? "close" : "plus"} color="black" />
       </View>
    ) : null}

{direction && !ctx ? (
       <View style={styles.clearBtn}>
       <FAB style={{backgroundColor: "white"}} small={true} uppercase={false} onPress={() => {
        clearCanvas() }} icon="chevron-left" label='Exit Station' color="black" />
     </View>
  ) : null}
  {alert ? (
    <View style={{position: 'absolute', bottom: 30, left: 10, right: 10}}>
    <NativeBaseProvider>
    <Alert w="100%" status="info" colorScheme="info">
    <VStack space={2} flexShrink={1} w="100%">
      <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
        <HStack flexShrink={1} space={2} alignItems="center">
          <Alert.Icon />
          <Text fontSize="md" fontWeight="medium" color="coolGray.800">
            Hi, Welcome. Simple usage steps:
          </Text>
        </HStack>
        <IconButton2 onPress={() => {handleCloseAlert()}} variant="unstyled" _focus={{
        borderWidth: 0
      }} icon={<CloseIcon size="3" color="coolGray.600" />} />
      </HStack>
      <Box pl="6" _text={{
      color: "coolGray.600"
    }}>
        1. Click the Traffic button to toggle traffic overlay.{"\n"}
        2. Click theme button to toggle light/dark theme.{"\n"}
        3. Click Add new to add a new station.{"\n"}
        4. Click the marker on the map to get more details about the station.{"\n"}

        Nice Journey ;)
      </Box>
    </VStack>
  </Alert>
    </NativeBaseProvider>
</View>
  ) : null}
  </View>
  {add && !ctx  ? (
    <View style={{height: height * 0.5, backgroundColor: themeFromContext.colors.background}}>
      <ScrollView>
      <NativeBaseProvider  >
      <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290" justifyContent="center" safeAreaBottom="5">
        <Heading size="xs" fontWeight="600" color={themeFromContext.colors.foreground} _dark={{
        color: "white"
      }}>
        This system assumes that you are near a gas station. Your coordinates are collected in background!
        </Heading>
        <VStack space={3} mt="5">
          <FormControl>
          <FormControl.Label ><Text style={{color: themeFromContext.colors.foreground }} >Is there fuel here?</Text></FormControl.Label>
          <Radio.Group name="myRadioGroup" accessibilityLabel="Is there fuel here?" onChange={(value) => {
            if(value === "1"){
              setYesFuel(true)
            } else {
              setYesFuel(false);
              setDemand("Low");
            }
          }} >
      <Radio  value="1" my={1}>
        <Text style={{color: themeFromContext.colors.foreground, marginLeft: 10}} onPress={() => {setYesFuel(true)}} >Yes</Text>
      </Radio>
      <Radio value="2" my={1}>
       <Text style={{color: themeFromContext.colors.foreground, marginLeft: 10}} onPress={() => {setYesFuel(false)}} >No</Text>
      </Radio>
    </Radio.Group>
          </FormControl>
        {yesfuel ? (
                    <View>
                                          <FormControl>
                    <FormControl.Label ><Text style={{color: themeFromContext.colors.foreground }} >Fuel</Text></FormControl.Label> 
    <Radio.Group name="myRadioGroup4" onChange={(value) => {
                  setFuel(value);
                }} accessibilityLabel="What's the fuel demand?">
                <Radio value="Diesel" my={1}>
                 <Text style={{color: themeFromContext.colors.foreground, marginLeft: 10}} >Diesel</Text>
                </Radio>
                <Radio value="Petrol" my={1}>
                  <Text style={{color: themeFromContext.colors.foreground, marginLeft: 10}} >Petrol</Text>
                </Radio>
                <Radio  value="Both" my={1}>
                  <Text style={{color: themeFromContext.colors.foreground, marginLeft: 10}} >Both Petrol & Diesel</Text>
                </Radio>
                <Radio  value="V-Power" my={1}>
                  <Text style={{color: themeFromContext.colors.foreground, marginLeft: 10}} >V-Power</Text>
                </Radio>
              </Radio.Group>
                    </FormControl>
                    <FormControl my={5}>
                    <FormControl.Label ><Text style={{color: themeFromContext.colors.foreground }} >Station</Text></FormControl.Label> 
                    <Select selectedValue={station} bg="white" color={themeFromContext.colors.background} minWidth="200" accessibilityLabel="Choose Station" placeholder="Choose Station" _selectedItem={{
        bg: "teal.600",
        endIcon: <CheckIcon size="5" />
      }} mt={1} onValueChange={itemValue => setStation(itemValue)}>
          <Select.Item label="Astro" value="Astro" />
          <Select.Item label="Delta" value="Delta" />
          <Select.Item label="Engen" value="Engen" />
          <Select.Item label="Gulf" value="Gulf" />
          <Select.Item label="Hashi" value="Hashi" />
          <Select.Item label="Hass" value="Hass" />
          <Select.Item label="Lexo" value="Lexo" />
          <Select.Item label="Luqman" value="Luqman" />
          <Select.Item label="National Oil" value="Naitional Oil" />
          <Select.Item label="Ola" value="Ola" />
          <Select.Item label="Petrocity" value="Petrocity" />
          <Select.Item label="Riva" value="Riva" />
          <Select.Item label="Rubis" value="Rubis" />
          <Select.Item label="Shell" value="Shell" />
          <Select.Item label="Tosha" value="Tosha" />
          <Select.Item label="Total" value="total" />
        </Select>
                    </FormControl>
                    <FormControl>
                    <FormControl.Label ><Text style={{color: themeFromContext.colors.foreground }} >What's the fuel demand?</Text></FormControl.Label> 
                <Radio.Group name="myRadioGroup2" onChange={(value) => {
                  setDemand(value);
                }} accessibilityLabel="What's the fuel demand?">
                <Radio value="High" my={1}>
                 <Text style={{color: themeFromContext.colors.foreground, marginLeft: 10}} >High</Text>
                </Radio>
                <Radio value="Normal" my={1}>
                  <Text style={{color: themeFromContext.colors.foreground, marginLeft: 10}} >Normal</Text>
                </Radio>
                <Radio  value="Low" my={1}>
                  <Text style={{color: themeFromContext.colors.foreground, marginLeft: 10}} >Low</Text>
                </Radio>
              </Radio.Group>
                    </FormControl>
                    </View>
        ) : null}
          <Button2 onPress={() => {addData()}} height={height * 0.06} mt="5" bg="orange.700" style={{ height: 45}} size="md" colorScheme="indigo">
            Add Info
          </Button2>
        </VStack>
      </Box>
    </Center>
    </NativeBaseProvider>
    </ScrollView>
    </View>
  ) : ctx && !add ? (
    !min ? (
      <View style={{height: height * 0.5, backgroundColor: themeFromContext.colors.background}}>
      <ScrollView>
        <NativeBaseProvider  >
        <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290" justifyContent="center" safeAreaBottom="5">
        <Heading my={1} size="sm" fontWeight="600" color={themeFromContext.colors.foreground} _dark={{
          color: "white"
        }}>
          Approx. Name: {markregion.name}
          </Heading>
          <Heading my={1} size="sm" fontWeight="600" color={themeFromContext.colors.foreground} _dark={{
          color: "white"
        }}>
          Has Fuel: {markregion.fuel ? "Yes" : "No"}
          </Heading>
          <Heading my={1} size="sm" fontWeight="600" color={themeFromContext.colors.foreground} _dark={{
          color: "white"
        }}>
          Station: {markregion.station}
          </Heading>
          <Heading my={1} size="sm" fontWeight="600" color={themeFromContext.colors.foreground} _dark={{
          color: "white"
        }}>
          Fuel Type: {markregion.fuelType}
          </Heading>
          <Heading my={1} size="sm" fontWeight="600" color={themeFromContext.colors.foreground} _dark={{
          color: "white"
        }}>
          Fuel Demand: {markregion.demand}
          </Heading>
  
        {distance !== null ? (
                  <Heading my={1} size="sm" fontWeight="600" color={themeFromContext.colors.foreground} _dark={{
                    color: "white"
                  }}>
                    Approx. Distance: {distance + " KM"}
                    </Heading>
        ) : null}
  
  {duration !== null ? (
                  <Heading my={1} size="sm" fontWeight="600" color={themeFromContext.colors.foreground} _dark={{
                    color: "white"
                  }}>
                    Approx. Duration: {duration + " minutes"}
                    </Heading>
        ) : null}
  
  
          <VStack space={3} mt="5">
  
            <Button2 onPress={() => {setDirection(true)}} height={height * 0.06} mt="5" bg="cyan.700" style={{ height: 45}} size="md" colorScheme="indigo">
              Show Direction
            </Button2>
  
          </VStack>
          <VStack space={3} mt="1">
  
  <Button2 onPress={() => {setContext(false)}} height={height * 0.06} mt="5" bg="orange.700" style={{ height: 45}} size="md" colorScheme="indigo">
    Close Panel
  </Button2>
  
  </VStack>
        </Box>
      </Center>
      </NativeBaseProvider>
      </ScrollView>
      </View>
    ) : null
  ) : null}
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: '#e91e63',
  },
  indicator: {
    backgroundColor: '#ffeb3b',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  trafficBtn: {
    position: 'absolute',
    top: 10,
    left: 20,
  },
  themeBtn: {
    position: 'absolute',
    top: 70,
    left: 20,
  },
  addBtn: {
    position: 'absolute',
    top: 130,
    left: 20,
  },
  filterBtn: {
    position: 'absolute',
    top: 190,
    left: 20
  },
  clearBtn: {
    position: 'absolute',
    top: 190,
    left: 20
  }
});
export default App;
