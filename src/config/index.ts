import ip from 'ip';

const env = process.env.NODE_ENV || 'development';
const configuration = () => ({
  server: {
    env,
    port: parseInt(process.env.PORT, 10) || 10000,
    ip: ip?.address() as string,
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sen_api',
    projection: { _id: 0, __v: 0 },
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    ttl: env === 'development' ? 5 : 30,
  },
  throttler: {
    ttl: env === 'development' ? 5 : 24 * 60 * 60,
    limit: env === 'development' ? 3 : 10,
  },
  solana: {
    taxmanAddress: '9doo2HZQEmh2NgfT3Yx12M89aoBheycYqH1eaR5gKb3e',
    swapAddress: 'SSW7ooZ1EbEognq5GosbygA3uWW1Hq1NsFq6TsftCFV',
    farmingAddress: 'DTvdh6Q13SfYxMoWyibBUmQAUqd2pDPSpjdku5a9NLSF',
    farmingV2Address: '6LaxnmWdYUAJvBJ4a1R8rrsvCRtaY7b43zKiNAU2k3Nx',
    senAddress: 'SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M',
    balansolAddress: 'Ff5wgqZ7B63J3iySASitrD6u3h5JHgrHyfSpAmm1Ufmw',
    interdaoAddress: 'BND6UZZG2rLGtaYLioBtXFnrBtvtp5g6YXWKEc4LLqrJ',
    senlpAddress: 'Aa3WZX7Xunfebp2MuAcz9CNw8TYTDL7mVrmb11rjyVm6',
    spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    chainId: 103,
    cluster: 'devnet',
    endpoint:
      env === 'development'
        ? 'https://devnet.genesysgo.net'
        : 'https://sparkling-compatible-telescope.solana-mainnet.quiknode.pro/7585a9ee75601c03a2815eeb8a018c05fa10e736/',
  },
  twitter: {
    token: process.env.TWITTER_BEARER_TOKEN || '',
  },
});

export interface SolanaConfig {
  taxmanAddress: string;
  swapAddress: string;
  balansolAddress: string;
  interdaoAddress: string;
  farmingAddress: string;
  farmingV2Address: string;
  senAddress: string;
  senlpAddress: string;
  endpoint: string;
  spltAddress: string;
  splataAddress: string;
  chainId: number;
  cluster: string;
}

export type EnvironmentVariables = ReturnType<typeof configuration>;

export default configuration;
