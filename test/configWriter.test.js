const chai = require('chai');
const chaiVerify = require('chai-verify');
const container = require('../container');
const sinon = require('sinon');

chai.use(chaiVerify);

const { assert } = chai;

describe("Config Writer", function () {
    let childContainer;
    let configWriterFactory;
    let fakeFs;
    let fakePath;

    beforeEach(function () {
        childContainer = container.new();

        fakeFs = {
            existsSync: () => true,
            writeFileSync: sinon.stub()
        };

        fakeProcess = {
            cwd: () => '/cwd/path'
        };

        fakePath = {
            join: (...args) => args.join('{fakeJoin}')
        };

        childContainer.register(() => fakeFs, 'fs');
        childContainer.register(() => fakePath, 'path');
        childContainer.register(() => fakeProcess, 'process');

        configWriterFactory = childContainer.build('configWriterFactory');
    });

    describe("writeConfig", function () {

        it('writes a file a path joined to a base path', function () {
            const basePath = '/path/to/config/';
            const configWriter = configWriterFactory.buildConfigWriter(basePath);

            const pathToFile = './myConfig.json';
            const fileContent = 'this is data';

            configWriter.writeConfig(pathToFile, fileContent);
            
            const expectedWritePath = fakePath.join(basePath, pathToFile);
            const actualWritePath = fakeFs.writeFileSync.getCall(0).args[0];
            const actualFileContent = fakeFs.writeFileSync.getCall(0).args[1];

            assert.equal(actualWritePath, expectedWritePath);
            assert.equal(actualFileContent, fileContent);
        });

        it('accepts an optional serializer function', function () {
            const basePath = '/path/to/config/';
            const configWriter = configWriterFactory.buildConfigWriter(basePath);

            const pathToFile = './myConfig.json';
            const fileContent = ['this is data'];

            const serializer = (data) => JSON.stringify(data);

            configWriter.writeConfig(pathToFile, fileContent, serializer);

            const expectedContent = JSON.stringify(fileContent);
            const actualContent = fakeFs.writeFileSync.getCall(0).args[1];

            assert.equal(actualContent, expectedContent);
        });
        
    });

});