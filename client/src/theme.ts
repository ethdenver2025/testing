import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  colors: {
    carbon: {
      50: '#f7f7f7',  
      100: '#e3e3e3', 
      200: '#c8c8c8', 
      300: '#a4a4a4', 
      400: '#818181', 
      500: '#666666', 
      600: '#515151', 
      700: '#434343', 
      800: '#1e1e1e', 
      900: '#141414', 
    },
    brand: {
      primary: '#0f62fe',   // Blue 60
      secondary: '#ff7eb6', // Pink 50
      accent: '#42be65',    // Green 50
      warning: '#f1c21b',   // Yellow 30
      error: '#fa4d56',     // Red 50
      success: '#42be65',   // Green 50
      info: '#4589ff',      // Blue 50
      purple: '#8a3ffc',    // Purple 60
      teal: '#08bdba',      // Teal 40
    }
  },
  styles: {
    global: {
      body: {
        bg: 'carbon.900',
        color: 'whiteAlpha.900',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'normal',
        borderRadius: 'sm',
        _focus: {
          boxShadow: '0 0 0 2px #ffffff, 0 0 0 4px #0f62fe',
        },
      },
      variants: {
        solid: {
          bg: 'carbon.700',
          color: 'whiteAlpha.900',
          _hover: {
            bg: 'carbon.600',
          },
        },
        outline: {
          borderColor: 'brand.primary',
          color: 'brand.primary',
          _hover: {
            bg: '#00000032',
          },
        },
        ghost: {
          color: 'brand.primary',
          _hover: {
            bg: 'carbon.800',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'carbon.800',
          borderRadius: '0',
          border: '1px solid',
          borderColor: 'carbon.700',
        },
      },
    },
    Progress: {
      baseStyle: {
        track: {
          bg: 'carbon.700',
        },
        filledTrack: {
          bg: 'brand.primary',
        },
      },
    },
    Menu: {
      baseStyle: {
        list: {
          bg: 'carbon.800',
          borderColor: 'carbon.700',
        },
        item: {
          bg: 'carbon.800',
          _hover: {
            bg: 'carbon.700',
          },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            borderRadius: '0',
            borderColor: 'carbon.600',
            _hover: {
              borderColor: 'brand.primary',
            },
            _focus: {
              borderColor: 'brand.primary',
              boxShadow: '0 0 0 2px #ffffff, 0 0 0 4px #0f62fe',
            },
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: 'normal',
        letterSpacing: '0.5px',
      },
    },
    Text: {
      baseStyle: {
        fontWeight: 'light',
      },
    },
    Link: {
      baseStyle: {
        fontWeight: 'light',
        _hover: {
          textDecoration: 'none',
          color: 'blue.300',
        },
      },
    },
  },
});
