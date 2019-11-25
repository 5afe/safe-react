// flow-typed signature: c2d42e89f2eeb1cdff2d4d7dea9fd97b
// flow-typed version: c6154227d1/storybook-router_v0.x.x/flow_>=v0.104.x

type LocationShape = {
  pathname?: string,
  search?: string,
  hash?: string,
  state?: any,
  ...
};

type GetUserConfirmation = (
  message: string,
  callback: (confirmed: boolean) => void
) => void;

declare module "storybook-router" {
  declare type Context = {
    kind: string,
    story: string,
    ...
  };
  declare type Renderable = React$Element<*>;
  declare type RenderFunction = () => Renderable | Array<Renderable>;

  declare type StoryDecorator = (
    story: RenderFunction,
    context: Context
  ) => Renderable | null;

  declare type Links = { [key: string]: (kind: string, story: string) => Function, ... };

  declare type RouterProps = {
    initialEntry?: Array<string>,
    autoRoute?: boolean,
    initialEntries?: Array<LocationShape | string>,
    initialIndex?: number,
    getUserConfirmation?: GetUserConfirmation,
    keyLength?: number,
    children?: React$Element<*>,
    ...
  };

  declare module.exports: { (links?: Links, routerProps?: RouterProps): StoryDecorator, ... };
}
