type User = {
  name: string;
  email: string;
  admin: boolean;
  uploadToken: boolean;
};

type Url = {
  identifier: string;
  url: string;
};
type Screenshot = {
  identifier: string;
  name: string;
  type: string;
};
type File = {
  identifier: string;
  name: string;
  type: string;
};
type Text = {
  identifier: string;
  text: string;
};

interface AllFilesInterface {
  screenshots: Screenshot[];
  urls: Url[];
  files: File[];
  text: Text[];
}

export type { User, AllFilesInterface, Url, File, Screenshot, Text };
