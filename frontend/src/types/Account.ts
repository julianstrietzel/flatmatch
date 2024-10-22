export interface IAccount {
  id: string;
  email: string;
  language: string;
  country: string;
  city: string;
  firstName: string;
  lastName: string;
  aboutMe: string;
  profilePicture: string;
  documents: IDocument[];
}

export interface IDocument {
  _id: string;
  documentURL: string;
  documentType: string;
}
