import React, { useState, FC, Fragment, useEffect, useCallback } from "react";
import { MemberForm, MembersForm, getWeb3 } from "@dorgtech/daocreator-lib";
import { MDBBox, MDBContainer, MDBRow } from "mdbreact";

import { MemberEditor, MembersAnalytics, MembersTable } from "./";
import { useForceUpdate } from "../../../utils/hooks";
import Toggle from "../Schemes/Toggle";

interface Props {
  form: MembersForm;
  loadedFromModal: boolean;
}

const MembersEditor: FC<Props> = ({ form, loadedFromModal }) => {
  /*
   * State
   */

  const { getDAOTokenSymbol } = form;
  const tokenSymbol = getDAOTokenSymbol();

  const [memberForm, setMemberForm] = useState(
    new MemberForm(getDAOTokenSymbol)
  );
  const [userMemberForm, setUserMemberForm] = useState<MemberForm>(
    new MemberForm(getDAOTokenSymbol)
  );
  const [editedMemberForm] = useState(new MemberForm(getDAOTokenSymbol));

  const [editing, setEditing] = useState(-1);
  const [web3Connected, setWeb3Connected] = useState(false);
  const [web3, setWeb3] = useState<any>(undefined);
  const [distribution, setDistribution] = useState(false);
  const [userAdded, setUserAdded] = useState(false);

  const newMemberForm = useCallback(
    (address = null) => {
      const memberForm = new MemberForm(getDAOTokenSymbol);
      if (address) memberForm.$.address.value = address;
      memberForm.$.reputation.value = "100";
      distribution
        ? (memberForm.$.tokens.value = "100")
        : (memberForm.$.tokens.value = "0");
      return memberForm;
    },
    [distribution, getDAOTokenSymbol]
  );

  /*
   * Hooks
   */

  const forceUpdate = useForceUpdate();

  // Update userAdded when loading existing user
  useEffect(() => {
    if (!loadedFromModal) return;
    if (form.$.length === 0) return;

    setUserAdded(true);
    if (form.$.some(memberForm => memberForm.$.tokens.value !== "0"))
      setDistribution(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedFromModal]);

  useEffect(() => {
    if (userAdded) return;

    if (!web3Connected) {
      setUserMemberForm(new MemberForm(getDAOTokenSymbol));
      return;
    }

    try {
      setUserMemberForm(newMemberForm(web3.eth.defaultAccount));
    } catch (e) {
      console.log(e);
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMemberForm, web3Connected, getDAOTokenSymbol, web3]);

  useEffect(() => {
    setMemberForm(newMemberForm());
  }, [newMemberForm]);

  /*
   * Buttons
   */

  const handleMetamask = async () => {
    try {
      const web3 = await getWeb3();
      setWeb3(web3);
      setWeb3Connected(true);
    } catch (e) {
      console.log(e);
    }
  };

  const toggleDistribution = () => {
    if (distribution)
      form.$.map((memberForm: MemberForm) => (memberForm.$.tokens.value = "0"));
    setDistribution(!distribution);
  };

  const addUser = async () => {
    const validate = await userMemberForm.validate();
    if (validate.hasError) return;
    form.$.push(userMemberForm);

    const membersValidate = await form.validate();
    if (membersValidate.hasError) form.$.pop();

    forceUpdate();

    setUserAdded(true);

    setUserMemberForm(newMemberForm());
  };

  const onSubmit = async (event: any) => {
    event.preventDefault();
    const validate = await memberForm.validate();

    if (validate.hasError) return;

    form.$.push(memberForm);
    const membersValidate = await form.validate();

    if (membersValidate.hasError) {
      form.$.pop();
      forceUpdate();
      return;
    }
    forceUpdate();

    setMemberForm(newMemberForm());
  };

  const cancelEdit = () => {
    setEditing(-1);
    forceUpdate();
  };

  const selectEdit = (index: number) => {
    editedMemberForm.setValues(form.$[index].values);
    setEditing(index);
  };

  const onEdit = async (index: number) => {
    const backup = form.$[index].values;
    const memberValidate = await editedMemberForm.validate();

    if (memberValidate.hasError) {
      forceUpdate();
      return;
    }

    form.$[index].setValues(editedMemberForm.values);

    const membersValidate = await form.validate();

    if (membersValidate.hasError) {
      form.$[index].setValues(backup);
      forceUpdate();
      return;
    }
    setEditing(-1);
  };

  const onDelete = async (index: number) => {
    form.$.splice(index, 1);

    if (editing === index) setEditing(-1);

    if (editing > index) setEditing(editing - 1);

    forceUpdate();
  };

  /*
   * Components
   */

  const MemberFormError: FC = () => (
    <Fragment>
      {form.showFormError && (
        <div style={{ marginRight: "-10px", color: "red" }}>
          <p>{form.error}</p>
        </div>
      )}
    </Fragment>
  );

  return (
    <MDBBox>
      <MDBContainer style={styles.noPadding}>
        <Toggle
          id={"distribution"}
          text={`Distribute ${tokenSymbol} token`}
          tooltip={
            " Distribute your organization’s native token at launch (regardless of initial distribution, the organization will be able to create more tokens after launch through proposals)"
          }
          toggle={toggleDistribution}
          disabled={false}
          checked={distribution}
          style={styles.toggle}
        />

        <div style={styles.divider} />

        <MembersAnalytics
          data={form.toState()}
          tokenSymbol={getDAOTokenSymbol()}
        />

        <div style={styles.thinDivider} />

        <MDBRow className="justify-content-start">
          <MemberEditor memberForm={memberForm} onSubmit={onSubmit} />
        </MDBRow>
        <MemberFormError />
        <MDBRow className="justify-content-center">
          {!userAdded && !web3Connected ? (
            <button
              style={styles.setDescriptionButton}
              onClick={handleMetamask}
            >
              Add Your Wallet
            </button>
          ) : (
            !userAdded && (
              <button style={styles.setDescriptionButton} onClick={addUser}>
                Add Self {/* TODO add blockie here?*/}
              </button>
            )
          )}
        </MDBRow>

        <div style={styles.thinDivider} />

        <MDBRow style={styles.tableWidth}>
          <MembersTable
            membersForm={form}
            editing={editing}
            editedMemberForm={editedMemberForm}
            onEdit={onEdit}
            onDelete={onDelete}
            selectEdit={selectEdit}
            cancelEdit={cancelEdit}
            tokenDistribution={distribution}
            getDAOTokenSymbol={getDAOTokenSymbol}
          />
        </MDBRow>
      </MDBContainer>
    </MDBBox>
  );
};

const styles = {
  tableWidth: {
    width: "-webkit-fill-available"
  },
  noPadding: {
    padding: "1px"
  },
  toggle: {
    paddingLeft: 15.35,
    marginTop: '-14px'
  },
  divider: {
    flexGrow: 1,
    marginLeft: "-10px",
    border: "0.5px solid rgb(211, 211, 211)",
    width: "103.3%"
  },
  thinDivider: {
    flexGrow: 1,
    marginLeft: "-10px",
    border: "0.5px solid rgb(211, 211, 211)",
    width: "103.3%"
  },
  setDescriptionButton: {
    borderRadius: "0.37rem",
    fontWeight: 300,
    height: "39px",
    padding: "8px",
    fontFamily: "inherit",
    fontSize: "14px",
    width: "12rem",
    marginTop: "-20px",
    marginBottom: "5px"
  }
};

export default MembersEditor;
