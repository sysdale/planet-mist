import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import {
  AddBuyer,
  ErrorPage,
  BuyerOrder,
  RootLayout,
  Login,
  PastOrders,
  BuyerHomePage,
} from "./listing";
import HomePage from "./pages/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "admin", element: <AddBuyer /> },
      {
        path: "buyer/:id",
        children: [
          {
            index: true,
            element: <BuyerHomePage />,
          },
          {
            path: "pastorders",
            element: <PastOrders />,
          },
          {
            path: "placeorder",
            element: <BuyerOrder />,
          },
        ],
      },
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
