import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const ForgotPassword = () => {
  let navigate = useNavigate();
  const { curruser, curruseremail, isuser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  useEffect(() => {
    if (curruser) {
      navigate("/");
    }
  }, [curruser, curruseremail, isuser, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    let result = await fetch(
      process.env.REACT_APP_Host_Api + `/api/user/forgotpassword`,
      {
        method: "POST",
        body: JSON.stringify({ email, pwd }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    result = await result.json();
    if (result.error) {
      alert(result.error);
      return;
    } else {
      alert("Password Changed");
      navigate("/userlogin");
    }
  }

  return (
    <div className="loginpage">
      <form className="form" onSubmit={handleSubmit}>
        <div className="formheading">User Password Recovery</div>

        <div className="field">
          <label>Email : </label>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>Password : </label>
          <input
            type="password"
            placeholder="Enter Password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
          />
        </div>

        <div className="formbtns">
          <div className="field">
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>

          <div className="field">
            <button
              type="button"
              className="submit-btn"
              onClick={() => navigate("/userlogin")}
            >
              Log In
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
