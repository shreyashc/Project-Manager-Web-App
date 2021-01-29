import { useRouter } from "next/router";
import React, { useState } from "react";
import AddTaskModal from "../../components/AddTaskModal";
import Layout from "../../components/Layout";
import SingleTask from "../../components/SingleTask";
import Spinner from "../../components/Spinner";
import {
  useCreateTaskMutation,
  useDeleteProjectMutation,
  useDeleteTaskMutation,
  useProjectDeatilsQuery,
  useUpdateTaskStatusMutation,
} from "../../generated/graphql";
import { withApollo } from "../../utils/withApollo";

const ProjectDetails = () => {
  const router = useRouter();
  const projectId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [tab, setTab] = useState("tasks");
  const [showModal, setShowModal] = useState(false);

  const [createTaskMutation] = useCreateTaskMutation();
  const [deleteProjectMutation] = useDeleteProjectMutation();
  const [deleteTaskMutation] = useDeleteTaskMutation();
  const [updateTaskStatusMutation] = useUpdateTaskStatusMutation();
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
            <div className="p-2 border rounded-b ">
              {data.myProject.tasks.map((task) => (
                <SingleTask
                  key={task.id}
                  task={task}
                  deleteTaskMutation={deleteTaskMutation}
                  updateTaskStatusMutation={updateTaskStatusMutation}
                />
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
                <button
                  onClick={async () => {
                    await deleteProjectMutation({
                      variables: { projectId },
                      update: (cache) => {
                        cache.evict({
                          id: "Project:" + data.myProject.id,
                        });
                        cache.gc();
                      },
                    });
                    router.push("/projects");
                  }}
                  className="px-2 py-1 border text-red-500 rounded ml-auto hover:bg-red-100 transition-colors"
                >
                  Delete Project
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {!showModal ? null : (
        <AddTaskModal
          projectId={projectId}
          setShowModal={setShowModal}
          createTaskMutation={createTaskMutation}
        />
      )}
    </Layout>
  );
};

export default withApollo({ ssr: true })(ProjectDetails);
