import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "./App.css";

const formatVGrade = (vGrade) => {
  return vGrade.startsWith("V") ? vGrade : `V${vGrade}`;
};

const App = () => {
  const [parsedData, setParsedData] = useState([]);
  const [userData, setUserData] = useState({
    edgeHang: "",
    maxPullUps: "",
    vGrade: "",
  });
  const [recommendations, setRecommendations] = useState([]);
  const [meanValues, setMeanValues] = useState({ pullUps: 0, edgeHang: 0 });

  useEffect(() => {
    // Load and parse the CSV file when the component mounts
    const fetchCsvData = async () => {
      const response = await fetch("/data.csv");
      const csv = await response.text();

      Papa.parse(csv, {
        header: true,
        complete: (results) => {
          setParsedData(results.data);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
    };

    fetchCsvData();
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateRecommendations(userData);
  };

  // Calculate means for the v grade
  const calculateMeans = (vGrade) => {
    const filteredData = parsedData.filter(
      (record) =>
        record["Hardest V Grade ever climbed "] === formatVGrade(vGrade)
    );

    if (filteredData.length === 0) return { pullUps: 0, edgeHang: 0 };

    let totalPullUps = 0;
    let validPullUpsCount = 0;

    let totalEdgeHang = 0;
    let validEdgeHangCount = 0;

    filteredData.forEach((record) => {
      // ------------------ Pull ups --------------------
      const pullUps = Number(record["5 rep max weighted pull ups"]);

      if (typeof pullUps === "string") {
        pullUps = pullUps.trim().toLowerCase();
        if (pullUps.endsWith("lbs") || pullUps.endsWith("lb")) {
          pullUps = Number(pullUps.replace(/lbs?/, "").trim());
          pullUps *= 0.453592;
        } else if (pullUps.endsWith("kg")) {
          pullUps = Number(pullUps.replace(/kg/, "").trim());
        } else {
          pullUps = Number(pullUps);
        }
      }

      if (!isNaN(pullUps) && pullUps != "") {
        totalPullUps += pullUps;
        validPullUpsCount += 1;
      }

      // ------------------ 18 mm hang --------------------
      let edgeHang =
        record[
          "Max Weight hangboard 18mm edge - Half crimp (KG)  (10 seconds) (added weight only)"
        ];

      if (typeof edgeHang === "string") {
        edgeHang = edgeHang.trim().toLowerCase();
        if (edgeHang.endsWith("lbs") || edgeHang.endsWith("lb")) {
          edgeHang = Number(edgeHang.replace(/lbs?/, "").trim());
          edgeHang *= 0.453592;
        } else if (edgeHang.endsWith("kg")) {
          edgeHang = Number(edgeHang.replace(/kg/, "").trim());
        } else {
          edgeHang = Number(edgeHang);
        }
      }

      if (!isNaN(edgeHang) && edgeHang != "") {
        totalEdgeHang += Number(edgeHang);
        validEdgeHangCount += 1;
      }
    });

    console.log(`total 5rm pullups count: ${totalPullUps}`);
    console.log(`total valid pullups: ${validPullUpsCount}`);
    console.log(`total 20mm hang kg: ${totalEdgeHang}`);
    console.log(`total valid 20mm hang: ${validEdgeHangCount}`);

    return {
      pullUps: validPullUpsCount === 0 ? 0 : totalPullUps / validPullUpsCount,
      edgeHang:
        validEdgeHangCount === 0 ? 0 : totalEdgeHang / validEdgeHangCount,
    };
  };

  const generateRecommendations = (userData) => {
    const { edgeHang, maxPullUps, vGrade } = userData;
    const newRecommendations = [];

    if (edgeHang < 10) {
      newRecommendations.push(
        "Increase edge hand duration to improve grip strength."
      );
    } else {
      newRecommendations.push("Maintain your current edge hand duration.");
    }

    if (maxPullUps < 5) {
      newRecommendations.push(
        "Focus on improving your pull-up strength with assisted pull-ups."
      );
    } else {
      newRecommendations.push(
        "Consider adding weight to your pull-ups for more resistance."
      );
    }

    const similarRecords = parsedData.filter(
      (record) => record["Max weight"] >= 15
    );
    if (similarRecords.length > 0) {
      newRecommendations.push(
        "You have a strong max weight lift. Keep up the good work!"
      );
    }

    setRecommendations(newRecommendations);

    // Calculate and set mean values
    const means = calculateMeans(vGrade);
    setMeanValues(means);
  };

  return (
    <div id="root">
      <h1>Bouldering Training Recommendations</h1>
      <p>
        Compares your input with user submitted data to see where you are
        physically for your given grade
      </p>
      <form onSubmit={handleSubmit}>
        <div class="userInput">
          <label for="edgeHang">18mm Hang 10 seconds (kg):</label>
          <input
            type="text"
            name="edgeHang"
            value={userData.edgeHang}
            onChange={handleChange}
          />
        </div>

        <div class="userInput">
          <label for="maxPullUps">5 Rep Max Pullups (kg):</label>
          <input
            type="text"
            name="maxPullUps"
            value={userData.maxPullUps}
            onChange={handleChange}
          />
        </div>

        <div class="userInput">
          <label for="vGrade">V Grade:</label>
          <input
            type="text"
            name="vGrade"
            value={userData.vGrade}
            onChange={handleChange}
          />
        </div>
        <button class="submitUserInput" type="submit">
          Submit
        </button>
      </form>
      {recommendations.length > 0 && (
        <div>
          <h2>Recommendations:</h2>
          <ul>
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h2>Mean Values for V Grade {userData.vGrade}:</h2>
        <p>Mean 5-RM Pull-ups: {meanValues.pullUps} kg</p>
        <p>Mean 20mm Edge Hang: {meanValues.edgeHang} kg</p>
      </div>

      <p>
        - Data based on Climbharder #V3{" "}
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSciYaa2iX79npcnPBltM7kx4EMS317jpLjTz0pgogQBmfn0DQ/viewform"
          target="_blank"
        >
          form
        </a>
      </p>

      <br></br>
      <br></br>
      <p>debug</p>
      <button onClick={() => console.log(parsedData)}>show parsed data</button>
      <button onClick={() => console.log(userData)}>show user data</button>
    </div>
  );
};

export default App;
