exports = async function() {
  const cluster = context.services.get("mongodb-atlas");
  const collection = cluster.db("tracker").collection("User");
  const caller = context.user;
  const filter = {
    $or: [
      {"readable_partitions": caller.id}, // has my id as a readable partition
      {"writeable_partitions": caller.id}, // has my id as a writeable partition
    ], // and...
    _id: {$ne: caller.id} // ...is not me
  };
  const projection = {
    _id: 1,
    name: 1
  };
  return await collection.find(filter, projection)
    .sort({_id: 1})
    .toArray();
};
