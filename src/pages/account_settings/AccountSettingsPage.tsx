import * as React from "react";
import Header from "../../components/header/Header";
import SolidHorizontalLineDivider from "../../components/divider/SolidHorizontalLineDivider";
import accountSettingsSections, {
  AccountSettingSection,
} from "./AccountSettingsSections";

function AccountSettingsSectionComponent(props: {
  accountSettingSection: AccountSettingSection;
}) {
  return (
    // the content of the page is divided into sections
    <div className={`mt-8 w-full`}>
      {/* every section has an header and some content which are grabbed by the account sections file */}
      <Header title={props.accountSettingSection.header} category="" />
      <div className={`w-full p-2`}>{props.accountSettingSection.content}</div>
    </div>
  );
}

export default function AccountSettingPage(props: {}) {
  return (
    // container of the page
    <div
      className={`
    w-1/2 h-full min-h-screen
    flex justify-center items-start flex-col 
    p-12
    `}
    >
      {/* header of the page */}
      <Header title="General Settings" category="" />
      {/* solid line to divide content from the header */}
      <div className="w-full">
        <SolidHorizontalLineDivider className="border-[rgba(40,41,42,0.4)]" />
      </div>
      {/* the content of the page */}
      {accountSettingsSections().map((accountSettingsSectionComponent, index) => {
        return (
          <AccountSettingsSectionComponent
            key={index}
            accountSettingSection={accountSettingsSectionComponent}
          />
        );
      })}
    </div>
  );
}
