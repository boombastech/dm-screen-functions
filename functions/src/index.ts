import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


export const onCreateUser = functions.auth.user()
    .onCreate(user => admin.firestore().collection('/users').doc(user.uid).set({ displayName: user.displayName, id: user.uid }));

export const onDeleteMapDeleteAllMarkers = functions.firestore.document('/users/{uid}/maps/{mapId}')
    .onDelete((snapshot, context) => admin.firestore().collection(`/users/${context.auth!.uid}/markers`)
        .where('mapId', '==', snapshot.data()!.id)
        .get()
        .then(results => results.forEach(result => result.ref.delete())));
