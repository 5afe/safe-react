// flow-typed signature: 26d5f1a6f2ea08c6adaea50d44628e9e
// flow-typed version: 0c975ef003/storybook-host_v4.x.x/flow_>=v0.54.1

declare module 'storybook-host' {
  declare type Props = {|
    mobXDevTools?:boolean,
    title?:string,
    hr?:boolean,
    align?:string,
    height?:number | string,
    width?:number | string,
    background?:boolean | number | string,
    backdrop?:boolean | number | string,
    cropMarks?:boolean,
    border?:boolean | number | string,
    padding?:number | string
  |};

  declare export function host(props: Props): (
    story: () => React$Element<any>,
    context?: { kind: string, story: string }
  ) => React$Element<any>;
}
