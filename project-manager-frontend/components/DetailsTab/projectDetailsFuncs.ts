export const deleteProject = async (
  deleteProjectMutation,
  projectId: number
) => {
  await deleteProjectMutation({
    variables: { projectId },
    update: (cache) => {
      cache.evict({
        id: "Project:" + projectId,
      });
      cache.gc();
    },
  });
};
