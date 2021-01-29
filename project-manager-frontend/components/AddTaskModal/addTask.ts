import gql from "graphql-tag";

export const addTask = async (
  createTaskMutation,
  projectId: number,
  name: string
) => {
  await createTaskMutation({
    variables: { name, projectId },
    update: (cache, response) => {
      const newTask = response.data.createTask;
      const query = gql`
                query {
                  myProject(projectId: ${projectId}) {
                    id
                    title
                    description
                    tasks {
                      id
                      name
                      status
                    }
                  }
                }
              `;
      const data: any = cache.readQuery({ query });
      cache.writeQuery({
        query,
        data: {
          myProject: {
            tasks: [...data.myProject.tasks, newTask],
          },
        },
      });
    },
  });
};
