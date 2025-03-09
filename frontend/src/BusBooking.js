import React, { useState } from "react";
import axios from "axios";

const BusBooking = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [buses, setBuses] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/getBuses?source=${source}&destination=${destination}`
      );
      setBuses(response.data);
    } catch (error) {
      console.error("Error fetching buses:", error);
    }
  };

  return (
    <div>
      <h2>Book Your Bus</h2>
      <input
        type="text"
        placeholder="Source"
        onChange={(e) => setSource(e.target.value)}
      />
      <input
        type="text"
        placeholder="Destination"
        onChange={(e) => setDestination(e.target.value)}
      />
      <button onClick={handleSearch}>Find Buses</button>

      <ul>
        {buses.map((bus, index) => (
          <li key={index}>
            <strong>{bus.name}</strong> - Congestion: {bus.congestionLevel}%
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusBooking;
