import { SWRConfig } from 'swr';

type Props = {
  [prop: string]: any;
  swr: { fallback: Record<string, any> };
};

export function withSWRConfig<T extends Props>(
  Component: React.ComponentType<T>
) {
  return function WithSWRConfig(props: T) {
    return (
      <SWRConfig value={props.swr}>
        <Component {...props} />
      </SWRConfig>
    );
  };
}
