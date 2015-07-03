module.exports = [
  {
    roles: 'guest',
    allows: [
      {resources: ['auth/signin', 'auth/signup'], permissions: 'post'}
    ]
  },
  {
    roles: 'user',
    allows: [
      {resources: ['/users'], permissions: 'get'}
    ]
  },
  {
    roles: 'admin',
    allows: [
      {resources: ['users'], permissions: '*'}
    ]
  }
];
