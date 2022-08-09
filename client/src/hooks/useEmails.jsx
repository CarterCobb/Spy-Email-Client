import { useState, useEffect } from "react";
import axios from "axios";

/**
 * Get emails from the API safely.
 * @returns {{list: Array<Object>, error: Error, loading: Boolean}}
 */
const useEmails = () => {
  const [emails, setEmails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    var mounted = true;
    if (mounted) {
      setLoading(true);
      axios
        .get("/v1/receive")
        .then(({ data }) => setEmails(data))
        .catch(setError)
        .finally(() => setLoading(false));
    }
    return () => (mounted = false);
  }, []);

  return {
    list: emails || [],
    error,
    loading,
  };
};

export default useEmails;
