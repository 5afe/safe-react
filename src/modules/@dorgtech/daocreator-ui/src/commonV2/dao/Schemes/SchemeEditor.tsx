import React, { useState, useEffect, FC, useRef } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBTooltip, MDBIcon, MDBAlert } from "mdbreact";
import {
  SchemeType,
  GenesisProtocolPreset,
  SchemesForm,
  AnySchemeForm,
  GenesisProtocolForm,
  ContributionRewardForm,
  SchemeRegistrarForm,
  DurationField
} from "@dorgtech/daocreator-lib";

import AdvancedEditor from "./AdvancedEditor";
import Toggle from "./Toggle";
import "./styles.css";

interface Props {
  form: SchemesForm;
  toggleCollapse: () => void;
  modal: boolean;
  setModal: (modal: boolean) => void;
  loadedFromModal: boolean;
  loadedSpeed: DAOSpeed;
  setLoadedSpeed: (speed: DAOSpeed) => void;
}

export type FullSchemes = [ContributionRewardForm, SchemeRegistrarForm];

export type VotingMachinePresets = GenesisProtocolForm[];

export enum DAOSpeed {
  Slow,
  Medium,
  Fast
}

class SchemePresets extends Map<SchemeType, GenesisProtocolPreset> {}
class SchemeSpeeds extends Map<DAOSpeed, SchemePresets> {}

const schemeSpeeds: SchemeSpeeds = new SchemeSpeeds([
  [
    DAOSpeed.Slow,
    new SchemePresets([
      [SchemeType.ContributionReward, GenesisProtocolPreset.Critical],
      [SchemeType.SchemeRegistrar, GenesisProtocolPreset.Critical]
    ])
  ],
  [
    DAOSpeed.Medium,
    new SchemePresets([
      [SchemeType.ContributionReward, GenesisProtocolPreset.Normal],
      [SchemeType.SchemeRegistrar, GenesisProtocolPreset.Critical]
    ])
  ],
  [
    DAOSpeed.Fast,
    new SchemePresets([
      [SchemeType.ContributionReward, GenesisProtocolPreset.Easy],
      [SchemeType.SchemeRegistrar, GenesisProtocolPreset.Normal]
    ])
  ]
]);

const initialVotingMachines = () => {
  let vms = [];
  let i = 0;
  for (i; i < 2; i++) {
    const schemePresetMap = schemeSpeeds.get(DAOSpeed.Medium);

    if (schemePresetMap === undefined) throw Error("Unimplemented Scheme Speed Configuration");

    const preset = schemePresetMap.get(i);
    if (preset === undefined) throw Error("Preset not found");

    vms.push(
      new GenesisProtocolForm({
        preset
      })
    );
  }
  return vms;
};

const SchemeEditor: FC<Props> = ({ form, toggleCollapse, modal, setModal, loadedFromModal, loadedSpeed, setLoadedSpeed }) => {
  /*
  / State
  */
  const [warnings, setWarnings] = useState<string[]>([]);

  const [decisionSpeed, setDecisionSpeed] = useState<DAOSpeed>(DAOSpeed.Medium);
  const [disabledDecisionSpeed, setDisabledDecisionSpeed] = useState(false);

  // Toggles
  const [rewardSuccess, setRewardSuccess] = useState(true);
  const [rewardAndPenVoters, setRewardAndPenVoters] = useState(true);
  const [autobet, setAutobet] = useState(true);

  const [fullSchemes, setFullSchemes] = useState<FullSchemes>([
    new ContributionRewardForm(),
    new SchemeRegistrarForm()
  ]);

  const [presetVotingMachines, setPresetVotingMachines] = useState<VotingMachinePresets>(initialVotingMachines);

  const [activeSchemeTypes, setActiveSchemeTypes] = useState<SchemeType[]>([
    SchemeType.ContributionReward,
    SchemeType.SchemeRegistrar
  ]);

  // Ref to stop force switching toggles from updating vm
  const updatingVotingMachine = useRef(false);
  const loadingSpeed = useRef(false);

  /*
   * Hooks
   */

  useEffect(() => {
    if (!loadedFromModal) return;
    if (form.$.length === 0) return;

    setDecisionSpeed(loadedSpeed);
    updatePresets(loadedSpeed);

    loadingSpeed.current = true;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedFromModal]);

  useEffect(() => {
    if (!loadingSpeed.current) return;

    const containsType = (type: SchemeType) => {
      return form.$.some((scheme: AnySchemeForm) => scheme.type === type);
    };
    const activeSchemes = [
      containsType(SchemeType.ContributionReward),
      containsType(SchemeType.SchemeRegistrar),
    ];

    updateSchemes(form.$, activeSchemes);
    loadingSpeed.current = false;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetVotingMachines]);

  const updatePresets = (speed = decisionSpeed) => {
    const newPresetVotingMachines: VotingMachinePresets = [];

    const newFullSchemes = fullSchemes.map((scheme: AnySchemeForm) => {
      // Gets voting machine preset using the decisionSpeed and scheme type
      const schemePresetMap = schemeSpeeds.get(speed);

      if (schemePresetMap === undefined) throw Error("Unimplemented Scheme Speed Configuration");

      const preset = schemePresetMap.get(scheme.type);
      if (preset === undefined) throw Error("Preset not found");

      scheme.$.votingMachine.preset = preset;
      newPresetVotingMachines.push(new GenesisProtocolForm({ preset }));

      return scheme;
    });

    unstable_batchedUpdates(() => {
      setFullSchemes(newFullSchemes as FullSchemes);
      setPresetVotingMachines(newPresetVotingMachines);
    });
  };

  // Sets vm presets when the speed is changed
  useEffect(() => {
    updatePresets();
    setLoadedSpeed(decisionSpeed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decisionSpeed]);

  // Updates form when vm changes
  useEffect(() => {
    const discardPreset = (scheme: AnySchemeForm) => {
      const schemePresetMap = schemeSpeeds.get(decisionSpeed);

      if (schemePresetMap === undefined) throw Error("Unimplemented Scheme Speed Configuration");

      const preset = schemePresetMap.get(scheme.type);
      if (preset === undefined) throw Error(`Preset: ${scheme.type} not found`);

      const presetVM = new GenesisProtocolForm({ preset });

      if (Object.entries(presetVM.values).toString() === Object.entries(scheme.$.votingMachine.values).toString()) return false;
      return true;
    };

    const newForm = new SchemesForm();
    activeSchemeTypes.map((activeSchemeType: SchemeType, index) => {
      newForm.$.push(fullSchemes[activeSchemeType]);

      if (discardPreset(fullSchemes[activeSchemeType])) newForm.$[index].$.votingMachine.preset = undefined;

      return activeSchemeType;
    });
    form.$ = newForm.$;

    return () => {
      updatingVotingMachine.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullSchemes]);

  // Updates vms when toggles change
  useEffect(() => {
    if (updatingVotingMachine.current) return;
    const newFullSchemes = fullSchemes.map((scheme: AnySchemeForm, index: number) => {
      rewardSuccess
        ? (scheme.$.votingMachine.$.proposingRepReward.value = presetVotingMachines[index].$.proposingRepReward.value)
        : (scheme.$.votingMachine.$.proposingRepReward.value = "0");
      return scheme;
    });

    setFullSchemes(newFullSchemes as FullSchemes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rewardSuccess, presetVotingMachines]);
  useEffect(() => {
    if (updatingVotingMachine.current) return;
    const newFullSchemes = fullSchemes.map((scheme: AnySchemeForm, index: number) => {
      rewardAndPenVoters
        ? (scheme.$.votingMachine.$.votersReputationLossRatio.value =
            presetVotingMachines[index].$.votersReputationLossRatio.value)
        : (scheme.$.votingMachine.$.votersReputationLossRatio.value = 0);
      return scheme;
    });
    setFullSchemes(newFullSchemes as FullSchemes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rewardAndPenVoters, presetVotingMachines]);
  useEffect(() => {
    if (updatingVotingMachine.current) return;
    const newFullSchemes = fullSchemes.map((scheme: AnySchemeForm, index: number) => {
      if (autobet) {
        scheme.$.votingMachine.$.minimumDaoBounty.value = presetVotingMachines[index].$.minimumDaoBounty.value;
        scheme.$.votingMachine.$.daoBountyConst.value = presetVotingMachines[index].$.daoBountyConst.value;
      } else {
        scheme.$.votingMachine.$.minimumDaoBounty.value = "0.000001";
        scheme.$.votingMachine.$.daoBountyConst.value = "1";
      }
      return scheme;
    });
    setFullSchemes(newFullSchemes as FullSchemes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autobet, presetVotingMachines]);

  /*
   * Methods
   */

  const disableSpeed = () => {
    setWarnings(["Your configuration will be overwritten by selecting a new speed"]);
    setDisabledDecisionSpeed(true);
  };

  const enableSpeed = (speed?: DAOSpeed) => {
    setWarnings([]);
    setDisabledDecisionSpeed(false);

    if (speed !== undefined) setDecisionSpeed(speed);
  };

  const checkSpeed = (scheme: AnySchemeForm, schemeType: SchemeType) => {
    const getSpeedValues = (votingMachine: GenesisProtocolForm) => {
      const { queuedVotePeriodLimit, preBoostedVotePeriodLimit, boostedVotePeriodLimit, quietEndingPeriod } = votingMachine.$;

      return [queuedVotePeriodLimit, preBoostedVotePeriodLimit, boostedVotePeriodLimit, quietEndingPeriod];
    };

    const schemeValues = getSpeedValues(scheme.$.votingMachine);
    const presetValues = getSpeedValues(presetVotingMachines[schemeType]);

    return schemeValues.some((value: DurationField, index) => {
      return value.toSeconds() !== presetValues[index].toSeconds();
    });
  };

  const updateSchemes = (advancedSchemes: AnySchemeForm[], activeSchemes: boolean[]) => {
    updatingVotingMachine.current = true;

    let newActiveSchemeTypes: SchemeType[] = [];
    activeSchemes.map((active: boolean, schemeType: number) => {
      if (active) newActiveSchemeTypes.push(schemeType);
      return active;
    });

    const newSchemesForm = new SchemesForm();
    fullSchemes.map(scheme => newSchemesForm.$.push(scheme));

    let toGrey = false;

    // Does not update inactive schemes because they are not validated
    advancedSchemes.map((scheme, index: number) => {
      newSchemesForm.$[scheme.type] = scheme as any;

      if (checkSpeed(scheme, index)) {
        disableSpeed();
        toGrey = true;
      }

      // Currently only updates toggles to reflect advanced changes of first scheme
      if (index !== 0) return scheme;
      // Update toggles
      const { proposingRepReward, votersReputationLossRatio, minimumDaoBounty, daoBountyConst } = scheme.$.votingMachine.values;

      setRewardSuccess(Number(proposingRepReward) > 0);
      setRewardAndPenVoters(Number(votersReputationLossRatio) > 0);
      setAutobet(Number(minimumDaoBounty) > 0.000001 && Number(daoBountyConst) >= 1); // TODO Update after daostack lets us use 0

      return scheme;
    });

    // Changes button styling without changing form
    if (!toGrey) enableSpeed();

    unstable_batchedUpdates(() => {
      setActiveSchemeTypes(newActiveSchemeTypes);
      setFullSchemes(newSchemesForm.$ as FullSchemes);
    });
  };

  const resetForm = () => {
    // Leaving toggles untouched
    if (decisionSpeed !== DAOSpeed.Medium) {
      setDecisionSpeed(DAOSpeed.Medium);
      enableSpeed(DAOSpeed.Medium);
      return;
    }
    // decisionSpeed effects because they won't trigger if speed doesn't change
    updatePresets();
    setLoadedSpeed(DAOSpeed.Medium);
    enableSpeed(DAOSpeed.Medium);
  };

  const handleClick = (e: any) => {
    const newSpeed = parseInt(e.target.value);

    // decisionSpeed effects because they won't trigger if speed doesn't change
    if (newSpeed === decisionSpeed) {
      updatePresets();
      setLoadedSpeed(DAOSpeed.Medium);
    }
    enableSpeed(newSpeed);
  };

  const buttonStyle = (speed: DAOSpeed) =>
    disabledDecisionSpeed
      ? styles.buttonColorInactive
      : decisionSpeed === speed
      ? styles.buttonColorActive
      : styles.buttonColor;

  return (
    <>
      <MDBContainer style={styles.paddingContainer}>
        <MDBRow>
          <MDBCol md="4"></MDBCol>
          <MDBCol md="4" className="offset-md-4">
            <AdvancedEditor
              form={form}
              defaultVMs={presetVotingMachines}
              updateSchemes={updateSchemes}
              resetForm={resetForm}
              setModal={setModal}
              modal={modal}
            />
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol>
            <p className="text-left" style={styles.title}>
              Recommended Configuration
            </p>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol>
            <p className="text-left" style={styles.subtitle}>
              Your organization uses a reputation-weighted voting system to make decisions.
            </p>
          </MDBCol>
        </MDBRow>

        <MDBRow style={styles.box}>
          <MDBContainer>
            {warnings.map((warning, index) => (
              <div key={index} style={{ margin: "0 1rem" }}>
                <MDBAlert color="warning" dismiss>
                  <MDBIcon className="red-text mr-2" icon="exclamation-triangle" />
                  <span style={{ marginRight: "0.5rem" }}>{warning}</span>
                </MDBAlert>
              </div>
            ))}
          </MDBContainer>
          <MDBCol size="6">
            <MDBRow>
              <span style={styles.marginText} className="text-left">
                Decision making
              </span>
              <MDBTooltip placement="bottom" clickable>
                <MDBBtn floating size="lg" color="transparent" style={styles.info}>
                  <MDBIcon icon="info-circle" />
                </MDBBtn>
                <span>How quickly your organization processes proposals</span>
              </MDBTooltip>
            </MDBRow>
          </MDBCol>
          <MDBCol id="col">
            <MDBRow style={styles.alignEnd}>
              <MDBTooltip domElement tag="span" placement="top">
                <button name="decisonSpeed" value={DAOSpeed.Fast} style={buttonStyle(DAOSpeed.Fast)} onClick={handleClick}>
                  Fast
                </button>
                <span>
                  <li><b>Distribute Assets: 2-7 days</b></li>
                  <li><b>Modify DAO: 5-30 days</b></li>
                </span>
              </MDBTooltip>
              <MDBTooltip domElement tag="span" placement="top">
                <button name="decisonSpeed" value={DAOSpeed.Medium} style={buttonStyle(DAOSpeed.Medium)} onClick={handleClick}>
                  Medium
                </button>
                <span>
                  <li><b>Distribute Assets: 5-30 days</b></li>
                  <li><b>Modify DAO: 10-60 days</b></li>
                </span>
              </MDBTooltip>
              <MDBTooltip domElement tag="span" placement="top">
                <button name="decisonSpeed" value={DAOSpeed.Slow} style={buttonStyle(DAOSpeed.Slow)} onClick={handleClick}>
                  Slow
                </button>
                <span>
                    <li><b>Distribute Assets: 10-60 days</b></li>
                    <li><b>Modify DAO: 10-60 days</b></li>
                </span>
              </MDBTooltip>
            </MDBRow>
          </MDBCol>
        </MDBRow>

        <Toggle
          id={"rewardSuccess"}
          text={"Reward successful proposer"}
          tooltip={"Successful proposers gain additional voting power"}
          toggle={() => {
            setRewardSuccess(!rewardSuccess);
          }}
          checked={rewardSuccess}
        />

        <Toggle
          id={"rewardAndPenVoters"}
          text={"Reward correct voters and penalize incorrect voters"}
          tooltip={"Voters on the winning side of proposals gain voting power, voters on the losing side lose voting power"}
          toggle={() => {
            setRewardAndPenVoters(!rewardAndPenVoters);
          }}
          checked={rewardAndPenVoters}
        />

        <Toggle
          id={"autobet"}
          text={"Auto-incentivize proposal curation"}
          tooltip={"The organization bets against every proposal to incentivize the GEN curation network"}
          toggle={() => setAutobet(!autobet)}
          checked={autobet}
        />
      </MDBContainer>

      <button onClick={toggleCollapse} style={styles.configButton}>
        Set Configuration
      </button>
    </>
  );
};

const styles = {
  column: {
    alignItems: "center"
  },
  box: {
    borderTop: "1px solid lightgray",
    borderBottom: "1px solid lightgray",
    padding: "10px"
  },
  buttonColor: {
    color: "black",
    borderRadius: "0.25rem",
    fontWeight: 300,
    width: "28%",
    height: "38px",
    fontSize: "14px",
    margin: "auto"
  },
  buttonColorActive: {
    color: "white",
    borderRadius: "0.25rem",
    fontWeight: 300,
    width: "28%",
    height: "38px",
    fontSize: "14px",
    backgroundColor: "#1976d2",
    margin: "auto"
  },
  buttonColorInactive: {
    color: "black",
    borderRadius: "0.25rem",
    fontWeight: 300,
    width: "28%",
    height: "38px",
    fontSize: "14px",
    backgroundColor: "gray",
    margin: "auto"
  },
  info: {
    backgroundColor: "transparent !important",
    color: "lightgray",
    boxShadow: "none",
    fontSize: "large",
    border: "none",
    outline: "none"
  },
  marginText: {
    marginTop: "6px",
    color: "black",
    fontSize: "16px"
  },
  alignEnd: {
    flexDirection: "row-reverse"
  },
  configButton: {
    borderRadius: "0.37rem",
    marginTop: "28px",
    // marginBottom: '15px',
    height: "45px",
    marginLeft: "6px",
    fontWeight: 300,
    backgroundColor: "#1976d2",
    color: "white",
    width: "145px",
    padding: "7px",
    fontSize: "smaller",
    marginBottom: "20px"
  },
  title: {
    fontWeight: 600,
    fontSize: "17px"
  },
  subtitle: {
    fontSize: "15px",
    color: "gray",
    fontFamily: "inherit"
  },
  toggle: {
    textAlign: '"right"'
  },
  paddingContainer: {
    padding: "8px"
  }
};

export default SchemeEditor;
