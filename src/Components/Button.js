import React from "react";
import { Button } from "semantic-ui-react";
import "./Button.css";

const ControlButton = props => {
  return (
    <div className='control-button'>
      <Button
        {...props}
      />
    </div>
  )}

export default ControlButton;