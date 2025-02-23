export type SearchDataType = {
  text: string;
  eventTypes: string[];
  startTimestamp: string;
  endTimestamp: string;
  results?: any[];
  loading?:boolean; 
};

export type UserDataType = {
  token : String,
  userID: String,
  username: String,
  email: String,
}


export type UserLoadedType = {
  loaded: boolean
}