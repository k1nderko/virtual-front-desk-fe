export interface Option {
  id: number;
  text: string;
  /** Only present in admin API responses */
  isCorrect?: boolean;
}

/** Option shape for admin create/edit form (id optional for new rows) */
export interface OptionForm {
  id?: number;
  text: string;
  isCorrect: boolean;
}

export interface Task {
  id: number;
  instruction: string;
  options: Option[];
}

/** Payload for creating a task (no id) */
export interface TaskCreate {
  instruction: string;
  options: Array<{ text: string; isCorrect: boolean }>;
}

/** Payload for updating a task (options may have optional id) */
export interface TaskUpdate {
  id: number;
  instruction: string;
  options: OptionForm[];
}

export interface AnswerResult {
  isCorrect: boolean;
  message: string;
}
