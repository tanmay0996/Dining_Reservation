import React, { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../UserContext";
import { loadStripe } from "@stripe/stripe-js";

function BookTable() {
  const navigate = useNavigate();
  const location = useLocation();
  const { curruser } = useContext(UserContext);

  const { hotel, tableSelected, slotSelected, curruseremail } =
    location.state || {};

  useEffect(() => {
    if (!curruser || curruseremail === undefined) {
      navigate("/");
    }
  }, [curruser, curruseremail, hotel, tableSelected, slotSelected]);

  async function payment() {
    const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

    const res = await fetch(`http://127.0.0.1:5000/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hotelname: hotel.name,
        hotel,
        tableSelected,
        slotSelected,
        curruseremail,
        price:500,
        image_url:`${hotel.image1}`,
      }),
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.statusText}`);
    }

    const session = await res.json();
    console.log(session);

    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.log(result.error);
    }
  }

  return (
    <div className="paymentpagebackground">
      <div className="paymentpage">
        <div className="payeename">Name : {curruser}</div>
        <div className="payeeemail">Email : {curruseremail}</div>
        <div className="payeehotelname">Hotel Name : {hotel?.name}</div>
        <div className="payeehoteladdress">
          Hotel Address : {hotel?.fulladdress}
        </div>
        <div className="payeetable">Table No. : {tableSelected}</div>
        <div className="payeeslot">Slot : {slotSelected}</div>
        <div className="payeecost">Cost : ₹ 500.00/-</div>
        <button className="paymentbtn" onClick={payment}>
          Pay
        </button>
        <button
          className="paymentbackbtn"
          onClick={() => navigate(`/hotel/${hotel._id}`)}
        >
          Cancel Payment
        </button>
      </div>
    </div>
  );
}

export default BookTable;
