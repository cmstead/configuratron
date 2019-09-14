const chai = require('chai');
const chaiVerify = require('chai-verify');
const container = require('../container');
const sinon = require('sinon');

chai.use(chaiVerify);

const { assert } = chai;

describe("Config Reader", function () {

    let childContainer;
    let configReader;
    let fakeFs;

    beforeEach(function () {
        childContainer = container.new();

        fakeFs = {
            existsSync: () => true
        };

        childContainer.register(() => fakeFs, 'fs');
        configReader = childContainer.build('configReader');
    });

    it('reads a config from the filesystem', function () {
        const expectedConfig = { test: 'config' };
        const filePaths = ['myconfig.json'];

        fakeFs.readFileSync = sinon.spy(() => JSON.stringify(expectedConfig));

        const capturedConfig = configReader.read(filePaths);

        // Ensuring call is correct and encoding isn't forgotten
        assert.equal(fakeFs.readFileSync.getCall(0).args[0], filePaths[0]);
        assert.equal(fakeFs.readFileSync.getCall(0).args[1].encoding, 'utf8');

        assert.verify(capturedConfig, expectedConfig);
    });

    it('reads next file path in paths array if first fails', function () {
        const expectedConfig = { test: 'config' };
        const filePaths = ['myconfig.json', 'backupConfig.json'];

        fakeFs.existsSync = sinon.spy(function (filePath) {
            return filePath !== filePaths[0]
        });

        fakeFs.readFileSync = sinon.spy(function () {
            return JSON.stringify(expectedConfig);
        });

        configReader.read(filePaths);

        assert.equal(fakeFs.existsSync.getCall(0).args[0], filePaths[0]);
        assert.equal(fakeFs.existsSync.getCall(1).args[0], filePaths[1]);

        assert.equal(fakeFs.readFileSync.getCall(0).args[0], filePaths[1]);
    });

    it('supports file path object', function () {
        const expectedConfig = { test: 'config' };
        const filePaths = [{ path: 'myconfig.json' }];

        fakeFs.readFileSync = sinon.spy(function (filePath) {
            return JSON.stringify(expectedConfig);
        });

        configReader.read(filePaths);

        assert.equal(fakeFs.readFileSync.getCall(0).args[0], filePaths[0].path);
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

    it('returns an empty object when config read throws an error', function () {
        const filePaths = ['myconfig.json', 'backupConfig.json'];

        fakeFs.existsSync = () => true;
        fakeFs.readFileSync = () => { throw new Error('Blammo!'); };

        const returnedConfig = configReader.read(filePaths);

        assert.verify(returnedConfig, {});
    });

});