import { useState, useCallback } from 'react';
import { handleApiError } from '../services/apiUtils';

export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo);
      throw errorInfo;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  return { data, loading, error, execute };
};

export const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (apiFunction, ...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      return result;
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo);
      throw errorInfo;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, callApi };
};