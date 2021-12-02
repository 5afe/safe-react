import React, { FC, Fragment, useEffect } from "react";
import { MDBContainer, MDBRow, MDBBtn, MDBBtnGroup } from "mdbreact";
import OrganizationLine from "./OrganizationLine";

interface IProps {
  migrationStates: any;
}

// Migrator Steps
enum STEP {
  Waiting,
  Creating,
  Configuring,
  Completed
}

// Migrator Steps
enum FAILED {
  Create,
  Config
}

const Migrator: FC<IProps> = ({ migrationStates }: IProps) => {
  const {
    installStep,
    minimalLogLines,
    approval,
    aborting,
    setAborting,
    failed,
    setFailed
  } = migrationStates;
  useEffect(() => {
    if (!aborting) return;

    setAborting(false);
    if (installStep === STEP.Creating) setFailed(FAILED.Create);
    else if (installStep === STEP.Configuring) setFailed(FAILED.Config);
  }, [aborting, installStep, setAborting, setFailed]);

  return (
    <MDBContainer>
      {approval && approval.msg && (
        <Fragment>
          <MDBRow center>
            <div>{approval.msg}</div>
          </MDBRow>
          <MDBRow center>
            <MDBBtnGroup>
              <MDBBtn onClick={() => approval.response(true)}>Yes</MDBBtn>
              <MDBBtn onClick={() => approval.response(false)}>No</MDBBtn>
            </MDBBtnGroup>
          </MDBRow>
        </Fragment>
      )}

      {/* Create Organization */}
      <OrganizationLine
        type={0}
        active={installStep === STEP.Creating}
        done={
          installStep === STEP.Configuring || installStep === STEP.Completed
        }
        failed={failed === FAILED.Create}
        logLines={minimalLogLines}
      />

      {/* Configure Organization */}
      <OrganizationLine
        type={1}
        active={installStep === STEP.Configuring}
        done={installStep === STEP.Completed}
        failed={failed === FAILED.Config}
        logLines={minimalLogLines}
      />
    </MDBContainer>
  );
};

export default Migrator;
