import React, { useEffect, useState } from "react";
import { AllProjects } from "../../components/Projects/AllProjects/AllProjects";
import { Suspense } from "react";
import { useLoaderData, Await} from "react-router-dom";
import { Spinner } from "../../components/Spinner/Spinner";

export const ProjectsDH = () => {
  const { projects } = useLoaderData();
  const [currentProjects, setCurrentProjects] = useState(projects);

    useEffect(() => {
      setCurrentProjects(projects);
    }, [projects]);
  return (
    <Suspense fallback={<Spinner />}>
      <Await resolve={currentProjects}>
        {(loadedProjects) => <AllProjects projects={loadedProjects} />}
      </Await>
    </Suspense>
  );
};
