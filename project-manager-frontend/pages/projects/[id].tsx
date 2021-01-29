import { useRouter } from "next/router";
import React, { useState } from "react";
import AddTaskModal from "../../components/AddTaskModal/";
import ProjectDetailsTab from "../../components/DetailsTab";
import Layout from "../../components/Layout";
import Spinner from "../../components/Spinner";
import TasksTab from "../../components/TasksTab";
import {
  useCreateTaskMutation,
  useDeleteProjectMutation,
  useDeleteTaskMutation,
  useProjectDeatilsQuery,
  useUpdateTaskStatusMutation,
} from "../../generated/graphql";
import { useEnsureAuth } from "../../utils/useEnsureAuth";
import { withApollo } from "../../utils/withApollo";

const ProjectDetails = () => {
  useEnsureAuth();
  const router = useRouter();
  const projectId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [tab, setTab] = useState("tasks");
  const [showModal, setShowModal] = useState(false);

  const [createTaskMutation] = useCreateTaskMutation();
  const [deleteProjectMutation] = useDeleteProjectMutation();
  const [deleteTaskMutation] = useDeleteTaskMutation();
  const [updateTaskStatusMutation] = useUpdateTaskStatusMutation();
  const { data, loading, error } = useProjectDeatilsQuery({
    variables: { projectId },
  });

  if (loading) {
    return null;
  }
  if (error) {
    return null;
  }

  if (!data.myProject) {
    return null;
  }

  return (
    <Layout>
      {loading && !data?.myProject ? (
        <Spinner size="large" />
      ) : (
        <div className="project-details">
          <h3 className="project-title">{data.myProject.title}</h3>
          <div className="tabs-header">
            <h4
              onClick={() => setTab("tasks")}
              className={tab === "tasks" ? "tab-selected" : "tab-default"}
            >
              Tasks
            </h4>
            <h4
              onClick={() => setTab("details")}
              className={tab === "details" ? "tab-selected" : "tab-default"}
            >
              Details
            </h4>
          </div>
          {tab === "tasks" ? (
            <TasksTab
              tasks={data.myProject.tasks}
              deleteTaskMutation={deleteTaskMutation}
              updateTaskStatusMutation={updateTaskStatusMutation}
              setShowModal={setShowModal}
            />
          ) : (
            <ProjectDetailsTab
              projectId={projectId}
              projectDesc={data.myProject.description}
              deleteProjectMutation={deleteProjectMutation}
            />
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
