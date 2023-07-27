"use client";
import "./style.css";
import { Accordion, Select, ThemeIcon } from "@mantine/core";
import React, { useState } from "react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { format, parseISO } from "date-fns";

import ContentEditable from "react-contenteditable";
import { timeZones } from "@/data/timezones";

import { IconPlus, IconTrash } from "@tabler/icons-react";

import { useEffect, useRef } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { FreeTime, Member, RootState } from "@/data";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewFreetime,
  changePersonName,
  changeTimeZone,
  currentMemberFreeTime,
  currentMemberName,
  currentMembers,
  deleteMember,
  removeFreetime,
  updateMemberFreeTimeEnd,
  updateMemberFreeTimeStart,
} from "@/redux/features/memberSlice";
import { eventNames } from "process";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

function Container(props: { memberData: Member }) {
  const currentMembersState = useSelector((state: RootState) =>
    currentMembers(state)
  );
  const currentFreeTime: FreeTime[] | undefined = useSelector(
    (state: RootState) => currentMemberFreeTime(state, props.memberData.id)
  );
  const currentName: string | undefined = useSelector((state: RootState) =>
    currentMemberName(state, props.memberData.id)
  );
  const dispatch = useDispatch();
  const [username, setUsername] = useState(props.memberData.name);
  const [tz, setTz] = useState(props.memberData.timezone);
  const [freeTime, setFreeTime] = useState<FreeTime[]>(
    props.memberData.freeTime
  );
  const text = useRef("");

  useEffect(() => {
    if (currentFreeTime) {
      setFreeTime([...currentFreeTime]);
    }
  }, [currentFreeTime]);

  useEffect(() => {
    if (currentName) {
      setUsername(currentName);
    }
  }, [currentName]);

  useEffect(() => {
    const m = currentMembersState.find((c) => c.id === props.memberData.id);
    if (m) {
      setTz(m.timezone);
    }
  }, [currentMembersState]);

  const addNewTimeRow = () => {
    if (
      freeTime[freeTime.length - 1].start.length !== 0 &&
      freeTime[freeTime.length - 1].end.length !== 0
    ) {
      dispatch(addNewFreetime({ id: props.memberData.id }));
    }
  };

  const handleChange = (evt: any) => {
    dispatch(
      changePersonName({ id: props.memberData.id, name: evt.target.value })
    );
  };

  function deleteItem(indexToDelete: number) {
    // setFreeTime((prevFreeTime) => {
    //   const updatedFreeTime = [...prevFreeTime];
    //   updatedFreeTime.splice(indexToDelete, 1);
    //   return updatedFreeTime;
    // });
    if (props.memberData.freeTime.length > 1) {
      dispatch(
        removeFreetime({
          memberId: props.memberData.id,
          indexTobeDeleted: indexToDelete,
        })
      );
    }
  }

  const handleChangeTime = (
    newValue: any,
    index: number,
    isStartTime: boolean
  ) => {
    let date = new Date(newValue);
    const dateObj = new Date(date);
    const timeString = dateObj.toTimeString().slice(0, 8);
    console.log(timeString); // Output: 03:32:00
    //   let h = date.getHours()
    //   let m = date.getMinutes()
    //   let s = date.getSeconds()
    //  console.log(h+":"+m+":"+s)

    setFreeTime((prevFreeTime) => {
      const updatedFreeTime = [...prevFreeTime];
      if (isStartTime) {
        dispatch(
          updateMemberFreeTimeStart({
            memberId: props.memberData.id,
            startTime: timeString,
            index: index,
          })
        );
      } else {
        dispatch(
          updateMemberFreeTimeEnd({
            memberId: props.memberData.id,
            endTime: timeString,
            index: index,
          })
        );
      }
      return updatedFreeTime;
    });
  };

  const deleteMemberF = (e: any) => {
    // e.stopPropagation();
    dispatch(deleteMember({ id: props.memberData.id }));
  };
  const handleBlur = () => {
    console.log(text.current);
  };

  //TIMEZONE

  function changeTimeZoneF(value: string) {
    dispatch(changeTimeZone({ id: props.memberData.id, timeZone: value }));
  }

  return (
    <div className="px-10">
      <Accordion
        chevronPosition="right"
        chevronSize={50}
        variant="separated"
        disableChevronRotation
        chevron={
          <ThemeIcon radius="xl" size={32}>
            <IconPlus size="1.05rem" stroke={1.5} />
          </ThemeIcon>
        }
      >
        <Accordion.Item className="glass" value="reset-password">
          <Accordion.Control>
            <div className="flex flex-row items-center gap-x-4">
              <ThemeIcon
                radius="xl"
                color={"red"}
                size={32}
                onClick={(e: any) => {
                  deleteMemberF(e);
                }}
              >
                <IconTrash size="1.05rem" stroke={1.5} />
              </ThemeIcon>
              <ContentEditable
                html={username}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>
          </Accordion.Control>
          <Accordion.Panel>
            <div className="flex flex-col gap-y-10">
              <Select
                mt="md"
                withinPortal
                className="w-4/5"
                data={timeZones}
                placeholder="Pick one"
                value={tz}
                onChange={(value: string) => {
                  changeTimeZoneF(value);
                }}
                label="Select your timezone"
              />
              <div className="free_time flex flex-col gap-y-4">
                {freeTime.map((f, index) => (
                  <div
                    key={f.id}
                    className="flex flex-row gap-x-2  relative items-center"
                  >
                    <ThemeIcon
                      size={32}
                      color="red"
                      className="cursor-pointer"
                      onClick={() => {
                        deleteItem(index);
                      }}
                    >
                      <IconTrash size="1.05rem" stroke={1.5} />
                    </ThemeIcon>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        className="w-36"
                        onChange={(newValue: any) =>
                          handleChangeTime(newValue, index, true)
                        }
                        value={f.start}
                        label="start"
                        viewRenderers={{
                          hours: renderTimeViewClock,
                          minutes: renderTimeViewClock,
                          seconds: renderTimeViewClock,
                        }}
                      />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        className="w-36"
                        onChange={(newValue: any) =>
                          handleChangeTime(newValue, index, false)
                        }
                        value={f.end}
                        label="End"
                        viewRenderers={{
                          hours: renderTimeViewClock,
                          minutes: renderTimeViewClock,
                          seconds: renderTimeViewClock,
                        }}
                      />
                    </LocalizationProvider>
                    {index === freeTime.length - 1 ? (
                      <div
                        onClick={() => {
                          addNewTimeRow();
                        }}
                        className="absolute top-2 right-3 cursor-pointer"
                      >
                        <ThemeIcon size={32}>
                          <IconPlus size="1.05rem" stroke={1.5} />
                        </ThemeIcon>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}

export default Container;
