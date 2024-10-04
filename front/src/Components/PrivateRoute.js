import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({
  component: Component,
  isAuthenticated,
  hasRequiredRole,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated && hasRequiredRole ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

export default PrivateRoute;
