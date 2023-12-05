import { Outlet } from "react-router-dom";
import { MainNavigation } from "../listing";

function RootLayout() {
  return (
    <>
      <div className="mb-10">
        <MainNavigation />
      </div>

      <main>
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
