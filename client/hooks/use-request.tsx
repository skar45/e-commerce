import { useState } from 'react';

const useRequest = (
  url: string,
  method: string,
  body,
  onSuccess?: (T) => void
) => {
  const [error, setError] = useState(null);

  const doRequest = async () => {
    try {
      const response = await fetch(url, { method, body });
      if (onSuccess) {
        onSuccess(response.body);
      }
    } catch (err) {
      setError(err);
    }
  };
  return { doRequest, error };
};

export default useRequest;
