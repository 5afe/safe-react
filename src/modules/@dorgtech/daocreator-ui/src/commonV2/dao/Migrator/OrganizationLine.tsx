import React, { FC, useState, useEffect } from "react";
import { MDBRow, MDBCol, MDBIcon } from "mdbreact";
import './styles.css'

interface Props {
  type: number;
  active: boolean;
  done: boolean;
  failed: boolean;
  logLines: string[];
}

enum STEP {
  Waiting,
  Start,
  Confirmed,
  Failed
}

export const OrganizationLine: FC<Props> = ({
  type,
  active,
  done,
  failed,
  logLines
}) => {
  const [step, setStep] = useState<STEP>(STEP.Waiting);
  const [lastLog, setLastLog] = useState<string>(
    type === 0 ? "Start Installation" : "Waiting"
  );

  useEffect(() => {
    if (done) {
      if (step === STEP.Confirmed) return;
      setStep(STEP.Confirmed);
      return;
    }

    if (failed) {
      if (step === STEP.Failed) return;
      setStep(STEP.Failed);
      return;
    }

    if (!active) {
      if (step === STEP.Waiting) return;
      setStep(STEP.Waiting);
      return;
    }

    if (step === STEP.Start) return;
    setStep(STEP.Start);
  }, [active, done, step, failed]);

  useEffect(() => {
    if (done || (!active && !failed)) return;
    if (logLines.length > 0) setLastLog(logLines[logLines.length - 1]);
  }, [logLines, active, done, failed]);

  const StepName: FC = () => {
    const stepName =
      type === 0 ? "Create Organization" : "Configure Organization";

    return step !== STEP.Waiting ? (
      <div style={{ fontWeight: "bold" }}>{stepName}</div>
    ) : (
      <div>{stepName}</div>
    );
  };

  const Output: FC = () => {
    let text = undefined;

    switch (step) {
      case STEP.Waiting:
        text = type === 0 ? "Start Installation" : "Waiting";
        break;

      case STEP.Start:
        text = lastLog;
        break;

      case STEP.Confirmed:
        text = "Confirmed";
        break;

      case STEP.Failed:
        text = lastLog;
        break;

      default:
        console.log("Unimplemented step");
    }

    return <div style={{ float: "right" }}>{text}</div>; // Should link to txHash
  };

  return (
    <MDBRow className="my-1">
      <MDBCol size="1" id="iconCol">
        {/* TODO 2x is a little big and default is small */}
        <MDBIcon
          className="blue-text"
          size="lg"
          icon={type === 0 ? "city" : "sliders-h"}
        />
      </MDBCol>
      <MDBCol size="4">
        <StepName />
      </MDBCol>
      <MDBCol size="6" id="outputCol">
        <Output />
      </MDBCol>
      <div>
        {step === STEP.Start && (
          <div
            className="spinner-border text-primary"
            style={{ width: "20px", height: "20px" }}
          />
        )}
        {step === STEP.Confirmed && (
          <MDBIcon className="blue-text fas" size="lg" icon="check-circle" />
        )}
        {step === STEP.Failed && (
          <MDBIcon className="red-text fas" size="lg" icon="times-circle" />
        )}
      </div>
    </MDBRow>
  );
};

export default OrganizationLine;
