import React from 'react'
import { ChangeClass } from '../../components/Classes/ChangeClass/ChangeClass'
import { Spinner } from '../../components/Spinner/Spinner'
import useAuth from '../../hooks/useAuth';

export const ChangeClassPage = () => {
  const { user } = useAuth();
  if (!user) {
    return <Spinner />
  }

  return (
    <ChangeClass />
  )
}
