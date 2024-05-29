import { Box, Container, Divider } from "@mui/material"

import Alert from "@/components/Alert"
import AppFooter from "@/components/AppFooter"
import AppHeader from "@/components/AppHeader"
import FileListSec from "@/components/FileListSec"
import IntroSec from "@/components/IntroSec"
import PolicySec from "@/components/PolicySec"
import ServerSettingSec from "@/components/ServerSettingSec"

export default function Home() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ flexGrow: 1 }}>
        <AppHeader />
        <Container maxWidth="lg">
          <Alert />
          <IntroSec sx={{ margin: "3rem 0 1.5rem" }} />
          <Divider />
          <FileListSec sx={{ margin: "1.5rem 0" }} />
          <Divider />
          <PolicySec sx={{ margin: "1.5rem 0" }} />
          <Divider />
          <ServerSettingSec sx={{ margin: "1.5rem 0" }} />
        </Container>
      </Box>
      <AppFooter />
    </Box >
  )
}
