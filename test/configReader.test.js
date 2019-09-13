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

        fakeFs = {};

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

        fakeFs.readFileSync = sinon.spy(function (filePath) {
            if(filePath === filePaths[0]) {
                throw new Error('Boom!');
            } else {
                return JSON.stringify(expectedConfig);
            }
        });

        configReader.read(filePaths);

        assert.equal(fakeFs.readFileSync.getCall(0).args[0], filePaths[0]);
        assert.equal(fakeFs.readFileSync.getCall(1).args[0], filePaths[1]);
    });

    it('throws an error if no file can be read', function () {
        const filePaths = ['myconfig.json', 'backupConfig.json'];

        fakeFs.readFileSync = sinon.spy(function (filePath) {
            throw new Error('Boom!');
        });

        assert.throws(() => configReader.read(filePaths));
    });

});