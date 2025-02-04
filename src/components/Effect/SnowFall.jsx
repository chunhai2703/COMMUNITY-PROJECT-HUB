import React, { useEffect, useState } from "react";
import classes from "./SnowFall.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(classes);

const SnowFall = () => {
  const [flakes, setFlakes] = useState([]);

  useEffect(() => {
    const newFlakes = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + "vw",
      right: Math.random() * 100 + "vw",
      delay: Math.random() * 5 + "s",
      size: Math.random() * 10 + 5 + "px",
    }));
    setFlakes(newFlakes);
  }, []);

  return (
    <div>
      {flakes.map((flake) => (
        <span
          key={flake.id}
          className={cx("snowflake")}
          style={{
            left: flake.left,
            animationDuration: flake.delay,
            fontSize: flake.size,
          }}
        >
          ❄
        </span>
      ))}
    </div>
  );
};

export default SnowFall;
