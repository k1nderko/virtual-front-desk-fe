export interface Option {
  id: number;
  text: string;
}

export interface Task {
  id: number;
  instruction: string;
  options: Option[];
}

export interface AnswerResult {
  isCorrect: boolean;
  message: string;
}
