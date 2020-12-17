const Realm = require("realm");
const ObjectId = require("bson").ObjectId;

const DogSchema = {
  name: 'Dog',
  properties: {
    _id: 'objectId',
    breed: 'string?',
    name: 'string'
  },
  primaryKey: '_id',
};

const PersonSchema = {
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

let realm;
let petCareProfessional;

async function run() {
    const realmApp = new Realm.App({ id: "application-0-bhmjd" });
    let credentials = Realm.Credentials.anonymous();
    // let credentials = Realm.Credentials.emailPassword("joe.jasper@example.com", "passw0rd");
    await realmApp.logIn(credentials);
  
    const config = {
      path: "my.realm",
      schema: [DogSchema, PersonSchema],
      sync: true,
    };
  
    realm = new Realm(config);

    const persons = realm.objects("Person");

    realm.write(() => {
        console.log("renderer: Creating new Person object");
        petCareProfessional = realm.create("Person", { "_id": new ObjectId(), firstName: "Jenny", lastName: "Smith", age: 30 });
        console.log("renderer: Added a new person in the Realm.");
    });
    

    const dogSubmitButton = document.getElementById("dog-submit");
    dogSubmitButton.addEventListener("click", () => {
        console.log('attempting to create dog ...')
        realm.write(() => {
            const dog = realm.create("Dog", { "_id": new ObjectId(), name: document.getElementById("dog-text-input").value });
            petCareProfessional.dogs.push(dog);
        })


        console.log("persons :\t", persons)
    });



}

run().catch((err) => console.log(`An error occurred: ${err}`));