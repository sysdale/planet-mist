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

  return (
    <header>
      <nav>
        <div className="flex justify-between bg-blue-200">
          <button
            onClick={handleHomeClick}
            className="text-3xl font-bold px-10"
          >
            Planet Mist
          </button>
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
