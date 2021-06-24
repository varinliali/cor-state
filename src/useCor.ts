import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    Cor: any;
  }
}
type ChangeKey = string;
type TCorProps = {
  keys: ChangeKey[];
  onChange?: (keys: ChangeKey[]) => void;
  defaultValues?: any;
};

export default function useCor({
  keys = [],
  onChange,
  defaultValues,
}: TCorProps) {
  const [flag, triggerRerender] = useState(false);

  const set = useRef(false);
  useEffect(() => {
    if (set.current) return;
    set.current = true;

    if (!window.Cor) window.Cor = {};
    if (defaultValues) {
      for (const key of Object.keys(defaultValues)) {
        if (!window.Cor?.[key]) {
          window.Cor[key] = defaultValues[key];
        }
      }
      triggerRerender(prev => !prev);
    }

    window.addEventListener('Cor', onMessageReceived);
    return () => window.removeEventListener('Cor', onMessageReceived);
  }, []);

  function onMessageReceived({ detail }: any) {
    if (!detail || detail.length === 0) return;

    if (checkIfIncludes(keys, detail)) {
      triggerRerender(prev => !prev);
      onChange && onChange(detail);
    }
  }

  return { flag, c };
}

function c(action: string | any, fetcher?: any, skip?: boolean) {
  if (typeof action === 'string') {
    const data = getFromWindow(action);
    if (data !== undefined) return data;
    else if (!fetcher) return;
    else {
      if (skip) return;
      setToWindow({ [action]: 'loading' });
      fetcher()
        .then((res: any) => res.json())
        .then((data: any) => setToWindow({ [action]: data }));
      return 'loading';
    }
  } else {
    setToWindow(action);
  }
}

function getFromWindow(action: string) {
  return window.Cor[action];
}

function setToWindow(action: any) {
  try {
    const keys = Object.keys(action);
    if (!keys || keys.length === 0) return;
    for (const key of keys) {
      window.Cor[key] = action[key];
    }

    const corEvent = new CustomEvent('Cor', { detail: keys });
    window.dispatchEvent(corEvent);
  } catch (error) {
    console.log('error setting key', { action, error });
  }
}
function checkIfIncludes(keys: string[], detail: string[]) {
  return keys.some(key => checkDetailIncludes(detail, key));
}
function checkDetailIncludes(detail: string[], key: string) {
  const splitWildCard = key.split('*');
  const hasWildCard = splitWildCard?.length > 0;
  return hasWildCard
    ? detail.some(key => key.startsWith(splitWildCard[0]))
    : detail.includes(key);
}
