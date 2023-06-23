/**
 * Especificação dos temas dos componentes.
 */
export const Button = {
  variants: {
    solid: ({ colorScheme }) => ({
      _focus: {
        boxShadow: `0 0 0 3px var(--chakra-colors-${colorScheme}-300)`,
      },
    }),
    outline: ({ colorScheme }) => ({
      _focus: {
        boxShadow: `0 0 0 3px var(--chakra-colors-${colorScheme}-300)`,
      },
    }),
  },
  sizes: {},
};

export const Drawer = {
  baseStyle: {
    overlay: {
      backdropFilter: "blur(10px)",
      bg: "rgba(255,255,255,0.1)",
    },
    closeButton: {
      _focus: { backgroundColor: "none" },
    },
  },
  sizes: {},
};
export const FormLabel = {
  baseStyle: (props) => {
    return {
      color: "gray.500",
    };
  },
  sizes: {},
};
export const Input = {
  baseStyle: (props) => {
    return {};
  },
  sizes: {},
  variants: {
    outline: ({ colorScheme }) => ({
      field: {
        rounded: "lg",
        shadow: "base",
        _focus: {
          borderColor: `${colorScheme}.500`,
          boxShadow: `0 0 0 1px var(--chakra-colors-${colorScheme}-500)`,
        },
      },
    }),
  },
  defaultProps: {
    colorScheme: "blue",
  },
};

export const Select = {
  baseStyle: (props) => {
    return {};
  },
  sizes: {},
  variants: {
    outline: ({ colorScheme }) => ({
      field: {
        rounded: "lg",
        shadow: "base",
        _focus: {
          borderColor: `${colorScheme}.500`,
          boxShadow: `0 0 0 1px var(--chakra-colors-${colorScheme}-500)`,
        },
      },
    }),
  },
  defaultProps: {
    colorScheme: "blue",
  },
};

export const Modal = {
  parts: ["overlay", "item"],
  baseStyle: (props) => {
    return {
      overlay: {
        backdropFilter: "blur(10px)",
        bg: "rgba(255,255,255,0.1)",
      },
      closeButton: {
        _focus: { backgroundColor: "none" },
      },
    };
  },
  sizes: {},
};
