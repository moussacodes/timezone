import moment from "moment";

export interface FreeTime {
  id: string;
  start: moment.Moment;
  end: moment.Moment;
}

// Define the type for member
export interface Member {
  id: string;
  name: string;
  timezone: string;
  freeTime: FreeTime[];
}

export interface Duration {
  duration: string;
}

export type RootState = {
  members: Member[];
  duration: Duration
};
