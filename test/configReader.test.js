const chai = require('chai');
const chaiVerify = require('chai-verify');
const container = require('../container');
const sinon = require('sinon');

chai.use(chaiVerify);

const { assert } = chai;

describe("Read Config", function () {

    let childContainer;
    let configuratronFactory;
    let configuratronOptions;
    let fakeFs;
    let fakePath;
    let returnValues;

    beforeEach(function () {
        childContainer = container.new();

        returnValues = {
            readFileSync: ''
        };

        configuratronOptions = {
            basePath: '/base/path/',
            defaultConfig: {},
            filePath: 'myconfig.json'
        };

        fakeFs = {
            existsSync: () => true
        };

        fakePath = {
            join: (...args) => args.join('{fakeJoin}')
        }

        fakeProcess = {
            cwd: () => '',
        };

        childContainer.register(() => fakeFs, 'fs');
        childContainer.register(() => fakePath, 'path');
        childContainer.register(() => fakeProcess, 'process');

        configuratronFactory = childContainer.build('configuratronFactory');
    });

    it.only('reads a config from the filesystem', function () {
        const configuratron = configuratronFactory.buildConfiguratron(configuratronOptions);

        const expectedConfig = { test: 'config' };
        const expectedPath = fakePath.join(
            configuratronOptions.basePath,
            configuratronOptions.filePath
        )

        fakeFs.readFileSync = sinon.stub().callsFake(() => {
            return JSON.stringify(expectedConfig);
        });

        const capturedConfig = configuratron.readConfig();

        function ensureCallIsCorrectAndEncodingIsNotForgotten() {
            assert.equal(fakeFs.readFileSync.getCall(0).args[0], expectedPath);
            assert.equal(fakeFs.readFileSync.getCall(0).args[1].encoding, 'utf8');
        }

        ensureCallIsCorrectAndEncodingIsNotForgotten();

        assert.verify(capturedConfig, expectedConfig);
    });

    it('supports optional source parser', function () {
        const expectedConfig = { test: 'config' };
        const filePaths = [{
            path: 'myconfig.json',
            parser: function (configString) {
                const config = JSON.parse(configString);

                return config.test;
            }
        }];

        fakeFs.readFileSync = sinon.spy(function (filePath) {
            return JSON.stringify(expectedConfig);
        });

        const configData = configReader.read(filePaths);

        assert.equal(configData, expectedConfig.test);
    });

    it('returns an empty object when a config file cannot be read', function () {
        const filePaths = ['myconfig.json', 'backupConfig.json'];

        fakeFs.existsSync = () => false;
        fakeFs.readFileSync = () => null;

        const returnedConfig = configReader.read(filePaths);

        assert.verify(returnedConfig, {});
    });

});