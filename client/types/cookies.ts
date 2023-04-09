import { type GetServerSideProps } from 'next';

export type RequestCookies =
  Parameters<GetServerSideProps>[0]['req']['cookies'];
