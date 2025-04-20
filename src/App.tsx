import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home.tsx";
import Profile from "./routes/profile.tsx";
import Login from "./routes/login.tsx";
import CreateAccount from "./routes/create-account.tsx";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { useState, useEffect } from "react";
import LoadingScreen from "./components/loading-screen.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
  },
]);

const GlobalStyles = createGlobalStyle`
   ${reset};
   @import url('https://fonts.googleapis.com/css2?family=Gowun+Dodum&display=swap');
   * {
     box-sizing: border-box;
   }
   body {
     background-color: black;
     color:white;
     font-family: 'Gowun Dodum', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
   }
 `;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </>
  );
}

export default App;
