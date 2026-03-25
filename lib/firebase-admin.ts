import admin from 'firebase-admin'

// Deferred init — runs on first request, NOT at module load time.
// This prevents `next build` from crashing when Firebase env vars
// are absent from the Docker build context.
function getAdminAuth(): admin.auth.Auth {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    })
  }
  return admin.auth()
}

export const adminAuth = {
  verifyIdToken: (token: string, checkRevoked?: boolean) =>
    getAdminAuth().verifyIdToken(token, checkRevoked),
  getUser: (uid: string) => getAdminAuth().getUser(uid),
}
