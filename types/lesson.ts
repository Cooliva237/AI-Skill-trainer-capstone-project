export type Lesson = {
  id: string;
  skillId: string;
  title: string;
  description: string;
  objective: string;
  order: number;
  prerequisiteId: string | null;
  content: {
  heading?: string;
  text?: string;
}[];
  tips: string[];
  commonMistakes: string[];
};
