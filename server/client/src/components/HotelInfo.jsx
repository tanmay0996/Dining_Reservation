import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import PaymentIcon from "@mui/icons-material/Payment";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import { UserContext } from "../UserContext";

const HotelInfo = () => {
  const { curruser, curruseremail, isuser, id } = useContext(UserContext);

  const params = useParams();
  const navigate = useNavigate();
  // const navigation=useNavigation();

  const [hotel, sethotel] = useState({});
  const [table, setTable] = useState([]);
  const [tableslots, setTableSlots] = useState("");
  const [tableSelected, setTableSelected] = useState("");
  const [slotSelected, setSlotSelected] = useState("");

  useEffect(() => {
    gethotel();
  }, []);

  async function gethotel() {
    let result = await fetch(
      process.env.REACT_APP_Host_Api + `/api/hotel/${params.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    result = await result.json();
    if (result.error) {
      alert("Error : ", result.error);
      navigate("/");
    } else {
      sethotel(result.hotel);
      setTable(result.tableavailable);
      setTableSlots(result.slots);
    }
  }

  async function booktable() {
    if (curruser && isuser) {
      navigate(`/hotel/${params.id}/book`, {
        state: {
          hotel,
          tableSelected,
          slotSelected,
          curruseremail,
        },
      });
    } else if (curruser && !isuser) {
      alert("Manager is not allowed to book any table at any restaurant");
      navigate(`/managerprofile/${id}`);
    } else {
      alert("Please Login");
      navigate("/userlogin");
    }
  }

  return (
    <div className="hotelinfobackground">
      <div className="hoteldetails2">
        <div className="hotelimages">
          <img
            src={`${process.env.REACT_APP_Host_Api}/uploads/${hotel.image1}`}
            alt="PIC"
            className="hotelimages2"
          />
          <img
            src={`${process.env.REACT_APP_Host_Api}/uploads/${hotel.image2}`}
            alt="PIC"
            className="hotelimages2"
          />
        </div>

        <div className="hotelinfo2">
          <div className="topblocks2">
            <div className="block1_2">
              <div className="name2">{hotel.name}</div>

              <div className="address2">
                <LocationOnIcon style={{ fontSize: "15px" }} />
                <span className="subinfo"> {hotel.fulladdress}</span>
              </div>
            </div>

            <div className="block2_2">
              <div className="timeheading2">
                <div className="subinfo"></div>
                <AccessTimeIcon style={{ fontSize: "15px" }} /> Timing -
              </div>

              <div className="time2">
                <span className="timeday2">{hotel.timeday}</span> :{" "}
                <span className="subinfo">{hotel.time}</span>
              </div>
            </div>
          </div>

          <div className="downblocks2">
            <div className="downleft2">
              <div className="cuisines2 common2">
                <span className="subheading2">
                  <RestaurantIcon style={{ fontSize: "15px" }} /> Cuisines :{" "}
                </span>
                <span className="subinfo">{hotel.cuisines}</span>
              </div>

              <div className="avg_cost2 common2">
                <span className="subheading2">
                  <AttachMoneyIcon style={{ fontSize: "15px" }} />
                  Average Meal Cost:
                </span>
                <CurrencyRupeeIcon style={{ fontSize: "15px" }} />
                <span className="subinfo">{hotel.avg_cost}</span>
              </div>

              <div className="mustorder2 common2">
                <span className="subheading2">
                  <StarBorderIcon style={{ fontSize: "15px" }} /> Must Order:{" "}
                </span>
                <span className="subinfo">{hotel.Mustorder}</span>
              </div>

              <div className="mode2 common2">
                <span className="subheading2">
                  <PaymentIcon style={{ fontSize: "15px" }} /> Mode of Payment :{" "}
                </span>
                <span className="subinfo">{hotel.ModeOfPayment}</span>
              </div>
            </div>

            <div className="downright2">
              <div className="number2">
                <span className="subheading2">
                  <CallIcon style={{ fontSize: "15px" }} /> Ph. No. :{" "}
                </span>{" "}
                <span className="subinfo">+91 {hotel.Phone}</span>
              </div>

              <div className="email2">
                <span className="subheading2">
                  <EmailIcon style={{ fontSize: "15px" }} /> Email :{" "}
                </span>
                <span className="subinfo">{hotel.Email}</span>
              </div>
            </div>

            <div className="features">
              <span className="subheading2">
                <FeaturedPlayListIcon style={{ fontSize: "15px" }} /> Features :
              </span>
              <span className="subinfo">{hotel.Features}</span>
            </div>

            <div className="no_of_tables">
              <span>Total No. of Tables : </span>
              <span className="subinfo">{hotel.no_of_tables}</span>
            </div>

            <div className="no_of_available_tables">
              <span>No. of Available Tables : </span>
              <span className="subinfo">{table.length}</span>
            </div>
          </div>
        </div>
      </div>

      {slotSelected ? (
        <div className="selected">
          <div className="selected_table_no">TABLE : {tableSelected}</div>
          <div className="selected_slot_no">SLOT : {slotSelected}</div>
          <div className="selection_btn" onClick={booktable}>
            <button>BOOK TABLE!!!</button>
          </div>
        </div>
      ) : (
        <></>
      )}

      <div className="table_selection">
        {table.map((val, idx) => {
          return (
            <div key={idx} className="table_no" value={tableSelected}>
              <div className="teable_no_text" value={val}>
                Table : {val}
              </div>
              <div className="table_slot">
                {tableslots.map((values, index) => {
                  return index === val - 1 ? (
                    values.map((vals, index2) => {
                      return (
                        <div
                          tabIndex="0"
                          key={index2}
                          className="slot"
                          value={vals}
                          onClick={() => {
                            setTableSelected(val);
                            setSlotSelected(vals);
                          }}
                        >
                          {vals}
                        </div>
                      );
                    })
                  ) : (
                    <React.Fragment key={`${idx}-${index}`} />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HotelInfo;
