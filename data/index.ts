export interface FreeTime {
    id: string
    start: string;
    end: string;
  }
  
  // Define the type for member
  export interface Member {
    id: string;
    name: string;
    timezone: string;
    freeTime: FreeTime[];
  }
  

export type RootState = {
    members: Member[]
}