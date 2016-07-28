'use strict';
const permissions = module.exports = {
  guest:   ['auth:signin', 'auth:signup'],
  user:    ['auth:signout', 'auth:profile', 'users:list', 'users:show'],
  manager: {
    extend:      'user',
    permissions: ['users:create', 'users:update', 'users:destroy']
  }
};
