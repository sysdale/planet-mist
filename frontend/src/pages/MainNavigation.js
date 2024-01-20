import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../store/AppContext";

function MainNavigation() {
  const { user, jwtToken, logout, loggedIn } = useContext(AppContext);
  const whichUser = localStorage.getItem("username");
  const whichUserId = localStorage.getItem("userId");

  const [activeButtonId, setActiveButtonId] = useState(null);
  const [activeButtonIdUser, setActiveButtonIdUser] = useState(null);

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
    setActiveButtonId("add");
    navigate("/admin/addbuyer");
  };

  const handleToday = () => {
    setActiveButtonId("today");
    navigate("/admin/todaysorders");
  };
  const handlePast = () => {
    setActiveButtonId("all");
    navigate("/admin/allorders");
  };
  const handleInvoices = () => {
    setActiveButtonId("invoices");
    navigate("/admin/invoices");
  };
  const handleMaster = () => {
    setActiveButtonId("master");
    navigate("/admin/mastertable");
  };

  const handlePastOrder = () => {
    setActiveButtonIdUser("past");
    navigate(`/buyer/${whichUserId}/pastorders`);
  };

  const handlePlaceOrder = () => {
    setActiveButtonIdUser("placeorder");
    navigate(`/buyer/${whichUserId}/placeorder`);
  };

  const buttons = [
    { id: "add", label: "Add Customer", onClick: handleAdd },
    { id: "today", label: "Today's Orders", onClick: handleToday },
    { id: "all", label: "Past Orders", onClick: handlePast },
    { id: "invoices", label: "Invoicing", onClick: handleInvoices },
    { id: "master", label: "Master Table", onClick: handleMaster },
  ];

  const buttonsUser = [
    { id: "past", label: "Past Orders", onClick: handlePastOrder },
    { id: "placeorder", label: "Place Order", onClick: handlePlaceOrder },
  ];

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

            {whichUser === "admin" && localStorage.getItem("loginStatus") ? (
              <div className="flex space-x-5">
                {buttons.map((button) => (
                  <button
                    key={button.id}
                    onClick={button.onClick}
                    className={`${activeButtonId === button.id} `}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            ) : null}

            {whichUser !== "admin" && localStorage.getItem("loginStatus") ? (
              <div className="flex space-x-5">
                {buttonsUser.map((button) => (
                  <button
                    key={button.id}
                    onClick={button.onClick}
                    className={`${activeButtonIdUser === button.id} `}
                  >
                    {button.label}
                  </button>
                ))}
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
