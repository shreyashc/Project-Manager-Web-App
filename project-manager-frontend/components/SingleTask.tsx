import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash, faUndo } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { DeleteTaskMutation, Exact, Task } from "../generated/graphql";
import { FetchResult, MutationFunctionOptions } from "@apollo/client";
interface TaskProps {
  task: {
    __typename?: "Task";
  } & Pick<Task, "id" | "name" | "status">;
  updateTaskStatusMutation: any;
  deleteTaskMutation: (
    options?: MutationFunctionOptions<
      DeleteTaskMutation,
      Exact<{
        taskId: number;
      }>
    >
  ) => Promise<
    FetchResult<DeleteTaskMutation, Record<any, any>, Record<any, any>>
  >;
}

const SingleTask = ({
  task,
  updateTaskStatusMutation,
  deleteTaskMutation,
}: TaskProps) => {
  return (
    <div>
      <div className="flex items-center p-2 flex-wrap bg-gray-600 my-3 rounded">
        <div
          className={
            task.status === "completed" ? "line-through text-gray-400" : ""
          }
        >
          {task.name}
        </div>
        {task.status === "pending" ? (
          <FontAwesomeIcon
            icon={faCheck}
            onClick={async () => {
              await updateTaskStatusMutation({
                variables: { id: task.id, status: "completed" },
                update: (cache) => {
                  cache.modify({
                    id: cache.identify(task),
                    fields: {
                      status() {
                        return "completed";
                      },
                    },
                  });
                },
              });
            }}
            className="ml-auto mr-4 focus:outline-none cursor-pointer"
          />
        ) : (
          <FontAwesomeIcon
            icon={faUndo}
            onClick={async () => {
              await updateTaskStatusMutation({
                variables: { id: task.id, status: "pending" },
                update: (cache) => {
                  cache.modify({
                    id: cache.identify(task),
                    fields: {
                      status() {
                        return "pending";
                      },
                    },
                  });
                },
              });
            }}
            className="ml-auto mr-4 focus:outline-none cursor-pointer"
          />
        )}
        <FontAwesomeIcon
          icon={faTrash}
          onClick={async () => {
            await deleteTaskMutation({
              variables: { taskId: task.id },
              update: (cache) => {
                cache.evict({
                  id: "Task:" + task.id,
                });
                cache.gc();
              },
            });
          }}
          className="cursor-pointer text-red-600 hover:text-red-500"
        />
      </div>
    </div>
  );
};

export default SingleTask;
