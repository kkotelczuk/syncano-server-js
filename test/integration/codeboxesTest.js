import should from 'should/as-function';
import Promise from 'bluebird';
import _ from 'lodash';
import Syncano from '../../src/syncano';
import {suffix, credentials} from './utils';

describe('CodeBox', function() {
  this.timeout(15000);

  let connection = null;
  let Instance = null;
  let CodeBox = null;
  let CodeBoxId = null;
  const instanceName = suffix.get('instance');
  const codeBoxName = suffix.get('codebox');
  const runtimeName = 'python';

  before(function() {
    connection = Syncano(credentials.getCredentials());
    Instance = connection.Instance;
    CodeBox = connection.CodeBox;

    return Instance.please().create({name: instanceName});
  });

  after(function() {
    return Instance.please().delete({name: instanceName});
  });

  afterEach(function(done) {
    return CodeBox.please().delete({
      instanceName: instanceName,
      id: CodeBoxId
    })
    .then(() => done())
    .catch(() => done());
  });

  it('should be validated', function() {
    should(CodeBox().save()).be.rejectedWith(Error);
  });

  it('should require "instanceName"', function() {
    should(CodeBox({name: codeBoxName}).save()).be.rejectedWith(/instanceName/);
  });

  it('should be able to save via model instance', function() {
    const data = {
      instanceName: instanceName,
      label: codeBoxName,
      runtime_name: runtimeName
    };

    return CodeBox(data).save()
      .then((codebox) => {
        should(codebox).be.an.Object();
        should(codebox).have.property('instanceName').which.is.String().equal(instanceName);
        should(codebox).have.property('description').which.is.String();
        should(codebox).have.property('created_at').which.is.String();
        should(codebox).have.property('updated_at').which.is.String();
        should(codebox).have.property('links').which.is.Object();
        should(codebox).have.property('id').which.is.Number();
        should(codebox).have.property('label').which.is.String();
        should(codebox).have.property('source').which.is.String();
        should(codebox).have.property('runtime_name').which.is.String().equal(runtimeName);
        should(codebox).have.property('config').which.is.Object();
        CodeBoxId = codebox.id;
      });
  });

  it('should be able to update via model instance', function() {
    const data = {
      instanceName: instanceName,
      label: codeBoxName,
      runtime_name: runtimeName
    };

    return CodeBox(data).save()
      .then((codebox) => {
        should(codebox).be.an.Object();
        should(codebox).have.property('instanceName').which.is.String().equal(instanceName);
        should(codebox).have.property('description').which.is.String();
        should(codebox).have.property('created_at').which.is.String();
        should(codebox).have.property('updated_at').which.is.String();
        should(codebox).have.property('links').which.is.Object();
        should(codebox).have.property('id').which.is.Number();
        should(codebox).have.property('label').which.is.String();
        should(codebox).have.property('source').which.is.String();
        should(codebox).have.property('runtime_name').which.is.String().equal(runtimeName);
        should(codebox).have.property('config').which.is.Object();

        CodeBoxId = codebox.id;

        codebox.label = 'new label';
        codebox.description = 'new description';
        return codebox.save();
      })
      .then((codebox) => {
        should(codebox).have.property('label').which.is.String().equal('new label');
        should(codebox).have.property('description').which.is.String().equal('new description');
      });
  });

  it('should be able to delete via model instance', function() {
    const data = {
      instanceName: instanceName,
      label: codeBoxName,
      runtime_name: runtimeName
    };

    return CodeBox(data).save()
      .then((codebox) => {
        should(codebox).have.property('instanceName').which.is.String().equal(data.instanceName);
        should(codebox).have.property('label').which.is.String().equal(data.label);

        return codebox.delete();
      });
  });

  describe('#please()', function() {

    afterEach(function() {
      return CodeBox
        .please()
        .list({instanceName})
        .then((keys) => {
          const ids = _.map(keys, 'id');
          return Promise.all(_.map(ids, (id) => CodeBox.please().delete({id, instanceName})));
        });
    });

    it('should be able to list codeBoxes', function() {
      return CodeBox.please().list({instanceName}).then((keys) => {
        should(keys).be.an.Array();
      });
    });

    it('should be able to create an codeBox', function() {
      return CodeBox.please().create({instanceName, label: codeBoxName, runtime_name: runtimeName}).then((codebox) => {
        should(codebox).have.property('instanceName').which.is.String().equal(instanceName);
        should(codebox).have.property('description').which.is.String();
        should(codebox).have.property('created_at').which.is.String();
        should(codebox).have.property('updated_at').which.is.String();
        should(codebox).have.property('links').which.is.Object();
        should(codebox).have.property('id').which.is.Number();
        should(codebox).have.property('label').which.is.String();
        should(codebox).have.property('source').which.is.String();
        should(codebox).have.property('runtime_name').which.is.String().equal(runtimeName);
        should(codebox).have.property('config').which.is.Object();
      });
    });

    it('should be able to get an codeBox', function() {
      let codeBoxId = null;

      return CodeBox.please().create({instanceName, label: codeBoxName, runtime_name: runtimeName}).then((codebox) => {
        should(codebox).have.property('instanceName').which.is.String().equal(instanceName);
        codeBoxId = codebox.id;

        return codebox;
      })
      .then(() => {
        return CodeBox
          .please()
          .get({id: codeBoxId, instanceName})
          .request();
      })
      .then((codebox) => {
        should(codebox).be.an.Object();
        should(codebox).have.property('instanceName').which.is.String().equal(instanceName);
        should(codebox).have.property('description').which.is.String();
        should(codebox).have.property('created_at').which.is.String();
        should(codebox).have.property('updated_at').which.is.String();
        should(codebox).have.property('links').which.is.Object();
        should(codebox).have.property('id').which.is.Number();
        should(codebox).have.property('label').which.is.String();
        should(codebox).have.property('source').which.is.String();
        should(codebox).have.property('runtime_name').which.is.String().equal(runtimeName);
        should(codebox).have.property('config').which.is.Object();
      });
    });

    it('should be able to delete an codeBox', function() {
      let codeBoxId = null;

      return CodeBox.please().create({instanceName, label: codeBoxName, runtime_name: runtimeName})
        .then((codebox) => {
          should(codebox).be.an.Object();
          should(codebox).have.property('instanceName').which.is.String().equal(instanceName);
          codeBoxId = codebox.id;
          return codebox;
        })
        .then(() => {
          return CodeBox
            .please()
            .delete({id: codeBoxId, instanceName})
            .request();
        });
    });

    it('should be able to update an codeBox', function() {
      return CodeBox.please().create({instanceName, label: codeBoxName, runtime_name: runtimeName}).then((codebox) => {
        should(codebox).be.an.Object();
        should(codebox).have.property('instanceName').which.is.String().equal(instanceName);
        should(codebox).have.property('label').which.is.String().equal(codeBoxName);

        return CodeBox.please().update({id: codebox.id, instanceName}, {label: 'newLabel'});
      })
      .then((codebox) => {
        should(codebox).be.an.Object();
        should(codebox).have.property('instanceName').which.is.String().equal(instanceName);
        should(codebox).have.property('label').which.is.String().equal('newLabel');
      })
    });

    it('should be able to get first codeBox', function() {
      const labels = [
        'label_1',
        'label_2'
      ];

      return Promise
        .all(_.map(labels, (label) => CodeBox.please().create({label: label, runtime_name: runtimeName, instanceName})))
        .then(() => {
          return CodeBox.please().first({instanceName});
        })
        .then((codebox) => {
          should(codebox).be.an.Object();
        });
    });

    it('should be able to change page size', function() {
      const labels = [
        'label_1',
        'label_2'
      ];

      return Promise
        .all(_.map(labels, (label) => CodeBox.please().create({label: label, runtime_name: runtimeName, instanceName})))
        .then((keys) => {
            should(keys).be.an.Array().with.length(2);
            return CodeBox.please({instanceName}).pageSize(1);
        })
        .then((keys) => {
          should(keys).be.an.Array().with.length(1);
        });
    });

    it('should be able to change ordering', function() {
      const labels = [
        'label_1',
        'label_2'
      ];
      let asc = null;

      return Promise
        .all(_.map(labels, (label) => CodeBox.please().create({label: label, runtime_name: runtimeName, instanceName})))
        .then((keys) => {
          should(keys).be.an.Array().with.length(2);
          return CodeBox.please({instanceName}).ordering('asc');
        })
        .then((keys) => {
          should(keys).be.an.Array().with.length(2);
          asc = keys;
          return CodeBox.please({instanceName}).ordering('desc');
        })
        .then((desc) => {
          const asdDescs = _.map(asc, 'description');
          const descDescs = _.map(desc, 'description');
          descDescs.reverse();
          should(desc).be.an.Array().with.length(2);

          _.forEach(asdDescs, (ascDesc, index) => {
            should(ascDesc).be.equal(descDescs[index]);
          });
        })
    });

    it('should be able to get raw data', function() {
      return CodeBox.please().list({instanceName}).raw().then((response) => {
        should(response).be.a.Object();
        should(response).have.property('objects').which.is.Array();
        should(response).have.property('next').which.is.null();
        should(response).have.property('prev').which.is.null();
      });
    });

  });

});
