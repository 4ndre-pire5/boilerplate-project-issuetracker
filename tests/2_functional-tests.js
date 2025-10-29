const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let testId;

suite('POST /api/issues/{project}', function () {
    test('Create an issue with every field', (done) => {
        chai.request(server)
            .post('/api/issues/testproject')
            .send({
                issue_title: 'Teste Funcional',
                issue_text: 'Testes automatizados',
                created_by: 'Andre',
                assigned_to: 'Andre',
                status_text: 'Aberto'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, '_id');
                assert.equal(res.body.issue_title, 'Teste Funcional');
                assert.equal(res.body.open, true);
                testId = res.body._id;
                done();
            });
    });

    test('Create an issue with only required fields', (done) => {
        chai.request(server)
            .post('/api/issues/testproject')
            .send({
                issue_title: 'Teste automatizado 2',
                issue_text: 'Teste POST 2',
                created_by: 'Andre'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, '_id');
                assert.equal(res.body.issue_title, 'Teste automatizado 2');
                assert.equal(res.body.issue_text, 'Teste POST 2');
                assert.equal(res.body.open, true);
                testId = res.body._id;
                done();
            });
    });

    test('Create an issue missing required fields', (done) => {
        chai.request(server)
            .post('/api/issues/testproject')
            .send({
                issue_title: '',
                issue_text: '',
                created_by: 'Andre'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'required field(s) missing');
                done();
            });
    });

});

suite('GET /api/issues/{project}', () => {
    test('View issues on a project', (done) => {
        chai.request(server)
            .get('/api/issues/testproject')
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isArray(res.body, 'A resposta deve ser um array');
                if (res.body.length > 0) {
                    assert.property(res.body[0], '_id');
                    assert.property(res.body[0], 'project');
                    assert.property(res.body[0], 'issue_title');
                    assert.property(res.body[0], 'issue_text');
                    assert.property(res.body[0], 'created_by');
                    assert.property(res.body[0], 'open');
                    assert.property(res.body[0], 'created_on');
                    assert.property(res.body[0], 'updated_on');
                }
                done();
            });
    });

    test('View issues on a project with one filter', (done) => {
        chai.request(server)
            .get('/api/issues/testproject')
            .query({ open: false })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                res.body.forEach(issue => {
                    assert.equal(issue.open, false);
                });
                done();
            });
    });

    test('View issues on a project with multiples filters', (done) => {
        chai.request(server)
            .get('/api/issues/testproject')
            .query({ open: false, created_by: 'Andre' })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                res.body.forEach(issue => {
                    assert.equal(issue.open, false);
                    assert.equal(issue.created_by, 'Andre')
                });
                done();
            });
    });

});

suite('PUT /api/issues/{project}', () => {
    test('Update one field on an issue', (done) => {
        chai.request(server)
            .put('/api/issues/testproject')
            .send({
                _id: testId,
                issue_text: 'Alterando um campo de texto'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body._id, testId);
                done();
            });
    });

    test('Update multiple fields on an issue', (done) => {
        chai.request(server)
            .put('/api/issues/testproject')
            .send({
                _id: testId,
                issue_title: 'Teste automação PUT',
                created_by: 'Andre Pires'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body._id, testId);
                done();
            });
    });

    test('Update an issue with missing _id', (done) => {
        chai.request(server)
            .put('/api/issues/testproject')
            .send({
                issue_text: 'Alterando um campo de texto'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'missing _id');
                done();
            });
    });

    test('Update an issue with no fields to update', (done) => {
        chai.request(server)
            .put('/api/issues/testproject')
            .send({
                _id: testId,
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'no update field(s) sent');
                assert.equal(res.body._id, testId);
                done();
            });
    });

    test('Update an issue with an invalid _id', (done) => {
        chai.request(server)
            .put('/api/issues/testproject')
            .send({
                _id: 'abcdef0123456789abcdef01',
                issue_title: 'Não atualiza com _id errado'
            })
            .end((err, res) => {
                assert.equal(res.status, 200);
                assert.property(res.body, 'error');
                assert.equal(res.body.error, 'could not update');
                assert.equal(res.body._id, 'abcdef0123456789abcdef01');
                done();
            });
    });






});











