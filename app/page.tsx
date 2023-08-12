"use client";
import { motion } from "framer-motion";
import Container from "@/components/Container";
import Empty from "@/components/Empty";
import { useDispatch, useSelector } from "react-redux";
import { currentMembers } from "@/redux/features/memberSlice";
import { Member } from "@/data";

import { useEffect, useState } from "react";
import { IconPlus, IconTrash, IconUserQuestion } from "@tabler/icons-react";

import { Result, findCommonIntervalAmongMembers } from "@/utils/logic";
import DisplayContainer from "@/components/DisplayContainer";
import { Button } from "@mantine/core";

export default function Home() {
  const [freeTimeSlots, setFreeTimeSlots] = useState<Result[]>([]);

  const [empty, setEmpty] = useState(false);

  const [show, setShow] = useState(false);
  const members: Member[] = useSelector(currentMembers);

  const calculate_date = () => {
    setEmpty(false);
    setShow(true);
  };

  useEffect(() => {
    //BUG: when the time is changed after clicking calculate, it keeps adding new display cards
    setFreeTimeSlots([]);

    const r = findCommonIntervalAmongMembers(members);

    if (r) {
      if (r.length === 0) {
        setEmpty(true);
      }
      setFreeTimeSlots([...r]);
    }
  }, [members]);

  return (
    <motion.main
      transition={{ ease: "easeOut", duration: 0.4 }}
      className="flex w-full h-screen flex-row justify-center items-center  p-24 max-md:p-4 max-xl:flex-col"
    >
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: "0%" }}
        transition={{ ease: "easeOut", duration: 0.4 }}
        className="h-5/6 w-1/3 border glass rounded-md glass flex flex-col gap-y-4 overflow-auto relative thumb_scroll max-2xl:w-3/4 max-md:w-full m-12 "
      >
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
      </motion.div>
      {show ? (
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          transition={{ ease: "easeOut", duration: 0.4 }}
          className="h-5/6 w-1/3 border glass rounded-md glass flex flex-col gap-y-4 overflow-auto relative thumb_scroll max-2xl:w-3/4 max-md:w-full"
        >
          <h1 className="text-xl text-black text-center p-4">meeting time</h1>
          {empty ? (
            <div>
              <p>couldn't find a time for a meeting</p>
            </div>
          ) : (
            <>
              {freeTimeSlots.map((f) => (
                <DisplayContainer
                  key={f.fTime.id}
                  timezone={f.timezone}
                  start={f.fTime.start}
                  end={f.fTime.end}
                />
              ))}
            </>
          )}
        </motion.div>
      ) : (
        <></>
      )}
      <p className="absolute bottom-0 text-sm">
        Photo by{" "}
        <a
          className="underline text-green-400"
          href="https://unsplash.com/@nasa?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
        >
          NASA
        </a>{" "}
        on{" "}
        <a
          className="underline text-green-400"
          href="https://unsplash.com/photos/gYwfpVI2JzM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
        >
          Unsplash
        </a>
      </p>
      <div className="tooltip absolute bottom-2 right-2 bg-white rounded-full p-3">
        <a
          target="blank"
          href="https://github.com/duckduckcodes/timezone/issues"
        >
          {" "}
          <IconUserQuestion color="black" size={"32px"}/>
          <span className="feedback">send feedback</span>
        </a>
      </div>
    </motion.main>
  );
}
