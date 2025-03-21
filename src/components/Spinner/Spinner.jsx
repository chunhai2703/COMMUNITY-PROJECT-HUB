import React from 'react'
import classes from './Spinner.module.css'

export const Spinner = () => {
  return (
    <div className={classes.backdrop}>
      <div className={classes.container}>
        <div className={classes.loader}></div>
        <h2 className={classes.text}>Vui lòng đợi trong giây lát ...</h2>
      </div>
    </div>

  )
}
