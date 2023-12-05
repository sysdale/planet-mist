import { Outlet } from "react-router-dom";
import { MainNavigation } from "../listing";

function RootLayout() {
  return (
    <>
      <MainNavigation />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
