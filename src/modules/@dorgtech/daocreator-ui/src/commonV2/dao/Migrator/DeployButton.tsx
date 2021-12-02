import React, { FC, Fragment } from "react";
import {
  LogUserApproval,
  LogInfo,
  LogError,
  LogTransactionResult,
  LogMigrationAborted,
  AnyLogLine,
  LogType
} from "./LogLineTypes";
import {
  DAOMigrationResult,
  getWeb3,
  DAOMigrationCallbacks,
  migrateDAO,
  getNetworkName,
  toDAOMigrationParams,
  DAOMigrationParams,
  DAOForm
} from "@dorgtech/daocreator-lib";
import { MDBBtn, MDBIcon, MDBTooltip } from "mdbreact";

import { STEP } from "../../../commonV2/Stepper";
import './styles.css';

interface IProps {
  migrationStates: any;
  redirectURL?: string;
}

export const DeployButton: FC<IProps> = ({ migrationStates, redirectURL }) => {
  const {
    installStep,
    setInstallStep,
    setNoWeb3Open,
    setEthSpent,
    fullLogLines,
    setFullLogLines,
    minimalLogLines,
    setMinimalLogLines,
    setApproval,
    result,
    setResult,
    alchemyURL,
    setAlchemyURL,
    setAborting,
    failed,
    setFailed,
    alchemyAdds,
    setAlchemyAdds,
    daoInfo,
    setDaoInfo,
    step,
    form,
    setLaunching,
    setDaoLogs,
    daoLogs
  } = migrationStates;

  /*
   * Callbacks
   */
  const onComplete = (
    { arcVersion, name, Avatar, DAOToken, Reputation, Controller }: DAOMigrationResult,
    alchemyURL: string
  ) => {
    setDaoInfo([...daoInfo, { arcVersion, name, Avatar, DAOToken, Reputation, Controller }]);
    setAlchemyAdds([...alchemyAdds, alchemyURL]);
    onStop();
  };

  const onStart = () => {
    setLaunching(true);
    addNewLogs();
  };

  const addMinLogLine = (log: string) => {
    setMinimalLogLines([...minimalLogLines, log]);
  };

  const addFullLogLine = (log: AnyLogLine) => {
    setFullLogLines([...fullLogLines, log]);
    onLog(log.toString());
  };

  const onAbort = (error: string) => {
    console.log("onAbort");
    console.log(error);
    onStop();
  };

  const onLog = (log: string) => {
    addLog(log);
  };

  const onStop = () => {
    setLaunching(false);
  };

  let dao: DAOMigrationParams;
  if (step > 2 && form instanceof DAOForm) {
    dao = toDAOMigrationParams((form as DAOForm).toState());
  }

  /*
   * Step Transitions
   */
  const createOrganization = () => {
    setInstallStep(STEP.Creating);
  };

  const configureOrganization = () => {
    setInstallStep(STEP.Configuring);
  };

  const completeOrganization = () => {
    //result: DAOMigrationResult // We're not getting this yet
    setInstallStep(STEP.Completed);
    // onComplete(result);
  };
  /*
   * Methods
   */

  const addLog = (log: string) => {
    setDaoLogs((daoLogs: any) => {
      daoLogs[daoLogs.length - 1].push(log);
      return daoLogs;
    });
  };

  const addNewLogs = () => {
    setDaoLogs((daoLogs: any) => [...daoLogs, []]);
  };
  /*
   * Callbacks
   */
  const addLogLine = (logLine: AnyLogLine) => {
    const { type } = logLine;
    addFullLogLine(logLine);

    const { UserApproval, Info, Error, TransactionResult, MigrationAborted } = LogType;

    console.log(logLine);

    switch (type) {
      case UserApproval:
        const approvalLine = logLine as LogUserApproval;
        const { question } = approvalLine;
        switch (question) {
          case "About to migrate new DAO. Continue?":
            approvalLine.onResponse(true);
            console.log("Answering true to: " + question);
            break;

          case "We found a deployment that was in progress, pickup where you left off?":
          case "We found a deployment that's was in progress, pickup where you left off?":
            addMinLogLine("Selecting deployment...");
            setApproval({
              msg: "Continue previous deployment?",
              response: (res: boolean): void => {
                res && configureOrganization();
                setApproval(undefined);
                approvalLine.onResponse(res);
              }
            });
            break;

          default:
            console.log("Unhandled approval log:");
            console.log(question);
            addMinLogLine(question);
            setApproval({
              msg: question,
              response: (res: boolean): void => {
                setApproval(undefined);
                approvalLine.onResponse(res);
              }
            });
            break;
        }
        break;

      case Info:
        const infoLine = logLine as LogInfo;
        const { info } = infoLine;
        switch (true) {
          case info === "Migrating DAO...":
          case info.startsWith("Using Arc Version:"):
            break;

          case info === "Creating a new organization...":
            addMinLogLine("Signing Create Org Tx...");
            break;

          case info === "Setting Scheme Registrar parameters...":
            addMinLogLine("Setting Scheme Registrar params...");
            break;

          case info === "Setting Generic Scheme parameters...":
            addMinLogLine("Setting Generic params...");
            break;

          case info === "Setting Contribution Reward parameters...":
            addMinLogLine("Setting Contribution Reward params...");
            break;

          case info === "Setting DAO schemes...":
            addMinLogLine("Setting DAO schemes...");
            break;

          case info === "Deploying Controller":
            addMinLogLine("Deploying Controller...");
            break;

          case info === "Setting GenesisProtocol parameters...":
            addMinLogLine("Setting Voting Params...");
            break;

          case info === "DAO Migration has Finished Successfully!":
            completeOrganization(); // Hack to complete until callback is implemented
            break;

          default:
            console.log("Unhandled info log:");
            console.log(info);
            addMinLogLine(info);
            break;
        }
        break;

      case Error:
        const errorLine = logLine as LogError;
        const { error } = errorLine;
        switch (true) {
          case error === "Transaction failed: MetaMask Tx Signature: User denied transaction signature.": // Most (all?) also cause an abort so the message shown in Line reverts back to default
            // setMinimalLogLines([
            //   ...minimalLogLines,
            //   "Failed to Sign Transaction"
            // ]);
            break;

          case error.startsWith('Provided address "null" is invalid'): // Happened in dev a lot
            addMinLogLine("Failed to get address");
            break;

          case error.startsWith("Transaction failed: Transaction has been reverted"):
          case error.startsWith("Transaction failed: Error"):
            // setMinimalLogLines([...minimalLogLines, "Transaction failed"]);
            break;

          default:
            console.log("Unhandled error log:");
            console.log(error);
            addMinLogLine(error);
            break;
        }
        break;

      case TransactionResult:
        const txLine = logLine as LogTransactionResult;
        const { msg } = txLine;
        switch (true) {
          case msg === "Created new organization.":
            configureOrganization();
            break;

          case msg.startsWith('Provided address "null" is invalid'): // Happened in dev a lot
            addMinLogLine("Failed to get address");
            // Reset to last step (set button to tx rebroadcast attempt)
            break;

          case msg === "DAO schemes set.":
            addMinLogLine(msg);
            break;

          default:
            console.log("Unhandled txResult log:");
            console.log(msg);
            // addMinLogLine(msg]);
            break;
        }
        break;

      case MigrationAborted:
        const abortedLine = logLine as LogMigrationAborted;
        const abortedMsg = abortedLine.toString();

        setAborting(true);

        switch (true) {
          case abortedMsg === "MetaMask Tx Signature: User denied transaction signature.":
            addMinLogLine("Failed to Sign Transaction");
            break;

          case abortedMsg.startsWith("Network request failed"): // Time out(?)
            addMinLogLine("Network request failed");
            break;

          case abortedMsg === "Returned values aren't valid, did it run Out of Gas?":
          case abortedMsg.startsWith("Transaction has been reverted"):
          case abortedMsg.startsWith("Error: "):
            addMinLogLine("Transaction failed");
            break;

          default:
            console.log("Unhandled abortedMsg log:");
            console.log(abortedMsg);
            addMinLogLine(abortedMsg);
            break;
        }
        break;
      default:
        console.log("Unimplemented log type");
    }
  };

  const getCallbacks = () => {
    const callbacks: DAOMigrationCallbacks = {
      userApproval: (msg: string): Promise<boolean> =>
        new Promise<boolean>(resolve => addLogLine(new LogUserApproval(msg, (resp: boolean) => resolve(resp)))),

      info: (msg: string) => addLogLine(new LogInfo(msg)),

      error: (msg: string) => addLogLine(new LogError(msg)),

      txComplete: (msg: string, txHash: string, txCost: number) =>
        new Promise<void>(resolve => {
          addLogLine(new LogTransactionResult(msg, txHash, txCost));
          setEthSpent((ethSpent: any) => (ethSpent += Number(txCost)));
          resolve();
        }),

      migrationAborted: (err: Error) => {
        window.onbeforeunload = () => {};

        addLogLine(new LogMigrationAborted(err));

        onAbort(err.toString()); // props
      },

      migrationComplete: (result: DAOMigrationResult) => {
        // Unimplemented callback

        window.onbeforeunload = () => {};
        setResult(result);
        setInstallStep(STEP.Completed);

        //onComplete(result); // props
      },

      getState: () => {
        const localState = localStorage.getItem("DAO_MIGRATION_STATE");
        return localState ? JSON.parse(localState) : {};
      },

      setState: (state: any) => {
        localStorage.setItem("DAO_MIGRATION_STATE", JSON.stringify(state));
      },

      cleanState: () => {
        localStorage.removeItem("DAO_MIGRATION_STATE");
      }
    };
    return callbacks;
  };

  /*
   * Start
   */

  const startInstallation = async () => {
    console.log("Starting Installation");

    console.log(dao);

    // Reset state
    setNoWeb3Open(false);
    setMinimalLogLines([]);
    setEthSpent(0);
    setResult(undefined);
    setApproval(undefined);
    setFailed(null);
    setAlchemyURL("");

    // Make sure we have a web3 provider available. If not,
    // tell the user they need to have one. TODO
    let web3 = undefined;

    try {
      web3 = await getWeb3();
    } catch (e) {
      console.log(e);
    }

    if (!web3) {
      setNoWeb3Open(true);
      return;
    }

    // Alert in case of user closing window while deploying, message is generic on modern browsers
    window.onbeforeunload = () => {
      return "Your migration is still in progress. Do you really want to leave?";
    };

    // Clear the log
    setFullLogLines([]);
    setMinimalLogLines([]);

    onStart(); // props

    const callbacks: DAOMigrationCallbacks = getCallbacks();
    setResult(undefined);

    createOrganization();

    const result = await migrateDAO(dao, callbacks);
    // Getting around unimplemented callback
    if (!result) return;

    let network = await getNetworkName();
    if (network === 'private') {
      if (await web3.eth.net.getId() === 100) {
        network = 'xdai'
      } else if (await web3.eth.net.getId() === 77) {
        network = 'sokol'
      }
    }

    let url;
    if (network === "mainnet")
      url = redirectURL
        ? `${redirectURL}/dao/${result.Avatar}`
        : `https://alchemy.daostack.io/dao/${result.Avatar}`;
    else if (network === "rinkeby")
      url = redirectURL
        ? `${redirectURL}/dao/${result.Avatar}`
        : `https://alchemy-staging-rinkeby.herokuapp.com/dao/${result.Avatar}`;
    else if (network === "xdai")
      url = redirectURL
        ? `${redirectURL}/dao/${result.Avatar}`
        : `https://alchemy-2-xdai.herokuapp.com/dao/${result.Avatar}`;
    else
      url = redirectURL
        ? `${redirectURL}/dao/${result.Avatar}`
        : `/dao/${result.Avatar}`;


    setAlchemyURL(url);

    onComplete(result, url);
    setResult(result);
    window.onbeforeunload = () => {};
  };

  const openAlchemy = async () => {
    if (!result) {
      console.log("Failed to open: Result wasn't set");
      return;
    }

    window.open(alchemyURL.toLowerCase());
  };

  const copyDAOLogs = (logs: string[]) => {
    console.log(JSON.stringify(JSON.stringify(logs, null, 2)));
    navigator.clipboard.writeText(JSON.stringify(logs, null, 2));
  };

  return installStep !== STEP.Completed ? (
    <MDBBtn id="installButton" disabled={installStep !== STEP.Waiting && failed === null} onClick={startInstallation}>
      {failed === null ? "Install Organization" : "Restart Installation"}
    </MDBBtn>
  ) : (
    <Fragment>
      <MDBBtn style={styles.postDeployBtn} onClick={openAlchemy}>
        Open Alchemy
      </MDBBtn>
      <MDBBtn style={styles.postDeployBtn} onClick={startInstallation}>
        Redeploy
      </MDBBtn>
      {daoLogs.length > 0 && (
        <div
          style={{
            marginLeft: "170px",
            marginTop: "12px"
          }}
        >
          <MDBTooltip placement="top" domElement>
            <div>
              <MDBIcon
                className="blue-text"
                size="lg"
                icon="copy"
                style={{ cursor: "pointer" }}
                onClick={() => copyDAOLogs(daoLogs[daoLogs.length - 1])}
              />
            </div>
            <div>Click to copy logs</div>
          </MDBTooltip>
        </div>
      )}
    </Fragment>
  );
};

const styles = {
  postDeployBtn: {
    fontSize: "13.5px",
    padding: "0.65rem"
  }
};
