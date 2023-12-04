import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AddBuyer, ErrorPage, BuyerOrder, RootLayout, Login } from "./listing";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/admin", element: <AddBuyer /> },
      { path: "/buyerorder", element: <BuyerOrder /> },
      { path: "/login", element: <Login /> },
    ],
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
