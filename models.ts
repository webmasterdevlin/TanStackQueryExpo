export type Movie = {
  id: number;
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
  id: number;
  title: string;
  completed: boolean;
};

export type Album = {
  userId: number;
  id: number;
  title: string;
};

export type Report = {
  id: number;
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
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export type User = {
  id: number;
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
  userId: number;
  id: number;
  title: string;
  body: string;
};
