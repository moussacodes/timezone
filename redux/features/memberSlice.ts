// memberSlice.ts
import { FreeTime, Member, RootState } from "@/data";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

// Define the type for free time object

// Initial state for the members slice
const initialState: Member[] = [
  {
    id: "qsfg57qregf5sg465sdfg",
    name: "Person 1",
    timezone: "Africa/Addis_Ababa",
    freeTime: [{ id: "qsdfqs2qs5df", start: "", end: "" }],
  },
];

function generateId(): string {
  const id: string = uuidv4();
  return id;
}

const memberSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    addMember: (state) => {
      const newId = generateId();
      const newName = "Person " + (state.length + 1).toString();
      state.push({
        id: newId,
        name: newName,
        timezone: "Africa/Addis_Ababa",
        freeTime: [{ id: generateId(), start: "", end: "" }],
      });
    },
    deleteMember: (state, action: PayloadAction<{ id: string }>) => {
      const memberIndex = state.findIndex((m) => m.id === action.payload.id);
      state.splice(memberIndex, 1);
    },
    changeTimeZone: (
      state,
      action: PayloadAction<{ id: string; timeZone: string }>
    ) => {
      const member = state.find((m) => m.id === action.payload.id);
      if (member) {
        member.timezone = action.payload.timeZone;
      }
    },
    changePersonName: (
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      const member = state.find((m) => m.id === action.payload.id);
      if (member) {
        member.name = action.payload.name;
      }
    },
    addNewFreetime: (state, action: PayloadAction<{ id: string }>) => {
      const member = state.find((m) => m.id === action.payload.id);
      const newId = generateId();
      if (member) {
        member.freeTime.push({ id: newId, start: "", end: "" });
      }
    },
    removeFreetime: (
      state,
      action: PayloadAction<{ memberId: string; indexTobeDeleted: number }>
    ) => {
      const member = state.find((m) => m.id === action.payload.memberId);
      if (member) {
        member.freeTime.splice(action.payload.indexTobeDeleted, 1);
      }
    },
    updateTimeZone: (
      state,
      action: PayloadAction<{ id: string; timeZone: string }>
    ) => {
      const m = state.find((m) => m.id === action.payload.id);
      if (m) {
        m.timezone = action.payload.timeZone;
      }
    },
    updateMemberFreeTimeStart: (
      state,
      action: PayloadAction<{
        memberId: string;
        startTime: string;
        index: number;
      }>
    ) => {
      const { memberId, startTime, index } = action.payload;
      const member = state.find((m) => m.id === memberId);
      if (member) {
        member.freeTime[index].start = startTime;
      }
    },
    updateMemberFreeTimeEnd: (
      state,
      action: PayloadAction<{
        memberId: string;
        endTime: string;
        index: number;
      }>
    ) => {
      const { memberId, endTime, index } = action.payload;
      const member = state.find((m) => m.id === memberId);
      if (member) {
        member.freeTime[index].end = endTime;
      }
    },
  },
});

export const {
  addMember,
  removeFreetime,
  changeTimeZone,
  addNewFreetime,
  changePersonName,
  deleteMember,
  updateMemberFreeTimeStart,
  updateMemberFreeTimeEnd,
} = memberSlice.actions;
export const currentMembers = (state: RootState) => state.members;
export const currentMemberName = (state: RootState, memberId: string) => {
  const m = state.members.find((mem) => mem.id === memberId);
  if (m) {
    return m.name;
  }
};

export const currentMemberFreeTime = (
  state: RootState,
  memberId: string
): FreeTime[] | undefined => {
  const m = state.members.find((mem) => mem.id === memberId);
  if (m) {
    return m.freeTime;
  }
};

export default memberSlice.reducer;
