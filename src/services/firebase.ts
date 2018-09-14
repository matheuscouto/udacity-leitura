import { auth, initializeApp } from 'firebase';
import { Observable } from 'rxjs';

const config = {
	apiKey: "AIzaSyAeTaUMJuc-bkiHWPhiG7NmdeLn7JHBAEM",
	authDomain: "udacity-leitura.firebaseapp.com",
	databaseURL: "https://udacity-leitura.firebaseio.com",
	projectId: "udacity-leitura",
	storageBucket: "udacity-leitura.appspot.com",
	messagingSenderId: "844422370440"
};

initializeApp(config);

export const SDKAuthStateObservable: Observable<{ uid: string } | null> = new Observable((observer) => {
	return auth().onAuthStateChanged(
		(user) => {
			observer.next(user ? { uid: user.uid } : null);
		},
		observer.error,
		observer.complete,
	);
});

export const SDKCreateUserWithEmailAndPassword = (email:string, password:string) => auth().createUserWithEmailAndPassword(email, password);

export const SDKSignInWithEmailAndPassword = (email:string, password:string) => auth().signInWithEmailAndPassword(email, password);

export const SDKSignOut = () => auth().signOut();