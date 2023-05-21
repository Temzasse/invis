import { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import { type RouterOutputs, api } from '~utils/api';
import { type ItemStatus } from '~components/project/ItemStatus';

type Categories = RouterOutputs['category']['getCategoriesWithItems'];
type Statuses = Record<string, ItemStatus>;

export function useItemStatusMutations(categories: Categories) {
  const currentStatuses = useMemo(() => getStatusMap(categories), [categories]);
  const [editedStatuses, setEditedStatuses] = useState<Statuses>({});
  const updateItemStatuses = api.project.updateItemStatuses.useMutation();
  const updateItemStatus = api.project.updateItemStatus.useMutation();
  const apiUtils = api.useContext();
  const isLoading = updateItemStatus.isLoading || updateItemStatuses.isLoading;
  const isError = updateItemStatus.isError || updateItemStatuses.isError;

  // Reset the edited statuses for changed items after mutations have completed.
  function resetEditedStatuses() {
    setEditedStatuses({});
  }

  // In multi-edit mode we don't want to send the request until the user
  // presses the "Done" icon-button.
  function onMultiEditChange(id: string, status: ItemStatus) {
    setEditedStatuses((prev) => ({ ...prev, [id]: status }));
  }

  function onMultiEditingEnd() {
    const changedItems = Object.entries(editedStatuses)
      .filter(([id]) => currentStatuses[id] !== editedStatuses[id])
      .map(([id, status]) => ({ id, status }));

    if (changedItems.length > 0) {
      updateItemStatuses.mutate(
        { items: changedItems },
        {
          onSuccess: async () => {
            await apiUtils.category.getCategoriesWithItems.invalidate();
            resetEditedStatuses();
          },
          onError: () => {
            toast.error('Jotain meni pieleen');
            resetEditedStatuses();
          },
        }
      );
    }
  }

  function onSingleEditChange(id: string, status: ItemStatus) {
    if (status !== currentStatuses[id]) {
      setEditedStatuses((prev) => ({ ...prev, [id]: status }));

      // When editing a single item we want to commit the change immediately.
      updateItemStatus.mutate(
        { id, status },
        {
          onSuccess: async () => {
            await apiUtils.category.getCategoriesWithItems.invalidate();
            resetEditedStatuses();
          },
          onError: () => {
            toast.error('Jotain meni pieleen');
            resetEditedStatuses();
          },
        }
      );
    }
  }

  return {
    onMultiEditChange,
    onMultiEditingEnd,
    onSingleEditChange,
    editedStatuses,
    isLoading,
    isError,
  };
}

function getStatusMap(categories: Categories) {
  const statuses: Record<string, ItemStatus> = {};

  categories.forEach(({ items }) => {
    items.forEach((item) => {
      statuses[item.id] = item.status as ItemStatus;
    });
  });

  return statuses;
}
