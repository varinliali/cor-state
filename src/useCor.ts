import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    Cor: any;
  }
}
type ChangeKey = string
type TCorProps = {
  keys: ChangeKey[];
  onChange?: (keys: ChangeKey[]) => void;
  defaultValues: any;
}

export default function useCor({ keys = [], onChange, defaultValues }: TCorProps) {
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

      triggerRerender((prev) => !prev);
    }

    window.addEventListener('Cor', ({ detail }: any) => {
      if (!detail) return;

      if (keys.some((key) => detail.includes(key))) {
        triggerRerender((prev) => !prev);
        onChange && onChange(detail);
      }
    });
  }, []);


  return { flag };
}