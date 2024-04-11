// contains text boxes with a button which submits all the text boxes
import TextBox from "./TextBox";
import Button from "./Button";
import React, { useState } from "react";

// property is an array of strings that represents the labels for the textboxes
const TextBoxContainer = ({ values, onSubmit }) => {
  // the data in the textboxes
  const [textBoxes, setTextBoxes] = useState(values);

  const handleTextBoxChange = (index, value) => {
    const newTextBoxes = [...textBoxes];
    newTextBoxes[index] = value;
    setTextBoxes(newTextBoxes);
  };

  const handleSubmit = () => {
    console.log("submitted data:" + textBoxes);
    onSubmit(textBoxes);
  };

  return (
    <>
      <ul>
        {textBoxes.map((value, index) => (
          <li key={index}>
            {/* <label for={index}>{value}</label> */}
            <TextBox
              initialValue={value}
              id={index}
              onChange={(newValue) => {
                handleTextBoxChange(index, newValue);
              }}
            ></TextBox>
          </li>
        ))}
      </ul>
      <Button onClick={handleSubmit} value="Submit"></Button>
    </>
  );
};

export default TextBoxContainer;
