import { Field, Form, Formik } from "formik";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Layout from "../../components/Layout";
import Spinner from "../../components/Spinner";
import {
  useCreateTaskMutation,
  useProjectDeatilsQuery,
} from "../../generated/graphql";
import { withApollo } from "../../utils/withApollo";

const ProjectDetails = () => {
  const router = useRouter();
  const projectId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [tab, setTab] = useState("tasks");
  const [showModal, setShowModal] = useState(false);

  const [createTaskMutation] = useCreateTaskMutation();
  const { data, loading } = useProjectDeatilsQuery({
    variables: { projectId },
  });

  return (
    <Layout>
      {loading && !data?.myProject ? (
        <Spinner size="large" />
      ) : (
        <div className="max-w-4xl mx-auto mt-9 p-3">
          <h3 className="text-center text-2xl font-semibold">
            {data.myProject.title}
          </h3>
          <div className="flex mt-8 text-lg -mb-px">
            <h4
              onClick={() => setTab("tasks")}
              className={
                tab === "tasks"
                  ? "p-2 cursor-pointer text-yellow-300 font-semibold bg-gray-900 border-l border-t border-r rounded-t px-4"
                  : "p-2 cursor-pointer"
              }
            >
              Tasks
            </h4>
            <h4
              onClick={() => setTab("details")}
              className={
                tab === "details"
                  ? "p-2 cursor-pointer text-yellow-300 font-semibold bg-gray-900 border-l border-t border-r rounded-t px-4"
                  : "p-2 cursor-pointer"
              }
            >
              Details
            </h4>
          </div>
          {tab === "tasks" ? (
            <div className="p-2 border rounded-b">
              {data.myProject.tasks.map((task) => (
                <div key={task.id}>
                  <div className="flex p-2 flex-wrap bg-gray-600 my-3 rounded">
                    <div>{task.name}</div>
                    {task.status === "pending" ? (
                      <button className="ml-auto mr-4 focus:outline-none">
                        <i className="fas fa-check">mc</i>
                      </button>
                    ) : (
                      <button className="ml-auto mr-4 focus:outline-none">
                        <i className="fas fa-check">mu</i>
                      </button>
                    )}
                    <button className="delete">
                      <i className=" far fa-trash-alt">Delete</i>
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex space-x-4 mt-5">
                <button
                  onClick={() => setShowModal(true)}
                  className="ml-auto py-1 px-2 bg-green-600 rounded hover:bg-green-500 transition-colors"
                >
                  Add Task
                </button>
              </div>
            </div>
          ) : (
            <div className="p-2 border rounded-b rounded-r">
              <p>{data.myProject.description}</p>
              <div className="mt-4 mb-2 flex">
                <a className="px-2 py-1 border text-red-500 rounded ml-auto hover:bg-red-100 transition-colors">
                  Delete Project
                </a>
              </div>
            </div>
          )}
        </div>
      )}
      {!showModal ? null : (
        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-gray-600 bg-opacity-60">
          <Formik
            initialValues={{ name: "" }}
            onSubmit={async ({ name }) => {
              await createTaskMutation({
                variables: { name, projectId },
                update: (cache, response) => {
                  const newTask = response.data.createTask;
                  cache.modify({
                    id: cache.identify(data.myProject),
                    fields: {
                      tasks(cachedTasks) {
                        return [...cachedTasks, newTask];
                      },
                    },
                  });
                  cache.gc();
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
      )}
    </Layout>
  );
};

export default withApollo({ ssr: true })(ProjectDetails);
