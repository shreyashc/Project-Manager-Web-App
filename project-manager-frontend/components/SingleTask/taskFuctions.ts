export const updateTask = async (
  updateTaskStatusMutation,
  task,
  status: "completed" | "pending"
) => {
  await updateTaskStatusMutation({
    variables: { id: task.id, status },
    update: (cache) => {
      cache.modify({
        id: cache.identify(task),
        fields: {
          status() {
            return status;
          },
        },
      });
    },
  });
};

export const deleteTask = async (deleteTaskMutation, task) => {
  await deleteTaskMutation({
    variables: { taskId: task.id },
    update: (cache) => {
      cache.evict({
        id: "Task:" + task.id,
      });
      cache.gc();
    },
  });
};
