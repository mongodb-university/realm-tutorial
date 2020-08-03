exports = async function(email) {
  const collection = context.services.get("mongodb-atlas").db("tracker").collection("User");
  const filter = {name: email};
  const newMember = await collection.findOne(filter);
  if (newMember == null) {
    return {error: `User ${email} not found`};
  }
  const callingUser = context.user;
  
  if (newMember._id === callingUser.id) {
    return {error: "You are already on your own team, of course!"};
  }
  
  if (newMember.readable_partitions.includes(callingUser.id)) {
    return {error: `User ${email} is already a member of your team`};
  }
  
  try {
    return await collection.updateOne(
      filter, 
      {$addToSet: {
          readable_partitions: callingUser.id,
          member_of: {
            name: callingUser.custom_data.name,
            partition: callingUser.id,
          }
      }});
  } catch (error) {
    return {error: error.toString()};
  }
};
