
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
  NotStarted = 'NotStarted',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export enum WatchlistType {
  Movie = 'Movie',
  WebSeries = 'WebSeries',
  Documentary = 'Documentary',
  Other = 'Other',
}

export enum Language {
  English = 'English',
  Hindi = 'Hindi',
  Tamil = 'Tamil',
  Malyalam = 'Malyalam',
  Marathi = 'Marathi',
  Other = 'Other',
}

export enum Genre {
  Action = 'Action',
  Comedy = 'Comedy',
  Drama = 'Drama',
  Horror = 'Horror',
  Thriller = 'Thriller',
  Romance = 'Romance',
  SciFi = 'SciFi',
  Documentary = 'Documentary',
  Other = 'Other',
}

export enum Rating {
  OneStar = 'OneStar',
  TwoStars = 'TwoStars',
  ThreeStars = 'ThreeStars',
  FourStars = 'FourStars',
  FiveStars = 'FiveStars',
}

export enum Ott {
  Netflix = 'Netflix',
  Prime = 'Prime',
  Hotstar = 'Hotstar',
  SonyLiv = 'SonyLiv',
  Zee5 = 'Zee5',
  YouTube = 'YouTube',
  Other = 'Other',
}
