import moment from "moment";
import m from "moment-timezone";
import { v4 as uuidv4 } from "uuid";

export interface FreeTime {
  id: string;
  start: moment.Moment;
  end: moment.Moment;
}

export interface Result {
  timezone: string,
  fTime: FreeTime
}

// Define the type for member
export interface Member {
  id: string;
  name: string;
  timezone: string;
  freeTime: FreeTime[];
}

export const generateId = (): string => {
  const id: string = uuidv4();
  return id;
};

const members: Member[] = [
  {
    id: generateId(),
    name: "Person 1",
    timezone: "Africa/Addis_Ababa",
    freeTime: [
      {
        id: generateId(),
        start: moment("10:30:00", "HH:mm:ss"),
        end: moment("12:00:00", "HH:mm:ss"),
      },
      {
        id: generateId(),
        start: moment("15:00:00", "HH:mm:ss"),
        end: moment("17:00:00", "HH:mm:ss"),
      },
    ],
  },
  {
    id: generateId(),
    name: "Person 2",
    timezone: "America/Los_Angeles",
    freeTime: [
      {
        id: generateId(),
        start: moment("21:00:00", "HH:mm:ss"),
        end: moment("23:30:00", "HH:mm:ss"),
      },
    ],
  },

  // Add more members here with their respective free times and timezones
];

const convertToUTC = (members: Member[]) => {
  return members.map((a) => {
    const convertedFreeTime = a.freeTime.map((f) => {
      const convertedStart = f.start
        .clone()
        .add(m().tz(a.timezone).utcOffset(), "minutes");
      const convertedEnd = f.end
        .clone()
        .add(m().tz(a.timezone).utcOffset(), "minutes");
      return { ...f, start: convertedStart, end: convertedEnd };
    });

    return { ...a, freeTime: convertedFreeTime };
  });
};

const findIntersection = (
  member1: FreeTime,
  member2: FreeTime
): FreeTime | null => {
  if (
    member1.start.isBefore(member2.start) &&
    member1.end.isBetween(member2.start, member2.end)
  ) {
    return {
      id: generateId(),
      start: member2.start,
      end: member1.end,
    };
  }
  if (
    member1.start.isAfter(member2.start) &&
    member1.end.isBefore(member2.end)
  ) {
    return {
      id: generateId(),
      start: member1.start,
      end: member1.end,
    };
  }
  if (
    member2.start.isAfter(member1.start) &&
    member2.end.isBefore(member1.end)
  ) {
    return {
      id: generateId(),
      start: member2.start,
      end: member2.end,
    };
  }
  if (
    member2.start.isBefore(member1.start) &&
    member2.end.isBetween(member1.start, member1.end)
  ) {
    return {
      id: generateId(),
      start: member1.start,
      end: member2.end,
    };
  }

  if (member1.start.isSame(member2.start) && member1.end.isSame(member2.end)) {
    return {
      id: generateId(),
      start: member1.start,
      end: member1.end,
    };
  }

  return null;
};

export const findCommonIntervalAmongMembers = (
  members: Member[]
): Result[] | null => {
  if (members.length === 0) {
    return null;
  }
  // members.forEach(A=>{
  //   A.freeTime.forEach(d=>{
  //         console.log(d.id, d.start)
  //   })
  // })
  let availableFreeTime: FreeTime[] = [];
  for (let index = 0; index < members.length; index++) {
    const f = compareWithMember(index, members);
    if (f) {
      for (const fTime of f) {
        if (!checkDuplicates(availableFreeTime, fTime)) {
          availableFreeTime.push(fTime);
        }
      }
    }
  }
  let tempArr: Result[] = [];
  let g = revertToOriginalTimezone(availableFreeTime, members);
  for (const t of g) {
    if (!checkDuplicateId(tempArr, t.fTime.id)) {
      tempArr.push(t);
    }
  }
  return tempArr;
};

const compareWithMember = (
  index: number,
  members: Member[]
): FreeTime[] | null => {
  members = convertToUTC(members);
  if (index < 0 || index >= members.length) {
    throw new Error("Invalid member index");
  }

  let commonIntervals = members[index].freeTime.slice();

  let newCommonIntervals: FreeTime[] = [];

  for (let i = 0; i < members.length; i++) {
    if (i !== index) {
      if (i === index) continue;

      const memberFreeTimes = members[i].freeTime.slice();

      for (const existingInterval of commonIntervals) {
        // Filter out intersections with other member's free times
        for (const newInterval of memberFreeTimes) {
          const intersection = findIntersection(existingInterval, newInterval);
          if (intersection) {
            newCommonIntervals.push(intersection);
          }
        }
      }
    }
  }
  return newCommonIntervals;
};

const revertToOriginalTimezone = (freetime: FreeTime[], members: Member[]) => {
  let revertedFreeTime: Result[] = [];

  members.forEach((member) => {
    freetime.forEach((f) => {
      const start = f.start.subtract(
        moment().tz(member.timezone).utcOffset(),
        "minutes"
      );
      const end = f.end.subtract(
        moment().tz(member.timezone).utcOffset(),
        "minutes"
      );
      revertedFreeTime.push({
        timezone: member.timezone,
        fTime: {
          id: f.id,
          start: start, // Convert back to ISO string if needed
          end: end, // Convert back to ISO string if needed
        },
      });
    });
  });

  return revertedFreeTime;
};

const checkDuplicateId = (freeTime: Result[], id: string) => {
  if (freeTime.length === 0) {
    return false;
  }
  for (const a of freeTime) {
    if (a.fTime.id === id) {
      return true;
    }
  }
  return false;
};

const checkDuplicates = (
  newCommonIntervals: FreeTime[],
  intersection: FreeTime
): Boolean => {
  for (const interval of newCommonIntervals) {
    if (
      interval.start.isSame(intersection.start) &&
      interval.end.isSame(intersection.end)
    ) {
      return true;
    }
  }
  return false;
};

// const convertedMemebers = convertToUTC(members);
// // convertedMemebers.forEach((a) => {
// //   console.log(a.freeTime);
// // });
// const availableFreeTimeSlots =
//   findCommonIntervalAmongMembers(convertedMemebers);

// console.log(availableFreeTimeSlots);
