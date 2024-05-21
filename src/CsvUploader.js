import React, { useState } from "react";
import Papa from "papaparse";

const CsvUploader = ({ setParsedData }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target.result;
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
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload and Parse CSV</button>
    </div>
  );
};

export default CsvUploader;
