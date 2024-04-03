import { Global } from "@emotion/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { styles } from "./globalStyles";
import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

export default function App() {
  return (
    <>
      <Global styles={styles} />
      <RouterProvider router={router} />
    </>
  );
}
