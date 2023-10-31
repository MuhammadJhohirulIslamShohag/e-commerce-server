import firebaseAdmin from "firebase-admin";
import serviceAccount from "../config/firebaseAccountKey.json";

const serviceAccountObject = JSON.parse(JSON.stringify(serviceAccount));

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccountObject)
});

export default firebaseAdmin;
