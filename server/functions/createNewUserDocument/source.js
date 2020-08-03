exports = async function createNewUserDocument({user}) {
  const cluster = context.services.get("mongodb-atlas");
  const users = cluster.db("tracker").collection("User");
  return users.insertOne({
    _id: user.id,
    _partition: user.id,
    name: user.data.email,
    readable_partitions: [],
    writeable_partitions: [user.id],
  });
};
