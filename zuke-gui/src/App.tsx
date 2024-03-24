import CssBaseline from "@mui/material/CssBaseline"
import { RecoilRoot } from "recoil"

import Home from "@/pages/Home"

export default function App() {
  return (
    <RecoilRoot>
      <CssBaseline />
      <Home />
    </RecoilRoot >
  )
}
