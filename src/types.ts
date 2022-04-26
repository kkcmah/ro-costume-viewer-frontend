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
