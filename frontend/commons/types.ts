export type OptionType = {
  value: string | number;
  caption: string;
  selected?: boolean;
};

export type ServerResponse = {
  error: boolean;
  data: any;
  messages?: any;
}

export type AppRequestWrapper = {
  url: string;
  method: 'POST' | 'GET' | 'DELETE';
  headers?: { [key: string]: any };
  body?: { [key: string]: any };
}
