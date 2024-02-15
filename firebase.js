import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: 'AIzaSyDjGYXKybe_l2FK-TU9LVgWAlIXCSUnhzs',
  authDomain: 'ignite-app-52bca.firebaseapp.com',
  projectId: 'ignite-app-52bca',
  storageBucket: 'ignite-app-52bca.appspot.com',
  messagingSenderId: '594837206570',
  appId: '1:594837206570:web:9fe016ed3428ffa7723553',
  measurementId: 'G-GSJ2WE6C8F',
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
