# Task Tracker Tutorial

## Answered Questions
 
- Do we need to emphasize MDBRealm first in tutorials or can we make it a later step?
  - Drew: We should emphasize Realm from the start
  - Drew: It's okay to emphasize Realm Schema (vs ROM + Dev Mode) for all tutorials
  - Drew: Dev mode as an aside, e.g. "if you already have a Realm model, check out dev mode..."
- What is the status of embedded objects in Realm DB?
  - Drew: May be ready soon, should be ready by release
- Sample data generation scripts/functions
  - Drew: Probably want to avoid these, may conflict with the upcoming Template Apps project
 
 ## Open Questions
 
- Do sync rules allow `%function` in Apply When expressions?
- Do sync rules allow `%%root` in Apply When expressions? (probably not)

## Frontend Tutorial Flow

0. Tracker App Introduction
1. Data Model Explanation

Web:

2. Create a Realm App
3. Define Realm Schemas
4. Enable Auth
5. Define Rules
6. Use create-react-app to setup
7. Add auth
8. Add GraphQL
9. Add "sync" with subscriptions

Mobile:

2. Set up project in XCode/Android Studio
3. Add dependencies w/ CocoaPods/Gradle
4. Explain how the pre-made UI is wired up
5. Define RealmObject Models
6. Hook up UI to models
7. Create a Realm App
   - Enable Auth 
   - Enable and Configure Sync
   - Enable Dev Mode
8. Add auth to client
9. Delete local realm and open a synced realm
10. Back to the app
   - Define rules
   - Turn off dev mode

## Application Flow

1. Enter app and see a list of `Project`s (or create a new one)
2. The next view shows the project detail, i.e. a list of tasks
  - Each task is a line item that shows the task name and its status
  - Assigned tasks show the avatar of the assignee
  - List should be sorted by status
  - action: add a member
3. Tasks show a detail modal/screen with actions on click/tap
  - action: change the task status
  - action: change the task assignee

## PartitionKey

- Project ID

## List

function getUsersForProject() {
  
}

```ts
type ProjectBoard = {
  _id: ProjectID;
  _partition: ProjectID;
  name: String;
  // isPrivate: Boolean;
  users: User[]
}
type ProjectID = ObjectID;
```

## Task

```ts
type Task = {
  _id: ObjectID;
  _partition: ProjectID;
  assignee: User | null;
  status: TaskStatus;
  description: String;
  watchers: UserID[];
}

enum TaskStatus {
  Open,
  InProgress,
  Complete,
}
```

## User

- Read-only on clients
- Must use a function to update

```ts
type UserID = String
type User = {
  _id: ObjectID;
  _partition: UserID;
  id: UserID;
  name: String;
  image: String;
  projects: String[];
}
```

## Roles

### Tasks

- IsInMyProject (ReadWrite)
{
  "%%user.projects": "%%partition"
}
- IsPublic (ReadOnly)
{ "%%true": true }
<!-- {
  "%%false": {
    "%function": {
      name: "IsPrivateProject",
      arguments: ["%%partition"]
    }
  }
} -->

### Users

- IsThisUser
{
  "%%user.id": "%%partition"
}


