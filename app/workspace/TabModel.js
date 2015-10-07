var uuid = require('node-uuid');
var detector = require('charset-detector');
var fs = require('fs');
var nodePath = require('path');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

/**
 * Tab in pane
 *
 * @constructor
 * @param {Object|String} [config] Configuration or path of the file
 * @param {String} [config.name] Name of tab or file
 * @param {String|'file'} [config.type] Type of tab
 * @param {String} [config.path] Path of the file associated with the tab
 */
function Tab(config) {
    EventEmitter.call(this);
    if (typeof  config === 'string') {
        config = {
            path : config
        };
    }
    this.id = uuid.v4();
    this.config = config || {};
    this.type = this.config.type || '';
    this.path = typeof this.config.path === 'string' ? nodePath.resolve(this.config.path) : '';
    this.name = this.config.name || (this.path && nodePath.basename(this.path)) || '';
    this.fileType = '';
    this.statTimes = {};
    this.content  = null;
    this.edited   = false;
}

/**
 * Inherits the event emitter
 */
util.inherits(Tab, EventEmitter);

/**
 * Load the file and initialize additional properties in the tab object
 *
 * @param callback
 */
Tab.prototype.loadFile = function loadFile(callback) {
    var self = this;

    fs.stat(this.path, function (err, stats) {
        if (!err) {
            self.statTimes = {
                modified : stats.mtime,
                change   : stats.ctime
            };
        }
        // Look at known extension first
        if (/\.(gif|jpeg|jpg|tif|tiff|png|bmp|pdf|ico|cur)$/i.test(self.path)) {
            self.fileType = 'image';
            self.edited   = false;
            if (typeof callback === 'function') {
                callback();
            }
            self.emit('loaded');
            return;
        }

        // Try to look at the nature of the file itself
        Tab.isTextOrBinaryFile(self.path, function (err, type) {
            self.fileType = type;
            self.edited   = false;
            if (type === 'text') {
                fs.readFile(self.path, function (err, data) {
                    self.content = data.toString();
                    if (typeof  callback === 'function') {
                        callback();
                    }
                });
            } else {
                if (typeof  callback === 'function') {
                    callback();
                }
            }
            self.emit('loaded');
        });
    });
};


/**
 * Save the file
 *
 * @param {Object|String} file Content of the file or the description of the file to save
 * @param {String} file.content Content of the file
 * @param {String} file.path Path of the file
 * @param {Function} callback Callback
 * @param {Error} callback.err Error
 */
Tab.prototype.saveFile = function saveFile(file, callback) {
    var content = null,
        path    = null,
        self    = this,
        finalPath;

    this.emit('saving');

    function cb(){
        if (typeof callback === 'function') {
            callback.apply(null, arguments);
        }
        self.emit('saved');
    }

    if (file === undefined || file === null || (typeof file !== 'object' && typeof file !== 'string')) {
        cb(new Error("invalid `file` argument. Expect an object with the `content` and/or the `path` keys"));
        return;
    }

    if (typeof file === 'object') {
        if (!file.path && !file.content){
            cb(new Error("invalid `file` argument. Expect an object with the `content` and/or the `path` keys"));
            return;
        }
        content = file.content || null;
        path    = typeof file.path === 'string' ? nodePath.resolve(file.path) : '';
    } else {
        content = file;
    }

    if (this.fileType === 'binary' && content !== null) {
        cb(new Error("Could not save the content of a binary file"));
        return;
    }

    if (!path && !this.path) {
        cb(new Error("No path defined"));
        return;
    }

    finalPath = path || this.path;

    function trySaveContent() {
        function saveContent(err) {
            if (err) {
                cb(err);
                return;
            }

            if (content === null) {
                cb(null);
                return;
            }


            fs.writeFile(finalPath, content, function (err) {
                if (err) {
                    cb(err);
                    return;
                }

                self.name = nodePath.basename(finalPath);
                self.path = finalPath;
                self.loadFile(cb);
            });
        }

        // Try to rename first
        if (path !== null) {
            fs.rename(self.path, path, function (err) {
                saveContent(err);
            });
            return;
        }

        saveContent();
    }


    /* ALWAYS SAVE
    if (this.path && this.statTimes.modified) {
        fs.stat(this.path, function (err, stats) {
            if (err) {
                cb(err);
            }
            if (self.statTimes.modified < stats.mtime) {
                cb(new Error("The file seems has been already modified"));
            } else {
                trySaveContent();
            }
        });
        return;
    }*/

    trySaveContent();
};


/**
 * Test if the file at the specified path is text or binary
 * @param {String} path Path of the file to test
 * @param {Function} callback Callback function
 * @param {Error} callback.err Error
 * @param {String} callback.err Error
 */
Tab.isTextOrBinaryFile = function (path, callback) {

    fs.open(path, 'r', function(err, fd) {
        if (err) {
            callback(err, "");
            return;
        }
        var bufferSize  = 16000,
            buffer      = new Buffer(bufferSize);

        fs.read(fd, buffer, 0, bufferSize, 0);
        fs.close(fd);

        var charsets = detector(buffer);
        var fileType = (charsets[0].confidence < 10) ? 'binary' : 'text';
        if (typeof callback === 'function') {
            callback(null, fileType);
        }
    });

};



exports.Tab = Tab;