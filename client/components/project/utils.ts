import { sleep } from '~utils/common';

export async function highlightElement(id: string) {
  await sleep(500);
  const element = document.getElementById(id);

  if (element) {
    element.scrollIntoView({ behavior: 'instant', block: 'center' });

    await sleep(100);
    element.setAttribute('data-highlighted', 'true');

    await sleep(2000);
    element.removeAttribute('data-highlighted');
  }
}
