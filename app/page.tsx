"use client"

import Image from "next/image";
import Container from "@/components/Container";
import Empty from "@/components/Empty";
import { Provider, useSelector } from "react-redux";
import { currentMembers } from "@/redux/features/memberSlice";
import { Member } from "@/data";
import store from "../redux/store";

export default function Home() {
  const members: Member[] = useSelector(currentMembers)
  return (
 
    <main className="flex h-screen flex-col items-center justify-between p-24">
      <div className="h-full w-1/3 border glass rounded-md glass flex flex-col gap-y-4 overflow-y-scroll thumb_scroll">
        <h1 className="text-xl text-black text-center p-4">
          Find the perfect time for the meeting
        </h1>
        {members.map(m => (
          <Container memberData={m}/>
        ))}
         
        <Empty />
      </div>
    </main>
 
  );
}
