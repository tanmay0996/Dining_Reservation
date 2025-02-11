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
  }, [curruser, curruseremail, hotel, tableSelected, slotSelected, navigate]);

  async function payment() {
    const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

    const res = await fetch(
      `${process.env.REACT_APP_Host_Api}/api/booking/payment`,
      {
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
          price: 500,
          image_url: `${hotel.image1}`,
        }),
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.statusText}`);
    }

    const session = await res.json();

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
      <div className="regulations">
        <div>
          For successful payment, use Indian Card No.:{" "}
          <span>4000 0035 6000 0008</span>
        </div>
        <div>
          Due to some regulations, international cards will not be accepted
          because the website is in developer mode.
        </div>
        <div>
          For more info, you can visit{" "}
          <a
            href="https://docs.stripe.com/testing?testing-method=card-numbers#international-cards"
            target="_blank"
            rel="noopener noreferrer"
          >
            Stripe Website
          </a>
        </div>
      </div>
    </div>
  );
}

export default BookTable;
