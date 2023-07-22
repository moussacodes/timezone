import { Member } from "@/data";
import moment from "moment-timezone";
import util from "util"; 


 
function convertToUTC(
  timeSlot: { start: string; end: string },
  timezone: string
): { start: string; end: string } {
  const startMoment = moment.tz(timeSlot.start, "HH:mm:ss", timezone).utc();
  const endMoment = moment.tz(timeSlot.end, "HH:mm:ss", timezone).utc();
  return { start: startMoment.format("HH:mm:ss"), end: endMoment.format("HH:mm:ss") };
}

function findCommonFreeTimeSlots(
  participants: Member[]
): { start: string; end: string }[] {
  // Find the common free time slots among all participants in UTC
  let commonTimeSlots = participants[0].freeTime.map((timeSlot) =>
    convertToUTC(timeSlot, participants[0].timezone)
  );

  for (let i = 1; i < participants.length; i++) {
    const participant = participants[i];
    commonTimeSlots = commonTimeSlots.filter((timeSlot) => {
      return participant.freeTime.some((otherTimeSlot) => {
        const startTimeMoment = moment.utc(timeSlot.start, "HH:mm:ss");
        const endTimeMoment = moment.utc(timeSlot.end, "HH:mm:ss");
        const otherStartTimeMoment = moment.utc(otherTimeSlot.start, "HH:mm:ss");
        const otherEndTimeMoment = moment.utc(otherTimeSlot.end, "HH:mm:ss");

        return (
          startTimeMoment.isSameOrBefore(otherEndTimeMoment) &&
          endTimeMoment.isSameOrAfter(otherStartTimeMoment)
        );
      });
    });
  }

  return commonTimeSlots;
}

function convertToTimeZone(
  timeSlot: { start: string; end: string },
  timezone: string
): { start: string; end: string } {
  const startMoment = moment.utc(timeSlot.start, "HH:mm:ss").tz(timezone);
  const endMoment = moment.utc(timeSlot.end, "HH:mm:ss").tz(timezone);
  return { start: startMoment.format("HH:mm:ss"), end: endMoment.format("HH:mm:ss") };
}

// Prepare the meetings array with each participant's timezone
export const getMeetingTime = (participants: Member[]) => {
  return participants.map((participant) => {
    const timezone = participant.timezone;
    const commonFreeTimeSlots = findCommonFreeTimeSlots(participants);
    const meetingsInOriginalTZ = commonFreeTimeSlots.map((timeSlot) =>
      convertToTimeZone(timeSlot, timezone)
    );
    return { participant: participant.name, meetings: meetingsInOriginalTZ };
  });
};

 console.log("Meetings:");

// TODO: should fix the logic