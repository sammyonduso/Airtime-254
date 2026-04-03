import * as admin from 'firebase-admin';
import firebaseConfig from '../firebase-applet-config.json';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      projectId: firebaseConfig.projectId,
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const adminDb = admin.firestore();
// If the default database is not the one we want, we might need to specify it, but admin SDK usually uses default.
// Let's use the specific database ID if provided.
export const getAdminDb = () => {
  if (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)') {
    return admin.firestore().database(firebaseConfig.firestoreDatabaseId);
  }
  return admin.firestore();
};
