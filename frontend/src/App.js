import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AddBuyer, ErrorPage, BuyerOrder, RootLayout, Login } from "./listing";
import HomePage from "./pages/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/admin", element: <AddBuyer /> },
      { path: "/buyer", element: <BuyerOrder /> },
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
