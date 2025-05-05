import { useEffect, useState } from 'react';

export function useQuery<T>(
  key: unknown[],
  queryFn: () => Promise<T>,
  options: { enabled?: boolean } = {}
) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (options.enabled === false) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const result = await queryFn();
        setData(result);
        setError(undefined);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [...key, options.enabled]);

  return { data, error, loading };
}