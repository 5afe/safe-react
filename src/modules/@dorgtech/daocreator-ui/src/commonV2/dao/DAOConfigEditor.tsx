import React, { FC } from "react";
import { observer } from "mobx-react";
import { MDBRow } from "mdbreact";

import { DAOConfigForm } from "@dorgtech/daocreator-lib";
import FormField from "../FormField";

interface Props {
  form: DAOConfigForm;
  editable: boolean;
}

const DAOConfigEditor: FC<Props> = ({
  form,
  editable,
}) => (
  <MDBRow>
    <FormField
      field={form.$.daoName}
      displayName="Name"
      editable={editable}
      tabIndex={1}
    />
    <FormField
      field={form.$.tokenSymbol}
      displayName="Symbol"
      editable={editable}
      tabIndex={2}
    />
  </MDBRow>
);

export default observer(DAOConfigEditor);
