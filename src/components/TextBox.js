import React, { useState } from "react";

const TextBox = ({ initialValue, id, onChange }) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    onChange(newValue); //  need this when updating the array in textboxcontainer
  };

  return (
    <input type="text" value={value} onChange={handleChange} id={id}></input>
  );
};

export default TextBox;
