module.exports = {
  apps : [{
    name: 'StyleShed',
    script: 'npm start',
    watch: '.',
    env: {
        PORT: 3000,
        NODE_ENV: 'development',
    },
    env_production: {
        PORT: 3000,
        NODE_ENV: 'production',
    }
  }]
};
