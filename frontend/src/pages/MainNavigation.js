import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../store/AppContext";

function MainNavigation() {
  const { user, jwtToken, logout } = useContext(AppContext);
  const whichUser = localStorage.getItem("username");
  const whichUserId = localStorage.getItem("userId");

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleHomeClick = () => {
    if (whichUser === "admin") {
      navigate("/admin");
    } else {
      navigate(`/buyer/${whichUserId}`);
    }
  };

  const handleAdd = () => {
    navigate("/admin/addbuyer");
  };

  const handleToday = () => {
    navigate("/admin/todaysorders");
  };
  const handlePast = () => {
    navigate("/admin/allorders");
  };
  const handleInvoices = () => {
    navigate("/admin/invoices");
  };
  const handleMaster = () => {
    navigate("/admin/mastertable");
  };

  return (
    <header>
      <nav>
        <div className="flex justify-between bg-blue-200">
          <div className="flex">
            <button
              onClick={handleHomeClick}
              className="text-3xl font-bold px-10"
            >
              Planet Mist
            </button>

            {whichUser === "admin" ? (
              <div className="flex space-x-5">
                <button onClick={handleAdd}>Add Customer</button>
                <button onClick={handleToday}>Todays' Orders</button>
                <button onClick={handlePast}>Past Orders</button>
                <button onClick={handleInvoices}>Invoices</button>
                <button onClick={handleMaster}>Master Table</button>
              </div>
            ) : null}
          </div>

          <div>
            {jwtToken && (
              <button className="font-bold px-10 " onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default MainNavigation;
