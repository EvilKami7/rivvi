import { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { checksApi } from '../services/checks-api.service';
import type { Check } from '../types/check.type';

const MAX_CHECKS = 20;

export function useChecks() {
  const [checks, setChecks] = useState<Check[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const updateCheck = useCallback((check: Check) => {
    setChecks((current) =>
      [check, ...current.filter((item) => item.id !== check.id)].slice(0, MAX_CHECKS),
    );
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    checksApi
      .list({ signal: controller.signal })
      .then(setChecks)
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') {
          return;
        }

        setError(
          requestError instanceof Error ? requestError.message : 'Не удалось загрузить историю',
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    const socket = io();
    socket.on('check:updated', updateCheck);

    return () => {
      controller.abort();
      socket.close();
    };
  }, [updateCheck]);

  return { checks, error, loading, setError, updateCheck };
}
