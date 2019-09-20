const chai = require('chai');
const chaiVerify = require('chai-verify');
const container = require('../container');
const sinon = require('sinon');
const path = require('path');

chai.use(chaiVerify);

const { assert } = chai;

describe("Config Writer", function () {
    let childContainer;
    let configWriter;
    let fakeFs;

    beforeEach(function () {
        childContainer = container.new();

        fakeFs = {
            existsSync: () => true,
            writeFileSync: sinon.stub()
        };

        fakeProcess = {
            cwd: () => '/cwd/path',
            join: (...args) => args.join('{fakeJoin}')
        };

        childContainer.register(() => fakeFs, 'fs');
        childContainer.register(() => fakeProcess, 'process');

        configWriter = childContainer.build('configWriter');
    });

    describe("writeConfig", function () {
        it('writes a file to a provided path', function () {
            const pathToFile = '/path/to/file.json';
            const fileContent = 'this is data';

            configWriter.writeConfig(pathToFile, fileContent);

            const actualWritePath = fakeFs.writeFileSync.getCall(0).args[0];
            const actualFileContent = fakeFs.writeFileSync.getCall(0).args[1];

            assert.equal(actualWritePath, pathToFile);
            assert.equal(actualFileContent, fileContent);
        });
    });

    // describe("writeConfigWithRelativePath", function(){
    //    it("writes a file to a path relative to current working directory", function(){
    //        const pathToFile = './myConfig.json';
    //        const fileContent = 
    //    });
    // });
});