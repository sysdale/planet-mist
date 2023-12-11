import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import {
  AddBuyer,
  ErrorPage,
  BuyerOrder,
  RootLayout,
  Login,
  PastOrders,
  BuyerHomePage,
  AdminHomePage,
  MasterTable,
  Invoices,
  TodaysOrders,
  AllOrders,
  HomePage,
} from "./listing";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "admin",
        children: [
          { index: true, element: <AdminHomePage /> },
          { path: "addbuyer", element: <AddBuyer /> },
          { path: "todayorders", element: <TodaysOrders /> },
          { path: "allorders", element: <AllOrders /> },
          { path: "invoices", element: <Invoices /> },
          { path: "mastertable", element: <MasterTable /> },
        ],
      },
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
