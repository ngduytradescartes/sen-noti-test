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
    cluster:
      env === 'development'
        ? 'https://ssc-dao.genesysgo.net/'
        : 'https://sparkling-compatible-telescope.solana-mainnet.quiknode.pro/7585a9ee75601c03a2815eeb8a018c05fa10e736/',
  },
  twitter: {
    token: process.env.TWITTER_BEARER_TOKEN || '',
  },
});

export type EnvironmentVariables = ReturnType<typeof configuration>;

export default configuration;
