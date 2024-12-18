import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const AddHotel = () => {
  const navigate = useNavigate();

  let { id, curruser, curruseremail, isuser } = useContext(UserContext);

  const [name, setname] = useState("");
  const [address, setAddress] = useState("");
  const [timeday, setTimeday] = useState("Mon-Sun");
  const [starttime, setStarttime] = useState(12);
  const [endtime, setEndtime] = useState(22);
  const [cuisines, setCuisines] = useState("");
  const [avg_cost, setavg_cost] = useState(500);
  const [Mustorder, setMustorder] = useState("");
  const [ModeOfPayment, setModeOfPayment] = useState("Cash, Card, UPI");
  const [Phone, setPhone] = useState("");
  const [Email, setEmail] = useState(curruseremail);
  const [fulladdress, setfulladdress] = useState("");
  const [no_of_tables, setno_of_tables] = useState("");
  const [Features, setFeatures] = useState("");
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");

  useEffect(() => {
    if (isuser || !curruser || !curruseremail || !id) {
      navigate("/");
    }
  }, [id, curruser, curruseremail, isuser]);

  const onImg1Change = (e) => {
    const file = e.target.files[0];
    setImg1(file);
  };

  const onImg2Change = (e) => {
    const file = e.target.files[0];
    setImg2(file);
  };

  async function handleSubmit() {
    try {
      let avg_cost1 = Number(avg_cost);
      let Phone1 = Number(Phone);
      let no_of_tables1 = Number(no_of_tables);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("address", address);
      formData.append("timeday", timeday);
      formData.append("starttime", starttime);
      formData.append("endtime", endtime);
      formData.append("cuisines", cuisines);
      formData.append("avg_cost1", avg_cost1);
      formData.append("Mustorder", Mustorder);
      formData.append("ModeOfPayment", ModeOfPayment);
      formData.append("Phone1", Phone1);
      formData.append("Email", Email);
      formData.append("fulladdress", fulladdress);
      formData.append("no_of_tables1", no_of_tables1);
      formData.append("Features", Features);
      formData.append("curruseremail", curruseremail);
      formData.append("img1", img1);
      formData.append("img2", img2);

      let result = await fetch(
        process.env.REACT_APP_Host_Api + `/api/manager/${id}/addhotel`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      result = await result.json();

      if (result.error) {
        alert(result.error);
      } else {
        navigate(`/managerprofile/${id}`);
      }
    } catch (e) {
      console.log("Error : ", e);
    }
  }

  return (
    <div className="addhotelbackground">
      <div className="addhotelform">
        <div className="formheading">Add Your Hotel</div>
        <div className="field hotelname">
          <span>Hotel Name : </span>
          <input
            type="text"
            placeholder="Name"
            // required
            value={name}
            onChange={(e) => {
              setname(e.target.value);
            }}
          />
        </div>

        <div className="field hotelshortaddress">
          <span>Short Address : </span>
          <input
            type="text"
            placeholder="Place, City"
            // required
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />
        </div>

        <div className="field hoteldaysopen">
          <span>Days Open: </span>
          <input
            type="text"
            placeholder="Mon-Sun"
            // required
            value={timeday}
            onChange={(e) => {
              setTimeday(e.target.value);
            }}
            disabled
          />
        </div>

        <div className="field hoteltime">
          <span>Time : </span>
          <span className="timestartend">Start : </span>
          <input
            type="number"
            placeholder=""
            value={starttime}
            onChange={(e) => {
              setStarttime(e.target.value);
            }}
          />
          <span className="timestartend">End : </span>
          <input
            type="number"
            placeholder=""
            value={endtime}
            onChange={(e) => {
              setEndtime(e.target.value);
            }}
          />
        </div>

        <div className="field hotelcuisines">
          <span>Cuisines : </span>
          <input
            type="text"
            placeholder="Cuisines"
            // required
            value={cuisines}
            onChange={(e) => {
              setCuisines(e.target.value);
            }}
          />
        </div>

        <div className="field hotelavg_cost">
          <span>Avergae Cost : </span>
          ₹
          <input
            type="number"
            placeholder="Avergae Cost"
            // required
            value={avg_cost}
            onChange={(e) => {
              setavg_cost(e.target.value);
            }}
          />
        </div>

        <div className="field hotelmustorder">
          <span>Must Order : </span>
          <input
            type="text"
            placeholder="Must Order"
            // required
            value={Mustorder}
            onChange={(e) => {
              setMustorder(e.target.value);
            }}
          />
        </div>

        <div className="field hotelmodeofpayment">
          <span>Mode of Payment : </span>
          <input
            type="text"
            placeholder="Mode of Payment"
            // required
            value={ModeOfPayment}
            onChange={(e) => {
              setModeOfPayment(e.target.value);
            }}
          />
        </div>

        <div className="field hotelphone">
          {" "}
          <span>Phone : </span>
          <input
            type="number"
            placeholder="Ph. No."
            // required
            value={Phone}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
            maxLength={10}
          />
        </div>

        <div className="field hotelemail">
          {" "}
          <span>Email : </span>
          <input
            type="email"
            placeholder="Email"
            // required
            value={Email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>

        <div className="field hotelfulladdress">
          {" "}
          <span>Full Address : </span>
          <input
            type="text"
            placeholder="Full Address"
            // required
            value={fulladdress}
            onChange={(e) => {
              setfulladdress(e.target.value);
            }}
          />
        </div>

        <div className="field hotelno_of_tables">
          {" "}
          <span>No. of Tables : </span>
          <input
            type="number"
            placeholder="Tables"
            // required
            value={no_of_tables}
            onChange={(e) => {
              setno_of_tables(e.target.value);
            }}
          />
        </div>

        <div className="field hotelfeatures">
          {" "}
          <span>Features : </span>
          <input
            type="text"
            placeholder="Features"
            // required
            value={Features}
            onChange={(e) => {
              setFeatures(e.target.value);
            }}
          />
        </div>

        <div className="field image1">
          <span>Select Image 1:</span>
          <input
            type="file"
            id="img1"
            name="img1"
            accept=".jpg, .jpeg, .png"
            onChange={onImg1Change}
          />
        </div>

        <div className="field image2">
          <span>Select Image 2:</span>
          <input
            type="file"
            id="img2"
            name="img2"
            accept=".jpg, .jpeg, .png"
            onChange={onImg2Change}
          />
        </div>

        <div className="formbtns">
          <div className="hotelsubmitbtn" onClick={handleSubmit}>
            <button>Submit</button>
          </div>

          <div className="hotelbackbtn">
            <button onClick={() => navigate(`/managerprofile/${id}`)}>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHotel;
