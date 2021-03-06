import { Project, Task } from "../entities";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { isOwnProject } from "../middleware/isOwnProject";

/**
 * Input type for creating new project
 */
@InputType()
class ProjectInput {
  @Field()
  title: string;
  @Field()
  description: string;
}

@ObjectType()
class Projects {
  @Field(() => [Project])
  projects: Project[];
}

/**
 * Project Resolver
 */
@Resolver(Project)
export class ProjectResolver {
  /**
   * Query
   * @description get all projects of current user
   * @returns {Promise<Project[]>} array of projects
   */

  @FieldResolver(() => [Task])
  @UseMiddleware(isAuth)
  tasks(@Root() project: Project, @Ctx() { taskLoader }: MyContext) {
    return taskLoader.load(project.id);
  }

  @Query(() => Projects)
  @UseMiddleware(isAuth)
  async myProjects(
    @Ctx()
    { req }: MyContext
  ): Promise<Projects> {
    const projects = await Project.find({ userId: req.session.userId });
    return { projects };
  }

  /**
   * Query: Get single project
   * @param {number} projectId project id
   * @returns {Promise<Project>}
   */
  @Query(() => Project, { nullable: true })
  @UseMiddleware(isAuth)
  async myProject(
    @Arg("projectId", () => Int) projectId: number,
    @Ctx()
    { req }: MyContext
  ): Promise<Project | undefined> {
    return Project.findOne({
      id: projectId,
      userId: req.session.userId,
    });
  }

  /**
   * Mutation: create a new project
   * @param {ProjectInput} input (project title and description)
   * @returns {Promise<Project>} of newly created project
   */
  @Mutation(() => Project)
  @UseMiddleware(isAuth)
  async createProject(
    @Arg("input") input: ProjectInput,
    @Ctx() { req }: MyContext
  ): Promise<Project> {
    return Project.create({
      userId: req.session.userId,
      ...input,
    }).save();
  }

  /**
   * Mutation: delete a project
   * @param {number} projectId
   * @returns {boolean | null} true for successfull deletion
   *                           null if project dosen't exists
   */
  @Mutation(() => Boolean, { nullable: true })
  @UseMiddleware(isAuth, isOwnProject)
  async deleteProject(
    @Arg("projectId", () => Int) projectId: number,
    @Ctx() { req }: MyContext
  ) {
    const project = await Project.findOne({
      id: projectId,
      userId: req.session.userId,
    });

    if (!project) {
      return null;
    }

    // delete with cascading all tasks related to this project.
    await project.remove();
    return true;
  }
}
