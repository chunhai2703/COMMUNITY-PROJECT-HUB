import React, { useEffect, useState } from "react";
import { ProjectDetail } from "../../components/Projects/ProjectDetail/ProjectDetail";
import { Suspense } from "react";
import { useLoaderData, Await, useParams } from "react-router-dom";
import { Spinner } from "../../components/Spinner/Spinner";
import { loadProjectDetails } from "../../services/ProjectsApi";

export const ProjectDetailPage = () => {
  const { project } = useLoaderData();
  const [currentProject, setCurrentProject] = useState(project);
  const { projectId } = useParams();

  useEffect(() => {
    setCurrentProject(project);
  }, [project]);


  return (
    <Suspense fallback={<Spinner />}>
      <Await resolve={currentProject}>
        {(loadedProject) => <ProjectDetail project={loadedProject} refreshProject={setCurrentProject} />}
      </Await>
    </Suspense>
  );
};
