import React from "react";
import { MDBRow, MDBCol } from "mdbreact";

import FormField from "../../FormField";
import { MemberForm } from "@dorgtech/daocreator-lib";
import './styles.css';

export const MemberEditor = ({ memberForm, onSubmit }: { memberForm: MemberForm; onSubmit: (event: any) => void }) => {
  return (
    <MDBRow
      style={styles.rowPrincipal}
      onKeyDown={(event: any) => {
        if (event.key === "Enter") onSubmit(event);
      }}
    >
      <FormField tabIndex={1} field={memberForm.$.address} editable={true} colSize="9" />
      <MDBCol id="addMember" size="3">
        <button id="addMemberButton" type="submit" style={styles.setDescriptionButton} onClick={onSubmit}>
          Add Member
        </button>
      </MDBCol>
    </MDBRow>
  );
};

const styles = {
  setDescriptionButton: {
    borderRadius: "0.37rem",
    fontWeight: 300,
    height: "39px",
    padding: "8px",
    fontFamily: "inherit",
    fontSize: "14px",
    width: "inherit",
    marginTop: "28px"
  },
  rowPrincipal: {
    margin: 0,
    width: "100%",
    paddingBottom: "25px"
  }
};
