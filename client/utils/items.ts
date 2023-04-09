import { useMemo } from 'react';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import { type Item } from '@prisma/client';

import { type HomeSortOrder } from '~stores/view-settings';
import { type ItemStatus } from '~components/project/ItemStatus';
import { type RouterOutputs } from './api';

const statusLabels: Record<ItemStatus, string> = {
  missing: 'Puuttuu',
  partial: 'Osittain',
  full: 'Kunnossa',
};

export function useItemSections(
  sortOrder: HomeSortOrder,
  categories: RouterOutputs['category']['getCategoriesWithItems']
) {
  return useMemo(() => {
    const items = categories.flatMap((c) => c.items);

    if (sortOrder === 'by-category') {
      const sections: Record<string, Item[]> = {};

      orderBy(categories, 'name').forEach((c) => {
        sections[c.name] = [
          ...c.items.filter((i) => i.status === 'missing'),
          ...c.items.filter((i) => i.status === 'partial'),
          ...c.items.filter((i) => i.status === 'full'),
        ];
      });

      return sections;
    } else if (sortOrder === 'by-state') {
      const sections: Record<string, Item[]> = {};

      items.forEach((i) => {
        const title = statusLabels[i.status as ItemStatus];
        const section = sections[title] ?? [];
        section.push(i);
        sections[title] = section;
      });

      Object.values(sections).forEach((section) => {
        section.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
      });

      return sections;
    }

    const sections: Record<string, Item[]> = {};
    const grouped = groupBy(items, (i) => i.name[0].toUpperCase());

    Object.entries(grouped).forEach(([key, items]) => {
      sections[key] = [
        ...items.filter((i) => i.status === 'missing'),
        ...items.filter((i) => i.status === 'partial'),
        ...items.filter((i) => i.status === 'full'),
      ];
    });

    return sections;
  }, [sortOrder, categories]);
}
