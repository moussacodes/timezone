import moment from "moment";
import React from "react";

function DisplayContainer(props: {
  timezone: string;
  start: moment.Moment;
  end: moment.Moment;
}) {
  return (
    <div className=" flex flex-col bg-white rounded  mx-4 p-4 gap-y-6">
      <h2 className="text-xl font-semibold ">{props.timezone}</h2>
      <div className=" flex flex-row gap-x-2">
        <span className="text-lg">start: </span>  <span className="text-lg">{props.start.format("hh:mm:ss")}</span>
        <span className=" text-lg">end: </span>  <span className="text-lg">{props.end.format("hh:mm:ss")}</span>
      </div>
    </div>
  );
}

export default DisplayContainer;
