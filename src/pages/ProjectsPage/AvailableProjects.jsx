import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import { useLoaderData, Await} from "react-router-dom";
import { Spinner } from "../../components/Spinner/Spinner";
import { AllAvailableProjects } from "../../components/Projects/AllProjects/AllAvailableProjects";


export const AvailableProjects = () => {
  const { projects } = useLoaderData();
    const [currentProjects, setCurrentProjects] = useState(projects);
  
      useEffect(() => {
        setCurrentProjects(projects);
      }, [projects]);
    return (
      <Suspense fallback={<Spinner />}>
        <Await resolve={currentProjects}>
          {(loadedProjects) => <AllAvailableProjects projects={loadedProjects} />}
        </Await>
      </Suspense>
    );
}
