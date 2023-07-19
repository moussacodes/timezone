"use client";
import "./style.css";
import { Accordion, Select, ThemeIcon } from "@mantine/core";
import React, { useState } from "react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import ContentEditable from "react-contenteditable";
import { timeZones } from "@/data/timezones";

import { IconPlus, IconTrash } from "@tabler/icons-react";

import { useEffect, useRef } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { FreeTime, Member, RootState } from "@/data";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewFreetime,
  currentMemberFreeTime,
  removeFreetime,
  updateMemberFreeTimeEnd,
  updateMemberFreeTimeStart,
} from "@/redux/features/memberSlice";

interface IFreeTime {
  start: string;
  end: string;
}

function Container(props: { memberData: Member }) {
  const currentFreeTime: IFreeTime[] | undefined = useSelector(
    (state: RootState) => currentMemberFreeTime(state, props.memberData.id)
  );
  const dispatch = useDispatch();
  const [username, setUsername] = useState(props.memberData.name);
  const [tz, setTz] = useState(props.memberData.timezone);
  const [freeTime, setFreeTime] = useState<IFreeTime[]>(
    props.memberData.freeTime
  );
  const text = useRef("");

  useEffect(() => {
    if (currentFreeTime) {
      setFreeTime([...currentFreeTime]);
    }
  }, [currentFreeTime]);

  const addNewTimeRow = () => {
    if (
      freeTime[freeTime.length - 1].start.length !== 0 &&
      freeTime[freeTime.length - 1].end.length !== 0
    ) {
      dispatch(addNewFreetime({ id: props.memberData.id }));
    }
  };

  const handleChange = (evt: any) => {
    setUsername(evt.target.value);
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
    newValue: string,
    index: number,
    isStartTime: boolean
  ) => {
    setFreeTime((prevFreeTime) => {
      const updatedFreeTime = [...prevFreeTime];
      if (isStartTime) {
        dispatch(
          updateMemberFreeTimeStart({
            memberId: props.memberData.id,
            startTime: newValue,
            index: index,
          })
        );
      } else {
        dispatch(
          updateMemberFreeTimeEnd({
            memberId: props.memberData.id,
            endTime: newValue,
            index: index,
          })
        );
      }
      return updatedFreeTime;
    });
  };

  const handleBlur = () => {
    console.log(text.current);
  };

  //TIMEZONE

  function changeTimeZone(value: string) {
    setTz(value);
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
            <ContentEditable
              html={username}
              onClick={(e) => {
                e.stopPropagation();
              }}
              onBlur={handleBlur}
              onChange={handleChange}
            />
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
                  changeTimeZone(value);
                }}
                label="Select your timezone"
              />
              <div className="free_time flex flex-col gap-y-4">
                {freeTime.map((f, index) => (
                  <div
                    key={f.end}
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
                        label="Start"
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
