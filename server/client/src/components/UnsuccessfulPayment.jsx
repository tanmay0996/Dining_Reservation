import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const UnsuccessfulPayment = () => {
  const navigate = useNavigate();
  const params = useParams();

  const id = params.id;

  return (
    <div className="unsuccessful-payment-container">
      <div className="message-box">
        <div className="message-title">
          The Last payment was unsuccessful due to some reason.
        </div>
        <div className="message-subtitle">Inconvinence is highly regreted</div>
      </div>
      <div className="formbtns">
        <button className="backbtn" onClick={() => navigate(`/hotel/${id}`)}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default UnsuccessfulPayment;
