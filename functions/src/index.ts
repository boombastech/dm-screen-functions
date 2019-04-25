import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp();


export const onCreateUser = functions.auth.user()
    .onCreate(user => admin.firestore().collection('/users').doc(user.uid).set({ displayName: user.displayName, id: user.uid }));

export const onDeleteMapDeleteAllMarkers = functions.firestore.document('/users/{uid}/maps/{mapId}')
    .onDelete((snapshot, context) => {
        console.log(`Deleting markers for map id: ${snapshot.data()!.id}`);
        return admin.firestore().collection(`/users/${context.params.uid}/markers`)
            .where('mapId', '==', snapshot.data()!.id).get()
            .then(results => {
                console.log(`Markers for map: ${results.size}`);
                results.forEach(result => result.ref.delete());
            });
    });
