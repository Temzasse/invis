import { toast } from 'react-hot-toast';
import { produce } from 'immer';

import { api } from '~/utils/api';
import { useStableCallback } from '~/utils/common';
import { isOptimisticId } from '~/utils/mutations';

export function useUpdateShoplistItem() {
  const utils = api.useUtils();

  const mutation = api.shoplist.updateShoplistItem.useMutation({
    onMutate: async (updates) => {
      await utils.shoplist.getCurrentShoplist.cancel();

      const shoplist = utils.shoplist.getCurrentShoplist.getData();
      if (!shoplist) return;

      const optimisticShoplist = produce(shoplist, (draft) => {
        const item = draft.items.find((i) => i.id === updates.id);

        if (item && updates.checked !== undefined) {
          item.checked = updates.checked;
        }
        if (item && updates.name !== undefined) {
          item.name = updates.name;
        }
      });

      utils.shoplist.getCurrentShoplist.setData(undefined, optimisticShoplist);

      return { shoplist, updates };
    },
    onError: (error, updates, context) => {
      toast.error('Jotain meni pieleen');
      utils.shoplist.getCurrentShoplist.setData(undefined, context?.shoplist);
    },
    onSettled: () => {
      utils.shoplist.getCurrentShoplist.invalidate();
    },
  });

  const updateName = useStableCallback((id: string, name: string) => {
    if (isOptimisticId(id)) return;
    mutation.mutate({ id, name });
  });

  const updateChecked = useStableCallback((id: string, checked: boolean) => {
    if (isOptimisticId(id)) return;
    mutation.mutate({ id, checked });
  });

  return { updateName, updateChecked };
}

export function useAddShoplistItem() {
  const utils = api.useUtils();

  const mutation = api.shoplist.addShoplistItem.useMutation({
    onMutate: async ({ name, shoplistId }) => {
      await utils.shoplist.getCurrentShoplist.cancel();

      const shoplist = utils.shoplist.getCurrentShoplist.getData();
      if (!shoplist) return;

      const optimisticShoplist = produce(shoplist, (draft) => {
        draft.items.push({
          id: `optimistic-${Date.now()}`,
          name,
          checked: false,
          shoplistId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      utils.shoplist.getCurrentShoplist.setData(undefined, optimisticShoplist);

      return { shoplist, name };
    },
    onError: (error, name, context) => {
      toast.error('Jotain meni pieleen');
      utils.shoplist.getCurrentShoplist.setData(undefined, context?.shoplist);
    },
    onSettled: () => {
      utils.shoplist.getCurrentShoplist.invalidate();
    },
  });

  const addItem = useStableCallback((shoplistId: string) => {
    mutation.mutate({ name: '', shoplistId });
  });

  return { addItem };
}

export function useRemoveShoplistItem() {
  const utils = api.useUtils();

  const mutation = api.shoplist.removeShoplistItem.useMutation({
    onMutate: async ({ id }) => {
      await utils.shoplist.getCurrentShoplist.cancel();

      const shoplist = utils.shoplist.getCurrentShoplist.getData();
      if (!shoplist) return;

      const optimisticShoplist = {
        ...shoplist,
        items: shoplist.items.filter((i) => i.id !== id),
      };

      utils.shoplist.getCurrentShoplist.setData(undefined, optimisticShoplist);

      return { shoplist, name };
    },
    onError: (error, name, context) => {
      toast.error('Jotain meni pieleen');
      utils.shoplist.getCurrentShoplist.setData(undefined, context?.shoplist);
    },
    onSettled: () => {
      utils.shoplist.getCurrentShoplist.invalidate();
    },
  });

  const removeItem = useStableCallback((id: string) => {
    if (isOptimisticId(id)) return;
    mutation.mutate({ id });
  });

  return { removeItem };
}
