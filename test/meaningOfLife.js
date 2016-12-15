'use strict';

const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');
const sinon = require('sinon');

describe("The meaning of life", function() {
    describe("Baseline", function() {
        var lib;
        before(function() {
            lib = require('../meaningDiscovery');
        });

        it("is 42", function() {
            var foo = lib.meaningOfLife();
            expect(foo).to.exist.and.equal(42);
        });

        it("is discovered as 42", function() {
            return lib.discover().then(function(meaning) {
                expect(meaning).to.exist.and.equal(42);
            });
        });
    });

    describe("Mocked", function() {
        var lib;
        before(function() {
            mockery.enable({useCleanCache: true});
            mockery.warnOnUnregistered(false);
            mockery.warnOnReplace(false);

            mockery.registerMock("./meaningOfLife", { meaning: function() { return "Gee, I don't know!" } });

            lib = require('../meaningDiscovery');
        });

        after(function() {
            mockery.disable();
        });

        it("is NOT 42", function() {
            var foo = lib.meaningOfLife();
            expect(foo).to.exist.and.equal("Gee, I don't know!");
        });

        it("is discovered to take longer!", function() {
            this.timeout(5000);

            return lib.discover().then(function(meaning) {
                expect(meaning).to.exist.and.equal("Gee, I don't know!");
            });
        });
    });

    describe("Sinon", function() {
        var lib;
        var meaningOfLife;
        before(function() {
            meaningOfLife = require('../meaningOfLife');
            lib = require('../meaningDiscovery');
        });

        describe("spy", function() {
            beforeEach(function() {
                sinon.spy(meaningOfLife,'meaning');
            });
            afterEach(function() {
                meaningOfLife.meaning.restore();
            });

            it('works', function() {
                meaningOfLife.meaning('test');
                expect(meaningOfLife.meaning.args && meaningOfLife.meaning.args[0]).to.exist.and.deep.equal(['test']);
                expect(meaningOfLife.meaning.called).to.exist.and.be.ok;
                expect(meaningOfLife.meaning.callCount).to.exist.and.equal(1);
                meaningOfLife.meaning('test');
                meaningOfLife.meaning('test');
                meaningOfLife.meaning('test');
                expect(meaningOfLife.meaning.callCount).to.exist.and.equal(4);
            });
        });

        describe("with sinon timers", function() {
            var clock;
            before(function() {
                clock = sinon.useFakeTimers();
            });
            after(function() {
                clock.restore();
            });
            it("is discovered to NOT take longer!", function() {
                //this.timeout(5000);

                var discoverPromise = lib.discover();
                for(var i = 0; i < 100; i++) {
                    clock.tick(1000);
                }
                return discoverPromise.then(function(meaning) {
                    expect(meaning).to.exist.and.equal(42);
                });
            });
        });

        describe("stub", function() {
            before(function() {
                meaningOfLife.meaning = sinon.stub();

                meaningOfLife.meaning
                    .returns(43)
                    .onFirstCall().returns(6)
                    .onSecondCall().returns(7)
            });

            it('works', function() {
                var foo = meaningOfLife.meaning();
                var bar = meaningOfLife.meaning();
                var finalrun = meaningOfLife.meaning();
                var finalrun2 = meaningOfLife.meaning();

                expect(foo).to.equal(6);
                expect(bar).to.equal(7);
                expect(finalrun).to.equal(43);
                expect(finalrun2).to.equal(43);
            });
        });
    });
    describe("Sinon+Mockery", function() {
        var lib;
        var meaningOfLife;
        before(function () {
            mockery.enable({useCleanCache: true});
            mockery.warnOnUnregistered(false);
            mockery.warnOnReplace(false);

            var meaningstub = sinon.stub();

            meaningstub
                .returns(43)
                .onFirstCall().returns(6)
                .onSecondCall().returns(7)

            mockery.registerMock("./meaningOfLife", { meaning: meaningstub });

            lib = require('../meaningDiscovery');

            it("is discovered!", function() {
                this.timeout(5000);

                return lib.discover().then(function(meaning) {
                    expect(meaning).to.exist.and.equal("43");
                });
            });
        });

        after(function() {
            mockery.disable();
        });
    });
});


