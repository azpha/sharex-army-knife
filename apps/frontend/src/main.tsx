import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/contexts/authContext.tsx";
import "./App.css";

// routes
import App from "./routes/App.tsx";
import Register from "./routes/Register.tsx";
import Login from "./routes/Login.tsx";
import GettingStarted from "./routes/GettingStarted.tsx";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/getting-started",
    element: <GettingStarted />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RouterProvider router={routes} />
  </AuthProvider>,
);
