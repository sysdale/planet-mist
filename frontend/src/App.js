import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { AppContextProvider } from "./store/AppContext";
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
  TodayInvoice,
  PastTenDaysInvoice,
  InvoiceDetails,
  InvoiceItem,
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
          { path: "todayorders/:id", element: <TodaysOrders /> },
          {
            path: "allorders",
            element: <Outlet />,
            children: [
              {
                element: <AllOrders />,
                index: true,
              },

              {
                path: ":id",
                element: <PastOrders />,
                children: [
                  {
                    path: "filter",
                    element: <PastOrders />,
                    index: true,
                  },
                ],
              },
            ],
          },
          {
            element: <Outlet />,
            path: "todaysorders",
            children: [
              {
                element: <TodaysOrders />,
                index: true,
              },
              {
                path: ":id",
                element: <PastOrders />,
              },
            ],
          },
          {
            path: "invoices",
            element: <Outlet />,
            children: [
              {
                element: <Invoices />,
                index: true,
              },
              {
                path: "today",
                element: <Outlet />,
                children: [
                  { element: <TodayInvoice />, index: true },
                  {
                    path: ":id",
                    element: <InvoiceItem />,
                  },
                ],
              },
              {
                path: "past",
                element: <PastTenDaysInvoice />,
              },
            ],
          },
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
    <AppContextProvider>
      <RouterProvider router={router} />
    </AppContextProvider>
  );
}

export default App;
