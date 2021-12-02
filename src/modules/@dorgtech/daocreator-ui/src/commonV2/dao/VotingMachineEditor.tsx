import React, { FC } from "react";
import { AnyField, GenesisProtocolForm } from "@dorgtech/daocreator-lib";
import FormField from "../FormField";
import { MDBRow } from "mdbreact";

interface Props {
  votingMachine: GenesisProtocolForm;
  editable: boolean;
}

const VotingMachineEditor: FC<Props> = ({ votingMachine, editable }) => {
  const iterableFields: string[] = Object.keys(votingMachine.$);

  return (
    <>
      {iterableFields.map((key: string, index: number) => {
        const field: AnyField = votingMachine.$[key];
        const prevField: AnyField = votingMachine.$[iterableFields[index - 1]];

        if (index <= 3) {
          return (
            <FormField
              field={field}
              editable={editable}
              key={`genproto-field-${index}`}
              tabIndex={index}
            />
          );
        } else if (index % 2 !== 0) {
          return (
            <MDBRow key={`genproto-field-${index}`}>
              <FormField
                field={field}
                editable={editable}
                tabIndex={index + 8}
              />
              <FormField
                field={prevField}
                editable={editable}
                tabIndex={index + 9}
              />
            </MDBRow>
          );
        }
        return null;
      })}
    </>
  );
};

export default VotingMachineEditor;
