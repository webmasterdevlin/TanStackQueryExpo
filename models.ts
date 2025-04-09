export type Movie = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  year: number;
  director: string;
  duration: string;
  genre: string[];
  rate: number;
};

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export type Album = {
  userid: string;
  id: string;
  title: string;
};

export type Report = {
  id: string;
  title: string;
  description: string;
  date: string;
};

export type CommodityPaginate = {
  first: number;
  prev: number;
  next: number;
  last: number;
  pages: number;
  items: number;
  data: Commodity[];
};

export type Commodity = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
};

export type Post = {
  userid: string;
  id: string;
  title: string;
  body: string;
};
