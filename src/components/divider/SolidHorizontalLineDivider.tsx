import * as React from "react";

export default function SolidHorizontalLineDivider(props: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center mt-4 mb-4`}>
      <div
        className={`
        w-full 
        border-[1px] border-solid border-[rgba(37,44,59,1)]
        ${props.className}
        `}
      />
      <div
        className={`
        w-full 
        border-[1px] border-solid border-[rgba(17,14,29,1)]`}
      />
    </div>
  );
}
