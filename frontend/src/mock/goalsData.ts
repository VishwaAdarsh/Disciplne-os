export interface GoalItem {
  id: string;
  title: string;
  category: 'Discipline' | 'Body' | 'Mind' | 'Nutrition' | 'Career';
  progressPercent: number;
  completedMilestones: number;
  totalMilestones: number;
  nextMilestone: string;
  dueDate: string;
  status: 'Active' | 'Completed' | 'On Hold';
}

export interface GoalsMockData {
  activeGoalsCount: number;
  completedGoalsCount: number;
  averageProgressPercent: number;
  goals: GoalItem[];
}

export const mockGoalsData: GoalsMockData = {
  activeGoalsCount: 4,
  completedGoalsCount: 7,
  averageProgressPercent: 68,
  goals: [
    {
      id: "g1",
      title: "LEARN PYTHON",
      category: "Career",
      progressPercent: 78,
      completedMilestones: 12,
      totalMilestones: 16,
      nextMilestone: "Complete Pandas & Data Wrangling module",
      dueDate: "Aug 15",
      status: "Active",
    },
    {
      id: "g2",
      title: "BUILD PORTFOLIO",
      category: "Career",
      progressPercent: 52,
      completedMilestones: 5,
      totalMilestones: 10,
      nextMilestone: "Finish Interactive Projects showcase section",
      dueDate: "Aug 30",
      status: "Active",
    },
    {
      id: "g3",
      title: "FITNESS CONSISTENCY",
      category: "Body",
      progressPercent: 64,
      completedMilestones: 16,
      totalMilestones: 25,
      nextMilestone: "Workout 5x/week for 4 consecutive weeks",
      dueDate: "Ongoing",
      status: "Active",
    },
    {
      id: "g4",
      title: "DAILY MINDFULNESS HABIT",
      category: "Mind",
      progressPercent: 80,
      completedMilestones: 24,
      totalMilestones: 30,
      nextMilestone: "Complete 30 consecutive meditation logs",
      dueDate: "Aug 10",
      status: "Active",
    },
  ]
};
