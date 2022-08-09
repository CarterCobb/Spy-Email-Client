import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import GeneralAPI from "../api/general";
import Matrix from "../components/MatrixCanvas";

const Home = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    if (await GeneralAPI.login({ username, password })) navigate("/admin");
  };

  return (
    <Fragment>
      <Matrix />
      <div className="home-container">
        <form onSubmit={login} className="login-form">
          <label className="login-label">Username:</label>
          <input
            onChange={({ target: { value } }) =>
              setUsername(value.toLowerCase())
            }
            value={username}
            className="login-field"
          />
          <label className="login-label">Password:</label>
          <input
            onChange={({ target: { value } }) => setPassword(value)}
            value={new Array(password.length).fill("*").join("")}
            className="login-field"
          />
          <input type="submit" value="Enter Portal" className="login-submit"/>
        </form>
      </div>
    </Fragment>
  );
};

export default Home;
