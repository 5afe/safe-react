import React from "react";
import './styles.css';

interface Props {
  title: string;
  openModal: (i: boolean | string) => void;
  id?: string | undefined
}
export function UtilityButton(props: Props) {
  const { title, openModal, id } = props;
  const handledCallback = () => {
    if (title === "Import CSV") {
      openModal(title);
    } else {
      openModal(true);
    }
  };
  return (
    <button style={styles.button} onClick={handledCallback} id={id || "utility"}>
      {title}
    </button>
  );
}

const styles = {
  button: {
    width: "174px",
    height: "42px",
    padding: "4px",
    marginRight: "36px",
    marginTop: "20px",
    border: "1px solid gray",
    boxShadow: "none",
    borderRadius: "4px",
    fontFamily: '"Roboto", sans-serif',
    fontWeight: 300,
    fontSize: "15px"
  }
};
