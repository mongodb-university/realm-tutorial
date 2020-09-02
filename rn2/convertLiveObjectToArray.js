// convertLiveObjectToArray takes a live object (a realm object) and
// converts it to an array,

// e.g: {"0": { "_id": [ObjectId], "name": "go jogging"},
//  "1": { "_id": [ObjectId], "name": "grocery shopping"}}

// is converted to: [{ "_id": [ObjectId], "name": "go jogging"},{ "_id":
// [ObjectId], "name": "grocery shopping"}]

export const convertLiveObjectToArray = (liveObject) => {
  const arr = [];
  for (item of liveObject) {
    arr.push(item);
  }
  return arr;
};
