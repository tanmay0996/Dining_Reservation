import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";

const SuccessfulPayment = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { id, curruser, curruseremail, isuser } = useContext(UserContext);

  useEffect(() => {
    if (!isuser || !curruser || !curruseremail || !id) {
      // navigate("/");
    } else {
      payment();
    }
  }, [curruser, curruseremail, id, isuser]);

  async function gethoteldata(id) {
    let res = await fetch(process.env.REACT_APP_Host_Api + `/hotel/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    res = await res.json();
    if (res.error) {
      alert("Error : ", res.error);
      navigate("/");
    } else {
      return res.hotel;
    }
  }

  async function payment() {
    let id = params.id;
    let tableSelected = params.tableselected;
    let slotSelected = params.slotselected;

    const hotel = await gethoteldata(id);
    console.log(hotel, id, tableSelected, slotSelected);

    let result = await fetch(
      process.env.REACT_APP_Host_Api + `/hotel/${id}/book`,
      {
        method: "POST",
        body: JSON.stringify({
          hotel,
          tableSelected,
          slotSelected,
          curruseremail,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    result = await result.json();

    let bookingid = result.id;
    console.log("Final Result : ", bookingid);

    navigate(`/user/${id}/booked/${bookingid}`, { state: { bookingid } });
  }

  return (
    <div className="unsuccessful-payment-container">
      <div className="message-box">
        <div className="message-title">SuccessfulPayment, redirecting...</div>
      </div>
    </div>
  );
};

export default SuccessfulPayment;
