import * as React from "react";
import Header from "../../../components/header/Header";
import Button from "../../../components/buttons/Button";

export default function ErrorPage(props: { onBackButtonClicked: () => void }) {
  return (
    <div className={``}>
      <Header category="Error" title="Sorry there was an error try again later" />
      <div className="p-6"></div>
      <Button inner="Back" onClick={props.onBackButtonClicked} />
    </div>
  );
}
