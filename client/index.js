import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './react/App';
import styles from './main.scss';
import StarWarsStore from './stores/StarWars.store';
import { Provider } from './stores/StoreProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));

const starWarsStore = StarWarsStore.create();

root.render(
  <Provider value={starWarsStore}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
