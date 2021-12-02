import React, { useCallback, useState } from "react";
import { DAOForm, MembersForm } from "@dorgtech/daocreator-lib";
import { useDropzone } from "react-dropzone";
import {
  MDBIcon,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBCol,
  MDBContainer,
  MDBRow
} from "mdbreact";
import './styles.css';


interface ImportError {
  file: string;
  message: string;
}

interface Props {
  title: string;
  form: DAOForm;
  reviewStep: any;
  setTitle: any;
}

function Dropzone(props: any) {
  const { isMembersImport, fileAdded, onFilePicked } = props;

  const onDrop = useCallback(
    acceptedFiles => {
      onFilePicked(acceptedFiles, isMembersImport);
    },
    [isMembersImport, onFilePicked]
  );

  const MembersDropzone = () => (
    <>
      <MDBRow>
        <MDBCol size="12">
          <p style={styles.memberWarning}>
            <MDBIcon
              icon="exclamation-circle"
              style={{ marginRight: "10px" }}
            />
            Make sure your CSV file has an address, reputation and token column
          </p>
        </MDBCol>
      </MDBRow>
      <MDBCol size="10" style={styles.memberDropzoneInput}>
        <p style={{ marginTop: "25px" }}>
          <MDBIcon far icon="file-alt" style={{ marginRight: "10px" }} />
          {fileAdded
            ? "File format accepted! Click on import button"
            : "Drag & drop your CSV file here"}
        </p>
      </MDBCol>
    </>
  );

  const ParamsDropzone = () => (
    <MDBCol size="12" style={styles.paramsDropzoneInput}>
      <p style={{ marginTop: "25px" }}>
        <MDBIcon far icon="file-alt" style={{ marginRight: "10px" }} />
        {fileAdded
          ? "File format accepted! Click on import button"
          : "Drag & drop your JSON file here"}
      </p>
    </MDBCol>
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div {...getRootProps()}>
      <input
        {...getInputProps()}
        accept={isMembersImport ? ".csv" : ".json"}
        multiple={isMembersImport}
      />
      <div style={styles.dropzoneContainer}>
        {isMembersImport ? <MembersDropzone /> : <ParamsDropzone />}
      </div>
    </div>
  );
}

export function ImporterModal(props: Props) {
  const { title, form, reviewStep, setTitle } = props;
  const open = title ? true : false;
  const [error, setError] = useState<any>();
  const [fileAdded, setFileAdded] = useState<boolean>(false);

  const isMembersImport = title === "Import CSV";

  const handleParamsImport = async (acceptedFiles: File[]) => {
    if (acceptedFiles === null) {
      return;
    }

    const files = Array.from(acceptedFiles);

    if (files.length === 0) {
      return;
    }

    const file: File = files[0];

    try {
      await form.fromMigrationParamsFile(file);
      await form.validate();
    } catch (e) {
      onError(file.name, e.message);
      return;
    }

    setFileAdded(true);
  };

  const handleMembersImport = async (files: File[]) => {
    const memberForm = form.$.members;

    const formClone = new MembersForm(memberForm.getDAOTokenSymbol);
    formClone.$ = [...memberForm.$];

    for (const file of files) {
      const importedMembers = new MembersForm(memberForm.getDAOTokenSymbol);

      try {
        await importedMembers.fromCSV(file);
      } catch (e) {
        onError(file.name, e.message);
        return;
      }

      // Try adding these members to the full list
      formClone.$ = [...formClone.$, ...importedMembers.$];

      await formClone.validate();
      if (formClone.hasError && formClone.error) {
        onError(file.name, formClone.error);
        return;
      }
    }

    memberForm.$ = [...formClone.$];
    onClose();
  };

  const onFilePicked = async (
    acceptedFiles: File[],
    isMembersImport: boolean
  ) => {
    if (isMembersImport) {
      handleMembersImport(acceptedFiles);
    } else {
      handleParamsImport(acceptedFiles);
    }
  };

  const onImport = (isMembersImport: boolean) => {
    if (!error && fileAdded) {
      if (!isMembersImport) reviewStep(3);
      onClose();
    }
  };

  const onError = (file: string, message: string) => {
    setError({
      file,
      message
    });
  };

  const ImportErrors = (props: { error: ImportError }) => (
    <>
      <strong>We encountered an issue during the import process:</strong>
      <br />
      <div>
        {props.error.file}: {props.error.message}
      </div>
    </>
  );

  const onClose = () => {
    setTitle("");
    setError(null);
    setFileAdded(false);
  };

  return (
    <MDBContainer>
      <MDBCol>
        <MDBModal isOpen={open} fullWidth={true} maxWidth="md">
          <MDBModalHeader style={styles.titlePadding}>
            {" "}
            <span style={styles.bold}>{title}</span>
          </MDBModalHeader>
          <MDBModalBody>
            {error ? (
              <ImportErrors error={error} />
            ) : (
              <Dropzone
                onFilePicked={onFilePicked}
                isMembersImport={isMembersImport}
                fileAdded={fileAdded}
              />
            )}
          </MDBModalBody>
          <MDBModalFooter>
            <button style={styles.cancelButton} onClick={onClose}>
              Close
            </button>
            <button
              id='importButton'
              style={styles.importButton}
              onClick={() => onImport(isMembersImport)}
            >
              {isMembersImport ? "Import CSV file" : "Import JSON File"}
            </button>
          </MDBModalFooter>
        </MDBModal>
      </MDBCol>
    </MDBContainer>
  );
}

const styles = {
  titlePadding: {
    padding: "26px"
  },
  bold: {
    fontWeight: 700,
    fontSize: "18px"
  },
  cancelButton: {
    backgroundColor: "white",
    color: "darkgrey",
    fontSize: "smaller",
    fontWeight: 700,
    borderRadius: "0.37rem",
    height: "45px",
    width: "110px",
    marginRight: "243px"
  },
  importButton: {
    backgroundColor: "#1976d2",
    color: "white",
    fontSize: "smaller",
    fontWeight: 300,
    borderRadius: "0.37rem",
    height: "45px",
    width: "145px"
  },
  dropzoneContainer: {
    height: "150px",
    top: "0",
    left: "0"
  },
  paramsDropzoneInput: {
    width: "90%",
    height: "50%",
    top: "25%",
    margin: "0 auto",
    position: "relative",
    borderStyle: "dotted",
    borderWidth: "1px",
    textAlign: "center",
    fontWeight: 300,
    borderColor: "lightgray"
  },
  memberDropzoneInput: {
    width: "90%",
    height: "50%",
    top: "13%",
    margin: "0 auto",
    position: "relative",
    borderStyle: "dotted",
    borderWidth: "1px",
    textAlign: "center",
    fontWeight: 300,
    borderColor: "lightgray"
  },
  memberWarning: {
    fontSize: "14px",
    borderColor: "lightgray",
    marginLeft: "10px",
    marginTop: "13px"
  }
};
