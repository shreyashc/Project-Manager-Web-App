import DataLoader from "dataloader";
import { In } from "typeorm";
import { Task } from "../../entities";

export const createTaskLoader = () =>
  new DataLoader<number, Task[]>(async (projectIds) => {
    const tasks = await Task.find({ projectId: In(projectIds as number[]) });
    const tasksToProjectId: Record<number, Task[]> = {};
    tasks.forEach((task) => {
      if (tasksToProjectId[task.projectId]) {
        tasksToProjectId[task.projectId].push(task);
      } else {
        tasksToProjectId[task.projectId] = [task];
      }
    });
    return projectIds.map((projectId) => tasksToProjectId[projectId]);
  });
