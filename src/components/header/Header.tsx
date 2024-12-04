import React from "react";

export default function Header(props: {
  category: string;
  title: string;
  onClick?: (e: any) => void;
}) {
  return (
    <div className="mb-10" onClick={props.onClick}>
      <p className="paragraph-text">{props.category}</p>
      <p className={`header-text tracking-tight`}>{props.title}</p>
    </div>
  );
}
