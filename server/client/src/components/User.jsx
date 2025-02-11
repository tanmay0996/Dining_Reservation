import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

const User = () => {
  let navigate = useNavigate();
  let { curruseremail } = useContext(UserContext);

  const [user, setUser] = useState({});
  const [bookings, setBookings] = useState([]);
  const [toupdate, setToupdate] = useState(false);
  const [newname, setnewname] = useState("");
  const [newphn, setnewphn] = useState("");
  const [newpwd, setnewpwd] = useState("");

  const {
    id,
    setId,
    curruser,
    setCurruser,
    setCurruseremail,
    setIsuser,
    isuser,
  } = useContext(UserContext);

  const getuser = useCallback(async () => {
    try {
      if (!isuser || !curruseremail || !curruser) {
        navigate("/");
      } else {
        let result = await fetch(
          process.env.REACT_APP_Host_Api + `/api/user/${id}`,
          {
            method: "PUT",
            body: JSON.stringify({ curruseremail }),
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        result = await result.json();

        setUser(result.user);
        setnewname(result.user.username);
        setnewphn(result.user.phn);
        setBookings(result.bookings);
      }
    } catch (error) {
      alert("Error fetching user details");
      console.error("Error fetching user details : ", error);
    }
  }, [isuser, curruseremail, curruser, navigate, id]);

  useEffect(() => {
    getuser();
    setnewpwd("");
  }, [id, toupdate, curruser, curruseremail, setIsuser, isuser, getuser]);

  async function update(e) {
    e.preventDefault();

    let result = await fetch(
      process.env.REACT_APP_Host_Api + `/api/user/${id}`,
      {
        method: "POST",
        body: JSON.stringify({
          curruseremail,
          newname,
          newphn,
          newpwd,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    result = await result.json();
    if (result.error) {
      alert(result.error);
      if (result.donavigate && result.donavigate === true) navigate("/");

      return;
    } else {
      alert("Profile Updated");
      setToupdate(!toupdate);
      setCurruser(result.name);
    }
  }

  async function deleteacc() {
    let result = await fetch(
      process.env.REACT_APP_Host_Api + "/api/user/delete",
      {
        method: "DELETE",
        body: JSON.stringify({ curruseremail }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    result = await result.json();

    if (result.error) {
      alert("Error : ", result.error);
    } else {
      setId("");
      setCurruseremail("");
      setCurruser("");
      setIsuser(false);
      navigate("/");
    }
  }

  return (
    <div className="userrootdiv">
      {!toupdate ? (
        <div className="userpage">
          <div className="username">
            <span>Name : </span>
            {user.username}
          </div>
          <div className="email">
            <span>Email : </span>
            {user.email}
          </div>
          <div className="phone">
            <span>Phone : </span>
            {user.phn}
          </div>
          <div className="formbtns">
            <div className="toupdate" onClick={() => setToupdate(!toupdate)}>
              <button>Update</button>
            </div>
            <div
              className="deleteacc"
              onClick={() => {
                deleteacc();
              }}
            >
              <button>Delete Account</button>
            </div>
          </div>

          <div className="mybookings">
            {bookings.map((value, idx) => {
              return (
                <div
                  className="booking"
                  key={idx}
                  onClick={() => navigate(`/user/${id}/booked/${value._id}`)}
                >
                  <div>Hotel Id : {value.hotelId}</div>
                  <div>Hotel Name : {value.hotelname}</div>
                  <div>Hotel Address : {value.hoteladdress}</div>
                  <div>Date : {value.date}</div>
                  <div>Table : {value.table}</div>
                  <div>Slot : {value.slot}</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="updateformbackground">
          <form className="updateform" onSubmit={update}>
            <div className="formheading">User's Profile</div>

            <div className="field formname">
              <label htmlFor="name">Name : </label>
              <input
                type="text"
                placeholder="Username"
                required
                value={newname}
                onChange={(e) => setnewname(e.target.value)}
              />
            </div>

            <div className="field formemail">
              <label htmlFor="name">Email : </label>
              <input
                type="email"
                placeholder="Email"
                disabled
                required
                value={curruseremail}
              />
            </div>

            <div className="field formphn">
              <label htmlFor="name">Phone : </label>
              <input
                type="Number"
                placeholder="Ph. No."
                value={newphn}
                maxLength={10}
                required
                onChange={(e) => setnewphn(e.target.value)}
              />
            </div>

            <div className="field formpwd">
              <label htmlFor="name">New Password : </label>
              <input
                type="password"
                placeholder="New Password"
                value={newpwd}
                onChange={(e) => setnewpwd(e.target.value)}
              />
            </div>

            <div className="formbtns">
              <button type="submit" className="updatebtn">
                Update
              </button>
              <button
                type="button"
                className="backbtn"
                onClick={() => setToupdate(!toupdate)}
              >
                Back
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default User;
