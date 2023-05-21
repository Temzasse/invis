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

type Sections = Record<string, Item[]>;

export function useItemSections(
  sortOrder: HomeSortOrder,
  categories: RouterOutputs['category']['getCategoriesWithItems']
) {
  return useMemo(() => {
    const items = categories.flatMap((c) => c.items);
    const sections: Sections = {};

    if (items.length === 0) {
      return sections;
    }

    if (sortOrder === 'by-category') {
      orderBy(categories, 'name').forEach((c) => {
        sections[c.name] = c.items;
      });

      return sections;
    } else if (sortOrder === 'by-state') {
      items.forEach((i) => {
        const title = statusLabels[i.status as ItemStatus];
        const section = sections[title] ?? [];
        section.push(i);
        sections[title] = section;
      });

      // Sort items within section alphabetically
      Object.values(sections).forEach((section) => {
        section.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
      });

      // Return sections in the order they appear in the statusLabels object
      return Object.values(statusLabels).reduce<Sections>((acc, key) => {
        acc[key] = sections[key];
        return acc;
      }, {});
    } else if (sortOrder === 'alphabetized') {
      const grouped = groupBy(items, (i) => i.name[0].toUpperCase());

      Object.entries(grouped).forEach(([key, items]) => {
        sections[key] = items;
      });
    }

    return sections;
  }, [sortOrder, categories]);
}
