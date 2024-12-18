import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import PaymentIcon from "@mui/icons-material/Payment";

function Homepage() {
  const [hotels, sethotels] = useState([]);
  const { setCurruser, setIsuser } = useContext(UserContext); //setCurruseremail, curruser, curruseremail

  const navigate = useNavigate();

  useEffect(() => {
    gethotels();
  }, []);

  async function searchhotels(event) {
    if (event && event.target) {
      let hotelsearch = event.target.value;

      let result = await fetch(process.env.REACT_APP_Host_Api+"/api/hotel", {
        method: "POST",
        body: JSON.stringify({ hotelsearch }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      result = await result.json();
      // sethotels(result);
      
      if (result.hotels) {
        sethotels(result.hotels);
      } else {
        sethotels([]);
      }
    }
  }

  async function gethotels() {

    let result = await fetch(process.env.REACT_APP_Host_Api+"/api/hotel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    result = await result.json();
    // console.log("here");

    // if (result.error) {
    //   alert(result.Error);
    // }

    let username = result.info.username;

    setCurruser(username);
    setIsuser(true);
    // console.log("UserInfo2 is ", result);
    sethotels(result.hotels);
  }

  return (
    <div className="homepagebackground">
      <div className="class1">
        <div className="classleft">
          <p className="class1_p1">Book Your Table!!</p>
          <p className="class1_p1">Enjoy your Meal!!</p>
        </div>
        <div className="plate"></div>
      </div>

      <div className="searchbox">
        <input
          type="text"
          placeholder="Search by Hotel Name and Place"
          onChange={searchhotels}
        />
      </div>

      <div className="hotelgroup">
        {!hotels.length ? (
          <>No hotels</>
        ) : (
          <>
            {hotels.map((value, id) => {
              return (
                <div
                  key={id}
                  className="hoteldetails"
                  onClick={() => {
                    navigate(`/hotel/${value._id}`);
                  }}
                >
                  <img
                    src={`${process.env.REACT_APP_Host_Api}/uploads/${value.image1}`}
                    alt="PIC"
                    className="hotelimage"
                  />

                  <div className="hotelinfo">
                    <div className="topblocks">
                      <div className="block1">
                        <div className="name">{value.name}</div>
                        <div className="address">
                          <LocationOnIcon style={{ fontSize: "15px" }} />
                          {value.address}
                        </div>
                      </div>
                      <div className="block2">
                        <div className="timeheading">
                          <AccessTimeIcon style={{ fontSize: "15px" }} />
                          Timing
                        </div>
                        <div className="time">
                          <span className="timeday">{value.timeday}</span> :{" "}
                          {value.time}
                        </div>
                      </div>
                    </div>

                    <div className="downblocks">
                      <div className="downleft">
                        <div className="cuisines common">
                          <span className="subheading">
                            <RestaurantIcon style={{ fontSize: "15px" }} />
                            Cuisines :{" "}
                          </span>
                          {value.cuisines}
                        </div>
                        <div className="avg_cost common">
                          <span className="subheading">
                            <AttachMoneyIcon style={{ fontSize: "15px" }} />
                            Avergae Cost :
                          </span>
                          <CurrencyRupeeIcon
                            style={{ fontSize: "15px" }}
                          />{" "}
                          {value.avg_cost}
                        </div>
                        <div className="mustorder common">
                          <span className="subheading">
                            <StarBorderIcon style={{ fontSize: "15px" }} />
                            Must Order :{" "}
                          </span>
                          {value.Mustorder}
                        </div>
                        <div className="mode common">
                          <span className="subheading">
                            <PaymentIcon style={{ fontSize: "15px" }} />
                            Mode of Payment :{" "}
                          </span>
                          {value.ModeOfPayment}
                        </div>
                      </div>

                      <div className="downright">
                        <div className="number">
                          <span className="subheading">
                            <CallIcon style={{ fontSize: "15px" }} />
                            Ph. No. :{" "}
                          </span>{" "}
                          +91
                          {value.Phone}
                        </div>
                        <div className="email">
                          <span className="subheading">
                            <EmailIcon style={{ fontSize: "15px" }} />
                            Email :{" "}
                          </span>
                          {value.Email}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default Homepage;
