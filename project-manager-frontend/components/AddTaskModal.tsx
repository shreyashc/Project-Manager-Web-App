import { MutationFunctionOptions, FetchResult } from "@apollo/client";
import { Field, Form, Formik } from "formik";
import gql from "graphql-tag";
import { CreateTaskMutation, Exact } from "../generated/graphql";

interface AddTaskModalProps {
  projectId: number;
  createTaskMutation: (
    options?: MutationFunctionOptions<
      CreateTaskMutation,
      Exact<{
        projectId: number;
        name: string;
      }>
    >
  ) => Promise<
    FetchResult<CreateTaskMutation, Record<any, any>, Record<any, any>>
  >;
  setShowModal;
}

const AddTaskModal = ({
  projectId,
  createTaskMutation,
  setShowModal,
}: AddTaskModalProps) => {
  return (
    <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-gray-600 bg-opacity-60">
      <Formik
        initialValues={{ name: "" }}
        onSubmit={async ({ name }) => {
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
          setShowModal(false);
        }}
      >
        {(props) => (
          <Form className="bg-gray-800 h-auto p-4 lg:p-10 rounded-md mt-16 shadow-lg">
            <h2 className="font-bold text-3xl text-blue-300 text-center mb-4">
              Add a task
            </h2>
            <div className="mb-3">
              <label className="mb-3">
                Task Name:
                <Field
                  required
                  type="text"
                  name="name"
                  placeholder="task name"
                  className="border-0 mt-2 px-4 py-2 bg-gray-700 rounded-sm w-full text-gray-200 focus:outline-none focus:ring focus:border-blue-400 ring-blue-300"
                />
              </label>
            </div>
            <div
              onClick={() => setShowModal(false)}
              className="uppercase font-semibold w-full mt-8 py-2 rounded-sm border focus:outline-none hover:bg-gray-500 cursor-pointer text-center"
            >
              Cancel
            </div>
            <button
              type="submit"
              className="uppercase font-semibold w-full bg-blue-600 mt-2 py-2 rounded-sm focus:outline-none hover:bg-blue-500"
            >
              {!props.isSubmitting ? "Add" : "Adding"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddTaskModal;
