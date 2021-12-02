import React, { Fragment, FC } from "react";
import { MemberForm } from "@dorgtech/daocreator-lib";
import {
  MDBRow,
  MDBContainer,
  MDBTooltip,
  MDBBtn,
  MDBIcon,
  MDBCol
} from "mdbreact";

import EthAddressAvatar from "../../EthAddressAvatar";
import FormField from "../../FormField";
import { truncateString } from "../../../utils";

const pencilIcon = require("../../../assets/icons/pencil.svg");

interface Props {
  membersForm: any;
  editing: number;
  editedMemberForm: MemberForm;
  onEdit: any;
  onDelete: any;
  selectEdit: any;
  cancelEdit: any;
  tokenDistribution: boolean;
  getDAOTokenSymbol: () => string;
}

interface RowProps {
  memberForm: MemberForm;
  index: number;
}

export const MembersTable: FC<Props> = ({
  membersForm,
  editing,
  editedMemberForm,
  onEdit,
  onDelete,
  selectEdit,
  cancelEdit,
  tokenDistribution,
  getDAOTokenSymbol
}) => {
  const Row: FC<RowProps> = ({ memberForm, index }) => {
    const lineEdit = editing === index;

    return (
      <MDBRow
        style={(styles.borderCell, { borderBottom: "1px solid lightgray" })}
      >
        <MDBCol id="addressAvatar" size="2" style={styles.avatarCell}>
          <EthAddressAvatar address={memberForm.values.address} />
        </MDBCol>
        <MDBCol size="2" style={styles.borderCell}>
          <div id="addressHex" style={{ marginTop: "5px", marginLeft: "-20px" }}>
            <MDBTooltip domElement>
              <div
                onClick={() => {
                  navigator.clipboard.writeText(memberForm.values.address);
                }}
                style={
                  (styles.noPadding,
                  { cursor: "pointer", display: "inline-block", color: "blue" })
                }
              >
                {truncateString(memberForm.values.address, 6, 4)}
              </div>
              <div>Click to copy</div>
            </MDBTooltip>
            <MDBBtn
              onClick={() =>
                window.open(
                  `https://etherscan.io/address/${memberForm.values.address}`
                )
              }
              floating
              size="lg"
              color="transparent"
              style={styles.link}
            ></MDBBtn>
          </div>
        </MDBCol>
        <MDBCol size={tokenDistribution ? "3" : "6"} id="reputationValue"  style={styles.borderCell}>
          {lineEdit ? (
            <div
              style={{ marginLeft: "-20px" }}
              onKeyDown={(event: any) => {
                if (event.key === "Enter") onEdit(index);
              }}
            >
              <FormField
                field={editedMemberForm.$.reputation}
                editable={true}
                colSize={"12"}
                tabIndex={1}
              />
            </div>
          ) : (
            <div style={{ marginTop: "5px" }}>
              {memberForm.values.reputation}
            </div>
          )}
        </MDBCol>
        {tokenDistribution && (
          <MDBCol size="3" id="tokenValueCol" style={styles.borderCell}>
            {lineEdit ? (
              <div
                style={{ marginLeft: "-20px" }}
                onKeyDown={(event: any) => {
                  if (event.key === "Enter") onEdit(index);
                }}
              >
                <FormField
                  field={editedMemberForm.$.tokens}
                  editable={true}
                  colSize={"12"}
                  tabIndex={2}
                />
              </div>
            ) : (
              <div id="tokenValue"style={{ marginTop: "5px" }}>{memberForm.values.tokens}</div>
            )}
          </MDBCol>
        )}
        <MDBCol size="1" style={styles.borderCell}>
          <div
            onClick={() => {
              lineEdit ? onEdit(index) : selectEdit(index);
            }}
            style={styles.editCol}
            id="editCol"
          >
            {lineEdit ? (
              <MDBIcon icon="check" className="blue-text"></MDBIcon>
            ) : (
              <img src={pencilIcon} alt="menu icon" />
            )}
          </div>
        </MDBCol>
        <MDBCol size="1" style={styles.borderCell}>
          <div
            onClick={() => {
              lineEdit ? cancelEdit() : onDelete(index);
            }}
            style={styles.editCol}
            id="editCol"
          >
            {lineEdit ? (
              <MDBIcon icon="times" className="red-text"></MDBIcon>
            ) : (
              <MDBIcon icon="minus" className="red-text"></MDBIcon>
            )}
          </div>
        </MDBCol>
      </MDBRow>
    );
  };

  if (membersForm.$.length === 0) return <Fragment></Fragment>;

  return (
    <MDBContainer>
      <div style={{ padding: "0 5px" }}>
        <MDBRow style={styles.tableWidth}>
          <MDBCol size="4" style={styles.titles}>
            MEMBERS
          </MDBCol>
          <MDBCol size={tokenDistribution ? "3" : "6"} id="reputationTitle">
            REPUTATION
          </MDBCol>

          {tokenDistribution && (
            <MDBCol size="2" id="tokenName">
              {getDAOTokenSymbol()} TOKEN
            </MDBCol>
          )}
          <MDBCol size="2" style={styles.titles}></MDBCol>
        </MDBRow>

        {membersForm.$.map((memberForm: MemberForm, index: number) => (
          <Row key={index} memberForm={memberForm} index={index} />
        ))}
      </div>
    </MDBContainer>
  );
};

const styles = {
  tableWidth: {
    width: "-webkit-fill-available",
    marginLeft: "-10.5px",
    marginRight: "-11.5px",
    borderBottom: "0.5px solid lightgray",
    borderTop: "0.5px lightgray",
    padding: "5px"
  },
  titles: {
    fontSize: "13px",
    color: "gray",
    padding: "10px 0"
  },
  borderCell: {
    padding: "5px 0",
    paddingTop: "7px",
    paddingRight: '1px',
    paddingLeft: '1px'
  },
  addressCell: {
    marginLeft: "-5px",
    padding: "5px 0"
  },
  avatarCell: {
    width: "20px",
    padding: "5px 0",
    paddingTop: "7px"
  },
  noPadding: {
    padding: 0
  },
  link: {
    backgroundColor: "transparent !important",
    color: "lightgray",
    boxShadow: "none",
    fontSize: "normal",
    border: "none",
    outline: "none",
    padding: 0,
    margin: "2px",
    marginLeft: "14px"
  },
  editCol: {
    paddingTop: "5px",
    cursor: "pointer",
  }
};
