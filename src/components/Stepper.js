// src/components/Stepper.js
import React from "react";
import "../Css/Stepper.css"; // Make sure to create this CSS file for custom styles

const Stepper = ({ currentStep }) => {
  return (
    <div className="stepper">
      <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
        <div className="circle">1</div>
        <div className="label">Shipping</div>
      </div>
      <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
        <div className="circle">2</div>
        <div className="label">Review & Payments</div>
      </div>
    </div>
  );
};

export default Stepper;
