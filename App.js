import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import  AsyncStorage from '@react-native-community/async-storage';
import { StyleSheet, View, ImageBackground, LogBox, Text, SafeAreaView, StatusBar, useColorScheme, Image, ScrollView, Dimensions, useWindowDimensions} from 'react-native';
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import { ActivityIndicator, Appbar, Badge, TextInput, Button, IconButton, Divider, Searchbar, TouchableRipple, List, BottomNavigation, Banner, Avatar as Avatar1} from 'react-native-paper';
import { NativeBaseProvider, Skeleton, useToast, Stack as Stack2, Icon, MaterialIcons, Avatar, Center, Pressable, Link, VStack, Box, Heading, FormControl, Input, Button as Button2, HStack, Text as Text2, WarningOutlineIcon, Alert, CloseIcon, IconButton as IconButton2} from 'native-base';
import {theme, darkTheme} from './theme';
import {TabView, SceneMap, TabBar } from "react-native-tab-view";
import MapView from 'react-native-maps';
import { LineChart, ContributionGraph, PieChart } from 'react-native-chart-kit';
import BasicInfo from "./components/account/basic";
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
        userToken = await AsyncStorage.getItem('userToken');
        user_id = await AsyncStorage.getItem('user_id');

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
        ) : state.userToken === null ? (
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginPage} options={{headerShown: false}}  />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} options={{headerShown: false}}  />
            <Stack.Screen name="Register" component={RegisterPage} options={{headerShown: false}}  />
          </Stack.Navigator>
        ) : (
          <Drawer.Navigator drawerStyle={{width: drawerWidth}} initialRouteName="Home" drawerContentOptions={
            {
              drawerItemStyle: {
                color: dark ? darkTheme.colors.foreground : theme.colors.foreground,
                height: 20,
              },
              labelStyle: {
                color: dark ? darkTheme.colors.foreground : theme.colors.foreground,
                marginLeft: 0,
              },
              activeBackgroundColor: dark ? "grey" : "#E0FFFF",
              drawerType: 'slide',
              drawerStyle: {width: drawerWidth},
              drawerLabelStyle: {color: dark ? darkTheme.colors.foreground : theme.colors.foreground},
            }
          }
          drawerContent={(props) => {
            return (
              <SafeAreaView style={{flex: 1, backgroundColor: dark ? darkTheme.colors.background : theme.colors.background}}>
                <ScrollView>
                <View style={{flexDirection: 'row', height: height * 0.14,}}>
                <NativeBaseProvider >
                  <View style={{flex: 1, height: 100, alignItems: "flex-start", justifyContent: "center", marginLeft: 30}}>
                    <Avatar style={{width: 70, height: 70}} bg="lightBlue.400" source={{uri: ""}}>
        DK
        <Avatar.Badge bg="green.500" />
      </Avatar>
                  </View>
                  </NativeBaseProvider>
                  <View style={{flex: 2, height: 100, alignItems: "flex-start", justifyContent: "center", textAlignVertical: "center", marginLeft: 10}}>
                    <Text style={{fontSize: 20, color: dark ? darkTheme.colors.foreground : theme.colors.foreground}}>David Kitavi</Text>
                   <Text style={{fontSize: 13, color: dark ? darkTheme.colors.success : theme.colors.danger}}>5% </Text>
                  </View>
                </View>
                <View style={{flex: 2, flexDirection: 'column', justifyContent: 'flex-start', marginBottom: height * 0.04}}>
                    <DrawerItemList  {...props} />

                </View>
                </ScrollView>
              </SafeAreaView>
            )
          }} >
            <Drawer.Screen name="Home" component={HomePage} options={{drawerLabel: 'Tasks', header: () => {return true}, drawerIcon: ({focused, size}) => (  <IconButton
      icon="car"
      color= {dark ? darkTheme.colors.foreground : theme.colors.foreground}
      size={20}
      onPress={() => {navigation.navigate("Home")}}
    />
             ),}} />
    <Drawer.Screen name="Payments" component={PaymentsPage} options={{drawerLabel: 'Earnings', header: () => {return true}, drawerIcon: ({focused, size}) => (  <IconButton
      icon="chart-line-variant"
      color= {dark ? darkTheme.colors.foreground : theme.colors.foreground}
      size={20}
      onPress={() => console.log('Pressed')}
    />
             ),}} />
                 <Drawer.Screen name="Account" component={AccountPage} options={{drawerLabel: 'Account', header: () => {return true}, drawerIcon: ({focused, size}) => (  <IconButton
      icon="account"
      color= {dark ? darkTheme.colors.foreground : theme.colors.foreground}
      size={20}
      onPress={() => console.log('Pressed')}
    />
             ),}} />

<Drawer.Screen name="Settings" component={SettingsPage} options={{drawerLabel: 'Settings', header: () => {return true}, drawerIcon: ({focused, size}) => (  <IconButton
      icon="cog"
      color= {dark ? darkTheme.colors.foreground : theme.colors.foreground}
      size={20}
      onPress={() => console.log('Pressed')}
    />
             ),}} />
          <Drawer.Screen name="Emergency" component={EmergencyPage} options={{drawerLabel: 'Emergency', header: () => {return true}, drawerIcon: ({focused, size}) => (  <IconButton
      icon="alert"
      color= {dark ? darkTheme.colors.foreground : theme.colors.foreground}
      size={20}
      onPress={() => console.log('Pressed')}
    />
             ),}} />
          <Drawer.Screen name="Terms" component={TermsPage} options={{drawerLabel: 'Privacy, Terms & FAQs', header: () => {return true}, drawerIcon: ({focused, size}) => (  <IconButton
      icon="information"
      color= {dark ? darkTheme.colors.foreground : theme.colors.foreground}
      size={20}
      onPress={() => console.log('Pressed')}
    />
             ),}} />

          </Drawer.Navigator>
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

const LoginPage = ({ navigation }) => {
  const { signIn } = React.useContext(AuthContext);
  const themeFromContext = React.useContext(ThemeContext);
  const [user_id, setUserId] = React.useState('');
  const [token, setToken] = React.useState('');
  const [security, setSecure] = React.useState(true);
  const [email, setEmail] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const toast = useToast();
  const handleLogin = () => {
    if(email !== null && password !== null){
      signIn({email, password});
    } else {
      handleToast("Error!", "Empty email or password");
    }
  }

  const handleToast = (name, desc) => {
    toast.show({
      title: name,
      status: "error",
      description: desc
    });
  }

  const height = (Dimensions.get('window').height);
  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center', backgroundColor: "indigo"}} >
    <StatusBar barStyle='light-content' backgroundColor="indigo" />
    <View style={{flex: 1, flexDirection: 'column-reverse'}} >
      <View style={{flex: 3,}} ></View>
      <View style={{flex: 2,}} >
      <NativeBaseProvider  >
      <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290" justifyContent="center" safeAreaBottom="5">
        <Heading size="lg" fontWeight="600" color="white" _dark={{
        color: "white"
      }}>
          Welcome
        </Heading>
        <Heading mt="1" _dark={{
        color: "white"
      }} color="white" fontWeight="medium" size="xs">
          Sign in to continue!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label ><Text style={{color: 'white'}} >Email ID</Text></FormControl.Label>
            <Input placeholder="email" onChangeText={(text) => {setEmail(text)}} height={height * 0.06} variant="filled" bg="white"/>
          </FormControl>
          <FormControl>
            <FormControl.Label ><Text style={{color: "white"}} >Password</Text></FormControl.Label>
            <Input placeholder="Password" onChangeText={(text) => {setPassword(text)}} height={height * 0.06} variant="filled" bg="white" type={security ? "password" : "text"} InputRightElement={<Button2 onPress={() => {setSecure(!security)}} size="xs" bg="orange.700" rounded="none" w="1/6" h="full">
            {security ? "show" : "Hide"}
          </Button2>} />
          <Pressable onPress={() => {navigation.navigate("ForgotPassword")}} >
          <Text2 fontSize="sm" alignSelf="flex-end" mt="5" color="orange.700" _dark={{
            color: "orange.700"
          }}>
              Forgot Password?
            </Text2>
          </Pressable>
          </FormControl>
          <Button2 onPress={() => {handleLogin()}} height={height * 0.06} mt="5" bg="orange.700" style={{ height: 45}} size="md" colorScheme="indigo">
            Sign in
          </Button2>
          <Pressable onPress={() => {navigation.navigate("Register")}} >
          <HStack mt="10" justifyContent="center">
          <Text2 fontSize="sm" color="orange.700" _dark={{
            color: "orange.700"
          }}>
              I'm a new user. Sign Up
            </Text2>
          </HStack>
          </Pressable>
        </VStack>
      </Box>
    </Center>
    </NativeBaseProvider>
      </View>
      <View style={{flex: 2,}} >
      </View>
    </View>
  </SafeAreaView>
  )
}

const ForgotPasswordPage = ({ navigation }) => {
  const height = (Dimensions.get('window').height);
  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center', backgroundColor: "indigo"}} >
    <StatusBar barStyle='light-content' backgroundColor="indigo" />
    <View style={{flex: 1, flexDirection: 'column-reverse'}} >
      <View style={{flex: 3,}} ></View>
      <View style={{flex: 2,}} >
      <NativeBaseProvider  >
      <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290" justifyContent="center" safeAreaBottom="5">
        <Heading size="lg" fontWeight="600" color="white" _dark={{
        color: "white"
      }}>
          Forgot Password?
        </Heading>
        <Heading mt="1" _dark={{
        color: "white"
      }} color="white" fontWeight="medium" size="xs">
         Reset your password here.
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label ><Text style={{color: 'white'}} >Email ID</Text></FormControl.Label>
            <Input placeholder="email" height={height * 0.06} variant="filled" />
          </FormControl>
          
          <Button2 mt="5" variant="rounded" height={height * 0.06} bg="orange.700" size="md" style={{height: 45}} _text={{color: 'white'}}>
           Reset Password
          </Button2>
          <Pressable onPress={() => {navigation.navigate("Login")}} >
          <HStack mt="10" justifyContent="center">
          <Text2 fontSize="sm" color="white" _dark={{
            color: "white"
          }}>{" "}
            </Text2>
            <Text2 fontSize="sm" color="orange.700" _dark={{
            color: "orange.700"
          }}>
              Sign In
            </Text2>
          </HStack>
          </Pressable>
        </VStack>
      </Box>
    </Center>
    </NativeBaseProvider>
      </View>
      <View style={{flex: 2,}} >
      </View>
    </View>
  </SafeAreaView>
  )
}

const RegisterPage = ({ navigation }) => {
  const height = (Dimensions.get('window').height);
  return (
<SafeAreaView style={{flex: 1, justifyContent: 'center', backgroundColor: "indigo"}} >
    <StatusBar barStyle='light-content' backgroundColor="indigo" />
    <View style={{flex: 1, flexDirection: 'column-reverse'}} >
      <View style={{flex: 3,}} ></View>
      <View style={{flex: 2,}} >
      <NativeBaseProvider  >
      <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290" justifyContent="center" safeAreaBottom="5">
        <Heading size="lg" fontWeight="600" color="white" _dark={{
        color: "white"
      }}>
          Hi,
        </Heading>
        <Heading mt="1" _dark={{
        color: "white"
      }} color="white" fontWeight="medium" size="xs">
         Create Account!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label ><Text style={{color: 'white'}} >Email ID</Text></FormControl.Label>
            <Input placeholder="email" height={height * 0.06} variant="filled" />
          </FormControl>
          <FormControl>
            <FormControl.Label ><Text style={{color: "white"}} >Password</Text></FormControl.Label>
            <Input placeholder="Password" height={height * 0.06} variant="filled" type="password" />
          </FormControl>
          <FormControl>
          <FormControl.Label ><Text style={{color: "white"}} >Confirm Password</Text></FormControl.Label>
            <Input placeholder="Password" height={height * 0.06} variant="filled" type="password" />
          </FormControl>
          
          <Button2 mt="5" size="md" height={height * 0.06} bg="orange.700" style={{height: 45}} colorScheme="indigo">
            Sign Up
          </Button2>
          <Pressable onPress={() => {navigation.navigate("Login")}} >
          <HStack mt="10" justifyContent="center">
          <Text2 fontSize="sm" color="orange.700" _dark={{
            color: "orange.700"
          }}>
              Already a user. Sign In
            </Text2>


          </HStack>
          </Pressable>
        </VStack>
      </Box>
    </Center>
    </NativeBaseProvider>
      </View>
      <View style={{flex: 2,}} >
      </View>
    </View>
  </SafeAreaView>
  )
}

const HomePage = ({ navigation }) => {
  const themeFromContext = React.useContext(ThemeContext);
  const [account, setAccount] = React.useState(false);
  const[notifications, setNotifications] = React.useState([
    {
      title: "Welcome to FluxLink",
      description: "Hello. We are thrilled to have you on board"
    },
    {
      title: "New changes to our mobile app",
      description: "Please See changes below"
    }
  ]);

  const [data, setData] = React.useState([]);
  const [length, setLength] = React.useState(0);
  const fetchData = React.useCallback(() => {
    // fetch data from api
    //demo data

  }, []);

  React.useEffect(() => {
    let timer = setInterval(function(){fetchData()}, 1000);

    return () => {
      clearInterval(timer);
    }
  }, []);

  const handleNotifications = () => {
    const newnotif = [];
    setNotifications(newnotif);
  }

  // Tabs components
  const AllTasks = () => {
    return (
      <View style={{flex: 1, justifyContent:length === 0 ? "center" : null, alignItems:length === 0 ? "center" : null,  backgroundColor: themeFromContext.colors.background}} >
        {!account ? (
                        <NativeBaseProvider>
                        <Center>
                        <Alert w="90%" maxW="400" status="info" colorScheme="danger">
                          <VStack space={2} flexShrink={1} w="100%">
                            <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                              <HStack flexShrink={1} space={2} alignItems="center">
                                <Alert.Icon />
                                <Text style={{color: "black"}} fontSize="md" fontWeight="medium" color="black">
                                  Unrecognized delivery account!
                                </Text>
                              </HStack>
                              <IconButton2 variant="unstyled" icon={<CloseIcon size="3" color="coolGray.600" />} />
                            </HStack>
                            <Box pl="6" _text={{
                            color: "coolGray.600"
                          }}>
                            <Text style={{color: "black"}} >Please register your delivery account <Text onPress={() => {navigation.jumpTo("Account")}} style={{ fontWeight: 'bold'}} >Here</Text></Text>
                            </Box>
                          </VStack>
                        </Alert>
                      </Center>
                        </NativeBaseProvider>
        ) : (
          length > 0 ? (
            data.map((val) => {
              return (
                <Text>{val.title}</Text>
              )
            })
          ) : (
              <Text style={{color: themeFromContext.colors.foreground}} >No tasks are available. Keep checking!</Text>
          )
        )}
      </View>
    )
  }

  const taskMap = () => {
    return(
      <Text>Map View</Text>
    )
  }


  const renderScene = SceneMap({
    all: AllTasks,
    mapview: taskMap
  });

  const renderTabBar = (props) => {
    return(
      <TabBar
        {...props}
        indicatorStyle={themeFromContext.colors.indicator}
        renderIcon={renderIcon}
        activeColor={themeFromContext.colors.activeTab}
        inactiveColor={ themeFromContext.colors.foreground}
        style={{backgroundColor: themeFromContext.colors.background, color: themeFromContext.colors.foreground, elevation: 1, }}
      />
    )
  }

  const renderIcon = (route, color) => {
    <IconButton
      icon={route}
      size={20}
      color={color}
    />
  }

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'all', title: 'All' },
    { key: 'mapview', title:'Map'}
  ]);

  const layout = useWindowDimensions();
  
  return (
    <SafeAreaView style={{flex: 1,}}>
      <StatusBar barStyle={themeFromContext.status}  backgroundColor={themeFromContext.colors.background} />
    <Appbar.Header style={{backgroundColor: themeFromContext.colors.background, elevation: 1,}}>
    <Appbar.Action icon="menu" onPress={() => {navigation.toggleDrawer()}} />
  <Appbar.Content title="Flux" style={{fontSize: themeFromContext.textVariants.header.fontSize, fontWeight: 'bold', fontFamily: 'italics'}} />
  <Appbar.Action  icon={notifications.length === 0 ? "bell" : props => <Badge>4</Badge>} onPress={() => {handleNotifications()}} />
 </Appbar.Header>

 <View style={{flex: 1, backgroundColor: themeFromContext.colors.background}}>
 <TabView
  renderTabBar={renderTabBar}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
        />
  </View>
    </SafeAreaView>
  );
}

const chartConfig = {
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
};

const width = (Dimensions.get('window').width);

const PaymentsPage = ({ navigation }) => {
  const themeFromContext = React.useContext(ThemeContext);
  const [total, setTotalAmount] = React.useState(1000);
  const [currency, setCurrency] = React.useState("KSH");
  const [transactions , setTransactions]= React.useState([
    {
      type: '-',
      amount: 200,
      day: '01/04',
      id: 1,
    },
    {
      type: '+',
      amount: 300,
      day: '02/04',
      id: 2,
    },
    {
      type: '-',
      amount: 500,
      day: '03/04',
      id: 3,
    },
    {
      type: '+',
      amount: 200,
      day: '01/04',
      id: 4,
    },
    {
      type: '+',
      amount: 300,
      day: '02/04',
      id: 5,
    },
    {
      type: '-',
      amount: 500,
      day: '03/04',
      id: 6,
    }
  ]);

  const commitsData = [
    { date: "2017-01-02", count: 1 },
    { date: "2017-01-03", count: 2 },
    { date: "2017-01-04", count: 3 },
    { date: "2017-01-05", count: 4 },
    { date: "2017-01-06", count: 5 },
    { date: "2017-01-30", count: 2 },
    { date: "2017-01-31", count: 3 },
    { date: "2017-03-01", count: 2 },
    { date: "2017-04-02", count: 4 },
    { date: "2017-03-05", count: 2 },
    { date: "2017-02-30", count: 4 }
  ];

  const height = (Dimensions.get('window').height);
  return (
    <SafeAreaView style={{flex: 1,}}>
      <StatusBar barStyle={themeFromContext.status}  backgroundColor={themeFromContext.colors.background} />
    <Appbar.Header style={{backgroundColor: themeFromContext.colors.background, elevation: 1,}}>
  <Appbar.Action icon="menu" onPress={() => {navigation.toggleDrawer()}} />
  <Appbar.Content title="Payments & Earnings" style={{fontSize: themeFromContext.textVariants.header.fontSize, fontWeight: 'bold', fontFamily: 'Raleway'}} />
 </Appbar.Header>

 <View style={{flex: 1, width: width, justifyContent: 'flex-start', backgroundColor: themeFromContext.colors.background}}>
    <View style={{height: height * 0.15, justifyContent: 'center', alignItems: 'center', marginTop: 10,}} >
    <NativeBaseProvider >
          <Avatar style={{width: 50, height: 50}} bg="lightBlue.400" source={{uri: ""}}>
            DK
            <Avatar.Badge bg="green.500" />
          </Avatar>
          <Text style={{fontSize: 10, color: themeFromContext.colors.foreground, marginTop: 5,}}>{currency}.{total}</Text>
                  </NativeBaseProvider>
    </View>
<View style={{height: height * 0.1, flexDirection: 'row',marginLeft: 5, marginRight: 5,}} >
<TouchableRipple style={{ width: width * 0.3, marginRight: 10, borderRadius: 30,}}>
<Button icon="arrow-up"  mode="contained" contentStyle={{height: height * 0.1 * 0.7}} labelStyle={{color: themeFromContext.colors.foreground, fontSize: 10}} style={{ borderRadius: 80, backgroundColor: themeFromContext.colors.success}}>
Pay Bills
</Button>
</TouchableRipple>
<TouchableRipple style={{ width: width * 0.3,  marginRight: 10,}}>
<Button icon="arrow-up"  mode="contained" contentStyle={{height: height * 0.1 * 0.7}} labelStyle={{color: themeFromContext.colors.foreground, fontSize: 10}} style={{ borderRadius: 80, backgroundColor: themeFromContext.colors.success}}>
M-Pesa
</Button>
</TouchableRipple>
<TouchableRipple style={{ width: width * 0.3, marginRight: 10,}}>
<Button icon="arrow-up"  mode="contained" contentStyle={{height: height * 0.1 * 0.7}} labelStyle={{color: themeFromContext.colors.foreground, fontSize: 10}} style={{ borderRadius: 80, backgroundColor: themeFromContext.colors.success}}>
Bank
</Button>
</TouchableRipple>
</View>
<View style={{height: height * 0.3 *0.7, flexDirection: 'row',}}>
<ContributionGraph
  values={commitsData}
  endDate={new Date("2017-04-01")}
  numDays={105}
  width={width}
  height={height * 0.3 * 0.7}
  chartConfig={chartConfig}
/>
</View>
<View style={{height: height * 0.5, marginTop: 5}} >
<ScrollView>
{transactions.map((data) => {
  return (
    data.type === '-' ? (
      <List.Item
      key={data.id}
    title={data.day}
    titleStyle={{fontSize: 13, color: themeFromContext.colors.foreground}}
    descriptionStyle={{fontSize: 11, color: themeFromContext.colors.foreground}}
    description={"KSH."+data.amount}
    left={props => <List.Icon {...props} color="green" size={10} icon="plus" />}
    right={props => <List.Icon {...props} color={themeFromContext.colors.foreground} icon="chevron-right" />}
  />
    ) : (
      <List.Item
      key={data.id}
      title={data.day}
      titleStyle={{fontSize: 13, color: themeFromContext.colors.foreground}}
      descriptionStyle={{fontSize: 11, color: themeFromContext.colors.foreground}}
      description={"KSH."+data.amount}
      left={props => <List.Icon {...props} color="red" size={10} icon="minus" />}
      right={props => <List.Icon {...props} color={themeFromContext.colors.foreground} icon="chevron-right" />}
    />
    )
  )
})}
</ScrollView>
</View>
  </View>
    </SafeAreaView>
  );
}

const AccountPage = ({ navigation }) => {
const themeFromContext = React.useContext(ThemeContext);
const [account, setAccount] = React.useState(false);
const [visible, setVisible] = React.useState(true);

//header info control
const [content, setContent] = React.useState("Register Account");
const [icon, setIcon] = React.useState("menu");
const [callback, setCallback] = React.useState()

// controls for info tab
const [main, setMain] = React.useState(true);
const [basic, setBasic] = React.useState(false);
const [id, setID] = React.useState(false);
const [vehicle, setVehicle] = React.useState(false);
const [logbook, setLogbook] = React.useState(false);
const [license, setLicense] = React.useState(false);


// handling accordion press
const handleAccordion = (item) => {
  switch(item){
    case 'basic':
      setBasic(true);
      setMain(false);
      setID(false);
      setVehicle(false);
      setLicense(false);
      setLogbook(false);
      setContent("Basic Information");
      setIcon("chevron-left");
      break;

    case 'id':
      setBasic(false);
      setMain(false);
      setID(true);
      setVehicle(false);
      setLicense(false);
      setLogbook(false);
      setContent("Identification Information");
      setIcon("chevron-left");
      break;

    case 'vehicle':
      setBasic(false);
      setMain(false);
      setID(false);
      setVehicle(true);
      setLicense(false);
      setLogbook(false);
      setContent("Vehicle Information");
      setIcon("chevron-left");
      break;

    case 'license':
      setBasic(false);
      setMain(false);
      setID(false);
      setVehicle(false);
      setLicense(true);
      setLogbook(false);
      setContent("License Information");
      setIcon("chevron-left");
      break;

    case 'logbook':
      setBasic(false);
      setMain(false);
      setID(false);
      setVehicle(false);
      setLicense(false);
      setLogbook(true);
      setContent("Logbook Information");
      setIcon("chevron-left");
      break;
    
    default:
      setBasic(false);
      setMain(true);
      setID(false);
      setVehicle(false);
      setLicense(false);
      setLogbook(false);
      setContent("Account");
      setIcon("menu");

  }
}

const infoRoute = () => {
  return (
    <View style={{flex: 1, backgroundColor: themeFromContext.colors.background}} >
      {account ? (
                <NativeBaseProvider>
                <Center>
                <Alert w="90%" maxW="400" status="info" colorScheme="info">
                  <VStack space={2} flexShrink={1} w="100%">
                    <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                      <HStack flexShrink={1} space={2} alignItems="center">
                        <Alert.Icon />
                        <Text style={{color: "black"}} fontSize="md" fontWeight="medium" color="coolGray.800">
                          You are set!
                        </Text>
                      </HStack>
                      <IconButton2 variant="unstyled" icon={<CloseIcon size="3" color="coolGray.600" />} />
                    </HStack>
                    <Box pl="6" _text={{
                    color: "coolGray.600"
                  }}>
                    <Text style={{color: "black"}} > Your delivery account is already registered. You can edit your information or go to task screen <Text onPress={() => {navigation.navigate("Home")}} style={{ fontWeight: 'bold'}} >Here</Text></Text>
                    </Box>
                  </VStack>
                </Alert>
              </Center>
                </NativeBaseProvider>
      ) : (
        main && !basic && !id && !vehicle && !logbook && !license ? (
          <ScrollView>
          <List.Section title="Register Delivery Account" titleStyle={{color: themeFromContext.colors.foreground}} style={{backgroundColor: themeFromContext.colors.background}}>
          <List.Accordion
          style={{backgroundColor: themeFromContext.colors.background}}
          onPress={() => {handleAccordion('basic')}}
            title="User Basic Information"
            titleStyle={{color: themeFromContext.colors.foreground, fontSize: 14}}
            left={props => <List.Icon {...props} color={themeFromContext.colors.foreground} icon="account" />}
            right = {props => <List.Icon {...props} color={themeFromContext.colors.foreground} icon="chevron-right" />}>
          </List.Accordion>
    
          <List.Accordion
          style={{backgroundColor: themeFromContext.colors.background}}
            title="Identification Information"
            onPress={() => {handleAccordion('id')}}
            titleStyle={{color: themeFromContext.colors.foreground, fontSize: 14}}
            left={props => <List.Icon {...props} color={themeFromContext.colors.foreground} icon="passport" />}
            right = {props => <List.Icon {...props} color={themeFromContext.colors.foreground} icon="chevron-right" />}>
          </List.Accordion>
    
          <List.Accordion
          style={{backgroundColor: themeFromContext.colors.background}}
            title="Vehicle Information"
            onPress={() => {handleAccordion('vehicle')}}
            titleStyle={{color: themeFromContext.colors.foreground, fontSize: 14}}
            left={props => <List.Icon {...props} color={themeFromContext.colors.foreground} icon="car-info" />}
            right = {props => <List.Icon {...props} color={themeFromContext.colors.foreground} icon="chevron-right" />}>
          </List.Accordion>
    
          <List.Accordion
          style={{backgroundColor: themeFromContext.colors.background}}
            title="Logbook Information"
            onPress={() => {handleAccordion('logbook')}}
            titleStyle={{color: themeFromContext.colors.foreground, fontSize: 14}}
            left={props => <List.Icon {...props} color={themeFromContext.colors.foreground} icon="star" />}
            right = {props => <List.Icon {...props} color={themeFromContext.colors.foreground} icon="chevron-right" />}>
          </List.Accordion>
    
          <List.Accordion
          style={{backgroundColor: themeFromContext.colors.background}}
            title="License Information"
            onPress={() => {handleAccordion('license')}}
            titleStyle={{color: themeFromContext.colors.foreground, fontSize: 14}}
            left={props => <List.Icon {...props} color={themeFromContext.colors.foreground} icon="information" />}
            right = {props => <List.Icon {...props} color={themeFromContext.colors.foreground} icon="chevron-right" />}>
          </List.Accordion>
        </List.Section>
            </ScrollView>
        ) : !main && basic && !id && !vehicle && !logbook && !license ? (
          <View style={{flex: 1, justifyContent: 'flex-start', marginRight: 10, marginLeft: 10, marginTop: 10, backgroundColor: themeFromContext.colors.background}}>
            <BasicInfo color={themeFromContext.colors.foreground} bg={themeFromContext.colors.background} />
          </View>
        ) : !main && !basic && id && !vehicle && !logbook && !license ? (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeFromContext.colors.background}}>
          <Text style={{color: themeFromContext.colors.foreground}}>ID Information</Text>
        </View>
        ) : !main && !basic && !id && vehicle && !logbook && !license ? (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeFromContext.colors.background}}>
          <Text style={{color: themeFromContext.colors.foreground}}>Vehicle Information</Text>
        </View>
        ) : !main && !basic && !id && !vehicle && logbook && !license ? (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeFromContext.colors.background}}>
          <Text style={{color: themeFromContext.colors.foreground}}>Logbook Information</Text>
        </View>
        ) : (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeFromContext.colors.background}}>
          <Text style={{color: themeFromContext.colors.foreground}} >License Information</Text>
        </View>
        )
      )}
  </View>
  )
}

const deliveriesRoute = () => {
  return (
    <View style={{flex: 1, backgroundColor: themeFromContext.colors.background}} >
     <List.Item
     style={{backgroundColor: themeFromContext.colors.background}}
     titleStyle={{color: themeFromContext.colors.foreground,}}
     descriptionStyle={{color: themeFromContext.colors.foreground}}
    title="Television"
    description="Description"
    left={props => <Avatar1.Text {...props} size={30} color={themeFromContext.colors.foreground} style={{backgroundColor: themeFromContext.colors.success}} label="TV" />}
    right={props => <List.Icon {...props} color={themeFromContext.colors.foreground} icon="chevron-right" />}
  />

    </View>
  )
}

const [index, setIndex] = React.useState(0);


const [routes] = React.useState([
    { key: 'info', title: 'Info', icon: 'car-info', },
    { key: 'deliveries', title: 'Deliveries', icon: 'map' }
]);

const renderScene = BottomNavigation.SceneMap({
    info: infoRoute,
    deliveries: deliveriesRoute
});

  return (
    <SafeAreaView style={{flex: 1,}}>
      <StatusBar barStyle={themeFromContext.status}  backgroundColor={themeFromContext.colors.background} />
    <Appbar.Header style={{backgroundColor: themeFromContext.colors.background, elevation: 1, borderBottomWidth: 1, borderBottomColor: themeFromContext.colors.foreground}}>
  <Appbar.Action icon={icon} onPress={() => {icon === 'menu' ? navigation.toggleDrawer() : handleAccordion(null)}} />
  <Appbar.Content title={content} style={{fontSize: themeFromContext.textVariants.header.fontSize, fontWeight: 'bold', fontFamily: 'Raleway'}} />
 </Appbar.Header>

 <View style={{flex: 1, backgroundColor: themeFromContext.colors.background}}>
 <BottomNavigation
 navigationState={{ index, routes }}
 onIndexChange={setIndex}
 renderScene={renderScene}
 barStyle={{backgroundColor: themeFromContext.colors.background, elevation: 1,}}
 activeColor={themeFromContext.colors.primary}
 inactiveColor={themeFromContext.colors.foreground}
/>
  </View>
    </SafeAreaView>
  );
}

const SettingsPage = ({ navigation }) => {
  const themeFromContext = React.useContext(ThemeContext);
  const { changeTheme } = React.useContext(AuthContext);
  const {signOut} = React.useContext(AuthContext);
  const width = (Dimensions.get('window').width);
  const height = (Dimensions.get('window').height);
  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'space-between', flexDirection: 'column'}}>
      <ScrollView>
 <View style={{flex: 1, justifyContent: 'flex-start', height: height * 0.8, backgroundColor: themeFromContext.colors.background}}>
 <StatusBar barStyle={themeFromContext.status}  backgroundColor={themeFromContext.colors.background} />
    <Appbar.Header style={{backgroundColor: themeFromContext.colors.background, elevation: 1,}}>
  <Appbar.Action icon="menu" onPress={() => {navigation.toggleDrawer()}} />
  <Appbar.Content title="Settings" style={{fontSize: themeFromContext.textVariants.header.fontSize, fontWeight: 'bold', fontFamily: 'Raleway'}} />
 </Appbar.Header>
 <ScrollView>
 <List.Item
    title="Full Name"
    titleStyle={{fontSize: 15, color: themeFromContext.colors.foreground}}
    descriptionStyle={{fontSize: 11, color: themeFromContext.colors.success}}
    description="David Kitavi"
    right={props => <List.Icon {...props} color={themeFromContext.colors.foreground} icon="chevron-right" />}
  />
   <List.Item
    title="Email ID"
    titleStyle={{fontSize: 15, color: themeFromContext.colors.foreground}}
    descriptionStyle={{fontSize: 11, color: themeFromContext.colors.success}}
    description="daviskitavi98@gmail.com"
    right={props => <List.Icon {...props} color={themeFromContext.colors.foreground} icon="chevron-right" />}
  />
     <List.Item
    title="Phone Number"
    titleStyle={{fontSize: 15, color: themeFromContext.colors.foreground}}
    descriptionStyle={{fontSize: 11, color: themeFromContext.colors.success}}
    description="+254 (0) 741582811"
    right={props => <List.Icon {...props} color={themeFromContext.colors.foreground} icon="chevron-right" />}
  />
    <List.Item
    title="Notifications"
    titleStyle={{fontSize: 15, color: themeFromContext.colors.foreground}}
    descriptionStyle={{fontSize: 11, color: themeFromContext.colors.success}}
    description="Enabled"
    right={props => <List.Icon {...props} color={themeFromContext.colors.foreground} icon="chevron-right" />}
  />
    <List.Item
    title="Theme"
    onPress={changeTheme}
    titleStyle={{fontSize: 15, color: themeFromContext.colors.foreground}}
    descriptionStyle={{fontSize: 11, color: themeFromContext.colors.success}}
    description={"Current- "+themeFromContext.theme}
    right={props => <List.Icon {...props} color={themeFromContext.colors.foreground} icon="chevron-right" />}
  />
  </ScrollView>
  </View>

  <View style={{flex: 2, flexDirection: 'row', height: height * 0.2, backgroundColor: themeFromContext.colors.background}} >
  <TouchableRipple style={{ width: width * 0.45, marginRight: 10, marginLeft: 10, borderRadius: 30,}}  onPress={signOut} >
<Button icon="logout"  mode="contained" contentStyle={{height: 45,}} labelStyle={{color: themeFromContext.colors.foreground, fontSize: 10}} style={{ borderRadius: 80, backgroundColor: themeFromContext.colors.warning}}>
Logout
</Button>
</TouchableRipple>
<TouchableRipple style={{ width: width * 0.45, marginRight: 10, marginLeft: 10, borderRadius: 30,}}>
<Button icon="delete"  mode="contained" contentStyle={{height: 45,}} labelStyle={{color: themeFromContext.colors.foreground, fontSize: 10}} style={{ borderRadius: 80, backgroundColor: themeFromContext.colors.danger}}>
Delete Account
</Button>
</TouchableRipple>
  </View>
  </ScrollView>
    </SafeAreaView>
  );
}

const EmergencyPage = ({ navigation }) => {

  const themeFromContext = React.useContext(ThemeContext);
  return (
    <SafeAreaView style={{flex: 1,}}>
      <StatusBar barStyle={themeFromContext.status}  backgroundColor={themeFromContext.colors.background} />
    <Appbar.Header style={{backgroundColor: themeFromContext.colors.background, borderBottomWidth: 1, borderBottomColor: themeFromContext.colors.foreground, elevation: 1,}}>
  <Appbar.Action icon="menu" onPress={() => {navigation.toggleDrawer()}} />
  <Appbar.Content title="Emergency Help" style={{fontSize: themeFromContext.textVariants.header.fontSize, fontWeight: 'bold', fontFamily: 'Raleway'}} />
 </Appbar.Header>

 <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeFromContext.colors.background}}>

<Text style={{color: themeFromContext.colors.foreground}} >Emergency Help</Text>
  </View>
    </SafeAreaView>
  );
}

const TermsPage = ({ navigation }) => {

  const themeFromContext = React.useContext(ThemeContext);
  return (
    <SafeAreaView style={{flex: 1,}}>
      <StatusBar barStyle={themeFromContext.status}  backgroundColor={themeFromContext.colors.background} />
    <Appbar.Header style={{backgroundColor: themeFromContext.colors.background, borderBottomWidth: 1, borderBottomColor: themeFromContext.colors.foreground, elevation: 1,}}>
  <Appbar.Action icon="menu" onPress={() => {navigation.toggleDrawer()}} />
  <Appbar.Content title="Our Values" style={{fontSize: themeFromContext.textVariants.header.fontSize, fontWeight: 'bold', fontFamily: 'Raleway'}} />
 </Appbar.Header>

 <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeFromContext.colors.background}}>

<Text style={{color: themeFromContext.colors.foreground}} >Terms</Text>
  </View>
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
});
export default App;