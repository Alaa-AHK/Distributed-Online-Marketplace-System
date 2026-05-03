export const getRoomId = (userA, userB) => {
  return [userA, userB].sort().join("_");
};