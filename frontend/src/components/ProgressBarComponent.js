import React from "react";
import { ProgressBar } from "react-bootstrap";

const ProgressBarComponent = ({ progress }) => {
  return (
    <div className="progress-container mb-4">
      <ProgressBar
        now={progress}
        label={`${progress}%`}
        animated
        variant={
          progress === 100 ? "success" : progress === 0 ? "danger" : "primary"
        }
        style={{
          height: "12px",
          borderRadius: "10px", // Rounded corners for iOS-like style
          backgroundColor: "#f0f0f5", // Light background for the bar
        }}
      />
    </div>
  );
};

export default ProgressBarComponent;
