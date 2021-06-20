let set = false;
export default function initCor() {
  let cache: any = {};

  if (set) return;
  setInterval(() => {
    set = true;
    try {
      if (!window.Cor) window.Cor = {}
      const keys = Object.keys(window.Cor);
      const changedKeys = [];

      for (let key of keys) {
        if (JSON.stringify(cache[key]) !== JSON.stringify(window.Cor?.[key])) {
          changedKeys.push(key);
          cache[key] = window.Cor[key];
        }
      }
      const corEvent = new CustomEvent('Cor', { detail: changedKeys });
      window.dispatchEvent(corEvent);

      // window.postMessage({ changedKeys }, '*');
    } catch (error) {
      console.log('error @initCor Cor listener', error);
    }
  }, 120);
}