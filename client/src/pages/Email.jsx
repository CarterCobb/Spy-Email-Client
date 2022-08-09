import React from "react";
import { fallback } from "../components/SuspenseUI";
import useEmails from "../hooks/useEmails";

const Home = () => {
  const emails = useEmails();

  if (emails.loading) return fallback;
  if (emails.error) return <pre>{JSON.stringify(emails.error, null, 2)}</pre>;

  return (
    <div>
      <h1>Email Page</h1>
      <p>
        Emails:
        <br />
      </p>
      <pre>{JSON.stringify(emails.list, null, 2)}</pre>
    </div>
  );
};

export default Home;
