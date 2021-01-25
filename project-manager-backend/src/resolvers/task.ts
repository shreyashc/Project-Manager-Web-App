import { Task } from "../entities";
import {
  Arg,
  Mutation,
  Int,
  Resolver,
  Query,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { isOwnProject } from "../middleware/isOwnProject";

/**
 * Task resolver
 */
@Resolver(Task)
export class TaskResolver {
  /**
   * Query to get all tasks of a project
   * @param {number} projectId
   * @returns {Promise<Task[]>} list of tasks of a particular project
   */
  @Query(() => [Task])
  @UseMiddleware(isAuth, isOwnProject)
  async tasks(
    @Arg("projectId", () => Int)
    projectId: number
  ): Promise<Task[]> {
    return Task.find({ projectId });
  }

  /**
   * Muataion: create a new task for a project
   * @param {string} name name of the task
   * @param {number} projectId id of the project
   * @returns {Promise<Task>} newly created task
   */
  @Mutation(() => Task)
  @UseMiddleware(isAuth, isOwnProject)
  async createTask(
    @Arg("name") name: string,
    @Arg("projectId", () => Int) projectId: number
  ): Promise<Task> {
    return Task.create({ projectId, name, status: "pending" }).save();
  }

  /**
   * Muataion: delete a task
   * @param {number} id - id of the task
   * @returns {Promise<Boolean>}
   */
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth, isOwnProject)
  async deleteTask(@Arg("id", () => Int) id: number): Promise<Boolean> {
    await Task.delete({ id });
    return true;
  }

  /**
   * Muataion: change status of a task
   * @param {number} id id of the task
   * @param {string} status status (pending or completed)
   */
  @Mutation(() => Task, { nullable: true })
  @UseMiddleware(isAuth, isOwnProject)
  async updateTaskStatus(
    @Arg("id", () => Int) id: number,
    @Arg("status") status: string
  ): Promise<Task | null> {
    if (!(status === "completed" || status === "pending")) {
      return null;
    }
    const task = await Task.findOne({ id });
    if (!task) {
      return null;
    }
    task.status = status;
    return await task.save();
  }
}
