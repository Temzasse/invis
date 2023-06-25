import { sleep } from '~utils/common';

export async function highlightItemRow(id: string) {
  await sleep(500);
  const itemRow = document.getElementById(id);

  if (itemRow) {
    itemRow.scrollIntoView({ behavior: 'instant', block: 'center' });

    await sleep(100);
    itemRow.setAttribute('data-highlighted', 'true');

    await sleep(2000);
    itemRow.removeAttribute('data-highlighted');
  }
}
