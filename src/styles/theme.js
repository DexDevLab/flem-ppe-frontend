/**
 * Tema customizado.
 */
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import {
  Button,
  Drawer,
  FormLabel,
  Input,
  Select,
  Modal,
} from "./ComponentsTheme";

const theme = extendTheme({
  initialColorMode: "light",
  colors: {
    brand1: {
      50: "#ECF0F9",
      100: "#C9D6ED",
      200: "#A7BCE2",
      300: "#84A2D7",
      400: "#6188CC",
      500: "#3F6DC0",
      600: "#32579A",
      700: "#264273",
      800: "#192C4D",
      900: "#0D1626",
    },
  },
  fontWeights: {
    normal: 400,
    medium: 600,
    bold: 700,
    xBold: 900,
  },
  styles: {
    global: (props) => ({
      "*": {
        "&::-webkit-scrollbar": {
          width: "0px",
          backgroundColor: "rgb(255,255,255,0.0)",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#A0AEC0",
          borderRadius: "10px",
          border: "px solid #F7FAFC",
        },
      },
      body: {
        bg: mode("gray.50", "gray.800")(props),
        fontFamily: "Helvetica, sans-serif",
      },
      html: {
        fontFamily: "Helvetica, sans-serif",
      },
    }),
  },
  components: {
    Button,
    Drawer,
    FormLabel,
    Input,
    Select,
    Modal,
  },
});

export default theme;
