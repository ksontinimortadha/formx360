// components/StatCard.js
import React from "react";
import { Card } from "react-bootstrap";
import { FaUsers, FaHourglassHalf, FaCheckCircle } from "react-icons/fa";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <Card
    className="text-white shadow-sm border-0 mb-3"
    style={{ backgroundColor: color }}
  >
    <Card.Body className="d-flex align-items-center justify-content-between">
      <div>
        <h6 className="mb-1">{label}</h6>
        <h4>{value}</h4>
      </div>
      <Icon size={32} />
    </Card.Body>
  </Card>
);

export default StatCard;
