export type AppInfo = {
  address: string;
  tvl: number;
};

export enum AppIds {
  balansol = 'balansol',
  sen_lp = 'sen_lp',
  sen_farming = 'sen_farming',
  sen_farming_v2 = 'sen_farming_v2',
}

export type StatTvl = {
  tvl: number;
};
export type AppsInfo = Record<AppIds, AppInfo[]>;
