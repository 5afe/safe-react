import React, { FC } from "react";
import { observer } from "mobx-react";
import { MDBRow, MDBCol, MDBTooltip, MDBBtn, MDBIcon } from "mdbreact";
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/grey";
import blue from "@material-ui/core/colors/blue";
import DateFnsUtils from "@date-io/date-fns";
import EthAddressAvatar from "../EthAddressAvatar";
import {
  AnyField,
  FieldType,
  StringField,
  TokenField,
  DurationField,
  DateTimeField,
  PercentageField,
  AddressField,
  NumberField
} from "@dorgtech/daocreator-lib";
import "./styles.css";

export interface Props<TField = AnyField> {
  field: TField;
  displayName?: string;
  editable?: boolean;
  colSize?: ColSize;
  tabIndex: number;
}

export type ColSize =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "auto";

const FormField: FC<Props> = ({
  field,
  displayName,
  editable,
  colSize,
  tabIndex
}) => {
  const size = colSize ? colSize : "6";
  let FieldView;

  switch (field.type) {
    case FieldType.String:
      FieldView = StringFieldView;
      break;
    case FieldType.Number:
      FieldView = NumberFieldView;
      break;
    case FieldType.Token:
      FieldView = TokenFieldView;
      break;
    case FieldType.DateTime:
      FieldView = DateTimeFieldView;
      break;
    case FieldType.Duration:
      FieldView = DurationFieldView;
      break;
    case FieldType.Address:
      FieldView = AddressFieldView;
      break;
    case FieldType.Percentage:
      FieldView = PercentageFieldView;
      break;
    default:
      throw Error(`Field type "${FieldType[field.type]}" unimplemented.`);
  }
  return (
    <FieldView
      field={field as any}
      displayName={displayName}
      editable={editable}
      colSize={size}
      tabIndex={tabIndex}
    />
  );
};

const FieldError = (field: any) => (
  <>{field.hasError && <p style={{ color: "red" }}>{field.error}</p>}</>
);

const StringFieldView = observer(
  ({ field, displayName, editable, tabIndex }: Props<StringField>) => {
    return (
      <MDBCol size="6" style={styles.largeMargin}>
        <label style={styles.labelStyle}>
          {displayName ? displayName : field.displayName}
        </label>
        <MDBTooltip placement="bottom" clickable>
          <MDBBtn
            floating
            size="lg"
            color="transparent"
            style={styles.info}
            id="img"
          >
            {" "}
            <MDBIcon icon="info-circle" />
          </MDBBtn>
          <span>{field.description}</span>
        </MDBTooltip>
        <input
          type={"text"}
          style={styles.stringInputStyle}
          value={field.value}
          disabled={editable === undefined ? false : !editable}
          onChange={(event: any) => field.onChange(event.target.value)}
          onBlur={field.enableAutoValidationAndValidate}
          tabIndex={tabIndex}
        />
        {FieldError(field)}
      </MDBCol>
    );
  }
);

const NumberFieldView = observer(
  ({ field, displayName, editable, tabIndex }: Props<NumberField>) => {
    return (
      <MDBCol size="6" style={styles.largeMargin}>
        <label style={styles.labelStyle}>
          {displayName ? displayName : field.displayName}
        </label>
        <MDBTooltip placement="bottom" clickable>
          <MDBBtn floating size="lg" color="transparent" style={styles.info}>
            {" "}
            <MDBIcon icon="info-circle" />
          </MDBBtn>
          <span>{field.description}</span>
        </MDBTooltip>
        <input
          type={"number"}
          style={styles.inputStyle}
          value={Number(field.value).toString()}
          disabled={editable === undefined ? false : !editable}
          onChange={(event: any) => field.onChange(event.target.value)}
          onBlur={field.enableAutoValidationAndValidate}
          tabIndex={tabIndex}
        />
        {FieldError(field)}
      </MDBCol>
    );
  }
);

const TokenFieldView = observer(
  ({ field, displayName, editable, colSize, tabIndex }: Props<TokenField>) => (
    <>
      <MDBCol size={colSize ? colSize : "6"} style={styles.largeMargin}>
        <label style={styles.labelStyle}>
          {displayName ? displayName : field.displayName}
        </label>
        <MDBTooltip placement="bottom" clickable>
          <MDBBtn floating size="lg" color="transparent" style={styles.info}>
            {" "}
            <MDBIcon icon="info-circle" />
          </MDBBtn>
          <span>{field.description}</span>
        </MDBTooltip>
        <input
          type={"number"}
          style={styles.inputStyle}
          value={Number(field.value).toString()}
          disabled={editable === undefined ? false : !editable}
          onChange={(event: any) => field.onChange(event.target.value)}
          onBlur={field.enableAutoValidationAndValidate}
          tabIndex={tabIndex}
        />
        {FieldError(field)}
      </MDBCol>
    </>
  )
);

const DurationFieldView = observer(
  ({ field, displayName, editable, tabIndex }: Props<DurationField>) => {
    const onChange = (event: any) => {
      const duration: any = {
        days: field.days,
        hours: field.hours,
        minutes: field.minutes
      };
      const { name, value } = event.target;
      duration[name] = +value;
      field.onChange(
        `${duration.days}:${duration.hours}:${duration.minutes}:00`
      );
    };

    const setMaxDuration = (name: string) => {
      if (name === "hours") {
        return 24;
      } else if (name === "minutes") {
        return 60;
      } else {
        return undefined;
      }
    };

    const DurationPart = observer(
      (props: { name: "days" | "hours" | "minutes" }) => (
        <>
          <input
            name={props.name}
            style={
              props.name === "days" && +field[props.name] < 10
                ? styles.oneNumberDay
                : props.name === "days" && +field[props.name] > 9
                ? styles.twoNumbersDay
                : {
                    paddingTop: "3px",
                    paddingBottom: "5px",
                    height: "2em",
                    width: "5.5em",
                    textAlign: "center"
                  }
            }
            value={Number(field[props.name]).toString()}
            disabled={editable === undefined ? false : !editable}
            onChange={onChange}
            type={"number"}
            min={0}
            max={setMaxDuration(props.name)}
            onBlur={field.enableAutoValidationAndValidate}
            tabIndex={props.name === "days" ? tabIndex + 1 : tabIndex + 2}
          />
          <div
            style={
              props.name === "days" || props.name === "hours"
                ? { paddingTop: "5px", marginRight: "-3px" }
                : { paddingTop: "5px" }
            }
          >
            <span className={props.name === "days" ? props.name : "hours"}>
              {" "}
              {props.name === "days"
                ? props.name
                : props.name === "hours"
                ? "h"
                : "m"}
            </span>
          </div>
        </>
      )
    );

    return (
      <>
        <MDBRow id="durationCol" style={styles.optionRow}>
          <MDBCol
            size="7"
            className="justify-content-center"
            id="durationLabel"
          >
            <label htmlFor={field.displayName}>
              {displayName ? displayName : field.displayName}
            </label>
            <MDBTooltip placement="bottom" clickable>
              <MDBBtn
                id="icon"
                floating
                size="lg"
                color="transparent"
                style={styles.info}
              >
                {" "}
                <MDBIcon icon="info-circle" />
              </MDBBtn>
              <span>{field.description}</span>
            </MDBTooltip>
          </MDBCol>
          <MDBCol id="durationInputsCol">
            <MDBRow id="durationInputsRow">
              <DurationPart name={"days"} />
              <DurationPart name={"hours"} />
              <DurationPart name={"minutes"} />

              {FieldError(field)}
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </>
    );
  }
);

const datePickerTheme = createMuiTheme({
  palette: {
    primary: grey,
    secondary: blue
  }
});

const DateTimeFieldView = observer(
  ({ field, displayName, editable, tabIndex }: Props<DateTimeField>) => {
    const [open, onOpen] = React.useState(false);
    const disabled = editable === undefined ? false : !editable;

    return (
      <MDBCol size="6" style={styles.largeMargin}>
        <label style={styles.labelStyle}>
          {displayName ? displayName : field.displayName}
        </label>
        <MDBTooltip placement="bottom" clickable>
          <MDBBtn floating size="lg" color="transparent" style={styles.info}>
            {" "}
            <MDBIcon icon="info-circle" />
          </MDBBtn>
          <span>{field.description}</span>
        </MDBTooltip>
        <ThemeProvider theme={datePickerTheme}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDateTimePicker
              value={field.value === undefined ? null : field.value}
              disabled={disabled}
              onChange={(date: Date | null) =>
                date === null ? field.onChange(undefined) : field.onChange(date)
              }
              open={open}
              onClose={() => onOpen(false)}
              disablePast
              format={"MM/dd/yyyy HH:mm"}
              ampm={false}
              variant={"dialog"}
              DialogProps={{
                disablePortal: true
              }}
              inputVariant={"outlined"}
              error={field.hasError}
              size={"small"}
              TextFieldComponent={() => (
                <div>
                  <input
                    style={styles.inputStyle}
                    placeholder="Pick a date and time..."
                    readOnly={true}
                    value={field.value ? field.value.toLocaleString() : ""}
                    disabled={disabled}
                    tabIndex={tabIndex}
                  />
                  <MDBBtn
                    floating
                    size="lg"
                    color="transparent"
                    style={styles.dateTimeEdit}
                    onClick={() => onOpen(!open)}
                    disabled={disabled}
                  >
                    <MDBIcon icon="calendar-alt" />
                  </MDBBtn>
                  {field.value ? (
                    <MDBBtn
                      floating
                      size="lg"
                      color="transparent"
                      style={styles.dateTimeClear}
                      onClick={() => field.onChange(undefined)}
                      disabled={disabled}
                    >
                      <MDBIcon icon="times" />
                    </MDBBtn>
                  ) : (
                    <></>
                  )}
                </div>
              )}
            />
          </MuiPickersUtilsProvider>
        </ThemeProvider>
        {FieldError(field)}
      </MDBCol>
    );
  }
);

const PercentageFieldView = observer(
  ({ field, displayName, editable, tabIndex }: Props<PercentageField>) => {
    const onInputChange = (event: any) => {
      const value = event.target.value;
      field.onChange(value === "" ? 0 : Number(value));
    };

    return (
      <>
        <MDBCol size="6" style={styles.largeMargin}>
          <label style={styles.labelStyle}>
            {displayName ? displayName : field.displayName}
          </label>
          <MDBTooltip placement="bottom" clickable>
            <MDBBtn floating size="lg" color="transparent" style={styles.info}>
              {" "}
              <MDBIcon icon="info-circle" />
            </MDBBtn>
            <span>{field.description}</span>
          </MDBTooltip>
          <input
            type={"number"}
            max="100"
            style={styles.inputStyle}
            value={Number(field.value).toString()}
            disabled={editable === undefined ? false : !editable}
            onChange={onInputChange}
            onBlur={field.enableAutoValidationAndValidate}
            tabIndex={tabIndex}
          />
          {FieldError(field)}
        </MDBCol>
      </>
    );
  }
);

const AddressFieldView = observer(
  ({
    field,
    displayName,
    editable,
    colSize,
    tabIndex
  }: Props<AddressField>) => (
    <>
      <MDBCol size={colSize ? colSize : "6"} style={styles.largeMargin}>
        {field.description === "The member's public address." ? (
          <></>
        ) : (
          <>
            <label style={styles.labelStyle}>
              {displayName ? displayName : field.displayName}
            </label>
            <MDBTooltip placement="bottom" clickable>
              <MDBBtn
                floating
                size="lg"
                color="transparent"
                style={styles.info}
              >
                {" "}
                <MDBIcon icon="info-circle" />
              </MDBBtn>
              <span>{field.description}</span>
            </MDBTooltip>
          </>
        )}
        <div
          style={
            colSize === "9"
              ? { display: "flex", flexDirection: "row", marginTop: "27px" }
              : { display: "flex", flexDirection: "row" }
          }
        >
          <input
            style={{ ...styles.inputStyle, paddingRight: "55px" }}
            placeholder="0x..."
            value={field.value}
            disabled={editable === undefined ? false : !editable}
            onChange={e => field.onChange(e.target.value)}
            onBlur={field.enableAutoValidationAndValidate}
            tabIndex={tabIndex}
          />
          <div style={{ padding: "2%", marginLeft: "-50px", width: 0 }}>
            <EthAddressAvatar address={field.value} paddingLeft={"0"} />
          </div>
        </div>
        {FieldError(field)}
      </MDBCol>
    </>
  )
);

export default FormField;

const styles = {
  inputStyle: {
    border: "1px solid",
    color: "#3E3F42",
    borderColor: "#E2E5ED",
    borderRadius: "4px",
    width: "100%",
    padding: "2%",
    fontFamily: "inherit",
    paddingLeft: "16px",
    paddingTop: "8px",
    paddingBottom: "8px",
    fontSize: "14px",
    fontWeight: 400,
    outline: "none"
  },
  stringInputStyle: {
    border: "1px solid",
    color: "#3E3F42",
    borderColor: "#E2E5ED",
    borderRadius: "4px",
    width: "250px",
    padding: "2%",
    fontFamily: "inherit",
    paddingLeft: "16px",
    paddingTop: "8px",
    paddingBottom: "8px",
    fontSize: "14px",
    fontWeight: 400,
    outline: "none"
  },
  noPadding: {
    padding: 0
  },
  info: {
    backgroundColor: "transparent !important",
    color: "lightgray",
    boxShadow: "none",
    fontSize: "large",
    border: "none",
    outline: "none"
  },
  optionRow: {
    paddingTop: "14px",
    paddingBottom: "10px"
  },
  twoNumbersDay: {
    paddingTop: "3px",
    paddingBottom: "5px",
    height: "2em",
    width: "5.5em",
    paddingLeft: "15px"
  },
  oneNumberDay: {
    paddingTop: "3px",
    paddingBottom: "5px",
    height: "2em",
    width: "5.5em",
    paddingLeft: "25px"
  },
  margin: {
    marginTop: "6px"
  },
  largeMargin: {
    marginTop: "0px"
  },
  labelStyle: {
    color: "#9EA0A5",
    fontWeight: 400,
    fontSize: "12px"
  },
  reactDatepickerWrapper: {
    paddingTop: "5px",
    paddingBottom: "5px",
    height: "2em",
    width: "5.9em",
    display: "flex !important"
  },
  marginInherit: {
    margin: "inherit"
  },
  color: {
    backgroundColor: "white !important"
  },
  dateTimeClear: {
    backgroundColor: "transparent !important",
    color: "#4285f4",
    boxShadow: "none",
    fontSize: "large",
    border: "none",
    outline: "none",
    marginLeft: "-50px"
  },
  dateTimeEdit: {
    backgroundColor: "transparent !important",
    color: "#4285f4",
    boxShadow: "none",
    fontSize: "large",
    border: "none",
    outline: "none",
    marginLeft: "-25px"
  }
};
