export type FormState = {
  date: string;
  project: string;
  hours: number;
  description: string;
};

export type FormErrors = {
  date?: string;
  project?: string;
  hours?: string;
  description?: string;
  dailyTotal?: string;
};