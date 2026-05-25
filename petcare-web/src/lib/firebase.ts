import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyCD_9GdsTS3tWweOAfGOUnfY2w5x5x2Z0g',
	authDomain: 'petcare-saas-3d821.firebaseapp.com',
	projectId: 'petcare-saas-3d821',
	storageBucket: 'petcare-saas-3d821.firebasestorage.app',
	messagingSenderId: '200870279599',
	appId: '1:200870279599:web:4cf0cbb270966d5c4d975a',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
