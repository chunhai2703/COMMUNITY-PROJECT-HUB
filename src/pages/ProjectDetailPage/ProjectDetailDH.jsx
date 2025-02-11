import React from 'react'
import { ProjectDetail } from '../../components/Projects/ProjectDetail/ProjectDetail'
import { Suspense } from "react";
import { useLoaderData, Await } from "react-router-dom";
import { Spinner } from '../../components/Spinner/Spinner';


export const ProjectDetailDH = () => {
  const { project } = useLoaderData()
  return (
    <>
      <Suspense fallback={<Spinner />}>
        <Await resolve={project}>
          {(loadedProject) => <ProjectDetail project={loadedProject} />}
        </Await>
      </Suspense>
    </>
  )
}
