import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { AuthProvider } from "./hooks/useAuth.tsx";
import Login from "./pages/auth/login.tsx";
import Register from "./pages/auth/register.tsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./components/ui/toaster.tsx";
import Dashboard from "./pages/user/dashboard.tsx";
// import Board from "./pages/user/board.tsxx";
import ProtectedRoutes from "./components/layout/ProtectedRoutes.tsx";
import AuthRoutes from "./components/layout/AuthRoutes.tsx";
import Settings from "./pages/user/settings.tsx";
import ModalProvider from "./hooks/useModal.tsx";
import LandingPage from "./pages/user/landing_page.tsx";
import Board from "./pages/user/board.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ModalProvider>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route element={<ProtectedRoutes />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/board/:boardId" element={<Board />} />
                </Route>
                <Route element={<AuthRoutes />}>
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                </Route>
              </Routes>
            </AuthProvider>
          </ModalProvider>
        </Router>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;

