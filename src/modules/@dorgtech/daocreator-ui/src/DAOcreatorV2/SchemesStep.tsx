import React, { FC, useState, useEffect } from "react";
import {
  SchemesForm,
  ContributionRewardForm,
  SchemeRegistrarForm
} from "@dorgtech/daocreator-lib";

import SchemeEditor, { DAOSpeed } from "../commonV2/dao/Schemes/SchemeEditor";

interface Props {
  form: SchemesForm;
  toggleCollapse: () => void;
  modal: boolean;
  setModal: (modal: boolean) => void;
  loadedFromModal: boolean;
  decisionSpeed: DAOSpeed;
  setDecisionSpeed: (speed: DAOSpeed) => void;
}

const SchemesStep: FC<Props> = ({
  form,
  toggleCollapse,
  modal,
  setModal,
  loadedFromModal,
  decisionSpeed,
  setDecisionSpeed
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) return;

    form.$ = [new ContributionRewardForm(), new SchemeRegistrarForm()];
    setLoading(false);
  }, [loading, form.$]);

  return (
    <SchemeEditor
      form={form}
      toggleCollapse={toggleCollapse}
      modal={modal}
      setModal={setModal}
      loadedFromModal={loadedFromModal}
      loadedSpeed={decisionSpeed}
      setLoadedSpeed={setDecisionSpeed}
    />
  );
};

export default SchemesStep;
