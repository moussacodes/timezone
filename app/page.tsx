"use client";

import Container from "@/components/Container";
import Empty from "@/components/Empty";
import { Provider, useSelector } from "react-redux";
import { currentMembers } from "@/redux/features/memberSlice";
import { Member } from "@/data";
import store from "../redux/store";
import { getMeetingTime } from "@/utils/logic";
import { useEffect, useState } from "react";
import ResultContainer from "@/components/ResultContainer";

export default function Home() {
  const [show, setShow] = useState(false);
  const members: Member[] = useSelector(currentMembers);
  const m = getMeetingTime(members);

  const calculate_date = () => {
    setShow(true);
    members.forEach((m) => {
      m.freeTime.forEach((x) => {
        console.log(x.start, x.end);
      });
    });
    m.forEach((a) => {
      console.log(a);
    });
  };

 
  return (
    <main className="flex h-screen flex-col items-center justify-between p-24">
      <div className="h-screen w-1/3 border glass rounded-md glass flex flex-col gap-y-4 overflow-auto relative thumb_scroll">
        <h1 className="text-xl text-black text-center p-4">
          Find the perfect time for the meeting
        </h1>
        {members.map((m) => (
          <Container key={m.id} memberData={m} />
        ))}

        <Empty />
        <button
          onClick={calculate_date}
          className="w-32 bg-blue-500 border-none px-6 py-4 rounded-md m-10"
        >
          Calculate
        </button>
      </div>
      <div className="result">
        {/* {show ? results : <></>} */}
      </div>
    </main>
  );
}
