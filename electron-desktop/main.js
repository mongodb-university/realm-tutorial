const { app, BrowserWindow, ipcMain } = require("electron");
const Realm = require("realm");
const ObjectId = require('bson').ObjectId;
console.log(`Process: ${process.pid}`);

function createWindow() {
  let mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile("index.html");
}

var DogSchema = {
  name: 'Dog',
  properties: {
    _id: 'objectId',
    breed: 'string?',
    name: 'string'
  },
  primaryKey: '_id',
};

var PersonSchema = {
  name: 'Person',
  properties: {
    _id: 'objectId',
    age: 'int',
    dogs: {
      type: 'list',
      objectType: 'Dog'
    },
    firstName: 'string',
    lastName: 'string'
  },
  primaryKey: '_id',
};

let realmApp;

app.whenReady().then(async () => {
  realmApp = new Realm.App({ id: "application-0-bhmjd" });

//   let credentials = Realm.Credentials.emailPassword("joe.jasper@example.com", "passw0rd");
  let credentials = Realm.Credentials.anonymous();
  let user = await realmApp.logIn(credentials);

  const config = {
    schema: [DogSchema, PersonSchema],
    path: "my.realm",
    sync: {
      user: user,
      partitionValue: `user=${user.id}`
    }
  };

  // open a synced realm
  const realm = await Realm.open(config);

  // Get all Persons in the realm
  const persons = realm.objects("Person");
  console.log(`Main: Number of Person objects: ${persons.length}`);

  console.log(`Creating new Person from main`);
  realm.write(() => {
    john = realm.create("Person", { "_id": new ObjectId(), firstName: "John2", lastName: "Smith", age: 25 });
  });

  console.log(`Main: Number of Person objects after create: ${persons.length}`);

  createWindow();
});
