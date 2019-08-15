import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

export default function initMockService() {
  const mock = new MockAdapter(axios);
  const modulesContext = require.context('./modules/', false, /\.ts$/);
  modulesContext.keys().forEach((key) => {
    if (modulesContext(key).default) {
      modulesContext(key).default(mock);
    }
  });
}
