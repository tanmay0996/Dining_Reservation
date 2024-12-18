import React, { useContext, useEffect, useState } from "react";
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
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";

const ManagerProfile = () => {
  let { id, curruser, curruseremail, setCurruser, isuser } =
    useContext(UserContext); //setCurruseremail,

  const navigate = useNavigate();

  const [manager, setManager] = useState({});
  const [toupdate, setToupdate] = useState(false);
  const [newname, setnewname] = useState("");
  const [newphn, setnewphn] = useState("");
  const [newpwd, setnewpwd] = useState("");
  const [newaadhar, setnewaadhar] = useState("");
  const [newpan, setnewpan] = useState("");
  const [newaddress, setnewaddress] = useState("");
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    getmanagerinfo();
    setnewpwd("");
  }, [id, curruseremail, curruser, toupdate]);

  async function searchhotels(event) {
    if (event && event.target) {
      let hotelsearch = event.target.value;

      let result = await fetch(
        process.env.REACT_APP_Host_Api + `/manager/profile/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({ curruseremail, hotelsearch }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      result = await result.json();
      if (result.hotels) {
        setHotels(result.hotels);
      }
    } else {
      getmanagerinfo();
    }
  }

  async function getmanagerinfo() {
    try {
      if (!curruseremail) {
        navigate("/managerlogin");
      } else if (curruseremail && isuser) {
        navigate("/");
      } else {
        let result = await fetch(
          process.env.REACT_APP_Host_Api + `/api/manager/profile/${id}`,
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

        let hotels = result.hotels;
        result = result.manager;

        setManager(result);
        setnewname(result.name);
        setnewaddress(result.address);
        setnewaadhar(result.aadhar);
        setnewpan(result.pan);
        setnewphn(result.phn);
        setHotels(hotels);
      }
    } catch (e) {
      console.log({ error: e });
    }
  }

  async function update() {
    // console.log(
    //   curruseremail,
    //   newname,
    //   newphn,
    //   newpwd,
    //   newaddress,
    //   newaadhar,
    //   newpan
    // );

    let result = await fetch(
      process.env.REACT_APP_Host_Api + `/api/manager/profile/${id}`,
      {
        method: "POST",
        body: JSON.stringify({
          curruseremail,
          newname,
          newphn,
          newpwd,
          newaddress,
          newaadhar,
          newpan,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    result = await result.json();

    setToupdate(!toupdate);
    // console.log(curruser, " changed to ", result.name);
    setCurruser(result.name);
    // console.log("Now curruser is ", curruser);
  }

  return !toupdate ? (
    <div className="manager">
      <div className="managerinfo">
        <div className="managername">
          <span>Name : </span>
          {manager.name}
        </div>
        <div className="manageremail">
          <span>Email : </span>
          {manager.email}
        </div>
        <div className="managerphn">
          <span>Phone : </span>
          {manager.phn}
        </div>
        <div className="manageraddress">
          <span>Address : </span>
          {manager.address}
        </div>
        <div className="manageraadhar">
          <span>Aadhar : </span>
          {manager.aadhar}
        </div>
        <div className="managerpan">
          <span>Pan : </span>
          {manager.pan}
        </div>

        <div className="formbtns">
          <div className="managertoupdate">
            <button onClick={() => setToupdate(!toupdate)}>Update</button>
          </div>
          <div className="manageraddhotelbtn">
            <button onClick={() => navigate(`/manager/${id}/addhotel`)}>
              Add Hotel
            </button>
          </div>
        </div>
      </div>

      <div className="searchbox">
        <input
          type="text"
          placeholder="Search by Hotel Name and Place"
          onChange={searchhotels}
        />
      </div>

      <div className="seehotels">
        {hotels.map((value, index) => {
          return (
            <div key={index} className="hoteldetails2">
              <div className="hotelimages">
                <img
                  src={`${process.env.REACT_APP_Host_Api}/uploads/${value.image1}`}
                  alt="PIC"
                  className="hotelimages2"
                />
                <img
                  src={`${process.env.REACT_APP_Host_Api}/uploads/${value.image2}`}
                  alt="PIC"
                  className="hotelimages2"
                />
              </div>

              <div className="hotelinfo2">
                <div className="topblocks2">
                  <div className="block1_2">
                    <div className="name2">{value.name}</div>

                    <div className="address2">
                      <LocationOnIcon style={{ fontSize: "15px" }} />
                      <span className="subinfo">{value.fulladdress}</span>
                    </div>
                  </div>

                  <div className="block2_2">
                    <div className="timeheading2">
                      <div className="subinfo"></div>
                      <AccessTimeIcon style={{ fontSize: "15px" }} />
                      Timing
                    </div>

                    <div className="time2">
                      <span className="timeday2">{value.timeday}</span> :{" "}
                      <span className="subinfo">{value.time}</span>
                    </div>
                  </div>
                </div>

                <div className="downblocks2">
                  <div className="downleft2">
                    <div className="cuisines2 common2">
                      <span className="subheading2">
                        <RestaurantIcon style={{ fontSize: "15px" }} />
                        Cuisines :{" "}
                      </span>
                      <span className="subinfo">{value.cuisines}</span>
                    </div>

                    <div className="avg_cost2 common2">
                      <span className="subheading2">
                        <AttachMoneyIcon style={{ fontSize: "15px" }} />
                        Average Cost:
                      </span>
                      <span className="subinfo">
                        <CurrencyRupeeIcon style={{ fontSize: "15px" }} />
                        {value.avg_cost}
                      </span>
                    </div>

                    <div className="mustorder2 common2">
                      <span className="subheading2">
                        <StarBorderIcon style={{ fontSize: "15px" }} />
                        Must Order:{" "}
                      </span>
                      <span className="subinfo">{value.Mustorder}</span>
                    </div>

                    <div className="mode2 common2">
                      <span className="subheading2">
                        <PaymentIcon style={{ fontSize: "15px" }} />
                        Mode of Payment:{" "}
                      </span>
                      <span className="subinfo">{value.ModeOfPayment}</span>
                    </div>
                  </div>

                  <div className="downright2">
                    <div className="number2">
                      <span className="subheading2">
                        <CallIcon style={{ fontSize: "15px" }} />
                        Ph. No. :{" "}
                      </span>{" "}
                      <span className="subinfo">+91 {value.Phone}</span>
                    </div>

                    <div className="email2">
                      <span className="subheading2">
                        <EmailIcon style={{ fontSize: "15px" }} />
                        Email :{" "}
                      </span>
                      <span className="subinfo">{value.Email}</span>
                    </div>
                  </div>

                  <div className="features">
                    <span className="subheading2">
                      <FeaturedPlayListIcon style={{ fontSize: "15px" }} />
                      Features :{" "}
                    </span>
                    <span className="subinfo">{value.Features}</span>
                  </div>

                  <div className="no_of_tables">
                    <span>Total No. of Tables : </span>
                    <span className="subinfo">{value.no_of_tables}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div className="managerupdateformbackground">
      <div className="managerupdateform">
        <div className="formheading">Manager's Profile</div>
        <div className="field managerformname">
          <label htmlFor="name">Name : </label>
          <input
            type="text"
            placeholder="Username"
            value={newname}
            onChange={(e) => setnewname(e.target.value)}
          />
        </div>
        <div className="field managerformemail">
          <label htmlFor="name">Email : </label>
          <input
            type="text"
            placeholder="Username"
            disabled
            value={curruseremail}
          />
        </div>
        <div className="field managerformphn">
          <label htmlFor="name">Phone : </label>
          <input
            type="number"
            placeholder="Username"
            value={newphn}
            maxLength={10}
            onChange={(e) => setnewphn(e.target.value)}
          />
        </div>
        <div className="field managerformaddress">
          <label htmlFor="name">Address : </label>
          <input
            type="text"
            placeholder="Username"
            value={newaddress}
            onChange={(e) => setnewaddress(e.target.value)}
          />
        </div>
        <div className="field managerformaadhar">
          <label htmlFor="name">Aadhar : </label>
          <input
            type="number"
            placeholder="Username"
            value={newaadhar}
            maxLength={12}
            onChange={(e) => setnewaadhar(e.target.value)}
          />
        </div>
        <div className="field managerformpan">
          <label htmlFor="name">Pan : </label>
          <input
            type="text"
            placeholder="Username"
            value={newpan}
            onChange={(e) => setnewpan(e.target.value)}
          />
        </div>
        <div className="field managerformpwd">
          <label htmlFor="name">New Password : </label>
          <input
            type="password"
            placeholder="New Password"
            value={newpwd}
            onChange={(e) => setnewpwd(e.target.value)}
          />
        </div>
        <div className="formbtns">
          <div className="managerupdatebtn">
            <button onClick={update}>Update</button>
          </div>
          <div className="managerbackbtn">
            <button onClick={() => setToupdate(!toupdate)}>Back</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerProfile;
