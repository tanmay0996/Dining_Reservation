import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import jsPDF from "jspdf";

const BookedPage = () => {
  let { id, curruser, curruseremail, isuser } = useContext(UserContext);

  let params = useParams();
  const navigate = useNavigate();
  const [bookingdetail, setBookingdetail] = useState({});

  useEffect(() => {
    getbookingdetails();
  }, [id, isuser, curruser, curruseremail]);

  async function getbookingdetails() {
    // if (isuser || !curruser || !curruseremail) {
    console.log("booking page ", isuser, curruser, curruseremail);
    // navigate("/");
    // } else {
    let result = await fetch(
      process.env.REACT_APP_Host_Api + `/user/${id}/booked/${params.id1}`,
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
      alert(result.error);
      navigate("/");
    }
    setBookingdetail(result);
    // }
  }

  const generateReceipt = () => {
    const doc = new jsPDF();
    doc.text("Booking Receipt", 25, 10);
    doc.text(`Booking ID: ${bookingdetail._id}`, 10, 20);
    doc.text(`Name: ${bookingdetail.username}`, 10, 30);
    doc.text(`Email: ${bookingdetail.email}`, 10, 40);
    doc.text(`Hotel ID: ${bookingdetail.hotelId}`, 10, 50);
    doc.text(`Hotel Name: ${bookingdetail.hotelname}`, 10, 60);
    doc.text(`Hotel Address: ${bookingdetail.hoteladdress}`, 10, 70);
    doc.text(`Booking Date: ${bookingdetail.date}`, 10, 80);
    doc.text(`Booked Table: ${bookingdetail.table}`, 10, 90);
    doc.text(`Booked Slot: ${bookingdetail.slot}`, 10, 100);

    doc.save(`booking_receipt_${bookingdetail._id}.pdf`);
  };

  return (
    <div className="bookedpagebackground">
      <div className="bookedpage">
        <div className="bookingid">
          <span>Booking ID : </span>
          {bookingdetail._id}
        </div>
        <div className="bookingid">
          <span>User ID : </span>
          {bookingdetail.userId}
        </div>
        <div className="bookingusername">
          <span>Name : </span>
          {bookingdetail.username}
        </div>
        <div className="bookinguseremail">
          <span>Email : </span>
          {bookingdetail.email}
        </div>
        <div className="bookinghotelId">
          <span>Hotel Id : </span>
          {bookingdetail.hotelId}
        </div>
        <div className="bookinghotelname">
          <span>Hotel Name: </span>
          {bookingdetail.hotelname}
        </div>
        <div className="bookinghoteladdress">
          <span>Hotel Address : </span>
          {bookingdetail.hoteladdress}
        </div>
        <div className="bookingdate">
          <span>Booking Date : </span>
          {bookingdetail.date}
        </div>
        <div className="bookingtable">
          <span>Booked Table No. : </span>
          {bookingdetail.table}
        </div>
        <div className="bookingslot">
          <span>Booked Slot : </span>
          {bookingdetail.slot}
        </div>
        <div className="formbtns">
          <button className="backbtn" onClick={() => navigate(`/user/${id}`)}>
            Back
          </button>

          <button className="downloadbtn" onClick={generateReceipt}>
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookedPage;
