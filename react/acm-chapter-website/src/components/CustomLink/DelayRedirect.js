import * as React from "react";
import { useEffect, useState } from "react";
import { Redirect } from "react-router";

const DelayRedirect = ({ delay, ...rest }) => {
  const [timeToRedirect, setTimeToRedirect] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimeToRedirect(true);
    }, delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return timeToRedirect ? <Redirect {...rest} /> : null;
};

export default DelayRedirect;
