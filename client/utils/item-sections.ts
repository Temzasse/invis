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

type SectionMap = Record<string, Item[]>;
type Sections = Array<{ title: string; items: Item[] }>;

export function useItemSections({
  categories,
  sortOrder,
  searchTerm,
}: {
  searchTerm: string;
  sortOrder: HomeSortOrder;
  categories: RouterOutputs['category']['getCategoriesWithItems'];
}): Sections {
  const sections = useMemo(() => {
    const items = categories.flatMap((c) => c.items);

    if (items.length === 0) return [];

    let sectionMap: SectionMap = {};

    if (sortOrder === 'by-category') {
      orderBy(categories, 'name').forEach((category) => {
        if (category.items?.length) {
          sectionMap[category.name] = category.items;
        }
      });
    } else if (sortOrder === 'by-state') {
      items.forEach((item) => {
        const title = statusLabels[item.status as ItemStatus];
        const sectionItems = sectionMap[title] || [];
        sectionItems.push(item);
        sectionMap[title] = sectionItems;
      });

      // Sort items within section alphabetically
      Object.values(sectionMap).forEach((section) => {
        section.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
      });

      // Return sections in the order they appear in the statusLabels object
      sectionMap = Object.values(statusLabels).reduce<SectionMap>(
        (sec, key) => {
          sec[key] = sectionMap[key] || [];
          return sec;
        },
        {}
      );
    } else if (sortOrder === 'alphabetized') {
      const grouped = groupBy(items, (i) => i.name[0].toUpperCase());

      Object.entries(grouped).forEach((entry) => {
        if (entry[1]?.length) {
          sectionMap[entry[0]] = entry[1];
        }
      });
    }

    const sections: Sections = Object.entries(sectionMap).map((entry) => ({
      title: entry[0],
      items: entry[1],
    }));

    return sections;
  }, [sortOrder, categories]);

  return useMemo(() => {
    if (!searchTerm) sections;

    const filteredSections: Sections = [];

    sections.forEach((section) => {
      const filteredItems = section.items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );

      if (filteredItems.length) {
        filteredSections.push({
          title: section.title,
          items: filteredItems,
        });
      }
    });

    return filteredSections;
  }, [searchTerm, sections]);
}
