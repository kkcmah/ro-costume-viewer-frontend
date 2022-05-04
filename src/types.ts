export interface User {
  id: string;
  username: string;
  favCostumes: string[];
  likedCostumeSets: string[];
  userType: number;
}

export interface UserWithToken extends User {
  token: string;
}

export interface UserLoginCreds {
  username: string;
  password: string;
}

export enum EquipSlot {
  Top = "Top",
  Middle = "Middle",
  Lower = "Lower",
  Garment = "Garment",
  Effect = "Effect",
}

export interface CostumeTag {
  id: string;
  name: string;
}

export interface Costume {
  id: string;
  itemId: number;
  name: string;
  equipSlots: EquipSlot[];
  costumeTags: CostumeTag[];
  previewUrl: string;
  className: string;
}

export interface CostumeURLSearchParams {
  page?: string;
  rows?: string;
  itemId?: string;
  name?: string;
  equipSlots?: string;
}

export interface CostumeListRetObj {
  costumes: Costume[];
  count: number;
  correctedParams: CostumeURLSearchParams;
  rowsOptions: number[];
}

export interface Owner {
  id: string;
  username: string;
}

export interface CostumeSet {
  id: string;
  name: string;
  description: string;
  costumes: Costume[];
  likes: number;
  owner: Owner;
  isPublic: boolean;
}

export interface CostumeSetsPagedParams {
  lastSeenIds?: string[];
  name?: string;
  lastLikeValue?: number;
}

export interface CostumeSetsWithCount {
  costumeSets: CostumeSet[];
  count: number;
}

export interface NewCostumeSet
  extends Omit<CostumeSet, "id" | "likes" | "owner" | "costumes"> {
  // mongodb object ids
  costumes: string[];
}
