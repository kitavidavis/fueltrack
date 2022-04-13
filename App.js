import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import  AsyncStorage from '@react-native-community/async-storage';
import { StyleSheet, View, ImageBackground, LogBox, Text, SafeAreaView, StatusBar, useColorScheme, Image, ScrollView, Dimensions, useWindowDimensions, Alert as Alert2, PermissionsAndroid} from 'react-native';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { ActivityIndicator, HelperText, Appbar, Badge, TextInput, Button, IconButton, Divider, Searchbar, TouchableRipple, List, BottomNavigation, Banner, Avatar as Avatar1, FAB} from 'react-native-paper';
import { NativeBaseProvider, Radio, Skeleton, useToast, Stack as Stack2, Icon, MaterialIcons, Avatar, Center, Pressable, Link, VStack, Box, Heading, FormControl, Input, Button as Button2, HStack, Text as Text2, WarningOutlineIcon, Alert, CloseIcon, IconButton as IconButton2} from 'native-base';
import {theme, darkTheme} from './theme';
import {TabView, SceneMap, TabBar } from "react-native-tab-view";
import MapView, {Marker} from 'react-native-maps';
import Geolocation from "@react-native-community/geolocation";
import { hydrate } from 'react-dom';
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
          <Stack.Navigator>
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

    const addNewInfo = () => {
      Alert2.alert(
        "New Information",
        "Are you near a gas station?",
        [
          {
            text: "No",
            onPress: () => alert("Make sure you are near to a gas station!"),
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
  const height = (Dimensions.get('window').height);
  return (
    <SafeAreaView style={{flex: 1,}}>
      <StatusBar barStyle={themeFromContext.status}  backgroundColor={themeFromContext.colors.background} />

 <View style={{height: add ? height * 0.5 : height, backgroundColor: themeFromContext.colors.background}}>
   <MapView
    style={styles.map} customMapStyle={themeFromContext.maptheme} showsTraffic={traffic} initialRegion={region} showsIndoorLevelPicker={true} showsPointsOfInterest={false} showsUserLocation={true} showsIndoors={true} >
      <Marker coordinate = {{latitude: -1.3056259012239455,longitude: 36.82388797402382}}
         pinColor = {"purple"} // any color
         style={{height: 100, width: 100, backgroundColor: themeFromContext.colors.background}}
         collapsable={false}
         title={"title"}
         description={"Hello There"}>
           
         </Marker>
   </MapView>
   <View style={styles.trafficBtn}>
     <FAB onPress={() => {setTraffic(!traffic)}} small={true} uppercase={false} style={{backgroundColor: "white"}} icon="car" color="black" />
   </View>
   <View style={styles.themeBtn}>
     <FAB onPress={changeTheme} disabled={add} uppercase={false} small={true} style={{backgroundColor: "white"}} icon="theme-light-dark" color="black" />
   </View>
   <View style={styles.addBtn}>
     <FAB style={{backgroundColor: "white"}} onPress={() => {add ? closeNewInfo() : addNewInfo()}} small={true} uppercase={false} icon={add ? "close" : "plus"} color="black" />
   </View>

  </View>
  {add ? (
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
              setYesFuel(false)
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
                    <FormControl>
                    <FormControl.Label ><Text style={{color: themeFromContext.colors.foreground }} >What's the fuel demand?</Text></FormControl.Label> 
                <Radio.Group name="myRadioGroup2" accessibilityLabel="What's the fuel demand?">
                <Radio value="1" my={1}>
                 <Text style={{color: themeFromContext.colors.foreground, marginLeft: 10}} >High</Text>
                </Radio>
                <Radio value="2" my={1}>
                  <Text style={{color: themeFromContext.colors.foreground, marginLeft: 10}} >Normal</Text>
                </Radio>
                <Radio  value="3" my={1}>
                  <Text style={{color: themeFromContext.colors.foreground, marginLeft: 10}} >Low</Text>
                </Radio>
              </Radio.Group>
                    </FormControl>
        ) : null}
          <Button2 height={height * 0.06} mt="5" bg="orange.700" style={{ height: 45}} size="md" colorScheme="indigo">
            Add Info
          </Button2>
        </VStack>
      </Box>
    </Center>
    </NativeBaseProvider>
    </ScrollView>
    </View>
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
});
export default App;