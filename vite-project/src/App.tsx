/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
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
import NotFound from "./pages/404.tsx";
import ShareBoard from "./pages/user/share_board.page.tsx";

export const UNAUTHORIZED_EVENT = "unauthorized_error";
const handleError = (error: any) => {
  if (error?.response?.status === 401) {
    console.log("Unauthorized error occurred");
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }
  // Handle other types of errors if needed
};

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleError,
  }),
  mutationCache: new MutationCache({
    onError: handleError,
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401) return false;
        return failureCount < 3;
      },
    },
  },
});
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
                  <Route path="/share/:boardId" element={<ShareBoard />} />
                  <Route path="/board" element={<NotFound />} />
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

