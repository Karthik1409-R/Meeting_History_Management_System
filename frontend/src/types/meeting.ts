export interface Participant {
  _id?: string;
  name: string;
  email: string;
}

export interface Meeting {
  _id: string;
  title: string;
  meetingCode: string;
  hostName: string;
  startedAt?: string;
  endedAt?: string;
  scheduledFor?: string;
  participants: Participant[];
  notes?: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}
