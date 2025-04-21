import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { getFirebaseAuth } from "./firebase";
import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import LoadingScreen from "./components/loading-screen.tsx";
import ProtectedRoute from "./components/protected-route.tsx";

// Lazy load route components
const Layout = lazy(() => import("./components/layout"));
const Home = lazy(() => import("./routes/home"));
const Profile = lazy(() => import("./routes/profile"));
const Login = lazy(() => import("./routes/login"));
const CreateAccount = lazy(() => import("./routes/create-account"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingScreen />}>
          <Layout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "profile",
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <Profile />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/create-account",
    element: (
      <Suspense fallback={<LoadingScreen />}>
        <CreateAccount />
      </Suspense>
    ),
  },
]);

const GlobalStyles = createGlobalStyle`
   ${reset};
   * {
     box-sizing: border-box;
   }
   body {
     background-color: black;
     color:white;
     font-family: 'Gowun Dodum', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
   }
 `;

const Wrapper = styled.div`
   height: 100vh;
   display: flex;
   justify-content: center;
 `;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    await getFirebaseAuth().authStateReady();
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  );
}

export default App;
