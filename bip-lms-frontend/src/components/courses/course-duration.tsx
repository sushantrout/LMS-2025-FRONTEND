import React from "react";

export  const Duration = ({ duration }) => {
  const hours = Math.floor(duration);
  const minutes = Math.round((duration - hours) * 60);

  const formatted = [
    hours > 0 ? `${hours} hr` : "",
    minutes > 0 ? `${minutes} min` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <span>{formatted || "0 min"}</span>;
};
