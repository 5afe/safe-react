import React, { FC } from "react";
import { MDBBtn, MDBRow, MDBCol, MDBTooltip, MDBIcon } from "mdbreact";

interface Props {
  id: string;
  text: string;
  tooltip: string;
  toggle: () => void;
  disabled?: boolean;
  checked: boolean;
  style?: any;
}

const Toggle: FC<Props> = ({
  id,
  text,
  tooltip,
  toggle,
  disabled = false,
  checked,
  style
}) => (
  <MDBRow style={style ? style : styles.paddingRow}>
    <MDBCol size="11" style={styles.noPadding}>
      <span style={styles.marginText} className="text-left">
        {text}
      </span>
      <MDBTooltip placement="bottom" clickable>
        <MDBBtn floating size="lg" color="transparent" style={styles.info}>
          <MDBIcon icon="info-circle" />
        </MDBBtn>
        <span>{tooltip}</span>
      </MDBTooltip>
    </MDBCol>
    <MDBCol id='toggle' style={styles.noPadding}>
      <div className="custom-control custom-switch">
        <input
          type="checkbox"
          className="custom-control-input"
          id={id}
          onChange={toggle}
          disabled={disabled}
          checked={checked}
        />
        <label className="custom-control-label" htmlFor={id}></label>
      </div>
    </MDBCol>
  </MDBRow>
);

const styles = {
  paddingRow: {
    paddingLeft: "10px",
    paddingTop: "6px"
  },
  info: {
    backgroundColor: "transparent !important",
    color: "lightgray",
    boxShadow: "none",
    fontSize: "large",
    border: "none",
    outline: "none"
  },
  noPadding: {
    padding: 0
  },
  marginText: {
    marginTop: "6px",
    color: "black",
    fontSize: "16px"
  }
};

export default Toggle;
