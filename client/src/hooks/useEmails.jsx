import { useState } from "react";
import axios from "axios";

/**
 * Get emails from the API safely.
 * @returns {{list: Array<Object>, error: Error, loading: Boolean, request: Function}}
 */
const useEmails = () => {
  const [emails, setEmails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Request the full email objects
   */
  const request = () => {
    setLoading(true);
    axios
      .get("/v1/receive")
      .then(({ data }) => setEmails(data))
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return {
    list: emails || [],
    error,
    loading,
    request,
  };
};

export default useEmails;
