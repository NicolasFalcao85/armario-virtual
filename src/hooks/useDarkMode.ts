import { useEffect, useState } from 'react';

const KEY = 'armario-virtual:tema';

type Tema = 'claro' | 'oscuro';

function temaInicial(): Tema {
  const guardado = localStorage.getItem(KEY);
  if (guardado === 'claro' || guardado === 'oscuro') return guardado;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro';
}

export function useDarkMode() {
  const [tema, setTema] = useState<Tema>(temaInicial);

  useEffect(() => {
    document.documentElement.setAttribute('data-tema', tema);
    localStorage.setItem(KEY, tema);
  }, [tema]);

  const toggle = () => setTema((t) => (t === 'claro' ? 'oscuro' : 'claro'));

  return { tema, toggle };
}
