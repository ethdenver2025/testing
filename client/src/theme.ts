import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

// Global border radius - 8px for consistency
const borderRadius = '8px';

// User-specified color palette
const colors = {
  background: {
    primary: '#121212',     // Carbon Black
    secondary: '#1E1E1E',   // Primary Surface (Charcoal Gray)
    tertiary: '#252525',    // Secondary Surface (Dark Slate Gray)
  },
  text: {
    primary: '#E0E0E0',     // Primary Text (Light Gray)
    secondary: '#A0A0A0',   // Secondary Text (Muted Gray)
  },
  accent: {
    primary: '#2979FF',     // Accent Blue (Electric Blue Highlight)
    secondary: '#607D8B',   // Muted Blue (Gray-Blue Highlight)
    hover: '#82B1FF',       // Hover State (Lighter, More Vibrant)
  },
  status: {
    success: '#00B8D4',     // Success (Teal Blue)
    warning: '#FFA726',     // Warning (Muted Orange-Yellow)
    error: '#F44336',       // Error (Standard Red)
    info: '#2979FF',        // Info (Same as accent.primary)
  },
  border: {
    subtle: '#333333',      // Subtle Border (Soft Charcoal Gray)
  },
  link: {
    subtle: '#5C89A6',      // Subtle Hyperlink (Gray-Blue, Softer Look)
  }
};

const theme = extendTheme({
  config,
  // Global radius for all components
  radii: {
    none: '0',
    sm: '4px',
    base: borderRadius,
    md: borderRadius,
    lg: borderRadius,
    xl: borderRadius,
    '2xl': borderRadius,
    '3xl': borderRadius,
    full: '9999px',
  },
  colors: {
    // Keep chakra compatibility with our custom palette
    black: colors.background.primary,
    white: colors.text.primary,
    gray: {
      50: '#F5F5F5',
      100: '#EEEEEE',
      200: '#E0E0E0',
      300: '#BDBDBD',
      400: '#9E9E9E',
      500: '#757575',
      600: '#616161',
      700: '#424242',
      800: '#252525',
      900: '#1E1E1E',
    },
    blue: {
      500: colors.accent.primary,
      600: colors.accent.secondary,
      300: colors.accent.hover,
    },
    teal: {
      500: colors.status.success,
    },
    orange: {
      500: colors.status.warning,
    },
    red: {
      500: colors.status.error,
    },
    // Our custom theme colors
    background: colors.background,
    accent: colors.accent,
    text: colors.text,
    status: colors.status,
    border: colors.border,
    link: colors.link,
  },
  styles: {
    global: {
      body: {
        bg: colors.background.primary,
        color: colors.text.primary,
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'base',
        _focus: {
          boxShadow: `0 0 0 3px ${colors.accent.primary}33`,
        },
      },
      variants: {
        solid: {
          bg: colors.accent.primary,
          color: colors.text.primary,
          _hover: {
            bg: colors.accent.hover,
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease',
          },
          _active: {
            bg: colors.accent.secondary,
          },
        },
        outline: {
          bg: 'transparent',
          color: colors.accent.primary,
          border: '1px solid',
          borderColor: colors.border.subtle,
          _hover: {
            bg: `${colors.accent.primary}11`,
            borderColor: colors.accent.primary,
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease',
          },
        },
        ghost: {
          color: colors.text.primary,
          _hover: {
            bg: colors.background.tertiary,
          },
        },
        secondary: {
          bg: colors.accent.secondary,
          color: colors.text.primary,
          _hover: {
            bg: colors.accent.hover,
            transform: 'translateY(-1px)',
            transition: 'all 0.2s ease',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'background.secondary',
          borderRadius: 'base',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          borderWidth: '1px',
          borderColor: 'border.subtle',
          transition: 'transform 0.2s, box-shadow 0.2s',
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
          },
        },
        header: {
          padding: '1rem',
        },
        body: {
          padding: '1rem',
        },
        footer: {
          padding: '1rem',
        },
      },
    },
    Progress: {
      baseStyle: {
        track: {
          bg: colors.background.tertiary,
        },
        filledTrack: {
          bg: colors.accent.primary,
        },
      },
    },
    Menu: {
      baseStyle: {
        list: {
          bg: colors.background.secondary,
          borderRadius: 'base',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '0.5rem',
        },
        item: {
          bg: 'transparent',
          borderRadius: '4px',
          _hover: {
            bg: colors.background.tertiary,
          },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            borderRadius: 'base',
            bg: colors.background.tertiary,
            border: 'none',
            _hover: {
              bg: `${colors.background.tertiary}DD`,
            },
            _focus: {
              border: 'none',
              ring: '2px',
              ringColor: colors.accent.primary,
              ringOffset: '0px',
            },
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: colors.background.secondary,
          borderRadius: 'base',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }
      }
    },
    Divider: {
      baseStyle: {
        opacity: 0.1,
        borderColor: colors.text.primary,
      }
    },
    Heading: {
      baseStyle: {
        fontWeight: 'semibold',
        letterSpacing: '0.5px',
        color: colors.text.primary,
      },
    },
    Text: {
      baseStyle: {
        fontWeight: 'normal',
        color: colors.text.primary,
      },
      variants: {
        secondary: {
          color: colors.text.secondary,
        },
      }
    },
    Link: {
      baseStyle: {
        fontWeight: 'normal',
        color: colors.link.subtle,
        _hover: {
          textDecoration: 'none',
          color: colors.accent.hover,
        },
      },
    },
    Avatar: {
      baseStyle: {
        container: {
          bg: colors.accent.secondary,
        }
      }
    },
    Badge: {
      baseStyle: {
        borderRadius: '4px',
        px: 2,
        py: 1,
      },
      variants: {
        solid: props => ({
          bg: props.colorScheme 
            ? `${props.colorScheme}.500` 
            : colors.accent.primary,
        }),
        subtle: props => ({
          bg: props.colorScheme 
            ? `${props.colorScheme}.100` 
            : `${colors.accent.primary}15`,
          color: props.colorScheme 
            ? `${props.colorScheme}.800` 
            : colors.accent.primary,
        }),
      }
    },
    Tabs: {
      variants: {
        'soft-rounded': {
          tab: {
            borderRadius: 'full',
            fontWeight: 'medium',
            _selected: {
              bg: colors.accent.primary,
              color: colors.text.primary,
            }
          }
        },
        line: {
          tab: {
            _selected: {
              color: colors.accent.primary,
              borderColor: colors.accent.primary,
            }
          }
        }
      }
    },
    Table: {
      variants: {
        simple: {
          th: {
            borderBottom: 'none',
            borderColor: 'transparent',
            bg: colors.background.secondary,
            color: colors.text.secondary,
          },
          td: {
            borderBottom: '1px solid',
            borderColor: colors.border.subtle,
          }
        }
      }
    }
  },
});

export { theme };
