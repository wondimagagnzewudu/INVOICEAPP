// theme.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';

interface CustomThemeOptions extends ThemeOptions {
  overrides?: {
    MuiTableCell?: {
      root?: {
        width: string;
        height: string;
        color: string;
        fontSize: number;
      };
    };
  };
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#ff4081',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  overrides: {
    MuiTableCell: {
      root: {
        width: '15%',
        height: '5vh',
        color: '#096ac9',
        fontSize: 16,
      },
    },
  },
} as CustomThemeOptions);

export default theme;
