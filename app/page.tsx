"use client";

import Image from "next/image";
import Container from "@/components/Container";
import Empty from "@/components/Empty";
import { Provider, useSelector } from "react-redux";
import { currentMembers } from "@/redux/features/memberSlice";
import { Member } from "@/data";
import store from "../redux/store";
import { getMeetingTime } from "@/utils/logic";
import util from "util"; // Import the util module
import { useEffect } from "react";

export default function Home() {
  // useEffect(() =>{},[])
  const members: Member[] = useSelector(currentMembers);
  // const m = getMeetingTime(members);
  const calculate_date = () => {
    console.log(util.inspect(getMeetingTime(members), false, null, true));
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
          className=" w-32 bg-blue-500 border-none px-6 py-4 rounded-md m-10"
        >
          Calculate
        </button>
      </div>
      <div className="result"></div>
    </main>
  );
}
