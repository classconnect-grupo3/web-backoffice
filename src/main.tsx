import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { AuthService } from "./lib/auth.ts"
import { AppWrapper } from "./components/common/PageMeta.tsx"

// Initialize authentication when the app starts
AuthService.initializeAuth()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWrapper>
      <App />
    </AppWrapper>
  </StrictMode>,
)
