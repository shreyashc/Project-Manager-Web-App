import { ForbiddenError } from "apollo-server-express";
import { Project } from "../entities";
import { MyContext } from "../types";
import { MiddlewareFn } from "type-graphql";

/**
 * Graphql Middleware to check whether project belongs
 * to requested user of not
 *
 */
export const isOwnProject: MiddlewareFn<MyContext> = async (
  { context, args },
  next
) => {
  const project = await Project.findOne({
    id: args.projectId,
  });

  if (!project) {
    return next();
  }

  if (project.userId !== context.req.session.userId) {
    throw new ForbiddenError(
      "You Don't have enough permission to perform this action."
    );
  }
  return next();
};
