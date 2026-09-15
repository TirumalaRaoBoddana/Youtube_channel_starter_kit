// Theme handled with a tiny inline script (no dependency, no flash).
export function ThemeScript() {
  const script = `(function(){try{var t=localStorage.getItem('cf-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
