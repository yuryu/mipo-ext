"use strict";

function MipoDb() {
}

MipoDb.prototype.ensureDb = function() {
    return new Promise(function(resolve, reject) {
        if ( this.db ) {
            resolve(this);
        }
        chrome.runtime.getBackgroundPage(function (backgroundPage) {
                var req = backgroundPage.indexedDB.open("MipoDb", 1);
                req.onerror = function (event) {
                    reject(event);
                };
                req.onsuccess = function (event) {
                    this.db = event.target.result;
                    resolve(this);
                };
                req.onupgradeneeded = function (event) {

                };
            }
        );

    });
};

MipoDb.prototype.getSites = function (hostSuffix) {
    return this.ensureDb().then(function () {
        return new Promise(function (resolve, reject) {
            var trans = this.db.transaction(["sites"], "readonly");
            var objStore = trans.objectStore("sites");
            var index = objStore.index("hostSuffix");
            var result = [];
            index.openCursor(IDBKeyRange.only(hostSuffix)).onsuccess =
                function (event) {
                    var cursor = event.target.result;
                    if ( cursor ) {
                        result.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(result);
                    }
                };
        });
    });
};


MipoDb.prototype.addSites = function (sites) {
    return this.ensureDb().then(function () {
        return new Promise(function (resolve, reject) {
            var trans = this.db.transaction(["sites"], "readonly");
            var objStore = trans.objectStore("sites");
            var promises = [];
            for ( var site in sites ) {
                promises.push(new Promise(function (resolve, reject) {
                    var request = objStore.add(site);
                    reuqest.onsuccess = resolve;
                    request.onerror = reject;
                }));
            }
            return Promise.all(promises);
        });
    });
};

MipoDb.prototype.RemoveSitesByPoint = function (pointId) {
    return this.ensureDb().then(function () {
        return new Promise(function (resolve, reject) {
            var trans = this.db.transaction(["sites", "readwrite"]);
            var objStore = trans.objectStore("sites");
            var index = objStore.index("point");
            var promises = [];
            index.openCursor(IDBKeyRange.only(pointId)).onsuccess = function (event) {
                var cursor =  event.target.result;
                if ( cursor ) {
                    var promise = new Promise(function(resolve2){
                        var del = cursor.delete();
                        del.onsuccess = function () {
                            resolve2();
                        };
                    });
                    promises.push(promise);
                    cursor.continue();
                } else {
                    Promise.all(promises);
                    resolve();
                }
            }
        });
    });

};
