export interface IMessage {
  content: string;
  sender: string;
  timestamp: Date;
  unread: boolean;
  documentURL?: string;
}

export interface IChat {
  // could extend Document, but then we have the mongoose dependency...
  messages: IMessage[];
  flatProfile: string;
  searchProfile: string;
  status: "active" | "inactive" | "new";
  _id?: string;
  partnerTitle?: string | null;
  partnerImage?: string | null;
  partnerName?: string | null;
}
