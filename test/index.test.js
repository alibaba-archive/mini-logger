'use strict';

var Logger = require('..');
var mkdirp = require('mkdirp');
var fs = require('fs');
var rm = require('rimraf');
var path = require('path');
var iconv = require('iconv-lite');
var should = require('should');

var logdir = path.join(__dirname, 'logs');

var err = new Error('mock error');
err.code = 'LOG';
err.data = {foo: 'bar'};

describe('mini-loger', function () {
  before(function() {
    rm.sync(logdir);
    mkdirp.sync(logdir);
  });

  describe('with out dir', function () {
    it('should throw', function () {
      (function () {
        Logger();
      }).should.throw('options required');
      (function () {
        Logger({});
      }).should.throw('options.dir required');
    });

    it('should ok', function () {
        Logger({
          file: false
        });
    });
  });

  describe('with file = false', function () {
    it('should not create file', function () {
      var logger = Logger({
        dir: logdir,
        file: false
      });
      logger.error(err);
      logger._streams.should.eql({});
    });
  });

  describe('Logger.[category]()', function () {
    it('should format error ok', function (done) {
      var logger = Logger({
        dir: logdir,
        duration: '1h',
        flushInterval: '100ms'
      });
      logger.error(err);
      setTimeout(function () {
        var content = fs.readFileSync(logger.getPath('error'), 'utf-8');
        content.should.containEql('mock error');
        done();
      }, 200);
    });

    it('should format string ok', function (done) {
      var logger = Logger({
        dir: logdir,
        categories: ['string']
      });
      logger.string('test for %j', ['item', 'item']);
      logger.flush();
      setTimeout(function () {
        var content = fs.readFileSync(logger.getPath('string'), 'utf-8');
        content.should.equal('test for ["item","item"]\n\n');
        done();
      }, 100);
    });

    it('should format object ok', function (done) {
      var logger = Logger({
        dir: logdir,
        categories: ['json']
      });
      logger.json({foo: 'bar'});
      logger.flush();
      setTimeout(function () {
        var content = fs.readFileSync(logger.getPath('json'), 'utf-8');
        content.should.equal('{"foo":"bar"}\n\n');
        done();
      }, 100);
    });

    describe('encoding support', function () {
      it('should gbk ok', function (done) {
        var logger = Logger({
          dir: logdir,
          categories: ['gbk'],
          encoding: 'gbk'
        });

        logger.gbk('中文');
        logger.flush();
        setTimeout(function () {
          var content = iconv.decode(fs.readFileSync(logger.getPath('gbk')), 'gbk');
          content.should.equal('中文\n\n');
          done();
        }, 100);
      });

      it('should utf8 ok', function (done) {
        var logger = Logger({
          dir: logdir,
          categories: ['utf8'],
          encoding: 'utf8'
        });

        logger.utf8('中文');
        logger.flush('utf8');
        setTimeout(function () {
          var content = fs.readFileSync(logger.getPath('utf8'), 'utf-8');
          content.should.eql('中文\n\n');
          done();
        }, 100);
      });
    });
  });

  describe('Logger.getPath', function () {
    it('should get null when no category', function () {
      var logger = Logger({dir: logdir});
      should.not.exist(logger.getPath());
    });

    it('should get null when not exist category', function () {
      var logger = Logger({dir: logdir});
      should.not.exist(logger.getPath('not-exist'));
    });

    it('should get path ok', function () {
      var logger = Logger({dir: logdir});
      logger.getPath('error').should.equal(logger._streams.error.stream.path);
    });
  });

  describe('destroy()', function () {
    it('should destroy category ok', function () {
      var logger = Logger({dir: logdir, categories: 'log'});
      logger.destroy('log');
      should.not.exist(logger.log);
      should.not.exist(logger._streams.log);
      should.exist(logger.error);
      should.exist(logger._streams.error);
    });

    it('should destroy not-exist category ok', function () {
      var logger = Logger({dir: logdir, categories: 'log'});
      logger.destroy('not-exist');
      should.exist(logger.log);
      should.exist(logger._streams.log);
      should.exist(logger.error);
      should.exist(logger._streams.error);
    });

    it('should destroy all category ok', function () {
      var logger = Logger({dir: logdir, categories: 'log'});
      logger.destroy();
      should.not.exist(logger.log);
      should.not.exist(logger._streams.log);
      should.not.exist(logger.error);
      should.not.exist(logger._streams.error);
    });
  });

   describe('Logger.timestamp', function () {
     it('should exist timestamp ', function () {
       var logger = Logger({dir: logdir, timestamp: true, categories:['timestamp']});
       logger.timestamp('logtext with timestamp');
       logger.flush('timestamp');
       var patt = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} logtext with timestamp/g;
        setTimeout(function () {
          var content = fs.readFileSync(logger.getPath('timestamp'), 'utf-8');
          var match = patt.exec(content);
          shoudl.notEqual(match, null);
          done();
        }, 100);
     });
   });

});
