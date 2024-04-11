import { useState } from "react";
import "./App.css";
import Results from "./components/Results";
import TextBoxContainer from "./components/TextBoxContainer";

function App() {
  let initialValues = ["", "", ""];

  let [resultValue, setResultValue] = useState("");
  const onSubmit = (newResultValue) => {
    setResultValue(newResultValue);
  };

  return (
    <div className="App">
      <h1>Climbing Buddy</h1>
      <p>Enter climbing stats to get training recommendations</p>
      <TextBoxContainer
        values={initialValues}
        onSubmit={onSubmit}
      ></TextBoxContainer>
      <Results initialValue="" value={resultValue}></Results>
    </div>
  );
}

export default App;
