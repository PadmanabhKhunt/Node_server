// const express = require('express');
// const bodyParser = require('body-parser');
// const { Pool } = require('pg');

// const app = express();
// const port = 3000;
// let phvalue = null;

// // Replace the following with your PostgreSQL connection details
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'phvalue',
//   password: 'padmanabh2',
//   port: 5432, // Default PostgreSQL port
// });

// app.use(bodyParser.json());

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// app.post('/update', async (req, res) => {
//   const { ph } = req.body;
//   console.log(`Received pH value: ${ph}`);
//   phvalue = ph;

//   // Insert pH value into PostgreSQL database
//   try {
//     const client = await pool.connect();
//     const result = await client.query('INSERT INTO ph_values (value) VALUES ($1)', [ph]);
//     console.log('pH value inserted into database');
//     client.release();
//   } catch (error) {
//     console.error('Error inserting pH value into database', error);
//     res.status(500).json({ error: 'Internal server error' });
//     return;
//   }

//   res.sendStatus(200);
// });

// app.get('/get', async (req, res) => {
//   if (phvalue !== null) {
//     res.header('Content-Type', 'application/json'); // Set content type to JSON
//     res.status(200).json({ ph: phvalue });
//   } else {
//     res.status(404).json({ error: 'pH value not available' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors"); // Add this line
const fs = require("fs");
let currentLatitude = 0.0;
let currentLongitude = 0.0;
let currentSpeed = 0.0;

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);


// Replace the following with your PostgreSQL connection details
const pool = new Pool({
  user: "admin",
  host: "192.168.0.112",
  database: "padmanabh", // Change the database name
  password: "admin",
  port: 5432, // Default PostgreSQL port
});

// const pool = new Pool({
//   connectionString: 'postgres://padmanabh:3zFnSBmknMq0oPY5Nhq4DmKaEn9wxUS3@dpg-cml206icn0vc739luo3g-a.oregon-postgres.render.com/phandspeed',
//   ssl: {
//     rejectUnauthorized: false, // You may need to set this to true in production with a valid certificate
//   },
// });

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/update", async (req, res) => {
  const { latitude, longitude, speed } = req.body;
  console.log(
    `Received GPS data - Latitude: ${latitude}, Longitude: ${longitude}, Speed: ${speed}`
  );
  currentLatitude = latitude;
  currentLongitude = longitude;
  currentSpeed = speed;
  // Insert GPS data into PostgreSQL database
  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO gps_data (latitude, longitude, speed) VALUES ($1, $2, $3)",
      [latitude, longitude, speed]
    );
    console.log("GPS data inserted into database");
    client.release();
  } catch (error) {
    console.error("Error inserting GPS data into database", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }

  res.sendStatus(200);
});

app.get("/getGPS", async (req, res) => {
  if (currentLatitude !== 0.0 && currentLongitude !== 0.0) {
    res.header("Content-Type", "application/json");
    res
      .status(200)
      .json({
        latitude: currentLatitude,
        longitude: currentLongitude,
        speed: currentSpeed,
      });
  } else {
    res.status(404).json({ error: "GPS data not available" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// const { Client } = require('pg');
// const fs = require('fs');

// // Connection string to your PostgreSQL database
// const connectionString = 'postgres://padmanabh:3zFnSBmknMq0oPY5Nhq4DmKaEn9wxUS3@dpg-cml206icn0vc739luo3g-a.oregon-postgres.render.com/phandspeed';

// // Create a new PostgreSQL client
// const client = new Client({
//   connectionString: connectionString,
//   ssl: {
//     rejectUnauthorized: false, // You may need to set this to true in production with a valid certificate
//   },
// });

// // Connect to the database
// client.connect();

// // Dummy data to insert
// const dummyData = [
//   { latitude: 40.7128, longitude: -74.0060, speed: 60.5 },
//   { latitude: 34.0522, longitude: -118.2437, speed: 45.3 },
//   // Add more dummy data as needed
// ];

// // Insert dummy data into the gps_data table
// async function insertDummyData() {
//   for (const data of dummyData) {
//     const query = {
//       text: 'INSERT INTO gps_data (latitude, longitude, speed) VALUES ($1, $2, $3) RETURNING *',
//       values: [data.latitude, data.longitude, data.speed],
//     };

//     try {
//       const result = await client.query(query);
//       console.log(`Inserted data with ID: ${result.rows[0].id}`);
//     } catch (error) {
//       console.error('Error inserting data:', error.message);
//     }
//   }

//   // Close the database connection
//   client.end();
// }

// // Call the function to insert dummy data
// insertDummyData();
