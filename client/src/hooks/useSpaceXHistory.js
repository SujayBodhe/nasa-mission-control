import { useCallback, useEffect, useState } from 'react';
import { httpGetSpaceXHistory } from './requests';

function useSpaceXHistory() {
  const [spaceXHistory, setSpaceXHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getSpaceXHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const history = await httpGetSpaceXHistory();
      setSpaceXHistory(history);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getSpaceXHistory();
  }, [getSpaceXHistory]);

  return { spaceXHistory, isLoading, error };
}

export default useSpaceXHistory;