import { useState, useEffect } from 'react';
import axios from 'axios';

const useGET = (url) => {
  const [res, setRes] = useState('');
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  const getData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}${url}`
      );
      setRes(response.data);
      setIsPending(false);
    } catch (err) {
      setError(err);
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (url) {
      setIsPending(true);
      getData();
    }
  }, [url]);

  return [res, isPending, error, getData];
};

export default useGET;
