//import { DarkTheme, DefaultTheme } from "react-native-paper";
import {Colors} from 'react-native-paper';

const palette = {
    purple: Colors.deepOrange700,
    green: '#0ECD9D',
    red: '#CD0E61',
    black: '#0B0B0B',
    white: '#F0F2F3',
    yellow: 'orange'
  }
  
  export const theme = {
    colors: {
      background: palette.white,
      foreground: palette.black,
      primary: palette.purple,
      success: palette.green,
      danger: palette.red,
      failure: palette.red,
      warning: palette.yellow,
      indicator: palette.purple,
      activeTab: palette.purple,
    },
    spacing: {
      s: 8,
      m: 16,
      l: 24,
      xl: 40,
    },
    status: 'dark-content',
    textVariants: {
      header: {
        fontFamily: 'Raleway',
        fontSize: 36,
        fontWeight: 'bold',
      },
      body: {
        fontFamily: 'Merriweather',
        fontSize: 16,
      },
    },
    theme: "Light"
  };
  
  export const darkTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      background: palette.black,
      foreground: palette.white,
    },
    status: 'light-content',
    theme: "Dark"
  }