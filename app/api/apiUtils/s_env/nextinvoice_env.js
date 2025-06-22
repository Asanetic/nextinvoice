
const mosyDbConfig = {
  local: {
    DB_HOST: 'localhost',
    DB_USER: 'root',
    DB_PASS: '',
    DB_NAME: 'firebirdbill',
  },
  production: {
    DB_HOST: '127.0.0.1',
    DB_USER: 'firebirdbill',
    DB_PASS: 'firebirdbill001',
    DB_NAME: 'firebirdbill',
  }
};

export default mosyDbConfig; 