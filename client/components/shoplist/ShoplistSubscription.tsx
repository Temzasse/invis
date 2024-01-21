import { produce } from 'immer';
import { toast } from 'react-hot-toast';

import { config } from '~/client/config';
import { api } from '~/utils/api';

export function ShoplistSubscription({ shoplistId }: { shoplistId: string }) {
  const utils = api.useUtils();

  api.shoplist.onChange.useSubscription(
    { shoplistId },
    {
      onData(event) {
        const shoplist = utils.shoplist.getCurrentShoplist.getData();

        if (!shoplist) {
          console.warn(
            'Shoplist subscription received event but shoplist is not loaded'
          );
          return;
        }

        // Ignore events from this client
        if (event.clientId !== config.CLIENT_ID) {
          switch (event.operation) {
            case 'add': {
              utils.shoplist.getCurrentShoplist.setData(
                undefined,
                produce(shoplist, (draft) => {
                  draft.items.push({
                    id: event.item.id,
                    name: event.item.name,
                    checked: event.item.checked,
                    shoplistId: event.item.shoplistId,
                    createdAt: new Date(event.item.createdAt),
                    updatedAt: new Date(event.item.updatedAt),
                  });
                })
              );
              break;
            }
            case 'update': {
              utils.shoplist.getCurrentShoplist.setData(
                undefined,
                produce(shoplist, (draft) => {
                  const item = draft.items.find(
                    (item) => item.id === event.item.id
                  );

                  if (!item) {
                    console.warn(
                      'Shoplist subscription received update event for item that does not exist'
                    );
                    return;
                  }

                  console.log('>>>>> update', event.item);

                  item.name = event.item.name;
                  item.checked = event.item.checked;
                })
              );
              break;
            }
            case 'remove': {
              utils.shoplist.getCurrentShoplist.setData(
                undefined,
                produce(shoplist, (draft) => {
                  const index = draft.items.findIndex(
                    (item) => item.id === event.item.id
                  );

                  if (index === -1) {
                    console.warn(
                      'Shoplist subscription received remove event for item that does not exist'
                    );
                    return;
                  }

                  draft.items.splice(index, 1);
                })
              );
              break;
            }
            case 'complete':
              utils.shoplist.getCurrentShoplist.setData(
                undefined,
                produce(shoplist, (draft) => {
                  draft.completed = true;
                })
              );
              toast.success('Kauppalista merkitty valmiiksi toisen toimesta', {
                position: 'bottom-center',
              });
              break;
          }

          utils.shoplist.getCurrentShoplist.invalidate();
        }
      },
      onError(err) {
        console.error('Shoplist subscription error:', err);
      },
    }
  );

  return null;
}
