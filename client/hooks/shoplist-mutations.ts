import { toast } from 'react-hot-toast';
import { produce } from 'immer';

import { api } from '~/utils/api';
import { useStableCallback } from '~/utils/common';
import { isOptimisticId } from '~/utils/mutations';
import { config } from '../config';

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
    mutation.mutate({ id, name, clientId: config.CLIENT_ID });
  });

  const updateChecked = useStableCallback((id: string, checked: boolean) => {
    if (isOptimisticId(id)) return;
    mutation.mutate({ id, checked, clientId: config.CLIENT_ID });
  });

  return { updateName, updateChecked };
}

export function useAddShoplistItem() {
  const utils = api.useUtils();

  const mutation = api.shoplist.addShoplistItem.useMutation({
    onError: () => {
      toast.error('Jotain meni pieleen');
    },
    onSettled: (data) => {
      if (data) {
        const shoplist = utils.shoplist.getCurrentShoplist.getData();
        if (!shoplist) return;

        utils.shoplist.getCurrentShoplist.setData(
          undefined,
          produce(shoplist, (draft) => {
            draft.items.push(data);
          })
        );

        // Focus the new item after it hase been rendered (and animated)
        setTimeout(() => {
          const itemEl = document.querySelector(
            `.shoplist-item-${data.id} .editable-text-button`
          ) as HTMLButtonElement | null;

          itemEl?.click();
        }, 500);
      }

      utils.shoplist.getCurrentShoplist.invalidate();
    },
  });

  const addItem = useStableCallback((shoplistId: string) => {
    mutation.mutate({ name: '', shoplistId, clientId: config.CLIENT_ID });
  });

  return { addItem, isAdding: mutation.isLoading };
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
    mutation.mutate({ id, clientId: config.CLIENT_ID });
  });

  return { removeItem };
}
