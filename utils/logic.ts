import { Member } from "@/data";
import moment from "moment-timezone";
import util from "util";

function convertToUTC(participants: Member[]): Member[] {
  let convertedResults: Member[] = [];
  participants.map((p) => {
    let res: Member = {
      id: p.id,
      name: p.name,
      timezone: p.timezone,
      freeTime: [],
    };
    let offset = moment().tz(p.timezone).utcOffset() / 60;
    p.freeTime.map((f) => {
      let sl = f.start.split(":");
      let el = f.end.split(":");
      let startSuffix = "";
      let endSuffix = "";

      if (parseInt(sl[0]) + offset < 10) {
        startSuffix = "0" + (parseInt(sl[0]) + offset);
      } else {
        startSuffix = startSuffix + (parseInt(sl[0]) + offset);
      }
      if (parseInt(el[0]) + offset < 10) {
        endSuffix = "0" + (parseInt(el[0]) + offset);
      } else {
        endSuffix = endSuffix + (parseInt(el[0]) + offset);
      }
      res.freeTime.push({
        id: f.id,
        start: startSuffix + ":" + sl[1] + ":" + sl[2],
        end: endSuffix + ":" + el[1] + ":" + el[2],
      });
    });
    convertedResults.push(res);
  });
 
  return convertedResults;
}

function findCommonTime(members) {
  if (members.length === 0) {
    return null; // No common time if there are no members
  }

  // Convert time strings to Moment objects
  const allFreeTimes = members.map(member => {
    return member.freeTime.map(timeSlot => {
      return {
        start: moment(timeSlot.start, "HH:mm:ss"),
        end: moment(timeSlot.end, "HH:mm:ss"),
      };
    });
  });

  // Find the maximum start time and minimum end time among all members
  const maxStartTime = moment.max(allFreeTimes.flat().map(timeSlot => timeSlot.start));
  const minEndTime = moment.min(allFreeTimes.flat().map(timeSlot => timeSlot.end));

  // Check if there is any overlap
  if (maxStartTime.isBefore(minEndTime)) {
    return { start: maxStartTime.format("HH:mm:ss"), end: minEndTime.format("HH:mm:ss") };
  } else {
    return null; // No common time found
  }
}


const commonTime = findCommonTime(initialState);
console.log(commonTime);