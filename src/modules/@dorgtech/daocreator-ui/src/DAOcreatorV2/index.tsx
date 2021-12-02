import * as React from "react";

import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBPopover,
  MDBPopoverBody
} from "mdbreact";

import {
  DAOConfigForm,
  MembersForm,
  SchemesForm,
  fromDAOMigrationParams,
  fromJSON,
  DAOForm,
  toDAOMigrationParams,
  toJSON,
  ContributionRewardForm,
  SchemeRegistrarForm,
  ProviderOrGetter,
  setWeb3Provider
} from "@dorgtech/daocreator-lib";

import NamingStep from "./NamingStep";
import MembersStep from "./MembersStep";
import SchemesStep from "./SchemesStep";
import InstallStep from "./InstallStep";

import FileSaver from "file-saver";
import Stepper from "../commonV2/Stepper";
import { ImporterModal } from "../commonV2/Stepper/ImporterModal";
import DAOstackLogo from "../commonV2/DAOstackLogo";

import { useActualNetwork } from "../web3/core";
import { Review } from "./Review";
import { DAOSpeed } from "../commonV2/dao/Schemes";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../assets/styles/bootstrap.css";
import "../assets/styles/mdbreact.css";
import "./styles.css";

const moreLogo = require("../assets/icons/more.svg");

const DAO_CREATOR_STATE = "DAO_CREATOR_SETUP";

interface DAO_CREATOR_INTERFACE {
  step: STEP;
  form: string;
  decisionSpeed: DAOSpeed;
}

interface Step {
  title: string;
  form: DAOForm | DAOConfigForm | MembersForm | SchemesForm;
  Component: any;
  callbacks?: Object;
}

export enum STEP {
  Config,
  Schemes,
  Members,
  Launch
}

const daoForm = new DAOForm();
const recoveredForm: DAOForm = new DAOForm();

interface Props {
  setWeb3Provider?: ProviderOrGetter;
  noDAOstackLogo?: Boolean;
  redirectURL?: string;
  networks?: string;
}

const DAOcreator: React.FC<Props> = (props: Props) => {
  const [step, setStep] = React.useState<STEP>(STEP.Config);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [recoverPreviewOpen, setRecoverPreviewOpen] = React.useState<boolean>(
    false
  );
  const [advanceSchemeConfig, setAdvanceSchemeConfig] = React.useState<boolean>(
    false
  );
  const [importFile, setImportFile] = React.useState<string>("");
  const [launching, setLaunching] = React.useState(false);

  const [loadedFromModal, setLoadedFromModal] = React.useState(false);
  const [decisionSpeed, setDecisionSpeed] = React.useState(DAOSpeed.Medium);

  const acceptedNetworks = React.useMemo(
    () =>
      props.networks
        ? props.networks.split("*")
        : ["mainnet", "xdai", "rinkeby", "kovan"],
    [props.networks]
  );

  const currentNetwork = useActualNetwork(acceptedNetworks);
  let currentForm: any = daoForm.$.config;

  const nextStep = React.useCallback(async () => {
    const res = await currentForm.validate();
    if (!res.hasError) {
      setStep(step + 1);
    }
  }, [currentForm, step]);

  // On initial load, set web3 provider getter if present
  React.useEffect(() => {
    if (props.setWeb3Provider) {
      setWeb3Provider(props.setWeb3Provider);
    }
  }, [props.setWeb3Provider]);

  // On initial load, load initial state
  React.useEffect(() => {
    const daoCreatorState: string | null = localStorage.getItem(
      DAO_CREATOR_STATE
    );

    if (daoCreatorState) {
      if (!loading) {
        return;
      }

      const { form } = JSON.parse(daoCreatorState) as DAO_CREATOR_INTERFACE;

      const previewLocalStorage = () => {
        if (!daoCreatorState) {
          setLoading(false);
          return;
        }

        const daoParams = fromJSON(form);
        const daoState = fromDAOMigrationParams(daoParams);
        recoveredForm.fromState(daoState);

        const { daoName, tokenSymbol } = daoState.config;
        // Modal does not render preview for steps that weren't fully validated
        if (
          daoName === "" &&
          tokenSymbol === "" &&
          JSON.parse(daoCreatorState!).furthestStep < STEP.Members
        ) {
          return;
        }
        setRecoverPreviewOpen(true);
      };

      previewLocalStorage();
    }

    setLoading(false);
  }, [loading]);

  // Save state every step
  React.useEffect(() => {
    const saveLocalStorage = () => {
      const daoState = daoForm.toState();
      // Check to see if the current form state hasn't been edited,
      // and if so early out so we don't save an empty state
      const nullForm = new DAOForm();
      nullForm.$.config.$.tokenName.value = " token";
      nullForm.$.schemes.$ = [
        new ContributionRewardForm(),
        new SchemeRegistrarForm()
      ];
      if (JSON.stringify(daoState) === JSON.stringify(nullForm.toState())) {
        return;
      }

      const daoParams = toDAOMigrationParams(daoState);
      const json = toJSON(daoParams);
      const daoCreatorState: DAO_CREATOR_INTERFACE = {
        step,
        form: json,
        decisionSpeed
      };

      localStorage.setItem(DAO_CREATOR_STATE, JSON.stringify(daoCreatorState));
    };

    window.addEventListener("beforeunload", saveLocalStorage);
    return () => {
      window.removeEventListener("beforeunload", saveLocalStorage);
    };
  }, [step, decisionSpeed]);

  React.useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key !== "Enter") return;
      switch (step) {
        case 2:
        case 3:
          break;
        default:
          nextStep();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [step, nextStep]);

  const getDAOName = () => daoForm.$.config.$.daoName.value;
  const getDAOTokenSymbol = () => daoForm.$.config.$.tokenSymbol.value;

  const loadLocalStorage = () => {
    const daoCreatorState = localStorage.getItem(DAO_CREATOR_STATE);

    if (!daoCreatorState) {
      return;
    }

    const { step, form, decisionSpeed } = JSON.parse(
      daoCreatorState
    ) as DAO_CREATOR_INTERFACE;
    const daoParams = fromJSON(form);
    const daoState = fromDAOMigrationParams(daoParams);
    daoForm.fromState(daoState);
    setStep(step === undefined ? STEP.Config : Math.min(STEP.Launch, step));
    setDecisionSpeed(
      decisionSpeed === undefined ? DAOSpeed.Medium : decisionSpeed
    );
    setRecoverPreviewOpen(false);
    setLoadedFromModal(true);
  };

  const resetLocalStorage = () => {
    localStorage.removeItem(DAO_CREATOR_STATE);
    setStep(STEP.Config);
    setRecoverPreviewOpen(false);
  };

  const exportDaoParams = () => {
    const dao = toDAOMigrationParams(daoForm.toState());
    const blob = new Blob([toJSON(dao)], {
      type: "text/plain;charset=utf-8"
    });
    FileSaver.saveAs(blob, "migration-params.json");
  };

  const PreviewDialog = () => {
    const props = {
      recoveredForm
    };
    return (
      <MDBModal isOpen={recoverPreviewOpen} fullWidth={true} maxWidth="md">
        <MDBModalHeader id="simple-dialog-title">
          In Progress DAO Detected
        </MDBModalHeader>
        <MDBModalBody>
          <Review {...props} />
        </MDBModalBody>
        <MDBModalFooter />

        <MDBBtn
          onClick={loadLocalStorage}
          color={"primary"}
          variant={"contained"}
        >
          Resume
        </MDBBtn>
        <MDBBtn
          onClick={resetLocalStorage}
          color={"primary"}
          variant={"contained"}
        >
          Start Over
        </MDBBtn>
      </MDBModal>
    );
  };

  const steps: Step[] = [
    {
      title: "Set Description",
      form: daoForm.$.config,
      Component: NamingStep,
      callbacks: {
        setStep,
        toggleCollapse: nextStep,
        getDAOName,
        getDAOTokenSymbol,
        loadedFromModal
      }
    },
    {
      title: "Configure",
      form: daoForm.$.schemes,
      Component: SchemesStep,
      callbacks: {
        setStep,
        toggleCollapse: nextStep,
        modal: advanceSchemeConfig,
        setModal: setAdvanceSchemeConfig,
        loadedFromModal,
        decisionSpeed,
        setDecisionSpeed
      }
    },
    {
      title: "Add Members",
      form: daoForm.$.members,
      Component: MembersStep,
      callbacks: {
        setStep,
        getDAOTokenSymbol,
        toggleCollapse: nextStep,
        setModal: setImportFile,
        step,
        loadedFromModal
      }
    },
    {
      title: "Launch",
      form: daoForm,
      Component: InstallStep,
      callbacks: {
        setLaunching
      }
    }
  ];

  currentForm = steps[step].form;
  const otherNetworks = acceptedNetworks.filter(n => currentNetwork !== n);
  return (
    <>
      <MDBContainer style={styles.paddingContainer}>
        <div id="creator-root">
          <MDBRow style={styles.headerTop}>
            <MDBCol size="3" />
            <MDBCol size="6" id="title" style={styles.titleContainer}>
              <h3 style={styles.fontStyle}>Create Organization</h3>
            </MDBCol>
            <MDBCol size="3">
              <div>
                <MDBPopover placement="bottom" popover clickable>
                  <MDBBtn
                    id="menu"
                    floating
                    size="lg"
                    color="transparent"
                    className="btn"
                    style={styles.icon}
                  >
                    <img src={moreLogo} alt="menu icon" />
                  </MDBBtn>
                  <div style={styles.divided}>
                    <div // There might be a better MDBReact component for this
                      style={{ cursor: "pointer" }}
                      onClick={() => setImportFile("Import configuration")}
                    >
                      <MDBPopoverBody>Import Configuration</MDBPopoverBody>
                    </div>
                    <div style={styles.divider} />
                    <div // There might be a better MDBReact component for this
                      style={{ cursor: "pointer" }}
                      onClick={exportDaoParams}
                    >
                      <MDBPopoverBody>Export Configuration</MDBPopoverBody>
                    </div>
                  </div>
                </MDBPopover>
              </div>
            </MDBCol>
          </MDBRow>
          <br />
          <div style={styles.divider} />
          <div className="row justify-content-center">
            <div className="col-md-12">
              {currentNetwork ? (
                <div style={styles.networkContainer}>
                  <p style={styles.networkLabel}>
                    Network:{" "}
                    <span style={styles.networkName}> {currentNetwork} </span>
                  </p>
                  {currentNetwork === "Not supported" ? (
                    <p style={styles.networkMessage}>
                      (Supported networks are {acceptedNetworks.join(", ")})
                    </p>
                  ) : otherNetworks.length > 0 ? (
                    <p style={styles.networkMessage}>
                      (Switch{" "}
                      {otherNetworks.length === 1 ? "network" : "networks"} to
                      deploy in {otherNetworks.join(", ")})
                    </p>
                  ) : (
                    <div />
                  )}
                </div>
              ) : (
                <div style={styles.networkContainer}>
                  <p style={styles.networkLabel}>Please login</p>
                  <p style={styles.networkMessage}>
                    (Supported{" "}
                    {otherNetworks.length === 1 ? "network is" : "networks are"}{" "}
                    {acceptedNetworks.join(", ")})
                  </p>
                </div>
              )}
              {loading ? (
                <div style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                  <MDBRow className="justify-content-center">
                    <div className="spinner-border text-primary" />
                  </MDBRow>
                  <MDBRow className="justify-content-center">
                    <p style={styles.fontStyle}> Please allow metamask </p>
                  </MDBRow>
                </div>
              ) : (
                <ul
                  className="stepper stepper-vertical"
                  style={styles.noPadding}
                >
                  {steps.map(
                    (
                      { form, title, Component, callbacks }: Step,
                      index: number
                    ) => {
                      return (
                        <Stepper
                          key={`step${index}`}
                          index={index}
                          form={form}
                          title={title}
                          step={step}
                          launching={launching}
                          Component={Component}
                          callbacks={callbacks}
                          redirectURL={props.redirectURL}
                        />
                      );
                    }
                  )}
                </ul>
              )}
            </div>
          </div>
          {props.noDAOstackLogo ? <></> : <DAOstackLogo />}
        </div>
      </MDBContainer>
      <PreviewDialog />
      <ImporterModal
        title={importFile}
        form={daoForm}
        reviewStep={setStep}
        setTitle={setImportFile}
      />
    </>
  );
};

const styles = {
  paddingContainer: {
    padding: "1%",
    height: "50px"
  },
  networkLabel: {
    color: "blue"
  },
  networkName: {
    color: "blue",
    fontWeight: "bold" as const
  },
  networkMessage: {
    marginTop: -15
  },
  networkContainer: {
    paddingTop: 10,
    paddingLeft: 90
  },
  fontStyle: {
    fontSize: "18px",
    letterSpacing: "0.6px",
    color: "#3E3F42",
    fontWeight: 400,
    fontFamily: "inherit"
  },
  noPadding: {
    paddingTop: 0,
    marginTop: -30
  },
  headerTop: {
    height: "40px"
  },
  titleContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  spinner: {
    display: "inline-block"
  },
  icon: {
    background: "white",
    boxShadow: "none",
    color: "blue !important",
    padding: 5,
    height: "35px",
    width: "35px",
    borderRadius: "400px",
    border: "1px solid #EEF0FF",
    margin: "14px 0px 0px 95px"
  },
  divided: {
    display: "flex",
    alignItems: "center"
  },
  divider: {
    flexGrow: 1,
    border: "0.5px solid #EAEDF3",
    height: "1px",
    padding: 0,
    margin: 0,
    width: "-webkit-fill-available",
    borderLeft: "aqua"
  },
  iconColor: {
    //  color: '#536DFE !important',
    color: "indigo accent-2 text"
  }
};

export default DAOcreator;
