const requiredEnvs = ['JWT_SECRET_KEY', 'MONGODB_URL'];

const missingEnvs = requiredEnvs.filter(env => !process.env[env]);

if (missingEnvs.length) {
  throw new Error(` missing environment variables ${missingEnvs}`);
}

module.exports = {
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  port: process.env.PORT || 3000,
  mongoUrl: process.env.MONGODB_URL
};
