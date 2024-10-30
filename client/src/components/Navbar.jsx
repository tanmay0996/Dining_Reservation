import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const Navbar = () => {
  let {
    id,
    setId,
    curruser,
    setCurruser,
    curruseremail,
    setCurruseremail,
    isuser,
    setIsuser,
  } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    profile();
    // console.log("From Navbar, Curruser ", curruser);
  }, [id, curruser, curruseremail, isuser]);

  async function profile() {
    let result = await fetch(process.env.REACT_APP_Host_Api + "/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    result = await result.json();

    setCurruseremail(result?.email);
    if (result.username) {
      setId(result.userId);
      setCurruser(result?.username);
      setIsuser(true);
    } else {
      setId(result.managerId);
      setCurruser(result?.managername);
      setIsuser(false);
    }
  }

  async function logout() {
    await fetch(process.env.REACT_APP_Host_Api + "/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    // window.localStorage.clear();
    setId("");
    setCurruseremail("");
    setCurruser("");
    setIsuser(false);
    navigate("/");
  }

  return (
    <div className="navbar">
      <div className="left">
        <li>Book your Table!</li>
        <li onClick={() => navigate("/")}>Home Page</li>
      </div>
      <div className="right">
        <>
          {!curruser ? (
            <>
              <li onClick={() => navigate("/userlogin")}>User Login</li>
              <li onClick={() => navigate("/managerlogin")}>Manager Login</li>
            </>
          ) : (
            <>
              <li>
                <Link onClick={logout} to="#" className="logoutlink">
                  LogOut
                </Link>
              </li>

              {isuser ? (
                <li
                  className="displayuser"
                  onClick={() => {
                    navigate(`/user/${id}`);
                  }}
                >
                  User : {curruser}
                </li>
              ) : (
                <li
                  className="displayuser"
                  onClick={() => {
                    navigate(`/managerprofile/${id}`);
                  }}
                >
                  Manager : {curruser}
                </li>
              )}
            </>
          )}
        </>
      </div>
    </div>
  );
};

export default Navbar;
