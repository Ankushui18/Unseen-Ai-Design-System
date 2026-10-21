import { Theme } from './settings/types';
import { DesignFoundations } from './components/generated/DesignFoundations';

let theme: Theme = 'light';

function App() {
  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  return <DesignFoundations />;
}

export default App;
