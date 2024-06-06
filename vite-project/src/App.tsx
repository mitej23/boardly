import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { AuthProvider } from "./hooks/useAuth";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./components/ui/toaster";
import Dashboard from "./pages/user/dashboard";
import ProtectedRoutes from "./components/layout/ProtectedRoutes";
import AuthRoutes from "./components/layout/AuthRoutes";
import Settings from "./pages/user/settings";
import ModalProvider from "./hooks/useModal";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ModalProvider>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<h1>Landing Page</h1>} />
                <Route element={<ProtectedRoutes />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/settings" element={<Settings />} />
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

