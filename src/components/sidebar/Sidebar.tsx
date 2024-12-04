import * as React from "react";
import { pages } from "../../pages/Pages";
import { Link, useLocation } from "react-router-dom";
import SolidHorizontalLine from "../divider/SolidHorizontalLineDivider";
import useStateStyleContext from "../../contexts/StyleContextProvider";

function SideBarIcon(props: {
  icon: React.ReactNode;
  tooltip: string;
  link: string;
  onClick?: () => void;
}) {
  const { pathname } = useLocation();
  const isCurrentPage = pathname === props.link;

  return (
    // the group keyboard is a way of applying the same styling to children components in tailwind
    // set group to the parent component and use group-<utility>
    // to the child components to apply the same utitlity to all of them
    // this is used to ensure that all the child icons are scaled
    <div
      className={`
    ${isCurrentPage ? "sidebar-icon-focused" : "sidebar-icon"}
    group`}
      onClick={props.onClick}
    >
      {props.icon}
      <div className="sidebar-tooltip group-hover:scale-100">{props.tooltip}</div>
    </div>
  );
}

export default function Sidebar(props: {}) {
  const { setSidebarIconMonitoringClicked, windowWidth } = useStateStyleContext();

  const categoriesWithRepeats = pages.map((pageMetadata) => {
    return pageMetadata.category;
  });
  const categories = [...new Set(categoriesWithRepeats)];
  return (
    <>
      {windowWidth >= 620 && (
        // keep the margin top 8rem way from the height of the navbar, which in this case is 16rem
        <div
          className={`
      min-h-screen w-16
      top-0 left-0  pt-14
      flex flex-col 
        bg-gray-900 text-white shadow
      `}
        >
          {categories.map((category, index) => {
            return (
              <React.Fragment key={index}>
                {pages
                  .filter((pageMetadata) => pageMetadata.category === category)
                  .map((pageMetadata, index) => {
                    return (
                      <Link to={pageMetadata.link} key={index}>
                        {pageMetadata.name === "Monitoring" ? (
                          <SideBarIcon
                            link={pageMetadata.link}
                            tooltip={pageMetadata.name}
                            icon={pageMetadata.pageIcon}
                            onClick={() => setSidebarIconMonitoringClicked(true)}
                          />
                        ) : (
                          <SideBarIcon
                            link={pageMetadata.link}
                            tooltip={pageMetadata.name}
                            icon={pageMetadata.pageIcon}
                          />
                        )}
                      </Link>
                    );
                  })}
                {/* if is not the last category use the Solid line as a divider */}
                {categories.indexOf(category) !== categories.length - 1 && (
                  <SolidHorizontalLine />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </>
  );
}
