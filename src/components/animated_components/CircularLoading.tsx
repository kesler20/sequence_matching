import * as React from "react";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number; total: number }
) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        {...props}
        value={Math.round((props.value * 100) / props.total)}
      />
      <Box
        sx={{
          top: 0,
          left: 12,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 160,
        }}
      >
        <div className="flex flex-col">
          <p className="paragraph-text">{`${props.value}/${props.total}`}</p>
          <p className="paragraph-text">{`${Math.round(
            (props.value * 100) / props.total
          )}%`}</p>
        </div>
      </Box>
    </Box>
  );
}

export default function CircularStatic(props: { value: number; total: number }) {
  return (
    <div
      className={`
  min-h-[100px] 
  pl-8 
  flex items-center justify-start
  `}
    >
      <CircularProgressWithLabel value={props.value} total={props.total} />
    </div>
  );
}
