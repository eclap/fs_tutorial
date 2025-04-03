// TODO: Change to Enum
const TaskStatus = {
  TO_DO: 'To Do',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

TaskStatus.getAll = () => {
  return [
    TaskStatus.TO_DO, 
    TaskStatus.IN_PROGRESS, 
    TaskStatus.COMPLETED,
  ];
};

module.exports = TaskStatus;
