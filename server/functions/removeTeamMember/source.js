exports = async function(email) {
  const collection = context.services.get("mongodb-atlas").db("tracker").collection("User");
  const filter = {name: email};
  const memberToRemove = await collection.findOne(filter);
  if (memberToRemove == null) {
    return {error: `User ${email} not found`};
  }
  const callingUser = context.user;
  
  if (memberToRemove._id === callingUser.id) {
    return {error: "You cannot remove yourself from your team"};
  }
  
  if (!memberToRemove.readable_partitions.includes(callingUser.id)) {
    return {error: `User ${email} is not a member of your team`};
  }
  
  try {
    return await collection.updateOne(
      filter,
      {$pull: {
          readable_partitions: callingUser.id,
          member_of: {
              partition: callingUser.id,
          }
      }});
  } catch (error) {
    return {error: error.toString()};
  }
};
