const React = require("react");
const { createContext, useEffect, useState } = require("react");
const netlifyIdentity = require("netlify-identity-widget");

const IdentityContext = createContext({});

const Provider = props => {
  const [user, setUser] = useState();

  useEffect(() => {
    netlifyIdentity.init({});
  }, []);

  netlifyIdentity.on("login", user => {
    netlifyIdentity.close();
    setUser(user);
  });
  netlifyIdentity.on("logout", _ => {
    netlifyIdentity.close();
    setUser();
  });

  return (
    <IdentityContext.Provider value={{ identity: netlifyIdentity, user }}>
      {props.children}
    </IdentityContext.Provider>
  );
};

exports.Provider = Provider;
exports.IdentityContext = IdentityContext;
