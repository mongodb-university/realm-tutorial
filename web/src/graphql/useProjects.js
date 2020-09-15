// import { useQuery } from "@apollo/client";

import { useRealmApp } from "../RealmApp";

const useProjects = () => {
  const { app } = useRealmApp();
  if(!app.currentUser) {
    throw new Error("Cannot list projects if there is no logged in user.")
  }
  const projects = app.currentUser.customData.memberOf;
  return projects
}
export default useProjects
