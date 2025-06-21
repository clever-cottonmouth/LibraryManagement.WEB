export interface BookIssue {
  id: number;
  studentId: number;
  bookId: number;
  issueDate: string;
  dueDate: string;
  penalty: number;
}
