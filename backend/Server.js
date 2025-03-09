const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Bus Schema
const BusSchema = new mongoose.Schema({
  name: String,
  source: String,
  destination: String,
  route: [String], // Route waypoints
  congestionLevel: Number,
});

const Bus = mongoose.model("Bus", BusSchema);

// Fetch Bus Routes with Traffic Data
app.get("/getBuses", async (req, res) => {
  const { source, destination } = req.query;
  const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  
  try {
    const buses = await Bus.find({ source, destination });

    // Fetch Traffic Data for Each Bus Route
    const updatedBuses = await Promise.all(
      buses.map(async (bus) => {
        const waypoints = bus.route.join("|");

        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${source}&destination=${destination}&waypoints=${waypoints}&departure_time=now&traffic_model=best_guess&key=${API_KEY}`;

        const response = await axios.get(url);
        const congestionLevel = Math.floor(Math.random() * 50) + 20; // Mock Congestion Data
        return { ...bus._doc, congestionLevel };
      })
    );

    res.json(updatedBuses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bus data" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
