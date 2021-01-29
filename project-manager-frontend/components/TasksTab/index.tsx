import React from "react";
import { Task } from "../../generated/graphql";
import SingleTask from "../SingleTask";

const TasksTab = ({
  tasks,
  deleteTaskMutation,
  updateTaskStatusMutation,
  setShowModal,
}: TasksTabProprs) => {
  return (
    <div className="tasks">
      {tasks.map((task) => (
        <SingleTask
          key={task.id}
          task={task}
          deleteTaskMutation={deleteTaskMutation}
          updateTaskStatusMutation={updateTaskStatusMutation}
        />
      ))}
      <div className="flex space-x-4 mt-5">
        <button onClick={() => setShowModal(true)} className="add-task">
          Add Task
        </button>
      </div>
    </div>
  );
};

interface TasksTabProprs {
  tasks: MyTask[];
  deleteTaskMutation: any;
  updateTaskStatusMutation: any;
  setShowModal;
}

type MyTask = {
  __typename?: "Task";
} & Pick<Task, "id" | "name" | "status">;

export default TasksTab;
