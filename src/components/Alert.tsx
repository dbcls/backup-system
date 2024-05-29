import { Alert as MuiAlert, Container } from "@mui/material"
import { SxProps } from "@mui/system"
import { useRecoilState } from "recoil"

import { alertAtom } from "@/store"

interface AlertProps {
  sx?: SxProps
}

export default function Alert({ sx }: AlertProps) {
  const [alert, setAlert] = useRecoilState(alertAtom)

  return (
    <>
      {alert && (
        <Container maxWidth="lg" sx={{
          position: "fixed",
          top: 30,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          ...sx,
        }}>
          <MuiAlert
            sx={{
              width: "100%",
            }}
            severity="error"
            onClose={() => setAlert(null)}
            children={alert}
          />
        </Container>
      )}
    </>
  )
}
