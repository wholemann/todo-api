import moment from 'moment';

module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    'users',
    [
      {
        email: 'test1@test.com',
        password: 'test1234',
        createdAt: moment().format('YYYY-MM-DD hh:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD hh:mm:ss'),
      },
      {
        email: 'test2@test.com',
        password: 'test1234',
        createdAt: moment().format('YYYY-MM-DD hh:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD hh:mm:ss'),
      },
      {
        email: 'test3@test.com',
        password: 'test1234',
        createdAt: moment().format('YYYY-MM-DD hh:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD hh:mm:ss'),
      },
    ], {},
  ),

  down: queryInterface => queryInterface.bulkDelete('users', null, {}),
};
