import React, { useEffect, useState } from "react";
import { ProjectDetail } from "../../components/Projects/ProjectDetail/ProjectDetail";
import { Suspense } from "react";
import { useLoaderData, Await } from "react-router-dom";
import { Spinner } from "../../components/Spinner/Spinner";

export const ProjectDetailPage = () => {
  const { project } = useLoaderData();
  const [currentProject, setCurrentProject] = useState(project);

  useEffect(() => {
    setCurrentProject(project);
  }, [project]);

  return (
    <Suspense fallback={<Spinner />}>
      <Await resolve={currentProject}>
        {(loadedProject) => <ProjectDetail project={loadedProject} />}
      </Await>
    </Suspense>
  );
};
