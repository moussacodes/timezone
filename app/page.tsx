"use client";
import { motion } from "framer-motion";
import Container from "@/components/Container";
import Empty from "@/components/Empty";
import { Provider, useDispatch, useSelector } from "react-redux";
import { currentMembers } from "@/redux/features/memberSlice";
import { FreeTime, Member } from "@/data";
import store from "../redux/store";
// import { getMeetingTime } from "@/utils/logic";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useEffect, useState } from "react";
import ResultContainer from "@/components/ResultContainer";
import { MenuItem } from "@mui/material";
import { chaangeDuration, getDuration } from "@/redux/features/durationSlice";
import { Result, findCommonIntervalAmongMembers } from "@/utils/logic";

export default function Home() {
  const currentDuration = useSelector(getDuration);
  const [duration, setDuration] = useState(currentDuration.duration); // 2h, 1h, 45m, 30m, 15m
  const [freeTimeSlots, setFreeTimeSlots] = useState<Result[]>([]);

  useEffect(() => {
    if (currentDuration) {
      setDuration(currentDuration.duration);
    }
  }, [currentDuration]);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const members: Member[] = useSelector(currentMembers);

  const handleDurationChange = (event: SelectChangeEvent) => {
    dispatch(chaangeDuration({ duration: event.target.value }));
  };
  // const m = findCommonIntervalAmongMembers(members);

  const calculate_date = () => {
    setShow(true);
    const r = findCommonIntervalAmongMembers(members);
    r?.forEach((e) => {
      console.log("container", e.fTime.start, e.timezone);
    });
    if (r) {
      console.log("Setting freeTimeSlots", r); // Check the value of r again
      setFreeTimeSlots([...r]);
    }
  };

  return (
    <motion.main
      transition={{ ease: "easeOut", duration: 0.4 }}
      className="flex w-full h-screen flex-row justify-center items-center  p-24"
    >
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: "0%" }}
        transition={{ ease: "easeOut", duration: 0.4 }}
        className="h-5/6 w-1/3 border glass rounded-md glass flex flex-col gap-y-4 overflow-auto relative thumb_scroll"
      >
        <h1 className="text-xl text-black text-center p-4">
          Find the perfect time for the meeting
        </h1>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          className="w-36 ml-10"
          value={duration}
          label="Age"
          defaultValue={currentDuration.duration}
          onChange={handleDurationChange}
        >
          <MenuItem value={"2h"}>2 hour</MenuItem>
          <MenuItem value={"1h"}>1 hour</MenuItem>
          <MenuItem value={"45m"}>45 minutes</MenuItem>
          <MenuItem value={"30m"}>30 minutes</MenuItem>
          <MenuItem value={"15m"}>15 minutes</MenuItem>
        </Select>
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
          className="h-5/6 w-1/3 border glass rounded-md glass flex flex-col gap-y-4 overflow-auto relative thumb_scroll"
        >
          <h1 className="text-xl text-black text-center p-4">meeting time</h1>
          {freeTimeSlots.map((f) => (
            <div key={f.fTime.id}>
              <p>{f.timezone}</p>
              <p>{f.fTime.start.format("hh:mm:ss")}</p>
              <p>{f.fTime.end.format("hh:mm:ss")}</p>
            </div>
          ))}
        </motion.div>
      ) : (
        <></>
      )}
    </motion.main>
  );
}
