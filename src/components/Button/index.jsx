import React from "react";
import { Link } from "react-router-dom";

const CustomButton = ({
  to,
  primary = false,
  outline = false,
  href,
  onClick,
  children,
  ...passProps
}) => {
  let Comp = "button";
  const props = {
    onClick,
    ...passProps,
  };
  if (disabled) {
    delete props.onClick;
  }
  if (to) {
    props.to = to;
    Comp = Link;
  } else if (href) {
    props.href = href;
    Comp = "a";
  }

  const classes = {
    primary,
    outline,
  };
  return (
    <Comp className={classes} {...props}>
      <span>{children}</span>
    </Comp>
  );
};

export default CustomButton;
