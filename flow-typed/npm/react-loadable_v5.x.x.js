// flow-typed signature: 27a1e0b05716361b7ef0637f8b240a02
// flow-typed version: 59aa644df6/react-loadable_v5.x.x/flow_>=v0.56.0

declare module 'react-loadable' {
  declare type LoaderResult<T> = T | { 'default': T };

  declare module.exports: <P>(opts: {
    loader(): Promise<LoaderResult<React$ComponentType<P>>>,
    loading: React$ComponentType<*>,
    delay?: number,
    timeout?: number,
    render?: (r: LoaderResult<React$ComponentType<P>>, p: P) => React$Node,
    webpack?: () => Array<string>,
    modules?: Array<string>
  }) => React$ComponentType<P>;
}
