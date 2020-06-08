import * as React from "react";
import BSON from "bson";
import { TaskStatus, User, GetUserQuery } from "../types";
import { TaskActions } from "../hooks/useTasks";
import { useGetUserLazyQuery } from "../graphql-operations";

export type DraftTask = {
  status: TaskStatus;
  name: string;
  assignee?: string;
};

export interface DraftTaskActions {
  createDraft: (draft: DraftTask) => void;
  updateDraft: (draft: DraftTask) => void;
  deleteDraft: () => void;
  saveDraft: () => Promise<void>;
}

export default function useDraftTask(
  taskActions: TaskActions
): [DraftTask | null, DraftTaskActions] {
  const [draft, setDraft] = React.useState<DraftTask | null>(null);
  const draftAssignee = useDraftAssignee(draft);

  const actions: DraftTaskActions = {
    createDraft: (draft: DraftTask) => {
      if (draft) {
        setDraft(draft);
      }
    },
    updateDraft: (updatedDraft: DraftTask) => {
      setDraft(updatedDraft);
    },
    deleteDraft: () => {
      setDraft(null);
    },
    saveDraft: async () => {
      if (draft) {
        await taskActions.addTask({
          ...draft,
          _id: new BSON.ObjectId(),
          assignee: draftAssignee ?? undefined,
          _partition: "My Project",
        });
        setDraft(null);
      }
    },
  };
  return [draft, actions];
}

function useDraftAssignee(draft: DraftTask | null): User | undefined {
  const [draftAssignee, setDraftAssignee] = React.useState<User | undefined>(
    undefined
  );
  const [getUserQuery] = useGetUserLazyQuery({
    onCompleted: ({ user }: GetUserQuery) => {
      console.log("user", user);
      if (user) {
        setDraftAssignee(user);
      }
    },
  });

  React.useEffect(() => {
    if (draft?.assignee) {
      getUserQuery({ variables: { userId: draft.assignee } });
    }
  }, [draft, getUserQuery]);

  return draftAssignee;
}
