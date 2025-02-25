import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    monokai: {
      50: '#f7f7f7',
      100: '#e3e3e3',
      200: '#c8c8c8',
      300: '#a4a4a4',
      400: '#818181',
      500: '#666666',
      600: '#515151',
      700: '#434343',
      800: '#383838',
      900: '#272822', // Monokai background
    },
    brand: {
      primary: '#66D9EF',   // Light blue
      secondary: '#FD971F', // Orange
      accent: '#A6E22E',    // Green
      warning: '#FD971F',   // Orange
      error: '#F92672',     // Pink/Red
      success: '#A6E22E',   // Green
      info: '#66D9EF',      // Light blue
      purple: '#AE81FF',    // Purple
      yellow: '#E6DB74',    // Yellow
    }
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: 'monokai.900',
        color: '#F8F8F2', // Monokai foreground
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        _focus: {
          boxShadow: '0 0 0 3px #66D9EF40',
        },
      },
      variants: {
        solid: {
          bg: 'brand.primary',
          color: 'monokai.900',
          _hover: {
            bg: '#80E1F7',
          },
        },
        outline: {
          borderColor: 'brand.primary',
          color: 'brand.primary',
          _hover: {
            bg: '#66D9EF20',
          },
        },
        ghost: {
          color: 'brand.primary',
          _hover: {
            bg: '#66D9EF15',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'monokai.800',
          borderColor: 'monokai.700',
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: 'monokai.800',
          borderColor: 'monokai.700',
        },
      },
    },
    Menu: {
      baseStyle: {
        list: {
          bg: 'monokai.800',
          borderColor: 'monokai.700',
        },
        item: {
          bg: 'monokai.800',
          _hover: {
            bg: 'monokai.700',
          },
        },
      },
    },
    Table: {
      variants: {
        simple: {
          th: {
            borderColor: 'monokai.700',
            color: 'brand.primary',
          },
          td: {
            borderColor: 'monokai.700',
          },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: 'monokai.800',
            borderColor: 'monokai.600',
            _hover: {
              borderColor: 'brand.primary',
            },
            _focus: {
              borderColor: 'brand.primary',
              boxShadow: '0 0 0 1px #66D9EF',
            },
          },
        },
      },
    },
    Select: {
      variants: {
        outline: {
          field: {
            bg: 'monokai.800',
            borderColor: 'monokai.600',
            _hover: {
              borderColor: 'brand.primary',
            },
            _focus: {
              borderColor: 'brand.primary',
              boxShadow: '0 0 0 1px #66D9EF',
            },
          },
        },
      },
    },
    Badge: {
      variants: {
        subtle: (props: any) => ({
          bg: `${props.colorScheme}.200`,
          color: `${props.colorScheme}.800`,
        }),
      },
    },
    Divider: {
      baseStyle: {
        borderColor: 'monokai.700',
      },
    },
  },
});

export default theme;
