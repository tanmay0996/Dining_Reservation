import React, { useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    getuser();
    setnewpwd("");
  }, [id, toupdate, curruser, curruseremail, setIsuser]);

  async function getuser() {
    try {
      // console.log("make req", curruseremail);

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
      console.error("Error fetching user:", error);
    }
  }

  async function update() {
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

    setToupdate(!toupdate);
    setCurruser(result.name);
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
      // navigate("/");
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
          <div className="updateform">
            <div className="formheading">User's Profile</div>
            <div className="field formname">
              <label htmlFor="name">Name : </label>
              <input
                type="text"
                placeholder="Username"
                // disabled
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
              <div className="updatebtn" onClick={update}>
                Update
              </div>
              <div className="backbtn" onClick={() => setToupdate(!toupdate)}>
                Back
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
