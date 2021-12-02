import React, { FC, useState, useEffect, useCallback } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBIcon,
  MDBRow,
  MDBCol,
  MDBTooltip
} from "mdbreact";
import {
  AnySchemeForm,
  ContributionRewardForm,
  SchemeRegistrarForm,
  SchemeType,
  SchemesForm,
  GenesisProtocolForm,
  AnyField
} from "@dorgtech/daocreator-lib";
import VotingMachineEditor from "../VotingMachineEditor";
import FormField from "../../FormField";
import { VotingMachinePresets } from "./SchemeEditor";
import "./styles.css";

interface Props {
  form: SchemesForm;
  defaultVMs: VotingMachinePresets;
  updateSchemes: (
    advancedSchemes: AnySchemeForm[],
    isActive: boolean[]
  ) => void;
  resetForm: () => void;
  modal: boolean;
  setModal: (modal: boolean) => void;
}

const schemeTemplates: AnySchemeForm[] = [
  new ContributionRewardForm(),
  new SchemeRegistrarForm()
];

const AdvancedEditor: FC<Props> = ({
  form,
  defaultVMs,
  updateSchemes,
  resetForm,
  modal,
  setModal
}) => {
  /*
   * State
   */

  const [advForm, setAdvForm] = useState<SchemesForm>(new SchemesForm());

  // Active Scheme
  const [scheme, setScheme] = useState<AnySchemeForm>();

  // Active toggles. Disable allows for removal from ui without scheme reset
  const [isActive, setIsActive] = useState([true, true, false]);

  const [warning, setWarning] = useState<string>();
  const [errors, setErrors] = useState<string[]>([]);

  /*
   * Hooks
   */

  // Update adv form on open
  const updateAdvancedForm = useCallback(() => {
    const newAdvForm = new SchemesForm();

    defaultVMs.map((votingMachine: GenesisProtocolForm, index: number) => {
      const formScheme = form.$.filter(
        (scheme: AnySchemeForm) => scheme.type === index
      );
      if (formScheme.length === 1) {
        newAdvForm.$.push(formScheme[0] as AnySchemeForm);
        return votingMachine;
      }

      newAdvForm.$.push(schemeTemplates[index]);
      newAdvForm.$[index].$.votingMachine = votingMachine;
      return votingMachine;
    });

    setAdvForm(newAdvForm);
    setScheme(newAdvForm.$[0]);
  }, [defaultVMs, form.$]);

  useEffect(() => {
    if (!modal) return;
    updateAdvancedForm();
    setIsActive(
      isActive.map((_, index) => form.$.some(scheme => scheme.type === index))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal, updateAdvancedForm]);

  // Check that scheme of type SchemeRegistrar is active
  useEffect(() => {
    if (isActive[SchemeType.SchemeRegistrar]) {
      setWarning("");
      return;
    }
    setWarning(
      "Warning: Without a Plugin Manager your organization will not be able to modify itself."
    );
  }, [isActive]);

  const toggleActiveScheme = (index: number) => {
    setIsActive(
      isActive.map((toggle: boolean, i: number) =>
        i === index ? !toggle : toggle
      )
    );
  };

  // Resets entire form
  const resetAdvancedForm = () => {
    resetForm();
    setIsActive([true, true, false]);
  };

  const updateForm = async () => {
    let schemes: AnySchemeForm[] = [];
    isActive.map((toggle: boolean, index: number) => {
      toggle && schemes.push(advForm.$[index]);
      return toggle;
    });

    const newAdvForm = new SchemesForm();
    newAdvForm.$ = schemes;

    const { hasError } = await newAdvForm.validate();
    if (hasError) {
      advForm.error &&
        setErrors(es => {
          const error = advForm.error as string;
          if (es.findIndex(value => value === error) > -1) {
            return es;
          } else {
            return [...es, error];
          }
        });

      setTimeout(() => {
        setErrors(es => {
          es.shift();
          return [...es]; // Requires spread operator or it will not rerender
        });
      }, 5000);

      return false;
    }

    updateSchemes(schemes, isActive);

    return true;
  };

  const closeModal = async (reset = false) => {
    if (reset) {
      resetAdvancedForm();
      setModal(false);
      return;
    }

    (await updateForm()) && setModal(false);
  };

  if (!scheme) return <></>;

  return (
    <MDBModal
      isOpen={modal}
      style={styles.modal}
      toggle={() => setModal(false)}
      size="lg"
    >
      <MDBModalHeader style={styles.titlePadding}>
        <span style={styles.bold}>Advanced Configuration</span>
      </MDBModalHeader>
      <MDBModalBody>
        <MDBRow style={styles.rowTab}>
          {schemeTemplates.map((schemeTemplate, index) => (
            <MDBCol style={styles.tab} key={"scheme-" + index}>
              <button
                style={
                  scheme.type === index
                    ? {
                        ...styles.buttonTabActive,
                        fontFamily: "inherit",
                        fontSize: "inherit",
                        lineHeight: "inherit"
                      }
                    : {
                        ...styles.buttonTab,
                        fontFamily: "inherit",
                        fontSize: "inherit",
                        lineHeight: "inherit"
                      }
                }
                id="tabButton"
                onClick={() => setScheme(advForm.$[index])}
              >
                {schemeTemplate.displayName}
              </button>
            </MDBCol>
          ))}
        </MDBRow>
        <div style={styles.divForm}>
          <MDBRow style={styles.borderRow}>
            <MDBCol>
              <span style={styles.boldSpan}>
                Enable {schemeTemplates[scheme.type].displayName}
              </span>
              <MDBTooltip placement="bottom" clickable>
                <MDBBtn
                  floating
                  size="lg"
                  color="transparent"
                  style={styles.info}
                >
                  <MDBIcon icon="info-circle" />
                </MDBBtn>
                <span>{schemeTemplates[scheme.type].description}</span>
              </MDBTooltip>
            </MDBCol>
            {warning && scheme.type === SchemeType.SchemeRegistrar && (
              <MDBCol>
                <span
                  style={{
                    fontWeight: 400,
                    color: "red",
                    alignItems: "center"
                  }}
                >
                  {/* TODO check */}
                  <p style={styles.errorMessage}>{warning}</p>
                </span>
              </MDBCol>
            )}
            <MDBCol size="1">
              <div id="toggleScheme" className="custom-control custom-switch">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="toggle"
                  checked={isActive[scheme.type]}
                  onChange={() => toggleActiveScheme(scheme.type)}
                />
                <label
                  className="custom-control-label"
                  htmlFor="toggle"
                ></label>
              </div>
            </MDBCol>
          </MDBRow>
          <VotingMachineEditor
            votingMachine={advForm.$[scheme.type].$.votingMachine}
            editable={isActive[scheme.type]}
          />
          {advForm.$[scheme.type]
            .getParams()
            .map((field: AnyField, index: number) => (
              <MDBRow key={`field-${index}`}>
                <FormField
                  field={field}
                  editable={isActive[scheme.type]}
                  colSize={"12"}
                  tabIndex={21}
                />
              </MDBRow>
            ))}
        </div>
      </MDBModalBody>
      <MDBModalFooter>
        <MDBRow style={styles.buttonsRow}>
          <MDBCol size="3">
            <button
              id="resetButton"
              style={styles.cancelButton}
              onClick={() => closeModal(true)}
            >
              Reset
            </button>
          </MDBCol>
          <MDBCol style={{ textAlign: "center" }}>
            {errors.map((error: string, index: number) => (
              <p key={`"error"-${index}`} style={styles.errorMessage}>
                {error}
              </p>
            ))}
          </MDBCol>
          <MDBCol style={styles.save}>
            <button
              id="saveConfigurationButton"
              style={styles.saveButton}
              onClick={() => closeModal()}
            >
              Save Configuration
            </button>
          </MDBCol>
        </MDBRow>
      </MDBModalFooter>
    </MDBModal>
  );
};

const styles = {
  button: {
    width: "174px",
    height: "42px",
    padding: "4px",
    border: "1px solid gray",
    boxShadow: "none",
    borderRadius: "4px",
    fontFamily: '"Roboto", sans-serif',
    fontWeight: 300,
    fontSize: "15px"
  },
  tab: {
    padding: "0px"
  },
  errorMessage: {
    color: "red",
    marginTop: "10px"
  },
  buttonTab: {
    width: "100%",
    margin: "auto",
    backgroundColor: "white !important",
    color: "gray",
    height: "52px",
    boxShadow: "none",
    borderTop: "none",
    borderBottom: "0.5px solid lightgray",
    borderLeft: "0.5px solid lightgray",
    borderRight: "0.5px solid lightgray"
  },
  buttonTabActive: {
    width: "100%",
    margin: "auto",
    backgroundColor: "white !important",
    color: "black",
    height: "52px",
    boxShadow: "none",
    borderTop: "none",
    borderBottom: "3px solid #4285f4",
    borderLeft: "0.5px solid lightgray",
    borderRight: "0.5px solid lightgray"
  },
  rowTab: {
    marginTop: "-15px",
    marginRight: "-16px",
    marginLeft: "-16px"
  },
  modal: {
    maxWidth: "700px !important"
  },
  info: {
    backgroundColor: "transparent !important",
    color: "lightgray",
    boxShadow: "none",
    fontSize: "large",
    border: "none",
    outline: "none",
    padding: 0
  },
  borderRow: {
    borderBottom: "0.5px solid lightgray",
    paddingBottom: "14px",
    paddingTop: "14px"
  },
  paddingRow: {
    paddingTop: "14px",
    paddingBottom: "14px"
  },
  date: {
    width: "50%",
    height: "100%"
  },
  dateTime: {
    width: "50%",
    height: "100%",
    content: "04:00 h"
  },
  lastRow: {
    borderBottom: "0.5px solid lightgray",
    paddingTop: "14px",
    paddingBottom: "14px"
  },
  buttonsRow: {
    width: "-webkit-fill-available",
    margin: "inherit"
  },
  save: {
    textAlign: "right"
  },
  inputStyle: {
    width: "100%"
  },
  divForm: {
    padding: "14px"
  },
  inputDiv: {
    width: "50%"
  },
  bold: {
    fontWeight: 400,
    fontSize: "23px"
  },
  saveButton: {
    height: "44px",
    borderRadius: "4px",
    width: "200px",
    color: "white",
    backgroundColor: "#4285f4"
  },
  cancelButton: {
    height: "44px",
    borderRadius: "4px",
    width: "100px"
  },
  titlePadding: {
    padding: "26px"
  },
  boldSpan: {
    fontWeight: 400
  }
};

export default AdvancedEditor;
