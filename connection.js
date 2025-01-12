
var admin = require("firebase-admin");

var serviceAccount = require("./new_service_file.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore()

module.exports = {db}