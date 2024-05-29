import CssBaseline from "@mui/material/CssBaseline"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { ErrorBoundary } from "react-error-boundary"
import { RecoilRoot } from "recoil"

import ErrorFallback from "@/pages/ErrorFallback"
import Home from "@/pages/Home"

// https://colorhunt.co/palette/22283131363f76abaeeeeeee
const theme = createTheme({
  palette: {
    primary: {
      main: "#31363F",
    },
    secondary: {
      main: "#3f51b5",
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
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Home />
        </ErrorBoundary>
      </ThemeProvider>
    </RecoilRoot >
  )
}
