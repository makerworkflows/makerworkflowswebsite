
export interface IJob {
  id: string;
  product: string;
  quantity: number;
  startDate: string; // ISO Date
  endDate: string;   // ISO Date
  line: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Conflict";
}

const MOCK_JOBS: IJob[] = [
  {
    id: "JOB-101",
    product: "Protein Bar - Chocolate",
    quantity: 50000,
    startDate: "2024-03-20T08:00:00",
    endDate: "2024-03-20T16:00:00",
    line: "Line A",
    status: "Scheduled",
  },
  {
    id: "JOB-102",
    product: "Vitamin C Tablets",
    quantity: 100000,
    startDate: "2024-03-21T09:00:00",
    endDate: "2024-03-21T17:00:00",
    line: "Line B",
    status: "Scheduled",
  },
];

export class SchedulerService {
  private jobs: IJob[] = [...MOCK_JOBS];

  public getJobs(): IJob[] {
    return this.jobs;
  }

  public detectConflicts(): string[] {
    const conflicts: string[] = [];
    const jobsByLine: Record<string, IJob[]> = {};

    this.jobs.forEach(job => {
      if (!jobsByLine[job.line]) jobsByLine[job.line] = [];
      jobsByLine[job.line].push(job);
    });

    // Simple conflict check: Overlapping times on same line
    Object.keys(jobsByLine).forEach(line => {
      const lineJobs = jobsByLine[line];
      for (let i = 0; i < lineJobs.length; i++) {
        for (let j = i + 1; j < lineJobs.length; j++) {
          const jobA = lineJobs[i];
          const jobB = lineJobs[j];
          
          const startA = new Date(jobA.startDate).getTime();
          const endA = new Date(jobA.endDate).getTime();
          const startB = new Date(jobB.startDate).getTime();
          const endB = new Date(jobB.endDate).getTime();

          if (startA < endB && startB < endA) {
            conflicts.push(`Conflict on ${line}: ${jobA.id} overlaps with ${jobB.id}`);
            jobA.status = "Conflict";
            jobB.status = "Conflict";
          }
        }
      }
    });

    return conflicts;
  }

  public addJob(job: IJob) {
    this.jobs.push(job);
    this.detectConflicts();
  }
}

export const schedulerService = new SchedulerService();
