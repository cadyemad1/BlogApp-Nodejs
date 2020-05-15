const requiredEnvs = [
  'NODE_ENV',
  'JWT_SECRET_KEY',
  'MONGODB_URL',
  'CLOUD_NAME',
  'API_KEY',
  'API_SECRET'
];

const missingEnvs = requiredEnvs.filter(env => !process.env[env]);

if (missingEnvs.length) {
  throw new Error(` missing environment variables ${missingEnvs}`);
}

module.exports = {
  nodeEnv: process.env.NODE_ENV,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  port: process.env.PORT || 3000,
  mongoUrl: process.env.MONGODB_URL,
  cloudName: process.env.CLOUD_NAME,
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET
};
