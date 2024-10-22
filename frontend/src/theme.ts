import { createTheme } from "@mui/material/styles";
import { ColorPartial } from "@mui/material/styles/createPalette";

declare module "@mui/material/styles" {
  interface Palette {
    blue: ColorPartial;
    red: ColorPartial;
    yellow: ColorPartial;
    teal: ColorPartial;
    neutral: ColorPartial;
    cyan: ColorPartial;
  }
  interface PaletteOptions {
    blue: ColorPartial;
    red: ColorPartial;
    yellow: ColorPartial;
    teal: ColorPartial;
    neutral: ColorPartial;
    cyan: ColorPartial;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    blue: true;
    red: true;
    yellow: true;
    teal: true;
    neutral: true;
    cyan: true;
  }
}

declare module "@mui/material/TextField" {
  interface TextFieldPropsColorOverrides {
    blue: true;
    red: true;
    yellow: true;
    teal: true;
    neutral: true;
    cyan: true;
  }
}

declare module "@mui/material/ToggleButton" {
  interface ToggleButtonPropsColorOverrides {
    blue: true;
    red: true;
    yellow: true;
    teal: true;
    neutral: true;
    cyan: true;
  }
}

declare module "@mui/material/SvgIcon" {
  interface SvgIconPropsColorOverrides {
    blue: true;
    red: true;
    yellow: true;
    teal: true;
  }
}

const palette = {
  primary: {
    50: "#E0FCFF",
    100: "#BEF8FD",
    200: "#87EAF2",
    300: "#54D1DB",
    400: "#38BEC9",
    500: "#2CB1BC",
    600: "#14919B",
    700: "#0E7C86",
    800: "#0A6C74",
    900: "#044E54",
    main: "#2CB1BC", // default primary color
  },
  neutral: {
    50: "#FAF9F7",
    100: "#E8E6E1",
    200: "#D3CEC4",
    300: "#B8B2A7",
    400: "#A39E93",
    500: "#857F72",
    600: "#625D52",
    700: "#504A40",
    800: "#423D33",
    900: "#27241D",
    main: "#857F72", // default neutral color
  },
  blue: {
    50: "#DCEEF8",
    100: "#B6E0FE",
    200: "#84C5F4",
    300: "#62B0E8",
    400: "#4098D7",
    500: "#2680C2",
    600: "#186FAF",
    700: "#0F609B",
    800: "#0A558C",
    900: "#003E6B",
    main: "#2680C2", // default blue color
  },
  red: {
    50: "#FFEEEE",
    100: "#FACDCD",
    200: "#F29B9B",
    300: "#E66A6A",
    400: "#D64545",
    500: "#BA2525",
    600: "#A61B1B",
    700: "#911111",
    800: "#780A0A",
    900: "#610404",
    main: "#BA2525", // default red color
  },
  yellow: {
    50: "#FFFAEB",
    100: "#FCEFC7",
    200: "#F8E3A3",
    300: "#F9DA8B",
    400: "#F7D070",
    500: "#E9B949",
    600: "#C99A2E",
    700: "#A27C1A",
    800: "#7C5E10",
    900: "#513C06",
    main: "#E9B949", // default yellow color
  },
  cyan: {
    50: "#E0FCFF",
    100: "#BEF8FD",
    200: "#87EAF2",
    300: "#54D1DB",
    400: "#38BEC9",
    500: "#2CB1BC",
    600: "#14919B",
    700: "#0E7C86",
    800: "#0A6C74",
    900: "#044E54",
    main: "#2CB1BC", // default cyan color
  },
  teal: {
    50: "#EFFCF6",
    100: "#C6F7E2",
    200: "#8EEDC7",
    300: "#65D6AD",
    400: "#3EBD93",
    500: "#27AB83",
    600: "#199473",
    700: "#147D64",
    800: "#0C6B58",
    900: "#014D40",
    main: "#27AB83",
  },
  text: {
    primary: "#27241D",
    secondary: "#857F72",
  },
  background: {
    default: "#FAF9F7",
  },
};

const theme = createTheme({
  palette: palette,
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "5px",
        },
        contained: {
          backgroundColor: palette.primary[500],
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: palette.primary[600],
          },
        },
        outlined: {
          color: palette.text.primary,
          border: `1px solid ${palette.neutral[200]}`,
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: palette.neutral[200],
          },
        },
        text: {
          color: palette.text.primary,
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: palette.neutral[100],
          },
        },
      },
      variants: [
        {
          props: { variant: "contained", color: "neutral" },
          style: {
            backgroundColor: palette.neutral[100],
            color: palette.text.primary,
            "&:hover": {
              backgroundColor: palette.neutral[200],
            },
          },
        },
        {
          props: { variant: "contained", color: "yellow" },
          style: {
            backgroundColor: palette.yellow[500],
            color: "#FFF",
            "&:hover": {
              backgroundColor: palette.yellow[600],
            },
          },
        },
        {
          props: { variant: "contained", color: "blue" },
          style: {
            backgroundColor: palette.blue[500],
            color: "#FFF",
            "&:hover": {
              backgroundColor: palette.blue[600],
            },
          },
        },
        {
          props: { variant: "contained", color: "teal" },
          style: {
            backgroundColor: palette.teal[700],
            color: "#FFF",
            "&:hover": {
              backgroundColor: palette.teal[800],
            },
          },
        },
        {
          props: { variant: "outlined", color: "yellow" },
          style: {
            borderColor: palette.yellow[500],
            color: palette.yellow[500],
            "&:hover": {
              backgroundColor: palette.yellow[50],
              borderColor: palette.yellow[600],
            },
          },
        },
        {
          props: { variant: "outlined", color: "blue" },
          style: {
            borderColor: palette.blue[500],
            color: palette.blue[500],
            "&:hover": {
              backgroundColor: palette.blue[50],
              borderColor: palette.blue[600],
            },
          },
        },
        {
          props: { variant: "outlined", color: "teal" },
          style: {
            borderColor: palette.teal[500],
            color: palette.teal[500],
            "&:hover": {
              backgroundColor: palette.teal[50],
              borderColor: palette.teal[600],
            },
          },
        },
        {
          props: { variant: "outlined", color: "neutral" },
          style: {
            color: palette.text.primary,
            border: `1px solid ${palette.neutral[200]}`,
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: palette.neutral[100],
            },
          },
        },
      ],
    },

    MuiSvgIcon: {
      variants: [
        {
          props: { color: "yellow" },
          style: {
            color: palette.yellow[500],
          },
        },
        {
          props: { color: "blue" },
          style: {
            color: palette.blue[500],
          },
        },
        {
          props: { color: "teal" },
          style: {
            color: palette.teal[500],
          },
        },
      ],
    },

    MuiTextField: {
      variants: [
        {
          props: { variant: "outlined" },
          style: {
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: palette.neutral[200],
              },
              "&:hover fieldset": {
                borderColor: palette.neutral[300],
              },
              "&.Mui-focused fieldset": {
                borderColor: palette.neutral[500],
              },
            },
            "& .MuiInputLabel-root": {
              color: palette.neutral[400],
              "&.Mui-focused": {
                color: palette.neutral[700],
              },
            },
          },
        },
      ],
    },
  },
});
export default theme;
