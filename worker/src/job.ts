export interface Job {
  id: string;
  data: string;
}

export interface JobDetails {
  worker: string | null;
  job: Job;
  progress: number;
  hasStarted: boolean;
  completed: boolean;
}
