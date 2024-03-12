import merge from 'lodash.merge';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const stage = process.env.STAGE || 'local';

// let envConfig = require(`./${stage}`).default;
let envConfig;

if(stage === 'production') {
  envConfig = require('./prod').default;
} else if(stage === 'testing') {
  envConfig = require('./testing').default;
} else {
  envConfig = require('./local').default;
}

export default merge({
  stage,
  env: process.env.NODE_ENV,
  isDev: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'testing',
  isProd: process.env.NODE_ENV === 'production',
  port: 3001,
  api: {
    url: process.env.API_URL || 'http://localhost:3000/api'
  },
  jwt: process.env.JWT
}, envConfig)