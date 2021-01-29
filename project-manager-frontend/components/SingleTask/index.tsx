import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash, faUndo } from "@fortawesome/free-solid-svg-icons";
import { Task } from "../../generated/graphql";
import { deleteTask, updateTask } from "./taskFuctions";

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
            onClick={() => {
              updateTask(updateTaskStatusMutation, task, "completed");
            }}
            className="ml-auto mr-4 focus:outline-none cursor-pointer"
          />
        ) : (
          <FontAwesomeIcon
            icon={faUndo}
            onClick={() => {
              updateTask(updateTaskStatusMutation, task, "pending");
            }}
            className="ml-auto mr-4 focus:outline-none cursor-pointer"
          />
        )}
        <FontAwesomeIcon
          icon={faTrash}
          onClick={() => {
            deleteTask(deleteTaskMutation, task);
          }}
          className="cursor-pointer text-red-600 hover:text-red-500"
        />
      </div>
    </div>
  );
};

interface TaskProps {
  task: {
    __typename?: "Task";
  } & Pick<Task, "id" | "name" | "status">;
  updateTaskStatusMutation: any;
  deleteTaskMutation: any;
}

export default SingleTask;
