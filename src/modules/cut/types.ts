export enum CutType {
  Basic = "basic",
}

export type Cut = {
  id: string;
  type: CutType;
  damage: [number, number];
  position: {
    x: number;
    y: number;
  };
  height: number;
  width: number;
  duration: number;
  background: string;
  border: string;
};

export type ActiveCut = Omit<Cut, "type">;
