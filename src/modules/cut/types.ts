export enum CutType {
  Basic = "basic",
}

export type Cut = {
  id: string;
  type: CutType;
  position: {
    x: number;
    y: number;
  };
};
