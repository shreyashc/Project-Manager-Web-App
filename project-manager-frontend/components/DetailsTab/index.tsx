import { useRouter } from "next/router";
import React from "react";
import { deleteProject } from "./projectDetailsFuncs";

const ProjectDetailsTab = ({
  projectDesc,
  projectId,
  deleteProjectMutation,
}: ProjectDetailsTabProps) => {
  const router = useRouter();
  return (
    <div className="project-desc">
      <p>{projectDesc}</p>
      <div className="mt-4 mb-2 flex">
        <button
          onClick={async () => {
            await deleteProject(deleteProjectMutation, projectId);
            router.push("/projects");
          }}
          className="delete-project "
        >
          Delete Project
        </button>
      </div>
    </div>
  );
};

interface ProjectDetailsTabProps {
  projectDesc: string;
  projectId: number;
  deleteProjectMutation: any;
}

export default ProjectDetailsTab;
