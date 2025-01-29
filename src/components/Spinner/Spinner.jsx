import React from 'react'
import classes from './Spinner.module.css'

export const Spinner = () => {
  return (
    <div className={classes.container}>
      <div className={classes.loader}></div>
      <h3>Please wait for a moment...</h3>
    </div>



  )
}
