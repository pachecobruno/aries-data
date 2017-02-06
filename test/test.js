import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import nock from 'nock';
import cryptobject from 'cryptobject';
import * as tunnel from '../lib/util/tunnel';
import execute, { parse, decryptConfig } from '../lib/cli/execute';

chai.use(chaiAsPromised);
const assert = chai.assert;

describe('execute', function() {

    describe('#execute', function() {
        it('executes goodActivity', async function() {
            // String params, from airflow.
            const task = '{}';
            const config = '{}';
            const executionDate = '2016-08-17T19:30:00';

            // Absolute path to mock activity.
            const repo = `${process.cwd()}/test/goodActivity`;

            // Construct param object.
            const params = { repo, _: [task, config, executionDate] };

            // Execute!
            const result = await execute(params);

            // Make sure we have input and the result from the mock task.
            assert.equal(result.input, 'result');
        });

        it('it rejects badActivity', function() {
            // String params, from airflow.
            const task = '{}';
            const config = '{}';
            const executionDate = '2016-08-17T19:30:00';

            // Absolute path to mock activity.
            const repo = `${process.cwd()}/test/badActivity`;

            // Construct param object.
            const params = { repo, _: [task, config, executionDate] };

            // Assert that the promise should fail.
            return assert.isRejected(execute(params));
        });

        it('calls openTunnel if vpnConnection exists on config.connection', async function() {
            // String params, from airflow.
            const task = '{}';
            const config = {
                connection: {
                    vpnConnection: {
                        type: 'forticlientsslvpn',
                    },
                },
            };
            const executionDate = '2016-08-17T19:30:00';

            // Absolute path to mock activity.
            const repo = `${process.cwd()}/test/goodActivity`;

            // Construct param object.
            const params = { repo, _: [task, JSON.stringify(config), executionDate] };

            // stub openTunnel
            const stub = sinon.stub(tunnel, 'createTunnel', () => {});

            // Execute!
            const result = await execute(params);
            assert(stub.calledOnce, 'createTunnel should be called if a connection has a vpnConnection param');
        });
    });

    describe('#decryptConfig', function () {
        it('returns the original config if no encryptionKey', function () {
            const connection = {
                host: 'example.com',
                port: 1234,
                user: 'user',
                pass: 'pass',
                _encrypted: true,
            };
            const encryptionKey = 'test-key';
            const { encryptor } = cryptobject;
            const encryptedConnection = encryptor(encryptionKey)(connection);
            const config = decryptConfig({ connection: encryptedConnection });
            assert.deepEqual(config.connection, encryptedConnection);
        });

        it('decrypts config.connection', function () {
            const connection = {
                host: 'example.com',
                port: 1234,
                user: 'user',
                pass: 'pass',
                _encrypted: true,
            };
            const encryptionKey = 'test-key';
            const { encryptor } = cryptobject;
            const encryptedConnection = encryptor(encryptionKey)(connection);
            const config = decryptConfig({ connection: encryptedConnection }, encryptionKey);
            assert.deepEqual(config.connection, connection);
        });

        it('does not decrypt config.connection if _encrypted is not true', function () {
            const connection = {
                host: 'example.com',
                port: 1234,
                user: 'user',
                pass: 'pass',
                _encrypted: false,
            };
            const encryptionKey = 'test-key';
            const config = decryptConfig({ connection }, encryptionKey);
            assert.deepEqual(config.connection, connection);
        });

        it('decrypts connection but not vpnConnection when vpnConnection._encrypted = false', function () {
            const connection = {
                host: 'example.com',
                port: 1234,
                user: 'user',
                pass: 'pass',
                _encrypted: true,
            };
            const vpnConnection = {
                host: 'example.com',
                user: 'user',
                port: 1234,
                _encrypted: false,
            };

            const encryptionKey = 'test-key';
            const { encryptor } = cryptobject;
            const encryptedConnection = encryptor(encryptionKey)(connection);
            encryptedConnection.vpnConnection = vpnConnection;
            const config = decryptConfig({ connection: encryptedConnection }, encryptionKey);
            assert.deepEqual(config.connection, { ...connection, vpnConnection });
        });

        it('decrypts vpnConnection but not connection when connection._encrypted = false', function () {
            const connection = {
                host: 'example.com',
                port: 1234,
                user: 'user',
                pass: 'pass',
                _encrypted: false,
            };
            const vpnConnection = {
                host: 'example.com',
                user: 'user',
                port: 1234,
                _encrypted: true,
            };

            const encryptionKey = 'test-key';
            const { encryptor } = cryptobject;
            const encryptedVpnConnection = encryptor(encryptionKey)(vpnConnection);
            const config = decryptConfig({
                connection: { ...connection, vpnConnection: encryptedVpnConnection },
            }, encryptionKey);
            assert.deepEqual(config.connection, { ...connection, vpnConnection });
        });

        it('does not decrypt connection.code', function () {
            const connection = {
                code: 'code',
                host: 'example.com',
                vpnConnection: {
                    code: 'code',
                    host: 'example.com',
                    _encrypted: true,
                },
                _encrypted: true,
            };

            const encryptionKey = 'test-key';
            const config = decryptConfig({ connection }, encryptionKey);
            console.log(config);
            assert(config.connection.code === 'code', 'decryptConfig should not decrypt code');
            assert(config.connection.vpnConnection.code === 'code', 'decryptConfig should not decrypt code');
        });
    });

    describe('#parse', function () {
        it('parses arguments', function () {
            const task = '{ "key": "val" }';
            const config = '{}';
            const executionDate = '2016-08-17T19:30:00';
            const args = [task, config, executionDate];

            const [parsedTask, parsedConfig, parsedExecutionDate] = parse(args);

            assert.deepEqual(parsedTask, { key: 'val' });
            assert.deepEqual(parsedConfig, {});
            assert.deepEqual(parsedExecutionDate, new Date(executionDate));
        });

        it('parses a non json object', function () {
            const task = 'None';

            const [parsedTask] = parse([task]);

            assert.equal(parsedTask, task);
        });
    });

    describe('singleS3StreamInput', function() {
        it.skip('exits early with no data', async function() {
            // String params, from airflow.
            const task = '{"input":{"key":"someobject"}}';
            const config = '{}';
            const executionDate = '2016-08-17T19:30:00';

            // // Mock up env var.
            process.env.AWS_S3_TEMP_BUCKET = 'astronomer-workflows';
            process.env.AWS_REGION = 'us-east-1';

            // Absolute path to mock activity.
            const repo = `${process.cwd()}/test/inputStreamActivity`;

            // Construct param object.
            const params = { repo, _: [task, config, executionDate] };

            nock(`https://${process.env.AWS_S3_TEMP_BUCKET}.s3.amazonaws.com`);

                // Execute!
                const result = await execute(params);

            // Make sure we have input and the result from the mock task.
            assert.equal(result.input, 'result');
        });
    });
});
