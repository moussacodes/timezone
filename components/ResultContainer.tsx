import React from "react";

function ResultContainer(props: {
  person: string;
  start: string;
  end: string;
  timezone: string;
}) {
  return (
    <div>
      <h1>{props.person}</h1>
      <p>{props.timezone}</p>
      <p>{props.start}</p>
      <p>{props.end}</p>
    </div>
  );
}

export default ResultContainer;
