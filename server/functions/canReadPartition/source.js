exports = async function(partitionValue) {
  try {
    const callingUser = context.user;

    // A user can always read their own user object.
    if (partitionValue === `user=${callingUser.id}`) {
      return true;
    }
  
    // The user custom data contains a canReadPartitions array that is managed
    // by a system function.
    const {canReadPartitions} = callingUser.custom_data;
    
    // If the user's canReadPartitions array contains the partition, they may read the partition
    return canReadPartitions && canReadPartitions.includes(partitionValue);

  } catch (error) {
    console.error(error);
    return false;
  }
};
