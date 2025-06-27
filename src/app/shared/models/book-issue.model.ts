export interface BookIssue {
  id: number;
  studentId: number;
  bookId: number;
  bookTitle?:string;
  issueDate: string;
  dueDate: string;
  penalty: number;
}
