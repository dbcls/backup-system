import CssBaseline from "@mui/material/CssBaseline"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { RecoilRoot } from "recoil"

import Home from "@/pages/Home"

// https://colorhunt.co/palette/22283131363f76abaeeeeeee
const theme = createTheme({
  palette: {
    primary: {
      main: "#31363F",
    },
    secondary: {
      main: "#76ABAE",
    },
    background: {
      default: "#FFFFFF",
    },
  },
})

export default function App() {
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Home />
      </ThemeProvider>
    </RecoilRoot >
  )
}
