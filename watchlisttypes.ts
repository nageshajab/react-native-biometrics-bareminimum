export type Watchlist = {
  id?: string;
  title: string;
  date: string;
  status: Status;
  userId: string;
  type: WatchlistType;
  language: Language;
  genre: Genre;
  rating: Rating;
  ott: Ott;
};

export enum Status {
  NotStarted = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4,
}

export enum WatchlistType {
  Movie = 1,
  WebSeries = 2,
  Documentary = 3,
  Other = 4,
}

export enum Language {
  English = 1,
  Hindi = 2,
  Tamil = 3,
  Malyalam = 4,
  Marathi =5,
  Other = 6,
}

export enum Genre {
  Action = 1,
  Comedy = 2,
  Drama = 3,
  Horror = 4,
  Thriller = 5,
  Romance = 6,
  SciFi = 7,
  Documentary = 8,
  Other = 9,
}

export enum Rating {
  OneStar = 1,
  TwoStars = 2,
  ThreeStars =3,
  FourStars = 4,
  FiveStars = 5,
}

export enum Ott {
  Netflix = 1,
  Prime = 2,
  Hotstar = 3,
  SonyLiv = 4,
  Zee5 = 5,
  YouTube = 6,
  Other = 7,
}
