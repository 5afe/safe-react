import React, { FC } from "react";

import { MembersForm, SchemesForm, DAOConfigForm } from "@dorgtech/daocreator-lib";

import LineGraphic from "../LineGraphic";
import { MDBIcon, MDBRow, MDBCol } from "mdbreact";
import { SimpleOption, getSimpleOptions } from "../../utils";
import './styles.css'

export const ConfigPreview: FC<{ form: DAOConfigForm }> = ({ form }) => (
  <MDBRow style={styles.configPreview}>
    <MDBCol>
      <span>
        Name: <strong>{form.$.daoName.value}</strong>
      </span>
    </MDBCol>
    <MDBCol>
      <span>
        Symbol: <strong>{form.$.tokenSymbol.value}</strong>
      </span>
    </MDBCol>
  </MDBRow>
);

export const SchemesPreview: FC<{ form: SchemesForm }> = ({ form }) => {
  const simpleOptions: SimpleOption[] = getSimpleOptions(form);

  return (
    <div id="preview" style={styles.schemePreview}>
      <p>
        <strong>Recommended</strong>
      </p>
      {simpleOptions.map(({ text, checked }: SimpleOption, index: number) => (
        <div key={index}>
          <p>
            <MDBIcon
              icon={checked ? "check" : "times"}
              className={checked ? "blue-text" : "red-text"}
              style={
                checked
                  ? { marginRight: "10px" }
                  : { marginLeft: "3px", marginRight: "12px" } // x icon is smaller
              }
            />
            {text}
          </p>
        </div>
      ))}
    </div>
  );
};

export const MembersPreview: FC<{ form: MembersForm }> = ({ form }) => {
  const reputationConfig = {
    showPercentage: false,
    height: "0.5rem",
    symbol: "REP",
    dataKey: "reputation",
    nameKey: "address"
  };
  const tokenConfig = {
    showPercentage: false,
    height: "0.5rem",
    symbol: form.getDAOTokenSymbol(),
    dataKey: "tokens",
    nameKey: "address"
  };
  let totalReputationAmount = 0;
  let totalTokenAmount = 0;
  form.toState().map(({ reputation, tokens }: any) => {
    totalReputationAmount += reputation;
    totalTokenAmount += tokens;
    return null;
  });
  const numberOfMembers = form.$.length;
  return (
    <div id="preview" style={styles.membersPreview}>
      <p id="membersCount">
        {numberOfMembers} Member{numberOfMembers > 1 && "s"}
      </p>
      <div style={{ width: "17.5em" }}>
        <p>Reputation Distribution</p>
        <LineGraphic
          data={form.toState() as any} // Working with this type is weird
          total={totalReputationAmount}
          config={reputationConfig}
          style={styles.lineGraphic}
        />
      </div>
      {totalTokenAmount > 0 && (
        <div style={{ paddingTop: "20px", width: "17.5em" }}>
          <p>{form.getDAOTokenSymbol()} Token Distribution</p>
          <LineGraphic
            data={form.toState() as any} // Working with this type is weird
            total={totalTokenAmount}
            config={tokenConfig}
            style={styles.lineGraphic}
          />
        </div>
      )}
    </div>
  );
};

const styles = {
  configPreview: {
    marginTop: 33,
    marginRight: "auto",
    marginLeft: "1.5rem",
    whiteSpace: "nowrap"
  },
  schemePreview: {
    marginTop: 33,
  },
  membersPreview: {
    marginTop: 33,
    paddingRight: "8rem"
  },
  lineGraphic: {
    padding: "unset"
  }
};
