import stampit from 'stampit';
import {Meta, Model} from './base';

const UserMeta = Meta({
  name: 'user',
  pluralName: 'users',
  endpoints: {
    'detail': {
      'methods': ['delete', 'patch', 'put', 'get'],
      'path': '/v1/instances/{instanceName}/users/{id}/'
    },
    'reset_key': {
      'methods': ['post'],
      'path': '/v1/instances/{instanceName}/users/{id}/reset_key/'
    },
    'list': {
      'methods': ['post', 'get'],
      'path': '/v1/instances/{instanceName}/users/'
    },
    'groups': {
      'methods': ['get', 'post'],
      'path': '/v1/instances/{instanceName}/users/{id}/groups/'
    }
  }
});

const UserConstraints = {
  instanceName: {
    presence: true,
    length: {
      minimum: 5
    }
  },
  username: {
    presence: true
  },
  password: {
    presence: true
  }
};

const User = stampit()
  .compose(Model)
  .setMeta(UserMeta)
  .setConstraints(UserConstraints);

export default User;
