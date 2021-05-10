export interface ImprovementModel {
  id: number;
  userId: number;
  improvementType: string;
  request: string;
  reqDate: Date;
  username?: string;
}
