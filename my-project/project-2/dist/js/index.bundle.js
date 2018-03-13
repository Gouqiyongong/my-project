/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "44757e8c34575e170982"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 2;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(35)(__webpack_require__.s = 35);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(2);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ 10:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "8894afe990d942d10a2df29c141db64a.jpg";

/***/ }),

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "7f202ee733afcf26216e0f155919cb8a.png";

/***/ }),

/***/ 2:
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ 35:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by gqy on 2017/9/10.
 */
__webpack_require__(36);
const indexbody = __webpack_require__(37);
$("body").prepend($(indexbody));
__webpack_require__(38); //webRTC主要代码，此处不做讲解，将单独讲解
;(function ($) {
  var index = {
    toLoad: function () {
      if (!localStorage.getItem('userName')) {
        alert('登录过期，请重新登录');
        location.href = 'login.html';
      }
    },
    onClick: function () {
      $(document).on("click", '#ht-connection li,li,.ht-jb-to', function (event) {
        var target = event.target;
        if (target.tagName.toLowerCase() == 'li') {
          if (!$(target).hasClass('actived')) {
            $(target).siblings().removeClass('actived');
            $(target).addClass('actived');
          }
        }
        if (target.tagName.toLowerCase() == 'span') {
          if (!$(target).parent().hasClass('actived')) {
            $(target).parent().siblings().removeClass('actived');
            $(target).parent().addClass('actived');
          }
          if ($(target).hasClass('ht-jb')) {
            $("#ht-jb-r").val($(target).parent().attr('id'));
            $(".ht-jb-to").css('top', '20%');
          }
          if ($(target).hasClass('ht-ah')) {
            $.ajax({
              url: "user/lookUserMessage",
              type: "GET",
              dataType: 'json',
              data: {
                userName: $(target).parent().attr('id')
              },
              success: function (data) {
                var string = '<p class="ht-ahs">';
                if (data.code == 100) {
                  for (var name in data.extend.message) {
                    if (data.extend.message[name]) {
                      string += "<span>" + name + "</span>";
                    }
                  }
                  string += '</p>';
                }
                $(target).parent().parent().find('p').remove();
                $(target).parent().append(string);
                $(target).parent().parent().find('p').animate({ width: '0px' }, 2000);
              }
            });
          }
        }

        if (target.id === 'ht-jb-not') {
          $('.ht-jb-to').css('top', '-350px');
          $('#ht-jb-yy').val("");
        }

        if (target.id === 'ht-jb-sure') {
          var dat = {
            userb: $("#ht-jb-r").val(),
            reason: $("#ht-jb-yy").val(),
            usera: $(".ht-jb-to input[type='radio']").checked().val() ? "" : localStorage.getItem('userName')
          };
          $.ajax({
            url: "user/lockOne",
            type: "POST",
            dataType: 'json',
            success: function (data) {
              if (data.code == 100) {
                alert('举报成功');
                $('.ht-jb-to').css('top', '-350px');
                $('#ht-jb-yy').val("");
              } else {
                if (data.extend.error.reason.length > 0) {
                  alert('举报理由不能为空');
                }
              }
            }
          });
        }

        if (target.id === 'out-load') {
          $.ajax({
            url: "http://39.108.174.208:8080/FTF/user/logout",
            type: "GET",
            dataType: 'json',
            asycn: true,
            success: function (data) {
              if (data.code == 100) {
                alert("退出成功");
                window.location.href = "load.html";
              } else {
                alert("退出失败，请重试");
              }
            }
          });
        }
      });
    },
    active: function () {
      this.toLoad();
      this.onClick();
    }
  };
  index.active();
})(jQuery);

/***/ }),

/***/ 36:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(5, function() {
			var newContent = __webpack_require__(5);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 37:
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div class=\"container-fluid\">\r\n  <div class=\"container\">\r\n  <header>\r\n    <img src=\"" + __webpack_require__(11) + "\">\r\n  </header>\r\n  <div class=\"ht-video\">\r\n    <video class=\"ht-hevideo\" id=\"ht-hevideo\" autoplay style=\"width: 100%;height: 490px;\"></video>\r\n    <div class=\"ht-opacity\" id=\"ht-opacity\"></div>\r\n    <video class=\"ht-myvideo\" id=\"ht-myvideo\" autoplay></video>\r\n    <div class=\"ht-video-go ht-video-back\" id=\"ht-video-back\">\r\n      <button  type=\"button\">结束</button>\r\n    </div>\r\n    <div class=\"ht-video-go\" id=\"ht-video-go\">\r\n      <button  type=\"button\">开始</button>\r\n    </div>\r\n    <div class=\"ht-video-go ht-video-login\" id=\"ht-video-login\">\r\n      <button  type=\"button\">准备</button>\r\n    </div>\r\n  </div>\r\n</div>\r\n  <div class=\"ht-left\" id=\"ht-lefe\">\r\n  <ul>\r\n    <li class=\"actived\">主页</li>\r\n    <a href=\"provi.html\"><li>个人空间</li></a>\r\n    <a href=\"newPassword.html\"><li>修改密码</li></a>\r\n    <li id=\"out-load\">退出登录</li>\r\n  </ul>\r\n  </div>\r\n  <div class=\"ht-right\" id=\"ht-right\">\r\n    <h5>联系人</h5>\r\n    <ul id=\"ht-connection\">\r\n      <li class=\"actived\" id=\"zhangsan\">\r\n        <span title=\"2017/3/22\">张三</span>\r\n        <span class=\"ht-jb\" title=\"举报\">↓↓</span>\r\n        <span class=\"ht-ah\" title=\"查看爱好\">↑↑</span>\r\n      </li>\r\n      <li>李四</li>\r\n      <li>李四</li>\r\n      <li>李四</li>\r\n      <li>李四</li>\r\n      <li>李四</li>\r\n    </ul>\r\n  </div>\r\n  <div class=\"ht-jb-to\">\r\n    <div>\r\n      <label>举报人</label>\r\n      <input id=\"ht-jb-r\" value=\"张三\" disabled>\r\n    </div>\r\n    <div>\r\n      <label>举报原因填写</label>\r\n      <textarea id=\"ht-jb-yy\" maxlength=\"50\"></textarea>\r\n    </div>\r\n    <div>\r\n      <label>是否匿名举报</label>\r\n      <input type=\"radio\" name=\"niming\" value=\"1\" checked>是\r\n      <input type=\"radio\" name=\"niming\" value=\"0\">否\r\n    </div>\r\n    <button id=\"ht-jb-sure\">确认</button>\r\n    <button id=\"ht-jb-not\">取消</button>\r\n  </div>\r\n</div>";

/***/ }),

/***/ 38:
/***/ (function(module, exports) {

/* 
* @Author: fxy
* @Date:   2017-08-08 19:53:42
* @Last Modified by:   anchen
* @Last Modified time: 2017-09-10 17:23:33
*/

(function ($) {
    $(document).ready(function () {
        ajax();
    });
    function ajax() {
        var str = "";
        var $ul = $("#ht-connection");
        if (localStorage.getItem('userName')) {
            $.ajax({
                url: "http://39.108.174.208:8080/FTF/user/lookUserContacts",
                type: 'GET',
                dataType: 'json',
                data: { userName: localStorage.getItem('userName') },
                async: false,
                success: function (data) {
                    if (data.code == 100) {
                        if (data.extend.message.length == 0) {
                            str = '<li class="actived"><span>没有联系人</span></li>';
                        } else {
                            data.extend.message.forEach(function (item, index) {
                                if (index == 0) {
                                    str += `<li class="actived"><span id="${item.userB}" title="${time(item.time)}"></span>
                      <span class="ht-jb" title="举报">↓↓</span>
                      <span class="ht-ah" title="爱好">↑↑</span></li>`;
                                } else {
                                    str += `<li><span id="${item.userB}" title="${time(item.time)}"></span>
                      <span class="ht-jb" title="举报">↓↓</span>
                      <span class="ht-ah" title="爱好">↑↑</span></li>`;
                                }
                            });
                        }
                    } else if (data.code == 200) {}{
                        str = '<li class="actived"><span>没有联系人</span></li>';
                    }
                }
            });
            console.log(str);
            $ul[0].innerHTML = str;
            console.log($ul[0]);
        }
        function time(time) {
            var d = new Date(time);
            return d.getFullYear() + "/" + (d.getMonth() + 1) + d.getMinutes();
        }
    }
    var Fxy = function (id) {
        this.elem = document.querySelector(id);
    };
    Fxy.prototype.on = function (type, fn) {
        var elem = this.elem;
        if (elem.nodeType != 1) {
            throw new Error('targetElement is not a right document');
        } else if (elem.addEventListener) {
            // 2¼¶
            elem.addEventListener(type, fn, false);
        } else if (elem.attachEvent) {
            elem.attachEvent(type, 'on' + type);
        } else {
            // 0¼¶
            elem['on' + type] = fn;
        }
    };
    /*
    *
    *   Gloabal veriable
    *
     */

    function Dom(typ) {
        switch (typ) {
            case 1:
                loginBtn.elem.style.display = 'none';
                callBtn.elem.style.display = 'block';
                hangUpBtn.elem.style.display = 'none';
                time = 40;
                break;
            case 2:
                loginBtn.elem.style.display = 'none';
                callBtn.elem.style.display = 'none';
                hangUpBtn.elem.style.display = 'block';
                setTime();
                break;
            case 3:
                loginBtn.elem.style.display = 'block';
                callBtn.elem.style.display = 'none';
                hangUpBtn.elem.style.display = 'none';
                ajax();
                break;
        }
    }
    function setTime() {
        $("#ht-opacity").css('display', 'block');
        $("#ht-opacity").fadeOut(15000, function () {
            time -= 15;
        });
        var timeout = setInterval(function () {
            time--;
            if (time <= 0) {
                leave();
                time = 40;
                clearInterval(timeout);
            }
        }, 1000);
    }
    var name, connectedUser;

    //Óë·þÎñÆ÷½¨Á¢Á¬½Ó£¬´«µÝ·þÎñÆ÷µØÖ·£¬ÔÙ¼ÓÉÏws£º//ÎªÇ°×ºÀ´ÊµÏÖ
    //"ws://"+window.location.host+'/FTF/u/websocket'
    var connection = new WebSocket('ws://39.108.174.208:8080/FTF/u/websocket');
    // var connection = new WebSocket('ws://localhost:8888');


    var loginPage = new Fxy('#login-page'),

    //usernameInput = new Fxy('#username'),
    loginBtn = new Fxy('#ht-video-login'),

    //callPage = new Fxy('#call-page'),
    //theirUsernameInput = new Fxy('#their-username'),
    callBtn = new Fxy('#ht-video-go'),
        hangUpBtn = new Fxy('#ht-video-back');

    //callPage.elem.style.display = 'none';

    var myVideo = new Fxy('#ht-myvideo'),
        theirVideo = new Fxy('#ht-hevideo'),
        myConnection,

    //theirConnection,
    stream,
        time = 0;
    /*
    *   ÊÂ¼þ°ó¶¨
    */
    //µ¥»÷µÇÂ¼
    loginBtn.on('click', function (e) {
        login();

        /* name = usernameInput.elem.value;
             if (name.length > 0) {
               send({
                   type: 'login'
               })
           }*/
    });
    function login() {
        name = localStorage.getItem("userName");
        if (name.length > 0) {
            send({
                type: 'login'
            });
        } else {
            alert("ÓÃ»§ÉÐÎ´µÇÂ¼");
            window.location.href = "login.html";
        }
    }
    //
    //¹Ò¶Ï

    function leave() {
        send({
            type: 'leave'
        });
        onLeave();
    }

    hangUpBtn.on('click', function (e) {
        leave();
    });
    //Ô¶³ÌÁ¬½Ó
    callBtn.on('click', function (e) {
        // var theirUserName = theirUsernameInput.value;
        //login();
        startPeerConnection();
        loginBtn.elem.style.display = "none";
        callBtn.elem.style.display = "none";
        hangUpBtn.elem.style.display = "block";
    });
    //µÇÂ¼
    function onLogin(success) {
        if (success == false) {
            alert("Login unsuccessful, please try a different name.");
        } else {
            Dom(1);
            startConnection();
        }
    }
    //offer½ÓÊÕ
    function onOffer(offer, name) {
        console.log(name, 'ÇëÇó½¨Á¢ÊÓÆµÁ´½Ó');
        connectedUser = name;
        //½ÓÊÕÔ¶³ÌSDP
        console.log('½ÓÊÕµ½µÄoffer', offer);
        myConnection.setRemoteDescription(new RTCSessionDescription(offer));
        //
        myConnection.createAnswer(function (answer) {
            myConnection.setLocalDescription(answer);
            send({
                type: 'answer',
                answer: answer
            });
        }, function (error) {
            console.log("An error has occurred at Offer", error);
            alert("An error has occurred at Offer");
        });
    }

    //Ó¦´ð
    function onAnswer(answer) {
        myConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
    // ice ºòÑ¡Í¨µÀ
    function onCandidate(candidate) {
        console.log('½ÓÊÕµ½µÄcandidate', candidate);
        myConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
    // ¹Ò¶Ï
    function onLeave() {
        connectedUser = null;
        //theirVideo.elem.src = null;
        myConnection.close();
        myConnection.onicecandidate = null;
        myConnection.onaddstream = null;
        Dom(3);
        setupPeerConnection(stream);
    }
    connection.onopen = function () {
        //·þÎñÆ÷Á¬½Ó³É¹¦
        console.log("Connected");
    };

    //Í¨¹ýonmessage·½·¨»ñÈ¡ËùÓÐ»ùÓÚWebRTCµÄÏûÏ¢
    connection.onmessage = function (msg) {
        console.log('msg', msg);
        console.log("Got message", JSON.parse(msg.data));
        var data = JSON.parse(msg.data);
        switch (data.type) {
            case 'login':
                onLogin(data.message.login);
                break;
            case 'offer':
                onOffer(JSON.parse(data.message.offer), data.message.userName);
                break;
            case 'answer':
                onAnswer(JSON.parse(data.message.answer));
                break;
            case 'candidate':
                onCandidate(JSON.parse(data.message.candidate));
                break;
            case 'leave':
                onLeave();
                break;
            default:
                break;
        }
    };
    connection.onerror = function (err) {
        console.log("Got error", err);
    };

    function send(msg) {
        if (connectedUser) {
            msg.connectedUser = connectedUser; //½«Á¬½Ó¶ÔÏó´øÈë
        }
        msg.userName = name;
        console.log('send:', JSON.stringify(msg));
        connection.send(JSON.stringify(msg));
    }

    function startConnection() {
        if (hasUserMedia()) {
            //»ñÈ¡ÊÓÆµÁ÷
            var opts = {
                video: true,
                audio: true
            };
            navigator.mediaDevices.getUserMedia(opts).then(function (myStream) {
                stream = myStream;
                // myVideo.src = window.URL.createObjectURL(stream);
                myVideo.elem.srcObject = stream;
                if (hasRTCPeerConnection()) {
                    setupPeerConnection(stream);
                } else {
                    alert("sorry, your browser does not support WebRTC");
                }
            }).catch(function (err) {
                console.log(err);
            });
        } else {
            alert("sorry, your browser does not support WebRTC");
        }
    }

    function setupPeerConnection(stream) {
        var configuration = {
            "iceServers": [{
                "urls": "stun:stun.l.google.com:19302" //google stun
            }]
        };
        myConnection = new RTCPeerConnection(configuration);
        //ÉèÖÃÁ÷µÄ¼àÌý
        myConnection.addStream(stream);
        myConnection.onaddstream = function (e) {
            Dom(2);
            theirVideo.elem.srcObject = e.stream;
        };
        //ÉèÖÃice´¦ÀíÊÂ¼þ
        myConnection.onicecandidate = function (e) {
            console.log('ConnectionÌí¼Ócandidate');
            if (e.candidate) {
                send({
                    type: 'candidate',
                    candidate: e.candidate
                });
            }
        };
    }
    function startPeerConnection() {
        // connectedUser = user;  //±£´æconnTarget

        //´´½¨offer
        //
        //myPeerConnection.createOffer(successCallback, failureCallback, [options])
        //  MDN ¶ÔcreateOfferµÄ×¢½â
        //The createOffer() method of the RTCPeerConnection interface initiates the creation of an SDP offer which includes information about any MediaStreamTracks already attached to the WebRTC session, codec and options supported by the browser, and any candidates already gathered by the ICE agent, for the purpose of being sent over the signaling channel to a potential peer to request a connection or to update the configuration of an existing connection.
        //
        //´´½¨SDP(°üÀ¨×Ô¼ºä¯ÀÀÆ÷µÄ»á»°,±àÒëÆ÷ºÍÉè±¸Ö§³ÖÐÅÏ¢)
        myConnection.createOffer(function (offer) {
            send({
                type: 'offer',
                offer: offer //SDP ÐÅÏ¢
            });
            //½«SDP·ÅÈëconnection
            myConnection.setLocalDescription(offer); //asyn
        }, function (error) {
            console.log("An error has occurred at createOffer", error);
            alert("An error has occurred");
        });
    }

    function hasUserMedia() {
        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.getUserMedia || navigator.mozGetUserMedia || // mozÄÚºË
        navigator.msGetUserMedia;
        return !!navigator.getUserMedia;
    }

    function hasRTCPeerConnection() {
        window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.msRTCPeerConnection;

        window.RTCSessionDescription = window.RTCSessionDescription || window.webkitRTCSessionDescription || window.mozRTCSessionDescription || window.msRTCSessionDescription;

        window.RTCIceCandidate = window.RTCIceCandidate || window.webkitIceCandidate || window.mozIceCandidate;
        // window.msIceCandidate;

        return !!window.RTCPeerConnection;
    }
})(jQuery);

/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "@font-face {\r\n  font-family: \"pingfang\";\r\n  src: url(\"" + __webpack_require__(9) + "\");\r\n  font-size: 20px;\r\n}\r\n\r\nbody{\r\n  padding: 0;\r\n  font-family: pingfang;\r\n  box-sizing: border-box;\r\n  overflow: hidden;\r\n  background-color: #719dca;\r\n}\r\n\r\n.activ{\r\n  border-top: 2px solid #719dca;\r\n}\r\n\r\n.navbar-inner{\r\n  font-size: 14px;\r\n  color: #b7bbcb;\r\n  background: #ffffff;\r\n}\r\n\r\n.navbar .brand{\r\n  padding-top: 0;\r\n}\r\n\r\n.ht-nav,.ht-nav>div,\r\n.ht-nav ul{\r\n  height: 60px;\r\n}\r\n\r\n.navbar .nav>li{\r\n  margin: 20px 40px 0 0;\r\n  padding: 10px 10px;\r\n  -webkit-transition: all .5s;\r\n  -moz-transition: all .5s;\r\n  -ms-transition: all .5s;\r\n  -o-transition: all .5s;\r\n  transition: all .5s;\r\n}\r\n\r\n.navbar .nav>.active>a{\r\n  box-shadow: none;\r\n  background: none;\r\n}\r\n\r\n.navbar .nav>li>a{\r\n  padding:0;\r\n}\r\n\r\n.navbar .btn{\r\n  margin-top: 20px;\r\n}\r\n\r\n.navbar .nav>li:hover{\r\n  border-top: 0;\r\n  background: rgba(255, 255, 0, 0.52);\r\n}\r\n\r\n.ht-nav img{\r\n  width: 70px;\r\n  height: 50px;\r\n}\r\n\r\n@media (max-width:1000px) {\r\n  .ht-nav ul{\r\n    margin: 0;\r\n    min-height: 180px;\r\n    background-color: rgba(255, 255, 255, 0.44);\r\n  }\r\n\r\n  .ht-nav ul>li{\r\n    border-top: none;\r\n  }\r\n\r\n  .ht-nav ul>li:first-child{\r\n    margin-top: 5px;\r\n  }\r\n}\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n.container>header{\r\n  margin: 20px 0 0 0;\r\n  width: 100%;\r\n  height: 100px;\r\n}\r\n\r\n.container>header>img{\r\n  display: block;\r\n  margin: 0 auto;\r\n  width: 130px;\r\n  height: 100px;\r\n}\r\n\r\n.ht-video{\r\n  position: relative;\r\n  margin: 20px auto 0 auto;\r\n  width: 60%;\r\n  min-width: 700px;\r\n  height: 490px;\r\n  background: url(" + __webpack_require__(10) + ") no-repeat;\r\n  background-size: cover;\r\n}\r\n\r\n.ht-video .ht-hevideo{\r\n  width: 100%;\r\n  height: 50px;\r\n}\r\n\r\n.ht-video .ht-opacity{\r\n  display: none;\r\n  position: absolute;\r\n  top:0;\r\n  left: 0;\r\n  width: 100%;\r\n  height: 490px;\r\n  z-index: 10;\r\n  background-color: #000000;\r\n}\r\n\r\n.ht-video .ht-myvideo{\r\n  position: absolute;\r\n  top: 10px;\r\n  right: 10px;\r\n  border:1px solid #ffffff;\r\n  width: 100px;\r\n  height: 120px;\r\n  z-index: 100;\r\n}\r\n\r\n.ht-video .ht-video-go{\r\n  position: absolute;\r\n  left: 0;\r\n  top: 350px;\r\n  width: 100%;\r\n  height: 110px;\r\n  background-color: rgba(0, 0, 0, 0.2);\r\n  z-index: 20;\r\n}\r\n\r\n.ht-video .ht-video-go>button{\r\n  display: block;\r\n  margin: 5px auto;\r\n  border: 0;\r\n  border-radius: 50px;\r\n  width: 100px;\r\n  height: 100px;\r\n  line-height: 80px;\r\n  text-align: center;\r\n  font-size: 24px;\r\n  font-weight: bold;\r\n  color: #ffffff;\r\n  background-color: rgba(0, 0, 0, 0.4);\r\n  -webkit-transition: all .3s;\r\n  -moz-transition: all .3s;\r\n  -ms-transition: all .3s;\r\n  -o-transition: all .3s;\r\n  transition: all .3s;\r\n}\r\n\r\n.ht-video .ht-video-go>button:hover{\r\n  color: rgba(255, 255, 255, 0.53);\r\n  background-color: rgba(0, 0, 0, 0.62);\r\n}\r\n\r\n\r\n.ht-video .ht-video-back{\r\n  display: none;\r\n}\r\n\r\n.ht-video .ht-video-go{\r\n  display: none;\r\n}\r\n\r\n.ht-video .ht-video-login{\r\n  display: block;\r\n}\r\n\r\n.ht-left,.ht-right{\r\n  position: absolute;\r\n  top: 60px;\r\n  height: 500px;\r\n  width: 150px;\r\n  box-sizing: border-box;\r\n  background-color: #ffffff;\r\n  -webkit-transition: all .5s;\r\n  -moz-transition: all .5s;\r\n  -ms-transition: all .5s;\r\n  -o-transition: all .5s;\r\n  transition: all .5s;\r\n}\r\n\r\n.ht-left ul,.ht-right>ul{\r\n  list-style-type: none;\r\n  width: 120%;\r\n  margin: 40px 0 0 0;\r\n  min-height: 120px;\r\n  max-height: 400px;\r\n  font-size: 14px;\r\n  box-sizing: border-box;\r\n  overflow: auto;\r\n  color: #cccccc;\r\n}\r\n.ht-right>h5{\r\n  margin: 20px 0;\r\n  width: 100%;\r\n  text-align: center;\r\n  font-size: 16px;\r\n  color: #cccccc;\r\n}\r\n\r\n.ht-left>ul li,.ht-right>ul>li{\r\n  list-style-type: none;\r\n  margin: 0 0 40px 0px;\r\n  width: 100%;\r\n  height: 40px;\r\n  line-height: 40px;\r\n  box-sizing: border-box;\r\n  cursor: pointer;\r\n}\r\n\r\n.ht-right>ul>li>span:not(:first-child){\r\n  float: right;\r\n  display: inline-block;\r\n  margin-left: 5px;\r\n  font-size: 12px;\r\n}\r\n\r\n.ht-right>ul>li>span:nth-child(2){\r\n  color: rgba(255, 0, 0, 0.68);\r\n}\r\n\r\n.ht-right>ul>li>span:nth-child(3){\r\n  color: green;\r\n}\r\n\r\n.ht-left a,.ht-right a{\r\n  text-decoration: none;\r\n  color: #cccccc;\r\n}\r\n\r\n.ht-left>ul li:hover,.ht-right>ul>li:hover{\r\n  background-color: rgba(255, 255, 0, 0.2);\r\n}\r\n\r\n.actived{\r\n  background-color: rgba(255, 255, 0, 0.8);\r\n}\r\n\r\n.ht-left>ul li{\r\n  padding-left: 70px;\r\n}\r\n\r\n.ht-right>ul{\r\n  margin-left: -20%;\r\n}\r\n\r\n.ht-right>ul>li{\r\n  padding-left: 30%;\r\n}\r\n\r\n.ht-left{\r\n  left: -150px;\r\n}\r\n\r\n.ht-left:hover{\r\n  left: 0;\r\n}\r\n\r\n.ht-right{\r\n  right: -150px;\r\n}\r\n\r\n.ht-right:hover{\r\n  right: 0;\r\n}\r\n\r\n.ht-jb-to{\r\n  position: absolute;\r\n  top:-350px;\r\n  left: 35%;\r\n  -webkit-box-sizing: border-box;\r\n  -moz-box-sizing: border-box;\r\n  box-sizing: border-box;\r\n  padding: 20px 100px;\r\n  width: 30%;\r\n  height: 300px;\r\n  background: rgba(156, 156, 156, 0.64);\r\n  -webkit-transition: top 1s;\r\n  -moz-transition: top 1s;\r\n  -ms-transition: top 1s;\r\n  -o-transition: top 1s;\r\n  transition: top 1s;\r\n}\r\n\r\n.ht-jb-to textarea{\r\n  resize: none;\r\n}\r\n\r\n.ht-jb-to>div{\r\n  margin-top: 5px;\r\n}\r\n\r\n.ht-jb-to button{\r\n  margin-top: 20px;\r\n}\r\n\r\n.ht-ahs{\r\n  position: absolute;\r\n  right: 200px;\r\n  -webkit-box-sizing: border-box;\r\n  -moz-box-sizing: border-box;\r\n  box-sizing: border-box;\r\n  border-radius: 10px;\r\n  padding: 20px 10px;\r\n  width: 100px;\r\n  background: rgba(0, 128, 0, 0.4);\r\n  -webkit-transition: all .5s;\r\n  -moz-transition: all .5s;\r\n  -ms-transition: all .5s;\r\n  -o-transition: all .5s;\r\n  transition: all .5s;\r\n}\r\n\r\n.ht-ahs span{\r\n  display: inline-block;\r\n  margin-bottom: 20px;\r\n}", ""]);

// exports


/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "15974853bc3294ef68e7e6d58fe74fd7.ttf";

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDQ3NTdlOGMzNDU3NWUxNzA5ODIiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL19jc3MtbG9hZGVyQDAuMjguNUBjc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvX3N0eWxlLWxvYWRlckAwLjE4LjJAc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanMiLCJ3ZWJwYWNrOi8vLy4vYWxsL2ltZy92aWRlby1iZy5qcGciLCJ3ZWJwYWNrOi8vLy4vYWxsL2ltZy9sb2dvLTEucG5nIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9fc3R5bGUtbG9hZGVyQDAuMTguMkBzdHlsZS1sb2FkZXIvbGliL3VybHMuanMiLCJ3ZWJwYWNrOi8vLy4vYWxsL2pzL2luZGV4LmpzIiwid2VicGFjazovLy8uL2FsbC9jc3MvaW5kZXguY3NzPzhjMmMiLCJ3ZWJwYWNrOi8vLy4vYWxsL3ZpZXcvaW5kZXgtYm9kLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vYWxsL2pzL2NsaWVudC5qcyIsIndlYnBhY2s6Ly8vLi9hbGwvY3NzL2luZGV4LmNzcyIsIndlYnBhY2s6Ly8vLi9hbGwvZm9udHMvUGluZ0ZhbmcgTWVkaXVtLnR0ZiJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiaW5kZXhib2R5IiwiJCIsInByZXBlbmQiLCJpbmRleCIsInRvTG9hZCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJhbGVydCIsImxvY2F0aW9uIiwiaHJlZiIsIm9uQ2xpY2siLCJkb2N1bWVudCIsIm9uIiwiZXZlbnQiLCJ0YXJnZXQiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJoYXNDbGFzcyIsInNpYmxpbmdzIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsInBhcmVudCIsInZhbCIsImF0dHIiLCJjc3MiLCJhamF4IiwidXJsIiwidHlwZSIsImRhdGFUeXBlIiwiZGF0YSIsInVzZXJOYW1lIiwic3VjY2VzcyIsInN0cmluZyIsImNvZGUiLCJuYW1lIiwiZXh0ZW5kIiwibWVzc2FnZSIsImZpbmQiLCJyZW1vdmUiLCJhcHBlbmQiLCJhbmltYXRlIiwid2lkdGgiLCJpZCIsImRhdCIsInVzZXJiIiwicmVhc29uIiwidXNlcmEiLCJjaGVja2VkIiwiZXJyb3IiLCJsZW5ndGgiLCJhc3ljbiIsIndpbmRvdyIsImFjdGl2ZSIsImpRdWVyeSIsInJlYWR5Iiwic3RyIiwiJHVsIiwiYXN5bmMiLCJmb3JFYWNoIiwiaXRlbSIsInVzZXJCIiwidGltZSIsImNvbnNvbGUiLCJsb2ciLCJpbm5lckhUTUwiLCJkIiwiRGF0ZSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJnZXRNaW51dGVzIiwiRnh5IiwiZWxlbSIsInF1ZXJ5U2VsZWN0b3IiLCJwcm90b3R5cGUiLCJmbiIsIm5vZGVUeXBlIiwiRXJyb3IiLCJhZGRFdmVudExpc3RlbmVyIiwiYXR0YWNoRXZlbnQiLCJEb20iLCJ0eXAiLCJsb2dpbkJ0biIsInN0eWxlIiwiZGlzcGxheSIsImNhbGxCdG4iLCJoYW5nVXBCdG4iLCJzZXRUaW1lIiwiZmFkZU91dCIsInRpbWVvdXQiLCJzZXRJbnRlcnZhbCIsImxlYXZlIiwiY2xlYXJJbnRlcnZhbCIsImNvbm5lY3RlZFVzZXIiLCJjb25uZWN0aW9uIiwiV2ViU29ja2V0IiwibG9naW5QYWdlIiwibXlWaWRlbyIsInRoZWlyVmlkZW8iLCJteUNvbm5lY3Rpb24iLCJzdHJlYW0iLCJlIiwibG9naW4iLCJzZW5kIiwib25MZWF2ZSIsInN0YXJ0UGVlckNvbm5lY3Rpb24iLCJvbkxvZ2luIiwic3RhcnRDb25uZWN0aW9uIiwib25PZmZlciIsIm9mZmVyIiwic2V0UmVtb3RlRGVzY3JpcHRpb24iLCJSVENTZXNzaW9uRGVzY3JpcHRpb24iLCJjcmVhdGVBbnN3ZXIiLCJhbnN3ZXIiLCJzZXRMb2NhbERlc2NyaXB0aW9uIiwib25BbnN3ZXIiLCJvbkNhbmRpZGF0ZSIsImNhbmRpZGF0ZSIsImFkZEljZUNhbmRpZGF0ZSIsIlJUQ0ljZUNhbmRpZGF0ZSIsImNsb3NlIiwib25pY2VjYW5kaWRhdGUiLCJvbmFkZHN0cmVhbSIsInNldHVwUGVlckNvbm5lY3Rpb24iLCJvbm9wZW4iLCJvbm1lc3NhZ2UiLCJtc2ciLCJKU09OIiwicGFyc2UiLCJvbmVycm9yIiwiZXJyIiwic3RyaW5naWZ5IiwiaGFzVXNlck1lZGlhIiwib3B0cyIsInZpZGVvIiwiYXVkaW8iLCJuYXZpZ2F0b3IiLCJtZWRpYURldmljZXMiLCJnZXRVc2VyTWVkaWEiLCJ0aGVuIiwibXlTdHJlYW0iLCJzcmNPYmplY3QiLCJoYXNSVENQZWVyQ29ubmVjdGlvbiIsImNhdGNoIiwiY29uZmlndXJhdGlvbiIsIlJUQ1BlZXJDb25uZWN0aW9uIiwiYWRkU3RyZWFtIiwiY3JlYXRlT2ZmZXIiLCJ3ZWJraXRHZXRVc2VyTWVkaWEiLCJtb3pHZXRVc2VyTWVkaWEiLCJtc0dldFVzZXJNZWRpYSIsIndlYmtpdFJUQ1BlZXJDb25uZWN0aW9uIiwibW96UlRDUGVlckNvbm5lY3Rpb24iLCJtc1JUQ1BlZXJDb25uZWN0aW9uIiwid2Via2l0UlRDU2Vzc2lvbkRlc2NyaXB0aW9uIiwibW96UlRDU2Vzc2lvbkRlc2NyaXB0aW9uIiwibXNSVENTZXNzaW9uRGVzY3JpcHRpb24iLCJ3ZWJraXRJY2VDYW5kaWRhdGUiLCJtb3pJY2VDYW5kaWRhdGUiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUVBQTJEO0FBQzNEO0FBQ0E7QUFDQSxXQUFHOztBQUVILG9EQUE0QztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3REFBZ0Q7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7Ozs7QUFJQTtBQUNBLHNEQUE4QztBQUM5QztBQUNBO0FBQ0Esb0NBQTRCO0FBQzVCLHFDQUE2QjtBQUM3Qix5Q0FBaUM7O0FBRWpDLCtDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4Q0FBc0M7QUFDdEM7QUFDQTtBQUNBLHFDQUE2QjtBQUM3QixxQ0FBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUFvQixnQkFBZ0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQWlCLDhCQUE4QjtBQUMvQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7O0FBRUEsNERBQW9EO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUFtQiwyQkFBMkI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQWtCLGNBQWM7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQWEsNEJBQTRCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNCQUFjLDRCQUE0QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBZ0IsdUNBQXVDO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtB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LHdCQUF3QixLQUFLLHdCQUF3Qix3QkFBd0IsS0FBSyxpQkFBaUIsbUJBQW1CLEtBQUssdUJBQXVCLGNBQWMsS0FBSyxrQkFBa0Isb0JBQW9CLEtBQUssd0JBQXdCLGVBQWUsS0FBSyxrQkFBa0IseUJBQXlCLGlCQUFpQixnQkFBZ0IscUNBQXFDLGtDQUFrQyw2QkFBNkIsMEJBQTBCLGlCQUFpQixvQkFBb0IsNENBQTRDLGlDQUFpQyw4QkFBOEIsNkJBQTZCLDRCQUE0Qix5QkFBeUIsS0FBSywyQkFBMkIsbUJBQW1CLEtBQUssc0JBQXNCLHNCQUFzQixLQUFLLHlCQUF5Qix1QkFBdUIsS0FBSyxnQkFBZ0IseUJBQXlCLG1CQUFtQixxQ0FBcUMsa0NBQWtDLDZCQUE2QiwwQkFBMEIseUJBQXlCLG1CQUFtQix1Q0FBdUMsa0NBQWtDLCtCQUErQiw4QkFBOEIsNkJBQTZCLDBCQUEwQixLQUFLLHFCQUFxQiw0QkFBNEIsMEJBQTBCLEtBQUs7O0FBRW5rTTs7Ozs7Ozs7QUNQQSxnRiIsImZpbGUiOiJqcy9pbmRleC5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHRmdW5jdGlvbiBob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuIFx0fVxuIFx0dmFyIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrID0gdGhpc1tcIndlYnBhY2tIb3RVcGRhdGVcIl07XG4gXHR0aGlzW1wid2VicGFja0hvdFVwZGF0ZVwiXSA9IFxyXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcclxuIFx0XHRpZihwYXJlbnRIb3RVcGRhdGVDYWxsYmFjaykgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHR9IDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XHJcbiBcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcbiBcdFx0c2NyaXB0LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xyXG4gXHRcdHNjcmlwdC5jaGFyc2V0ID0gXCJ1dGYtOFwiO1xyXG4gXHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzXCI7XHJcbiBcdFx0aGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZE1hbmlmZXN0KHJlcXVlc3RUaW1lb3V0KSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRyZXF1ZXN0VGltZW91dCA9IHJlcXVlc3RUaW1lb3V0IHx8IDEwMDAwO1xyXG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdGlmKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXCJObyBicm93c2VyIHN1cHBvcnRcIikpO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3RQYXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCI7XHJcbiBcdFx0XHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCByZXF1ZXN0UGF0aCwgdHJ1ZSk7XHJcbiBcdFx0XHRcdHJlcXVlc3QudGltZW91dCA9IHJlcXVlc3RUaW1lb3V0O1xyXG4gXHRcdFx0XHRyZXF1ZXN0LnNlbmQobnVsbCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KGVycik7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRpZihyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHJldHVybjtcclxuIFx0XHRcdFx0aWYocmVxdWVzdC5zdGF0dXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHQvLyB0aW1lb3V0XHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIHRpbWVkIG91dC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgPT09IDQwNCkge1xyXG4gXHRcdFx0XHRcdC8vIG5vIHVwZGF0ZSBhdmFpbGFibGVcclxuIFx0XHRcdFx0XHRyZXNvbHZlKCk7XHJcbiBcdFx0XHRcdH0gZWxzZSBpZihyZXF1ZXN0LnN0YXR1cyAhPT0gMjAwICYmIHJlcXVlc3Quc3RhdHVzICE9PSAzMDQpIHtcclxuIFx0XHRcdFx0XHQvLyBvdGhlciBmYWlsdXJlXHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIGZhaWxlZC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdC8vIHN1Y2Nlc3NcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0dmFyIHVwZGF0ZSA9IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZSkge1xyXG4gXHRcdFx0XHRcdFx0cmVqZWN0KGUpO1xyXG4gXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRyZXNvbHZlKHVwZGF0ZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuXG4gXHRcclxuIFx0XHJcbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcclxuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCI0NDc1N2U4YzM0NTc1ZTE3MDk4MlwiOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RSZXF1ZXN0VGltZW91dCA9IDEwMDAwO1xyXG4gXHR2YXIgaG90Q3VycmVudE1vZHVsZURhdGEgPSB7fTtcclxuIFx0dmFyIGhvdEN1cnJlbnRDaGlsZE1vZHVsZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHMgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHNUZW1wID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBtZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdGlmKCFtZSkgcmV0dXJuIF9fd2VicGFja19yZXF1aXJlX187XHJcbiBcdFx0dmFyIGZuID0gZnVuY3Rpb24ocmVxdWVzdCkge1xyXG4gXHRcdFx0aWYobWUuaG90LmFjdGl2ZSkge1xyXG4gXHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XHJcbiBcdFx0XHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpIDwgMClcclxuIFx0XHRcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5wdXNoKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gcmVxdWVzdDtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpIDwgMClcclxuIFx0XHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xyXG4gXHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVxdWVzdCArIFwiKSBmcm9tIGRpc3Bvc2VkIG1vZHVsZSBcIiArIG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHJlcXVlc3QpO1xyXG4gXHRcdH07XHJcbiBcdFx0dmFyIE9iamVjdEZhY3RvcnkgPSBmdW5jdGlvbiBPYmplY3RGYWN0b3J5KG5hbWUpIHtcclxuIFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcclxuIFx0XHRcdFx0fSxcclxuIFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fTtcclxuIFx0XHR9O1xyXG4gXHRcdGZvcih2YXIgbmFtZSBpbiBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkgJiYgbmFtZSAhPT0gXCJlXCIpIHtcclxuIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBPYmplY3RGYWN0b3J5KG5hbWUpKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0Zm4uZSA9IGZ1bmN0aW9uKGNodW5rSWQpIHtcclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJyZWFkeVwiKVxyXG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0aG90Q2h1bmtzTG9hZGluZysrO1xyXG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uZShjaHVua0lkKS50aGVuKGZpbmlzaENodW5rTG9hZGluZywgZnVuY3Rpb24oZXJyKSB7XHJcbiBcdFx0XHRcdGZpbmlzaENodW5rTG9hZGluZygpO1xyXG4gXHRcdFx0XHR0aHJvdyBlcnI7XHJcbiBcdFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0XHRmdW5jdGlvbiBmaW5pc2hDaHVua0xvYWRpbmcoKSB7XHJcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmctLTtcclxuIFx0XHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIikge1xyXG4gXHRcdFx0XHRcdGlmKCFob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0pIHtcclxuIFx0XHRcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH07XHJcbiBcdFx0cmV0dXJuIGZuO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBob3QgPSB7XHJcbiBcdFx0XHQvLyBwcml2YXRlIHN0dWZmXHJcbiBcdFx0XHRfYWNjZXB0ZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcclxuIFx0XHRcdF9zZWxmQWNjZXB0ZWQ6IGZhbHNlLFxyXG4gXHRcdFx0X3NlbGZEZWNsaW5lZDogZmFsc2UsXHJcbiBcdFx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcclxuIFx0XHRcdF9tYWluOiBob3RDdXJyZW50Q2hpbGRNb2R1bGUgIT09IG1vZHVsZUlkLFxyXG4gXHRcclxuIFx0XHRcdC8vIE1vZHVsZSBBUElcclxuIFx0XHRcdGFjdGl2ZTogdHJ1ZSxcclxuIFx0XHRcdGFjY2VwdDogZnVuY3Rpb24oZGVwLCBjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBbaV1dID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGVjbGluZTogZnVuY3Rpb24oZGVwKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmRGVjbGluZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXHJcbiBcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcclxuIFx0XHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGRpc3Bvc2U6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGFkZERpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRyZW1vdmVEaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkgaG90Ll9kaXNwb3NlSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcclxuIFx0XHRcdC8vIE1hbmFnZW1lbnQgQVBJXHJcbiBcdFx0XHRjaGVjazogaG90Q2hlY2ssXHJcbiBcdFx0XHRhcHBseTogaG90QXBwbHksXHJcbiBcdFx0XHRzdGF0dXM6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0aWYoIWwpIHJldHVybiBob3RTdGF0dXM7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZVN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdFN0YXR1c0hhbmRsZXJzLmluZGV4T2YobCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3RTdGF0dXNIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly9pbmhlcml0IGZyb20gcHJldmlvdXMgZGlzcG9zZSBjYWxsXHJcbiBcdFx0XHRkYXRhOiBob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF1cclxuIFx0XHR9O1xyXG4gXHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHVuZGVmaW5lZDtcclxuIFx0XHRyZXR1cm4gaG90O1xyXG4gXHR9XHJcbiBcdFxyXG4gXHR2YXIgaG90U3RhdHVzSGFuZGxlcnMgPSBbXTtcclxuIFx0dmFyIGhvdFN0YXR1cyA9IFwiaWRsZVwiO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90U2V0U3RhdHVzKG5ld1N0YXR1cykge1xyXG4gXHRcdGhvdFN0YXR1cyA9IG5ld1N0YXR1cztcclxuIFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgaG90U3RhdHVzSGFuZGxlcnMubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRob3RTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdC8vIHdoaWxlIGRvd25sb2FkaW5nXHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXMgPSAwO1xyXG4gXHR2YXIgaG90Q2h1bmtzTG9hZGluZyA9IDA7XHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RBdmFpbGFibGVGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90RGVmZXJyZWQ7XHJcbiBcdFxyXG4gXHQvLyBUaGUgdXBkYXRlIGluZm9cclxuIFx0dmFyIGhvdFVwZGF0ZSwgaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIHRvTW9kdWxlSWQoaWQpIHtcclxuIFx0XHR2YXIgaXNOdW1iZXIgPSAoK2lkKSArIFwiXCIgPT09IGlkO1xyXG4gXHRcdHJldHVybiBpc051bWJlciA/ICtpZCA6IGlkO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDaGVjayhhcHBseSkge1xyXG4gXHRcdGlmKGhvdFN0YXR1cyAhPT0gXCJpZGxlXCIpIHRocm93IG5ldyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xyXG4gXHRcdGhvdEFwcGx5T25VcGRhdGUgPSBhcHBseTtcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJjaGVja1wiKTtcclxuIFx0XHRyZXR1cm4gaG90RG93bmxvYWRNYW5pZmVzdChob3RSZXF1ZXN0VGltZW91dCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcclxuIFx0XHRcdGlmKCF1cGRhdGUpIHtcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RBdmFpbGFibGVGaWxlc01hcCA9IHVwZGF0ZS5jO1xyXG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xyXG4gXHRcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gXHRcdFx0XHRob3REZWZlcnJlZCA9IHtcclxuIFx0XHRcdFx0XHRyZXNvbHZlOiByZXNvbHZlLFxyXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xyXG4gXHRcdFx0dmFyIGNodW5rSWQgPSAyO1xyXG4gXHRcdFx0eyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvbmUtYmxvY2tzXHJcbiBcdFx0XHRcdC8qZ2xvYmFscyBjaHVua0lkICovXHJcbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gcHJvbWlzZTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXHJcbiBcdFx0XHRyZXR1cm47XHJcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcclxuIFx0XHRmb3IodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRpZigtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XHJcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XHJcbiBcdFx0aWYoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcclxuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xyXG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xyXG4gXHRcdGhvdERlZmVycmVkID0gbnVsbDtcclxuIFx0XHRpZighZGVmZXJyZWQpIHJldHVybjtcclxuIFx0XHRpZihob3RBcHBseU9uVXBkYXRlKSB7XHJcbiBcdFx0XHQvLyBXcmFwIGRlZmVycmVkIG9iamVjdCBpbiBQcm9taXNlIHRvIG1hcmsgaXQgYXMgYSB3ZWxsLWhhbmRsZWQgUHJvbWlzZSB0b1xyXG4gXHRcdFx0Ly8gYXZvaWQgdHJpZ2dlcmluZyB1bmNhdWdodCBleGNlcHRpb24gd2FybmluZyBpbiBDaHJvbWUuXHJcbiBcdFx0XHQvLyBTZWUgaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NDY1NjY2XHJcbiBcdFx0XHRQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRyZXR1cm4gaG90QXBwbHkoaG90QXBwbHlPblVwZGF0ZSk7XHJcbiBcdFx0XHR9KS50aGVuKFxyXG4gXHRcdFx0XHRmdW5jdGlvbihyZXN1bHQpIHtcclxuIFx0XHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XHJcbiBcdFx0XHRcdH0sXHJcbiBcdFx0XHRcdGZ1bmN0aW9uKGVycikge1xyXG4gXHRcdFx0XHRcdGRlZmVycmVkLnJlamVjdChlcnIpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHQpO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0XHRmb3IodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xyXG4gXHRcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaCh0b01vZHVsZUlkKGlkKSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHRcdGRlZmVycmVkLnJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcclxuIFx0XHRpZihob3RTdGF0dXMgIT09IFwicmVhZHlcIikgdGhyb3cgbmV3IEVycm9yKFwiYXBwbHkoKSBpcyBvbmx5IGFsbG93ZWQgaW4gcmVhZHkgc3RhdHVzXCIpO1xyXG4gXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gXHRcclxuIFx0XHR2YXIgY2I7XHJcbiBcdFx0dmFyIGk7XHJcbiBcdFx0dmFyIGo7XHJcbiBcdFx0dmFyIG1vZHVsZTtcclxuIFx0XHR2YXIgbW9kdWxlSWQ7XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGdldEFmZmVjdGVkU3R1ZmYodXBkYXRlTW9kdWxlSWQpIHtcclxuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbdXBkYXRlTW9kdWxlSWRdO1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XHJcbiBcdFxyXG4gXHRcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCkubWFwKGZ1bmN0aW9uKGlkKSB7XHJcbiBcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0Y2hhaW46IFtpZF0sXHJcbiBcdFx0XHRcdFx0aWQ6IGlkXHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdHdoaWxlKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuIFx0XHRcdFx0dmFyIHF1ZXVlSXRlbSA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0XHR2YXIgbW9kdWxlSWQgPSBxdWV1ZUl0ZW0uaWQ7XHJcbiBcdFx0XHRcdHZhciBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbjtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKCFtb2R1bGUgfHwgbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9zZWxmRGVjbGluZWQpIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKG1vZHVsZS5ob3QuX21haW4pIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJ1bmFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBtb2R1bGUucGFyZW50cy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdHZhciBwYXJlbnRJZCA9IG1vZHVsZS5wYXJlbnRzW2ldO1xyXG4gXHRcdFx0XHRcdHZhciBwYXJlbnQgPSBpbnN0YWxsZWRNb2R1bGVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRpZighcGFyZW50KSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRpZihwYXJlbnQuaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcclxuIFx0XHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGVjbGluZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcclxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRwYXJlbnRJZDogcGFyZW50SWRcclxuIFx0XHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKG91dGRhdGVkTW9kdWxlcy5pbmRleE9mKHBhcmVudElkKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRpZihwYXJlbnQuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSA9IFtdO1xyXG4gXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xyXG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHBhcmVudElkKTtcclxuIFx0XHRcdFx0XHRxdWV1ZS5wdXNoKHtcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRpZDogcGFyZW50SWRcclxuIFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcclxuIFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdHR5cGU6IFwiYWNjZXB0ZWRcIixcclxuIFx0XHRcdFx0bW9kdWxlSWQ6IHVwZGF0ZU1vZHVsZUlkLFxyXG4gXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXM6IG91dGRhdGVkTW9kdWxlcyxcclxuIFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXM6IG91dGRhdGVkRGVwZW5kZW5jaWVzXHJcbiBcdFx0XHR9O1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0ZnVuY3Rpb24gYWRkQWxsVG9TZXQoYSwgYikge1xyXG4gXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0dmFyIGl0ZW0gPSBiW2ldO1xyXG4gXHRcdFx0XHRpZihhLmluZGV4T2YoaXRlbSkgPCAwKVxyXG4gXHRcdFx0XHRcdGEucHVzaChpdGVtKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGF0IGJlZ2luIGFsbCB1cGRhdGVzIG1vZHVsZXMgYXJlIG91dGRhdGVkXHJcbiBcdFx0Ly8gdGhlIFwib3V0ZGF0ZWRcIiBzdGF0dXMgY2FuIHByb3BhZ2F0ZSB0byBwYXJlbnRzIGlmIHRoZXkgZG9uJ3QgYWNjZXB0IHRoZSBjaGlsZHJlblxyXG4gXHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHR2YXIgYXBwbGllZFVwZGF0ZSA9IHt9O1xyXG4gXHRcclxuIFx0XHR2YXIgd2FyblVuZXhwZWN0ZWRSZXF1aXJlID0gZnVuY3Rpb24gd2FyblVuZXhwZWN0ZWRSZXF1aXJlKCkge1xyXG4gXHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIpIHRvIGRpc3Bvc2VkIG1vZHVsZVwiKTtcclxuIFx0XHR9O1xyXG4gXHRcclxuIFx0XHRmb3IodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZUlkID0gdG9Nb2R1bGVJZChpZCk7XHJcbiBcdFx0XHRcdHZhciByZXN1bHQ7XHJcbiBcdFx0XHRcdGlmKGhvdFVwZGF0ZVtpZF0pIHtcclxuIFx0XHRcdFx0XHRyZXN1bHQgPSBnZXRBZmZlY3RlZFN0dWZmKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRyZXN1bHQgPSB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcImRpc3Bvc2VkXCIsXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogaWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdHZhciBhYm9ydEVycm9yID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBkb0FwcGx5ID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBkb0Rpc3Bvc2UgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGNoYWluSW5mbyA9IFwiXCI7XHJcbiBcdFx0XHRcdGlmKHJlc3VsdC5jaGFpbikge1xyXG4gXHRcdFx0XHRcdGNoYWluSW5mbyA9IFwiXFxuVXBkYXRlIHByb3BhZ2F0aW9uOiBcIiArIHJlc3VsdC5jaGFpbi5qb2luKFwiIC0+IFwiKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRzd2l0Y2gocmVzdWx0LnR5cGUpIHtcclxuIFx0XHRcdFx0XHRjYXNlIFwic2VsZi1kZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIHNlbGYgZGVjbGluZTogXCIgKyByZXN1bHQubW9kdWxlSWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImRlY2xpbmVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIiBpbiBcIiArIHJlc3VsdC5wYXJlbnRJZCArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwidW5hY2NlcHRlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vblVuYWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25VbmFjY2VwdGVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVVbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIFwiICsgbW9kdWxlSWQgKyBcIiBpcyBub3QgYWNjZXB0ZWRcIiArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25BY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkFjY2VwdGVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0FwcGx5ID0gdHJ1ZTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkaXNwb3NlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRpc3Bvc2VkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGlzcG9zZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGRvRGlzcG9zZSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRkZWZhdWx0OlxyXG4gXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leGNlcHRpb24gdHlwZSBcIiArIHJlc3VsdC50eXBlKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihhYm9ydEVycm9yKSB7XHJcbiBcdFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiYWJvcnRcIik7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGFib3J0RXJyb3IpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvQXBwbHkpIHtcclxuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IGhvdFVwZGF0ZVttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCByZXN1bHQub3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHRcdFx0XHRmb3IobW9kdWxlSWQgaW4gcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoIW91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSlcclxuIFx0XHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdLCByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoZG9EaXNwb3NlKSB7XHJcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCBbcmVzdWx0Lm1vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSB3YXJuVW5leHBlY3RlZFJlcXVpcmU7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIFN0b3JlIHNlbGYgYWNjZXB0ZWQgb3V0ZGF0ZWQgbW9kdWxlcyB0byByZXF1aXJlIHRoZW0gbGF0ZXIgYnkgdGhlIG1vZHVsZSBzeXN0ZW1cclxuIFx0XHR2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0Zm9yKGkgPSAwOyBpIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IG91dGRhdGVkTW9kdWxlc1tpXTtcclxuIFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdICYmIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMucHVzaCh7XHJcbiBcdFx0XHRcdFx0bW9kdWxlOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRlcnJvckhhbmRsZXI6IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXHJcbiBcdFx0XHRcdH0pO1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTm93IGluIFwiZGlzcG9zZVwiIHBoYXNlXHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiZGlzcG9zZVwiKTtcclxuIFx0XHRPYmplY3Qua2V5cyhob3RBdmFpbGFibGVGaWxlc01hcCkuZm9yRWFjaChmdW5jdGlvbihjaHVua0lkKSB7XHJcbiBcdFx0XHRpZihob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSA9PT0gZmFsc2UpIHtcclxuIFx0XHRcdFx0aG90RGlzcG9zZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH0pO1xyXG4gXHRcclxuIFx0XHR2YXIgaWR4O1xyXG4gXHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpO1xyXG4gXHRcdHdoaWxlKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuIFx0XHRcdG1vZHVsZUlkID0gcXVldWUucG9wKCk7XHJcbiBcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdGlmKCFtb2R1bGUpIGNvbnRpbnVlO1xyXG4gXHRcclxuIFx0XHRcdHZhciBkYXRhID0ge307XHJcbiBcdFxyXG4gXHRcdFx0Ly8gQ2FsbCBkaXNwb3NlIGhhbmRsZXJzXHJcbiBcdFx0XHR2YXIgZGlzcG9zZUhhbmRsZXJzID0gbW9kdWxlLmhvdC5fZGlzcG9zZUhhbmRsZXJzO1xyXG4gXHRcdFx0Zm9yKGogPSAwOyBqIDwgZGlzcG9zZUhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdGNiID0gZGlzcG9zZUhhbmRsZXJzW2pdO1xyXG4gXHRcdFx0XHRjYihkYXRhKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXSA9IGRhdGE7XHJcbiBcdFxyXG4gXHRcdFx0Ly8gZGlzYWJsZSBtb2R1bGUgKHRoaXMgZGlzYWJsZXMgcmVxdWlyZXMgZnJvbSB0aGlzIG1vZHVsZSlcclxuIFx0XHRcdG1vZHVsZS5ob3QuYWN0aXZlID0gZmFsc2U7XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIG1vZHVsZSBmcm9tIGNhY2hlXHJcbiBcdFx0XHRkZWxldGUgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFxyXG4gXHRcdFx0Ly8gd2hlbiBkaXNwb3NpbmcgdGhlcmUgaXMgbm8gbmVlZCB0byBjYWxsIGRpc3Bvc2UgaGFuZGxlclxyXG4gXHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHJcbiBcdFx0XHQvLyByZW1vdmUgXCJwYXJlbnRzXCIgcmVmZXJlbmNlcyBmcm9tIGFsbCBjaGlsZHJlblxyXG4gXHRcdFx0Zm9yKGogPSAwOyBqIDwgbW9kdWxlLmNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdHZhciBjaGlsZCA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcclxuIFx0XHRcdFx0aWYoIWNoaWxkKSBjb250aW51ZTtcclxuIFx0XHRcdFx0aWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIHtcclxuIFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyByZW1vdmUgb3V0ZGF0ZWQgZGVwZW5kZW5jeSBmcm9tIG1vZHVsZSBjaGlsZHJlblxyXG4gXHRcdHZhciBkZXBlbmRlbmN5O1xyXG4gXHRcdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUpIHtcclxuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRmb3IoaiA9IDA7IGogPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2pdO1xyXG4gXHRcdFx0XHRcdFx0aWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XHJcbiBcdFx0XHRcdFx0XHRpZihpZHggPj0gMCkgbW9kdWxlLmNoaWxkcmVuLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTm90IGluIFwiYXBwbHlcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImFwcGx5XCIpO1xyXG4gXHRcclxuIFx0XHRob3RDdXJyZW50SGFzaCA9IGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRcdC8vIGluc2VydCBuZXcgY29kZVxyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXBwbGllZFVwZGF0ZSwgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVttb2R1bGVJZF07XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBjYWxsIGFjY2VwdCBoYW5kbGVyc1xyXG4gXHRcdHZhciBlcnJvciA9IG51bGw7XHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYobW9kdWxlKSB7XHJcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xyXG4gXHRcdFx0XHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV07XHJcbiBcdFx0XHRcdFx0XHRjYiA9IG1vZHVsZS5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcGVuZGVuY3ldO1xyXG4gXHRcdFx0XHRcdFx0aWYoY2IpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoY2FsbGJhY2tzLmluZGV4T2YoY2IpID49IDApIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdFx0XHRjYWxsYmFja3MucHVzaChjYik7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGZvcihpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdFx0Y2IgPSBjYWxsYmFja3NbaV07XHJcbiBcdFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0XHRjYihtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyk7XHJcbiBcdFx0XHRcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV0sXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBMb2FkIHNlbGYgYWNjZXB0ZWQgbW9kdWxlc1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0dmFyIGl0ZW0gPSBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRtb2R1bGVJZCA9IGl0ZW0ubW9kdWxlO1xyXG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRpdGVtLmVycm9ySGFuZGxlcihlcnIpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZXJyMikge1xyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3ItaGFuZGxlci1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnIyLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG9yZ2luYWxFcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnIyO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxyXG4gXHRcdGlmKGVycm9yKSB7XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xyXG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcclxuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gX193ZWJwYWNrX2hhc2hfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5oID0gZnVuY3Rpb24oKSB7IHJldHVybiBob3RDdXJyZW50SGFzaDsgfTtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gaG90Q3JlYXRlUmVxdWlyZSgzNSkoX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMzUpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDQ0NzU3ZThjMzQ1NzVlMTcwOTgyIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgbGlzdCA9IFtdO1xuXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0dmFyIGNvbnRlbnQgPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCk7XG5cdFx0XHRpZihpdGVtWzJdKSB7XG5cdFx0XHRcdHJldHVybiBcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGNvbnRlbnQgKyBcIn1cIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBjb250ZW50O1xuXHRcdFx0fVxuXHRcdH0pLmpvaW4oXCJcIik7XG5cdH07XG5cblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3Rcblx0bGlzdC5pID0gZnVuY3Rpb24obW9kdWxlcywgbWVkaWFRdWVyeSkge1xuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xuXHRcdHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XG5cdFx0XHRpZih0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcblx0XHR9XG5cdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxuXHRcdFx0Ly8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxuXHRcdFx0aWYodHlwZW9mIGl0ZW1bMF0gIT09IFwibnVtYmVyXCIgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xuXHRcdFx0XHR9IGVsc2UgaWYobWVkaWFRdWVyeSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRyZXR1cm4gbGlzdDtcbn07XG5cbmZ1bmN0aW9uIGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKSB7XG5cdHZhciBjb250ZW50ID0gaXRlbVsxXSB8fCAnJztcblx0dmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuXHRpZiAoIWNzc01hcHBpbmcpIHtcblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxuXG5cdGlmICh1c2VTb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcblx0XHR2YXIgc291cmNlTWFwcGluZyA9IHRvQ29tbWVudChjc3NNYXBwaW5nKTtcblx0XHR2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuXHRcdFx0cmV0dXJuICcvKiMgc291cmNlVVJMPScgKyBjc3NNYXBwaW5nLnNvdXJjZVJvb3QgKyBzb3VyY2UgKyAnICovJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbignXFxuJyk7XG5cdH1cblxuXHRyZXR1cm4gW2NvbnRlbnRdLmpvaW4oJ1xcbicpO1xufVxuXG4vLyBBZGFwdGVkIGZyb20gY29udmVydC1zb3VyY2UtbWFwIChNSVQpXG5mdW5jdGlvbiB0b0NvbW1lbnQoc291cmNlTWFwKSB7XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuXHR2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKTtcblx0dmFyIGRhdGEgPSAnc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJyArIGJhc2U2NDtcblxuXHRyZXR1cm4gJy8qIyAnICsgZGF0YSArICcgKi8nO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvX2Nzcy1sb2FkZXJAMC4yOC41QGNzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUgNiIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5cbnZhciBzdHlsZXNJbkRvbSA9IHt9O1xuXG52YXJcdG1lbW9pemUgPSBmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW87XG5cblx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdHJldHVybiBtZW1vO1xuXHR9O1xufTtcblxudmFyIGlzT2xkSUUgPSBtZW1vaXplKGZ1bmN0aW9uICgpIHtcblx0Ly8gVGVzdCBmb3IgSUUgPD0gOSBhcyBwcm9wb3NlZCBieSBCcm93c2VyaGFja3Ncblx0Ly8gQHNlZSBodHRwOi8vYnJvd3NlcmhhY2tzLmNvbS8jaGFjay1lNzFkODY5MmY2NTMzNDE3M2ZlZTcxNWMyMjJjYjgwNVxuXHQvLyBUZXN0cyBmb3IgZXhpc3RlbmNlIG9mIHN0YW5kYXJkIGdsb2JhbHMgaXMgdG8gYWxsb3cgc3R5bGUtbG9hZGVyXG5cdC8vIHRvIG9wZXJhdGUgY29ycmVjdGx5IGludG8gbm9uLXN0YW5kYXJkIGVudmlyb25tZW50c1xuXHQvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyL2lzc3Vlcy8xNzdcblx0cmV0dXJuIHdpbmRvdyAmJiBkb2N1bWVudCAmJiBkb2N1bWVudC5hbGwgJiYgIXdpbmRvdy5hdG9iO1xufSk7XG5cbnZhciBnZXRFbGVtZW50ID0gKGZ1bmN0aW9uIChmbikge1xuXHR2YXIgbWVtbyA9IHt9O1xuXG5cdHJldHVybiBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdGlmICh0eXBlb2YgbWVtb1tzZWxlY3Rvcl0gPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdG1lbW9bc2VsZWN0b3JdID0gZm4uY2FsbCh0aGlzLCBzZWxlY3Rvcik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG1lbW9bc2VsZWN0b3JdXG5cdH07XG59KShmdW5jdGlvbiAodGFyZ2V0KSB7XG5cdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldClcbn0pO1xuXG52YXIgc2luZ2xldG9uID0gbnVsbDtcbnZhclx0c2luZ2xldG9uQ291bnRlciA9IDA7XG52YXJcdHN0eWxlc0luc2VydGVkQXRUb3AgPSBbXTtcblxudmFyXHRmaXhVcmxzID0gcmVxdWlyZShcIi4vdXJsc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XG5cdGlmICh0eXBlb2YgREVCVUcgIT09IFwidW5kZWZpbmVkXCIgJiYgREVCVUcpIHtcblx0XHRpZiAodHlwZW9mIGRvY3VtZW50ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3R5bGUtbG9hZGVyIGNhbm5vdCBiZSB1c2VkIGluIGEgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRcIik7XG5cdH1cblxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRvcHRpb25zLmF0dHJzID0gdHlwZW9mIG9wdGlvbnMuYXR0cnMgPT09IFwib2JqZWN0XCIgPyBvcHRpb25zLmF0dHJzIDoge307XG5cblx0Ly8gRm9yY2Ugc2luZ2xlLXRhZyBzb2x1dGlvbiBvbiBJRTYtOSwgd2hpY2ggaGFzIGEgaGFyZCBsaW1pdCBvbiB0aGUgIyBvZiA8c3R5bGU+XG5cdC8vIHRhZ3MgaXQgd2lsbCBhbGxvdyBvbiBhIHBhZ2Vcblx0aWYgKCFvcHRpb25zLnNpbmdsZXRvbikgb3B0aW9ucy5zaW5nbGV0b24gPSBpc09sZElFKCk7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgPGhlYWQ+IGVsZW1lbnRcblx0aWYgKCFvcHRpb25zLmluc2VydEludG8pIG9wdGlvbnMuaW5zZXJ0SW50byA9IFwiaGVhZFwiO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIGJvdHRvbSBvZiB0aGUgdGFyZ2V0XG5cdGlmICghb3B0aW9ucy5pbnNlcnRBdCkgb3B0aW9ucy5pbnNlcnRBdCA9IFwiYm90dG9tXCI7XG5cblx0dmFyIHN0eWxlcyA9IGxpc3RUb1N0eWxlcyhsaXN0LCBvcHRpb25zKTtcblxuXHRhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUgKG5ld0xpc3QpIHtcblx0XHR2YXIgbWF5UmVtb3ZlID0gW107XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblxuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xuXHRcdH1cblxuXHRcdGlmKG5ld0xpc3QpIHtcblx0XHRcdHZhciBuZXdTdHlsZXMgPSBsaXN0VG9TdHlsZXMobmV3TGlzdCwgb3B0aW9ucyk7XG5cdFx0XHRhZGRTdHlsZXNUb0RvbShuZXdTdHlsZXMsIG9wdGlvbnMpO1xuXHRcdH1cblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbWF5UmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBtYXlSZW1vdmVbaV07XG5cblx0XHRcdGlmKGRvbVN0eWxlLnJlZnMgPT09IDApIHtcblx0XHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykgZG9tU3R5bGUucGFydHNbal0oKTtcblxuXHRcdFx0XHRkZWxldGUgc3R5bGVzSW5Eb21bZG9tU3R5bGUuaWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07XG5cbmZ1bmN0aW9uIGFkZFN0eWxlc1RvRG9tIChzdHlsZXMsIG9wdGlvbnMpIHtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblxuXHRcdGlmKGRvbVN0eWxlKSB7XG5cdFx0XHRkb21TdHlsZS5yZWZzKys7XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXShpdGVtLnBhcnRzW2pdKTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yKDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBwYXJ0cyA9IFtdO1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRwYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblxuXHRcdFx0c3R5bGVzSW5Eb21baXRlbS5pZF0gPSB7aWQ6IGl0ZW0uaWQsIHJlZnM6IDEsIHBhcnRzOiBwYXJ0c307XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGxpc3RUb1N0eWxlcyAobGlzdCwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGVzID0gW107XG5cdHZhciBuZXdTdHlsZXMgPSB7fTtcblxuXHRmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XG5cdFx0dmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG5cdFx0dmFyIGNzcyA9IGl0ZW1bMV07XG5cdFx0dmFyIG1lZGlhID0gaXRlbVsyXTtcblx0XHR2YXIgc291cmNlTWFwID0gaXRlbVszXTtcblx0XHR2YXIgcGFydCA9IHtjc3M6IGNzcywgbWVkaWE6IG1lZGlhLCBzb3VyY2VNYXA6IHNvdXJjZU1hcH07XG5cblx0XHRpZighbmV3U3R5bGVzW2lkXSkgc3R5bGVzLnB1c2gobmV3U3R5bGVzW2lkXSA9IHtpZDogaWQsIHBhcnRzOiBbcGFydF19KTtcblx0XHRlbHNlIG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KTtcblx0fVxuXG5cdHJldHVybiBzdHlsZXM7XG59XG5cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudCAob3B0aW9ucywgc3R5bGUpIHtcblx0dmFyIHRhcmdldCA9IGdldEVsZW1lbnQob3B0aW9ucy5pbnNlcnRJbnRvKVxuXG5cdGlmICghdGFyZ2V0KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnRJbnRvJyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG5cdH1cblxuXHR2YXIgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AgPSBzdHlsZXNJbnNlcnRlZEF0VG9wW3N0eWxlc0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XG5cblx0aWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidG9wXCIpIHtcblx0XHRpZiAoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XG5cdFx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCB0YXJnZXQuZmlyc3RDaGlsZCk7XG5cdFx0fSBlbHNlIGlmIChsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xuXHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXHRcdH1cblx0XHRzdHlsZXNJbnNlcnRlZEF0VG9wLnB1c2goc3R5bGUpO1xuXHR9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwiYm90dG9tXCIpIHtcblx0XHR0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciAnaW5zZXJ0QXQnLiBNdXN0IGJlICd0b3AnIG9yICdib3R0b20nLlwiKTtcblx0fVxufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQgKHN0eWxlKSB7XG5cdGlmIChzdHlsZS5wYXJlbnROb2RlID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cdHN0eWxlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGUpO1xuXG5cdHZhciBpZHggPSBzdHlsZXNJbnNlcnRlZEF0VG9wLmluZGV4T2Yoc3R5bGUpO1xuXHRpZihpZHggPj0gMCkge1xuXHRcdHN0eWxlc0luc2VydGVkQXRUb3Auc3BsaWNlKGlkeCwgMSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU3R5bGVFbGVtZW50IChvcHRpb25zKSB7XG5cdHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcblxuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cblx0YWRkQXR0cnMoc3R5bGUsIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGUpO1xuXG5cdHJldHVybiBzdHlsZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTGlua0VsZW1lbnQgKG9wdGlvbnMpIHtcblx0dmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcblxuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cdG9wdGlvbnMuYXR0cnMucmVsID0gXCJzdHlsZXNoZWV0XCI7XG5cblx0YWRkQXR0cnMobGluaywgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBsaW5rKTtcblxuXHRyZXR1cm4gbGluaztcbn1cblxuZnVuY3Rpb24gYWRkQXR0cnMgKGVsLCBhdHRycykge1xuXHRPYmplY3Qua2V5cyhhdHRycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ZWwuc2V0QXR0cmlidXRlKGtleSwgYXR0cnNba2V5XSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBhZGRTdHlsZSAob2JqLCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZSwgdXBkYXRlLCByZW1vdmUsIHJlc3VsdDtcblxuXHQvLyBJZiBhIHRyYW5zZm9ybSBmdW5jdGlvbiB3YXMgZGVmaW5lZCwgcnVuIGl0IG9uIHRoZSBjc3Ncblx0aWYgKG9wdGlvbnMudHJhbnNmb3JtICYmIG9iai5jc3MpIHtcblx0ICAgIHJlc3VsdCA9IG9wdGlvbnMudHJhbnNmb3JtKG9iai5jc3MpO1xuXG5cdCAgICBpZiAocmVzdWx0KSB7XG5cdCAgICBcdC8vIElmIHRyYW5zZm9ybSByZXR1cm5zIGEgdmFsdWUsIHVzZSB0aGF0IGluc3RlYWQgb2YgdGhlIG9yaWdpbmFsIGNzcy5cblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgcnVubmluZyBydW50aW1lIHRyYW5zZm9ybWF0aW9ucyBvbiB0aGUgY3NzLlxuXHQgICAgXHRvYmouY3NzID0gcmVzdWx0O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgIFx0Ly8gSWYgdGhlIHRyYW5zZm9ybSBmdW5jdGlvbiByZXR1cm5zIGEgZmFsc3kgdmFsdWUsIGRvbid0IGFkZCB0aGlzIGNzcy5cblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgY29uZGl0aW9uYWwgbG9hZGluZyBvZiBjc3Ncblx0ICAgIFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHQgICAgXHRcdC8vIG5vb3Bcblx0ICAgIFx0fTtcblx0ICAgIH1cblx0fVxuXG5cdGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xuXHRcdHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xuXG5cdFx0c3R5bGUgPSBzaW5nbGV0b24gfHwgKHNpbmdsZXRvbiA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSk7XG5cblx0XHR1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIGZhbHNlKTtcblx0XHRyZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIHRydWUpO1xuXG5cdH0gZWxzZSBpZiAoXG5cdFx0b2JqLnNvdXJjZU1hcCAmJlxuXHRcdHR5cGVvZiBVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwuY3JlYXRlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLnJldm9rZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCJcblx0KSB7XG5cdFx0c3R5bGUgPSBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSB1cGRhdGVMaW5rLmJpbmQobnVsbCwgc3R5bGUsIG9wdGlvbnMpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG5cblx0XHRcdGlmKHN0eWxlLmhyZWYpIFVSTC5yZXZva2VPYmplY3RVUkwoc3R5bGUuaHJlZik7XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRzdHlsZSA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSBhcHBseVRvVGFnLmJpbmQobnVsbCwgc3R5bGUpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZSk7XG5cdFx0fTtcblx0fVxuXG5cdHVwZGF0ZShvYmopO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZSAobmV3T2JqKSB7XG5cdFx0aWYgKG5ld09iaikge1xuXHRcdFx0aWYgKFxuXHRcdFx0XHRuZXdPYmouY3NzID09PSBvYmouY3NzICYmXG5cdFx0XHRcdG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmXG5cdFx0XHRcdG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXBcblx0XHRcdCkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHVwZGF0ZShvYmogPSBuZXdPYmopO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZW1vdmUoKTtcblx0XHR9XG5cdH07XG59XG5cbnZhciByZXBsYWNlVGV4dCA9IChmdW5jdGlvbiAoKSB7XG5cdHZhciB0ZXh0U3RvcmUgPSBbXTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gKGluZGV4LCByZXBsYWNlbWVudCkge1xuXHRcdHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcblxuXHRcdHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xuXHR9O1xufSkoKTtcblxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyAoc3R5bGUsIGluZGV4LCByZW1vdmUsIG9iaikge1xuXHR2YXIgY3NzID0gcmVtb3ZlID8gXCJcIiA6IG9iai5jc3M7XG5cblx0aWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XG5cdFx0dmFyIGNoaWxkTm9kZXMgPSBzdHlsZS5jaGlsZE5vZGVzO1xuXG5cdFx0aWYgKGNoaWxkTm9kZXNbaW5kZXhdKSBzdHlsZS5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XG5cblx0XHRpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcblx0XHRcdHN0eWxlLmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0eWxlLmFwcGVuZENoaWxkKGNzc05vZGUpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBhcHBseVRvVGFnIChzdHlsZSwgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgbWVkaWEgPSBvYmoubWVkaWE7XG5cblx0aWYobWVkaWEpIHtcblx0XHRzdHlsZS5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSlcblx0fVxuXG5cdGlmKHN0eWxlLnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZS5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG5cdH0gZWxzZSB7XG5cdFx0d2hpbGUoc3R5bGUuZmlyc3RDaGlsZCkge1xuXHRcdFx0c3R5bGUucmVtb3ZlQ2hpbGQoc3R5bGUuZmlyc3RDaGlsZCk7XG5cdFx0fVxuXG5cdFx0c3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlTGluayAobGluaywgb3B0aW9ucywgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuXHQvKlxuXHRcdElmIGNvbnZlcnRUb0Fic29sdXRlVXJscyBpc24ndCBkZWZpbmVkLCBidXQgc291cmNlbWFwcyBhcmUgZW5hYmxlZFxuXHRcdGFuZCB0aGVyZSBpcyBubyBwdWJsaWNQYXRoIGRlZmluZWQgdGhlbiBsZXRzIHR1cm4gY29udmVydFRvQWJzb2x1dGVVcmxzXG5cdFx0b24gYnkgZGVmYXVsdC4gIE90aGVyd2lzZSBkZWZhdWx0IHRvIHRoZSBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgb3B0aW9uXG5cdFx0ZGlyZWN0bHlcblx0Ki9cblx0dmFyIGF1dG9GaXhVcmxzID0gb3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgPT09IHVuZGVmaW5lZCAmJiBzb3VyY2VNYXA7XG5cblx0aWYgKG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzIHx8IGF1dG9GaXhVcmxzKSB7XG5cdFx0Y3NzID0gZml4VXJscyhjc3MpO1xuXHR9XG5cblx0aWYgKHNvdXJjZU1hcCkge1xuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xuXHR9XG5cblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XG5cblx0dmFyIG9sZFNyYyA9IGxpbmsuaHJlZjtcblxuXHRsaW5rLmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG5cdGlmKG9sZFNyYykgVVJMLnJldm9rZU9iamVjdFVSTChvbGRTcmMpO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvX3N0eWxlLWxvYWRlckAwLjE4LjJAc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiODg5NGFmZTk5MGQ5NDJkMTBhMmRmMjljMTQxZGI2NGEuanBnXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hbGwvaW1nL3ZpZGVvLWJnLmpwZ1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDIiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCI3ZjIwMmVlNzMzYWZjZjI2MjE2ZTBmMTU1OTE5Y2I4YS5wbmdcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2FsbC9pbWcvbG9nby0xLnBuZ1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDIiLCJcbi8qKlxuICogV2hlbiBzb3VyY2UgbWFwcyBhcmUgZW5hYmxlZCwgYHN0eWxlLWxvYWRlcmAgdXNlcyBhIGxpbmsgZWxlbWVudCB3aXRoIGEgZGF0YS11cmkgdG9cbiAqIGVtYmVkIHRoZSBjc3Mgb24gdGhlIHBhZ2UuIFRoaXMgYnJlYWtzIGFsbCByZWxhdGl2ZSB1cmxzIGJlY2F1c2Ugbm93IHRoZXkgYXJlIHJlbGF0aXZlIHRvIGFcbiAqIGJ1bmRsZSBpbnN0ZWFkIG9mIHRoZSBjdXJyZW50IHBhZ2UuXG4gKlxuICogT25lIHNvbHV0aW9uIGlzIHRvIG9ubHkgdXNlIGZ1bGwgdXJscywgYnV0IHRoYXQgbWF5IGJlIGltcG9zc2libGUuXG4gKlxuICogSW5zdGVhZCwgdGhpcyBmdW5jdGlvbiBcImZpeGVzXCIgdGhlIHJlbGF0aXZlIHVybHMgdG8gYmUgYWJzb2x1dGUgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHBhZ2UgbG9jYXRpb24uXG4gKlxuICogQSBydWRpbWVudGFyeSB0ZXN0IHN1aXRlIGlzIGxvY2F0ZWQgYXQgYHRlc3QvZml4VXJscy5qc2AgYW5kIGNhbiBiZSBydW4gdmlhIHRoZSBgbnBtIHRlc3RgIGNvbW1hbmQuXG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzcykge1xuICAvLyBnZXQgY3VycmVudCBsb2NhdGlvblxuICB2YXIgbG9jYXRpb24gPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdy5sb2NhdGlvbjtcblxuICBpZiAoIWxvY2F0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZml4VXJscyByZXF1aXJlcyB3aW5kb3cubG9jYXRpb25cIik7XG4gIH1cblxuXHQvLyBibGFuayBvciBudWxsP1xuXHRpZiAoIWNzcyB8fCB0eXBlb2YgY3NzICE9PSBcInN0cmluZ1wiKSB7XG5cdCAgcmV0dXJuIGNzcztcbiAgfVxuXG4gIHZhciBiYXNlVXJsID0gbG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyBsb2NhdGlvbi5ob3N0O1xuICB2YXIgY3VycmVudERpciA9IGJhc2VVcmwgKyBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC9bXlxcL10qJC8sIFwiL1wiKTtcblxuXHQvLyBjb252ZXJ0IGVhY2ggdXJsKC4uLilcblx0Lypcblx0VGhpcyByZWd1bGFyIGV4cHJlc3Npb24gaXMganVzdCBhIHdheSB0byByZWN1cnNpdmVseSBtYXRjaCBicmFja2V0cyB3aXRoaW5cblx0YSBzdHJpbmcuXG5cblx0IC91cmxcXHMqXFwoICA9IE1hdGNoIG9uIHRoZSB3b3JkIFwidXJsXCIgd2l0aCBhbnkgd2hpdGVzcGFjZSBhZnRlciBpdCBhbmQgdGhlbiBhIHBhcmVuc1xuXHQgICAoICA9IFN0YXJ0IGEgY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgKD86ICA9IFN0YXJ0IGEgbm9uLWNhcHR1cmluZyBncm91cFxuXHQgICAgICAgICBbXikoXSAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKD86ICA9IFN0YXJ0IGFub3RoZXIgbm9uLWNhcHR1cmluZyBncm91cHNcblx0ICAgICAgICAgICAgICAgICBbXikoXSsgID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgICAgIFteKShdKiAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICBcXCkgID0gTWF0Y2ggYSBlbmQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICkgID0gRW5kIEdyb3VwXG4gICAgICAgICAgICAgICpcXCkgPSBNYXRjaCBhbnl0aGluZyBhbmQgdGhlbiBhIGNsb3NlIHBhcmVuc1xuICAgICAgICAgICkgID0gQ2xvc2Ugbm9uLWNhcHR1cmluZyBncm91cFxuICAgICAgICAgICogID0gTWF0Y2ggYW55dGhpbmdcbiAgICAgICApICA9IENsb3NlIGNhcHR1cmluZyBncm91cFxuXHQgXFwpICA9IE1hdGNoIGEgY2xvc2UgcGFyZW5zXG5cblx0IC9naSAgPSBHZXQgYWxsIG1hdGNoZXMsIG5vdCB0aGUgZmlyc3QuICBCZSBjYXNlIGluc2Vuc2l0aXZlLlxuXHQgKi9cblx0dmFyIGZpeGVkQ3NzID0gY3NzLnJlcGxhY2UoL3VybFxccypcXCgoKD86W14pKF18XFwoKD86W14pKF0rfFxcKFteKShdKlxcKSkqXFwpKSopXFwpL2dpLCBmdW5jdGlvbihmdWxsTWF0Y2gsIG9yaWdVcmwpIHtcblx0XHQvLyBzdHJpcCBxdW90ZXMgKGlmIHRoZXkgZXhpc3QpXG5cdFx0dmFyIHVucXVvdGVkT3JpZ1VybCA9IG9yaWdVcmxcblx0XHRcdC50cmltKClcblx0XHRcdC5yZXBsYWNlKC9eXCIoLiopXCIkLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pXG5cdFx0XHQucmVwbGFjZSgvXicoLiopJyQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSk7XG5cblx0XHQvLyBhbHJlYWR5IGEgZnVsbCB1cmw/IG5vIGNoYW5nZVxuXHRcdGlmICgvXigjfGRhdGE6fGh0dHA6XFwvXFwvfGh0dHBzOlxcL1xcL3xmaWxlOlxcL1xcL1xcLykvaS50ZXN0KHVucXVvdGVkT3JpZ1VybCkpIHtcblx0XHQgIHJldHVybiBmdWxsTWF0Y2g7XG5cdFx0fVxuXG5cdFx0Ly8gY29udmVydCB0aGUgdXJsIHRvIGEgZnVsbCB1cmxcblx0XHR2YXIgbmV3VXJsO1xuXG5cdFx0aWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiLy9cIikgPT09IDApIHtcblx0XHQgIFx0Ly9UT0RPOiBzaG91bGQgd2UgYWRkIHByb3RvY29sP1xuXHRcdFx0bmV3VXJsID0gdW5xdW90ZWRPcmlnVXJsO1xuXHRcdH0gZWxzZSBpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvXCIpID09PSAwKSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgYmFzZSB1cmxcblx0XHRcdG5ld1VybCA9IGJhc2VVcmwgKyB1bnF1b3RlZE9yaWdVcmw7IC8vIGFscmVhZHkgc3RhcnRzIHdpdGggJy8nXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIGN1cnJlbnQgZGlyZWN0b3J5XG5cdFx0XHRuZXdVcmwgPSBjdXJyZW50RGlyICsgdW5xdW90ZWRPcmlnVXJsLnJlcGxhY2UoL15cXC5cXC8vLCBcIlwiKTsgLy8gU3RyaXAgbGVhZGluZyAnLi8nXG5cdFx0fVxuXG5cdFx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCB1cmwoLi4uKVxuXHRcdHJldHVybiBcInVybChcIiArIEpTT04uc3RyaW5naWZ5KG5ld1VybCkgKyBcIilcIjtcblx0fSk7XG5cblx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCBjc3Ncblx0cmV0dXJuIGZpeGVkQ3NzO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL19zdHlsZS1sb2FkZXJAMC4xOC4yQHN0eWxlLWxvYWRlci9saWIvdXJscy5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IDYiLCIvKipcclxuICogQ3JlYXRlZCBieSBncXkgb24gMjAxNy85LzEwLlxyXG4gKi9cclxucmVxdWlyZSgnLi4vY3NzL2luZGV4LmNzcycpO1xyXG5jb25zdCBpbmRleGJvZHkgPSByZXF1aXJlKCcuLi92aWV3L2luZGV4LWJvZC5odG1sJyk7XHJcbiQoXCJib2R5XCIpLnByZXBlbmQoJChpbmRleGJvZHkpKTtcclxucmVxdWlyZSgnLi4vanMvY2xpZW50LmpzJyk7Ly93ZWJSVEPkuLvopoHku6PnoIHvvIzmraTlpITkuI3lgZrorrLop6PvvIzlsIbljZXni6zorrLop6NcclxuOyhmdW5jdGlvbiAoJCkge1xyXG4gIHZhciBpbmRleCA9IHtcclxuICAgIHRvTG9hZDpmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmKCFsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlck5hbWUnKSl7XHJcbiAgICAgICAgYWxlcnQoJ+eZu+W9lei/h+acn++8jOivt+mHjeaWsOeZu+W9lScpO1xyXG4gICAgICAgIGxvY2F0aW9uLmhyZWYgPSAnbG9naW4uaHRtbCc7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvbkNsaWNrOmZ1bmN0aW9uICgpIHtcclxuICAgICAgJChkb2N1bWVudCkub24oXCJjbGlja1wiLCcjaHQtY29ubmVjdGlvbiBsaSxsaSwuaHQtamItdG8nLGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQ7XHJcbiAgICAgICAgaWYodGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PSAnbGknKXtcclxuICAgICAgICAgIGlmKCEkKHRhcmdldCkuaGFzQ2xhc3MoJ2FjdGl2ZWQnKSl7XHJcbiAgICAgICAgICAgICQodGFyZ2V0KS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmVkJyk7XHJcbiAgICAgICAgICAgICQodGFyZ2V0KS5hZGRDbGFzcygnYWN0aXZlZCcpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09ICdzcGFuJyl7XHJcbiAgICAgICAgICBpZighJCh0YXJnZXQpLnBhcmVudCgpLmhhc0NsYXNzKCdhY3RpdmVkJykpe1xyXG4gICAgICAgICAgICAkKHRhcmdldCkucGFyZW50KCkuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlZCcpO1xyXG4gICAgICAgICAgICAkKHRhcmdldCkucGFyZW50KCkuYWRkQ2xhc3MoJ2FjdGl2ZWQnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmKCQodGFyZ2V0KS5oYXNDbGFzcygnaHQtamInKSl7XHJcbiAgICAgICAgICAgICQoXCIjaHQtamItclwiKS52YWwoJCh0YXJnZXQpLnBhcmVudCgpLmF0dHIoJ2lkJykpO1xyXG4gICAgICAgICAgICAkKFwiLmh0LWpiLXRvXCIpLmNzcygndG9wJywnMjAlJyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZigkKHRhcmdldCkuaGFzQ2xhc3MoJ2h0LWFoJykpe1xyXG4gICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgIHVybDpcInVzZXIvbG9va1VzZXJNZXNzYWdlXCIsXHJcbiAgICAgICAgICAgICAgdHlwZTpcIkdFVFwiLFxyXG4gICAgICAgICAgICAgIGRhdGFUeXBlOidqc29uJyxcclxuICAgICAgICAgICAgICBkYXRhOntcclxuICAgICAgICAgICAgICAgIHVzZXJOYW1lOiQodGFyZ2V0KS5wYXJlbnQoKS5hdHRyKCdpZCcpXHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3RyaW5nID0gJzxwIGNsYXNzPVwiaHQtYWhzXCI+JztcclxuICAgICAgICAgICAgICAgIGlmKGRhdGEuY29kZSA9PSAxMDApe1xyXG4gICAgICAgICAgICAgICAgICBmb3IodmFyIG5hbWUgaW4gZGF0YS5leHRlbmQubWVzc2FnZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5leHRlbmQubWVzc2FnZVtuYW1lXSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gXCI8c3Bhbj5cIiArIG5hbWUgKyBcIjwvc3Bhbj5cIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgc3RyaW5nICs9ICc8L3A+JztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICQodGFyZ2V0KS5wYXJlbnQoKS5wYXJlbnQoKS5maW5kKCdwJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAkKHRhcmdldCkucGFyZW50KCkuYXBwZW5kKHN0cmluZyk7XHJcbiAgICAgICAgICAgICAgICAkKHRhcmdldCkucGFyZW50KCkucGFyZW50KCkuZmluZCgncCcpLmFuaW1hdGUoe3dpZHRoOiAnMHB4J30sIDIwMDApO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0YXJnZXQuaWQgPT09ICdodC1qYi1ub3QnKXtcclxuICAgICAgICAgICQoJy5odC1qYi10bycpLmNzcygndG9wJywnLTM1MHB4Jyk7XHJcbiAgICAgICAgICAkKCcjaHQtamIteXknKS52YWwoXCJcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0YXJnZXQuaWQgPT09ICdodC1qYi1zdXJlJyl7XHJcbiAgICAgICAgICB2YXIgZGF0ID0ge1xyXG4gICAgICAgICAgICB1c2VyYjogJChcIiNodC1qYi1yXCIpLnZhbCgpLFxyXG4gICAgICAgICAgICByZWFzb246ICQoXCIjaHQtamIteXlcIikudmFsKCksXHJcbiAgICAgICAgICAgIHVzZXJhOiAkKFwiLmh0LWpiLXRvIGlucHV0W3R5cGU9J3JhZGlvJ11cIikuY2hlY2tlZCgpLnZhbCgpID8gXCJcIiA6IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyTmFtZScpXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOlwidXNlci9sb2NrT25lXCIsXHJcbiAgICAgICAgICAgIHR5cGU6XCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOidqc29uJyxcclxuICAgICAgICAgICAgc3VjY2VzczpmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgIGlmKGRhdGEuY29kZSA9PSAxMDApe1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoJ+S4vuaKpeaIkOWKnycpO1xyXG4gICAgICAgICAgICAgICAgJCgnLmh0LWpiLXRvJykuY3NzKCd0b3AnLCctMzUwcHgnKTtcclxuICAgICAgICAgICAgICAgICQoJyNodC1qYi15eScpLnZhbChcIlwiKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIGlmKGRhdGEuZXh0ZW5kLmVycm9yLnJlYXNvbi5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgICAgICAgYWxlcnQoJ+S4vuaKpeeQhueUseS4jeiDveS4uuepuicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0YXJnZXQuaWQgPT09ICdvdXQtbG9hZCcpe1xyXG4gICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOlwiaHR0cDovLzM5LjEwOC4xNzQuMjA4OjgwODAvRlRGL3VzZXIvbG9nb3V0XCIsXHJcbiAgICAgICAgICAgIHR5cGU6XCJHRVRcIixcclxuICAgICAgICAgICAgZGF0YVR5cGU6J2pzb24nLFxyXG4gICAgICAgICAgICBhc3ljbjp0cnVlLFxyXG4gICAgICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgaWYoZGF0YS5jb2RlID09IDEwMCl7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIumAgOWHuuaIkOWKn1wiKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCJsb2FkLmh0bWxcIjtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwi6YCA5Ye65aSx6LSl77yM6K+36YeN6K+VXCIpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBhY3RpdmU6ZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLnRvTG9hZCgpO1xyXG4gICAgICB0aGlzLm9uQ2xpY2soKTtcclxuICAgIH1cclxuICB9O1xyXG4gIGluZGV4LmFjdGl2ZSgpO1xyXG59KShqUXVlcnkpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FsbC9qcy9pbmRleC5qcyIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvX2Nzcy1sb2FkZXJAMC4yOC41QGNzcy1sb2FkZXIvaW5kZXguanMhLi9pbmRleC5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvX3N0eWxlLWxvYWRlckAwLjE4LjJAc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9fY3NzLWxvYWRlckAwLjI4LjVAY3NzLWxvYWRlci9pbmRleC5qcyEuL2luZGV4LmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL19jc3MtbG9hZGVyQDAuMjguNUBjc3MtbG9hZGVyL2luZGV4LmpzIS4vaW5kZXguY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2FsbC9jc3MvaW5kZXguY3NzXG4vLyBtb2R1bGUgaWQgPSAzNlxuLy8gbW9kdWxlIGNodW5rcyA9IDIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGRpdiBjbGFzcz1cXFwiY29udGFpbmVyLWZsdWlkXFxcIj5cXHJcXG4gIDxkaXYgY2xhc3M9XFxcImNvbnRhaW5lclxcXCI+XFxyXFxuICA8aGVhZGVyPlxcclxcbiAgICA8aW1nIHNyYz1cXFwiXCIgKyByZXF1aXJlKFwiLi4vaW1nL2xvZ28tMS5wbmdcIikgKyBcIlxcXCI+XFxyXFxuICA8L2hlYWRlcj5cXHJcXG4gIDxkaXYgY2xhc3M9XFxcImh0LXZpZGVvXFxcIj5cXHJcXG4gICAgPHZpZGVvIGNsYXNzPVxcXCJodC1oZXZpZGVvXFxcIiBpZD1cXFwiaHQtaGV2aWRlb1xcXCIgYXV0b3BsYXkgc3R5bGU9XFxcIndpZHRoOiAxMDAlO2hlaWdodDogNDkwcHg7XFxcIj48L3ZpZGVvPlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJodC1vcGFjaXR5XFxcIiBpZD1cXFwiaHQtb3BhY2l0eVxcXCI+PC9kaXY+XFxyXFxuICAgIDx2aWRlbyBjbGFzcz1cXFwiaHQtbXl2aWRlb1xcXCIgaWQ9XFxcImh0LW15dmlkZW9cXFwiIGF1dG9wbGF5PjwvdmlkZW8+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImh0LXZpZGVvLWdvIGh0LXZpZGVvLWJhY2tcXFwiIGlkPVxcXCJodC12aWRlby1iYWNrXFxcIj5cXHJcXG4gICAgICA8YnV0dG9uICB0eXBlPVxcXCJidXR0b25cXFwiPue7k+adnzwvYnV0dG9uPlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwiaHQtdmlkZW8tZ29cXFwiIGlkPVxcXCJodC12aWRlby1nb1xcXCI+XFxyXFxuICAgICAgPGJ1dHRvbiAgdHlwZT1cXFwiYnV0dG9uXFxcIj7lvIDlp4s8L2J1dHRvbj5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXYgY2xhc3M9XFxcImh0LXZpZGVvLWdvIGh0LXZpZGVvLWxvZ2luXFxcIiBpZD1cXFwiaHQtdmlkZW8tbG9naW5cXFwiPlxcclxcbiAgICAgIDxidXR0b24gIHR5cGU9XFxcImJ1dHRvblxcXCI+5YeG5aSHPC9idXR0b24+XFxyXFxuICAgIDwvZGl2PlxcclxcbiAgPC9kaXY+XFxyXFxuPC9kaXY+XFxyXFxuICA8ZGl2IGNsYXNzPVxcXCJodC1sZWZ0XFxcIiBpZD1cXFwiaHQtbGVmZVxcXCI+XFxyXFxuICA8dWw+XFxyXFxuICAgIDxsaSBjbGFzcz1cXFwiYWN0aXZlZFxcXCI+5Li76aG1PC9saT5cXHJcXG4gICAgPGEgaHJlZj1cXFwicHJvdmkuaHRtbFxcXCI+PGxpPuS4quS6uuepuumXtDwvbGk+PC9hPlxcclxcbiAgICA8YSBocmVmPVxcXCJuZXdQYXNzd29yZC5odG1sXFxcIj48bGk+5L+u5pS55a+G56CBPC9saT48L2E+XFxyXFxuICAgIDxsaSBpZD1cXFwib3V0LWxvYWRcXFwiPumAgOWHuueZu+W9lTwvbGk+XFxyXFxuICA8L3VsPlxcclxcbiAgPC9kaXY+XFxyXFxuICA8ZGl2IGNsYXNzPVxcXCJodC1yaWdodFxcXCIgaWQ9XFxcImh0LXJpZ2h0XFxcIj5cXHJcXG4gICAgPGg1PuiBlOezu+S6ujwvaDU+XFxyXFxuICAgIDx1bCBpZD1cXFwiaHQtY29ubmVjdGlvblxcXCI+XFxyXFxuICAgICAgPGxpIGNsYXNzPVxcXCJhY3RpdmVkXFxcIiBpZD1cXFwiemhhbmdzYW5cXFwiPlxcclxcbiAgICAgICAgPHNwYW4gdGl0bGU9XFxcIjIwMTcvMy8yMlxcXCI+5byg5LiJPC9zcGFuPlxcclxcbiAgICAgICAgPHNwYW4gY2xhc3M9XFxcImh0LWpiXFxcIiB0aXRsZT1cXFwi5Li+5oqlXFxcIj7ihpPihpM8L3NwYW4+XFxyXFxuICAgICAgICA8c3BhbiBjbGFzcz1cXFwiaHQtYWhcXFwiIHRpdGxlPVxcXCLmn6XnnIvniLHlpb1cXFwiPuKGkeKGkTwvc3Bhbj5cXHJcXG4gICAgICA8L2xpPlxcclxcbiAgICAgIDxsaT7mnY7lm5s8L2xpPlxcclxcbiAgICAgIDxsaT7mnY7lm5s8L2xpPlxcclxcbiAgICAgIDxsaT7mnY7lm5s8L2xpPlxcclxcbiAgICAgIDxsaT7mnY7lm5s8L2xpPlxcclxcbiAgICAgIDxsaT7mnY7lm5s8L2xpPlxcclxcbiAgICA8L3VsPlxcclxcbiAgPC9kaXY+XFxyXFxuICA8ZGl2IGNsYXNzPVxcXCJodC1qYi10b1xcXCI+XFxyXFxuICAgIDxkaXY+XFxyXFxuICAgICAgPGxhYmVsPuS4vuaKpeS6ujwvbGFiZWw+XFxyXFxuICAgICAgPGlucHV0IGlkPVxcXCJodC1qYi1yXFxcIiB2YWx1ZT1cXFwi5byg5LiJXFxcIiBkaXNhYmxlZD5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXY+XFxyXFxuICAgICAgPGxhYmVsPuS4vuaKpeWOn+WboOWhq+WGmTwvbGFiZWw+XFxyXFxuICAgICAgPHRleHRhcmVhIGlkPVxcXCJodC1qYi15eVxcXCIgbWF4bGVuZ3RoPVxcXCI1MFxcXCI+PC90ZXh0YXJlYT5cXHJcXG4gICAgPC9kaXY+XFxyXFxuICAgIDxkaXY+XFxyXFxuICAgICAgPGxhYmVsPuaYr+WQpuWMv+WQjeS4vuaKpTwvbGFiZWw+XFxyXFxuICAgICAgPGlucHV0IHR5cGU9XFxcInJhZGlvXFxcIiBuYW1lPVxcXCJuaW1pbmdcXFwiIHZhbHVlPVxcXCIxXFxcIiBjaGVja2VkPuaYr1xcclxcbiAgICAgIDxpbnB1dCB0eXBlPVxcXCJyYWRpb1xcXCIgbmFtZT1cXFwibmltaW5nXFxcIiB2YWx1ZT1cXFwiMFxcXCI+5ZCmXFxyXFxuICAgIDwvZGl2PlxcclxcbiAgICA8YnV0dG9uIGlkPVxcXCJodC1qYi1zdXJlXFxcIj7noa7orqQ8L2J1dHRvbj5cXHJcXG4gICAgPGJ1dHRvbiBpZD1cXFwiaHQtamItbm90XFxcIj7lj5bmtog8L2J1dHRvbj5cXHJcXG4gIDwvZGl2PlxcclxcbjwvZGl2PlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYWxsL3ZpZXcvaW5kZXgtYm9kLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDM3XG4vLyBtb2R1bGUgY2h1bmtzID0gMiIsIi8qIFxyXG4qIEBBdXRob3I6IGZ4eVxyXG4qIEBEYXRlOiAgIDIwMTctMDgtMDggMTk6NTM6NDJcclxuKiBATGFzdCBNb2RpZmllZCBieTogICBhbmNoZW5cclxuKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE3LTA5LTEwIDE3OjIzOjMzXHJcbiovXHJcblxyXG4oZnVuY3Rpb24oJCl7XHJcbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgYWpheCgpO1xyXG4gIH0pXHJcbiAgZnVuY3Rpb24gYWpheCgpIHtcclxuICAgIHZhciBzdHIgPSBcIlwiO1xyXG4gICAgdmFyICR1bCA9ICQoXCIjaHQtY29ubmVjdGlvblwiKTtcclxuICAgIGlmKGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyTmFtZScpKXtcclxuICAgICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6XCJodHRwOi8vMzkuMTA4LjE3NC4yMDg6ODA4MC9GVEYvdXNlci9sb29rVXNlckNvbnRhY3RzXCIsXHJcbiAgICAgICAgdHlwZTonR0VUJyxcclxuICAgICAgICBkYXRhVHlwZTonanNvbicsXHJcbiAgICAgICAgZGF0YTp7dXNlck5hbWU6IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyTmFtZScpfSxcclxuICAgICAgICBhc3luYzpmYWxzZSxcclxuICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICBpZihkYXRhLmNvZGUgPT0gMTAwKXtcclxuICAgICAgICAgICAgaWYoZGF0YS5leHRlbmQubWVzc2FnZS5sZW5ndGggPT0gMCl7XHJcbiAgICAgICAgICAgICAgc3RyID0gJzxsaSBjbGFzcz1cImFjdGl2ZWRcIj48c3Bhbj7msqHmnInogZTns7vkuro8L3NwYW4+PC9saT4nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgZGF0YS5leHRlbmQubWVzc2FnZS5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgaWYoaW5kZXggPT0gMCl7XHJcbiAgICAgICAgICAgICAgICAgIHN0ciArPSBgPGxpIGNsYXNzPVwiYWN0aXZlZFwiPjxzcGFuIGlkPVwiJHtpdGVtLnVzZXJCfVwiIHRpdGxlPVwiJHt0aW1lKGl0ZW0udGltZSl9XCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJodC1qYlwiIHRpdGxlPVwi5Li+5oqlXCI+4oaT4oaTPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJodC1haFwiIHRpdGxlPVwi54ix5aW9XCI+4oaR4oaRPC9zcGFuPjwvbGk+YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgIHN0ciArPSBgPGxpPjxzcGFuIGlkPVwiJHtpdGVtLnVzZXJCfVwiIHRpdGxlPVwiJHt0aW1lKGl0ZW0udGltZSl9XCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJodC1qYlwiIHRpdGxlPVwi5Li+5oqlXCI+4oaT4oaTPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJodC1haFwiIHRpdGxlPVwi54ix5aW9XCI+4oaR4oaRPC9zcGFuPjwvbGk+YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSBpZiAoZGF0YS5jb2RlID09IDIwMCkge317XHJcbiAgICAgICAgICAgIHN0ciA9ICc8bGkgY2xhc3M9XCJhY3RpdmVkXCI+PHNwYW4+5rKh5pyJ6IGU57O75Lq6PC9zcGFuPjwvbGk+JztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBjb25zb2xlLmxvZyhzdHIpO1xyXG4gICAgICAkdWxbMF0uaW5uZXJIVE1MID0gc3RyO1xyXG4gICAgICBjb25zb2xlLmxvZygkdWxbMF0pO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gdGltZSh0aW1lKSB7XHJcbiAgICAgIHZhciBkID0gbmV3IERhdGUodGltZSk7XHJcbiAgICAgIHJldHVybiBkLmdldEZ1bGxZZWFyKCkgKyBcIi9cIiArIChkLmdldE1vbnRoKCkgKyAxKSArIGQuZ2V0TWludXRlcygpO1xyXG4gICAgfVxyXG4gIH1cclxuICB2YXIgRnh5ID0gZnVuY3Rpb24oaWQpIHtcclxuICAgICAgdGhpcy5lbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpZCk7XHJcbiAgfVxyXG4gIEZ4eS5wcm90b3R5cGUub24gPSBmdW5jdGlvbih0eXBlLCBmbikge1xyXG4gICAgICB2YXIgZWxlbSA9IHRoaXMuZWxlbTtcclxuICAgICAgaWYgKGVsZW0ubm9kZVR5cGUgIT0gMSkge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd0YXJnZXRFbGVtZW50IGlzIG5vdCBhIHJpZ2h0IGRvY3VtZW50Jyk7XHJcbiAgICAgIH0gZWxzZSBpZiAoZWxlbS5hZGRFdmVudExpc3RlbmVyKSB7ICAvLyAywrzCtlxyXG4gICAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGZuLCBmYWxzZSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoZWxlbS5hdHRhY2hFdmVudCkge1xyXG4gICAgICAgICAgZWxlbS5hdHRhY2hFdmVudCh0eXBlLCAnb24nK3R5cGUpO1xyXG4gICAgICB9IGVsc2UgeyAvLyAwwrzCtlxyXG4gICAgICAgICAgZWxlbVsnb24nK3R5cGVdID0gZm47XHJcbiAgICAgIH1cclxuICB9XHJcbiAgLypcclxuICAqXHJcbiAgKiAgIEdsb2FiYWwgdmVyaWFibGVcclxuICAqXHJcbiAgICovXHJcblxyXG4gIGZ1bmN0aW9uIERvbSh0eXApIHtcclxuICAgICAgc3dpdGNoICh0eXApe1xyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgIGxvZ2luQnRuLmVsZW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgIGNhbGxCdG4uZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICAgIGhhbmdVcEJ0bi5lbGVtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICB0aW1lID0gNDA7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICBsb2dpbkJ0bi5lbGVtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICBjYWxsQnRuLmVsZW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgIGhhbmdVcEJ0bi5lbGVtLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgICAgc2V0VGltZSgpXHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICBsb2dpbkJ0bi5lbGVtLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgICAgY2FsbEJ0bi5lbGVtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICBoYW5nVXBCdG4uZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgYWpheCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICBmdW5jdGlvbiBzZXRUaW1lKCkge1xyXG4gICAgJChcIiNodC1vcGFjaXR5XCIpLmNzcygnZGlzcGxheScsJ2Jsb2NrJyk7XHJcbiAgICAkKFwiI2h0LW9wYWNpdHlcIikuZmFkZU91dCgxNTAwMCxmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRpbWUgLT0gMTU7XHJcbiAgICB9KTtcclxuICAgIHZhciB0aW1lb3V0ID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aW1lLS07XHJcbiAgICAgIGlmKHRpbWUgPD0gMCl7XHJcbiAgICAgICAgbGVhdmUoKTtcclxuICAgICAgICB0aW1lID0gNDA7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lb3V0KTtcclxuICAgICAgfVxyXG4gICAgfSwxMDAwKTtcclxuICB9XHJcbiAgdmFyIG5hbWUsXHJcbiAgICAgIGNvbm5lY3RlZFVzZXI7XHJcblxyXG4gIC8vw5PDq8K3w77DjsOxw4bDt8K9wqjDgcKiw4HCrMK9w5PCo8KswrTCq8K1w53Ct8O+w47DscOGw7fCtcOYw5bCt8KjwqzDlMOZwrzDk8OJw493c8KjwrovL8OOwqrDh8Kww5fCusOAwrTDisK1w4/DllxyXG4gIC8vXCJ3czovL1wiK3dpbmRvdy5sb2NhdGlvbi5ob3N0KycvRlRGL3Uvd2Vic29ja2V0J1xyXG4gIHZhciBjb25uZWN0aW9uID0gbmV3IFdlYlNvY2tldCgnd3M6Ly8zOS4xMDguMTc0LjIwODo4MDgwL0ZURi91L3dlYnNvY2tldCcpO1xyXG4gIC8vIHZhciBjb25uZWN0aW9uID0gbmV3IFdlYlNvY2tldCgnd3M6Ly9sb2NhbGhvc3Q6ODg4OCcpO1xyXG5cclxuXHJcbiAgdmFyIGxvZ2luUGFnZSA9IG5ldyBGeHkoJyNsb2dpbi1wYWdlJyksXHJcbiAgICAgIC8vdXNlcm5hbWVJbnB1dCA9IG5ldyBGeHkoJyN1c2VybmFtZScpLFxyXG4gICAgICBsb2dpbkJ0biA9IG5ldyBGeHkoJyNodC12aWRlby1sb2dpbicpLFxyXG4gICAgICAvL2NhbGxQYWdlID0gbmV3IEZ4eSgnI2NhbGwtcGFnZScpLFxyXG4gICAgICAvL3RoZWlyVXNlcm5hbWVJbnB1dCA9IG5ldyBGeHkoJyN0aGVpci11c2VybmFtZScpLFxyXG4gICAgICBjYWxsQnRuID0gbmV3IEZ4eSgnI2h0LXZpZGVvLWdvJyksXHJcbiAgICAgIGhhbmdVcEJ0biA9IG5ldyBGeHkoJyNodC12aWRlby1iYWNrJyk7XHJcblxyXG4gICAgICAvL2NhbGxQYWdlLmVsZW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuXHJcbiAgdmFyIG15VmlkZW8gPSBuZXcgRnh5KCcjaHQtbXl2aWRlbycpLFxyXG4gICAgICB0aGVpclZpZGVvID0gbmV3IEZ4eSgnI2h0LWhldmlkZW8nKSxcclxuICAgICAgbXlDb25uZWN0aW9uLFxyXG4gICAgICAvL3RoZWlyQ29ubmVjdGlvbixcclxuICAgICAgc3RyZWFtLFxyXG4gICAgICB0aW1lID0gMDtcclxuLypcclxuKiAgIMOKw4LCvMO+wrDDs8K2wqhcclxuKi9cclxuICAvL8K1wqXCu8O3wrXDh8OCwrxcclxuICBsb2dpbkJ0bi5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuICAgIGxvZ2luKCk7XHJcblxyXG5cclxuICAgIC8qIG5hbWUgPSB1c2VybmFtZUlucHV0LmVsZW0udmFsdWU7XHJcblxyXG4gICAgICAgaWYgKG5hbWUubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgIHNlbmQoe1xyXG4gICAgICAgICAgICAgICB0eXBlOiAnbG9naW4nXHJcbiAgICAgICAgICAgfSlcclxuICAgICAgIH0qL1xyXG4gIH0pXHJcbiAgZnVuY3Rpb24gbG9naW4oKSB7XHJcbiAgICBuYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ1c2VyTmFtZVwiKTtcclxuICAgIGlmIChuYW1lLmxlbmd0aCA+IDApIHtcclxuICAgICAgc2VuZCh7XHJcbiAgICAgICAgdHlwZTogJ2xvZ2luJ1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBhbGVydChcIsOTw4PCu8Knw4nDkMOOwrTCtcOHw4LCvFwiKTtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcImxvZ2luLmh0bWxcIjtcclxuICAgIH1cclxuICB9XHJcbiAgLy9cclxuICAvL8K5w5LCtsOPXHJcblxyXG5mdW5jdGlvbiBsZWF2ZSgpIHtcclxuICBzZW5kKHtcclxuICAgIHR5cGU6ICdsZWF2ZScsXHJcbiAgfSk7XHJcbiAgb25MZWF2ZSgpO1xyXG59XHJcblxyXG4gIGhhbmdVcEJ0bi5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuICAgICAgbGVhdmUoKTtcclxuICB9KVxyXG4gIC8vw5TCtsKzw4zDgcKswr3Dk1xyXG4gIGNhbGxCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcbiAgICAgIC8vIHZhciB0aGVpclVzZXJOYW1lID0gdGhlaXJVc2VybmFtZUlucHV0LnZhbHVlO1xyXG4gICAgLy9sb2dpbigpO1xyXG4gICAgc3RhcnRQZWVyQ29ubmVjdGlvbigpO1xyXG4gICAgbG9naW5CdG4uZWxlbS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICBjYWxsQnRuLmVsZW0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgaGFuZ1VwQnRuLmVsZW0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICB9KVxyXG4gIC8vwrXDh8OCwrxcclxuICBmdW5jdGlvbiBvbkxvZ2luKHN1Y2Nlc3Mpe1xyXG4gICAgICBpZiAoc3VjY2VzcyA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgYWxlcnQoXCJMb2dpbiB1bnN1Y2Nlc3NmdWwsIHBsZWFzZSB0cnkgYSBkaWZmZXJlbnQgbmFtZS5cIik7XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgICAgRG9tKDEpO1xyXG4gICAgICAgICAgc3RhcnRDb25uZWN0aW9uKCk7XHJcbiAgICAgIH1cclxuICB9XHJcbiAgLy9vZmZlcsK9w5PDisOVXHJcbiAgZnVuY3Rpb24gb25PZmZlcihvZmZlciwgbmFtZSl7XHJcbiAgICAgIGNvbnNvbGUubG9nKG5hbWUsICfDh8Orw4fDs8K9wqjDgcKiw4rDk8OGwrXDgcK0wr3DkycpXHJcbiAgICAgIGNvbm5lY3RlZFVzZXIgPSBuYW1lO1xyXG4gICAgICAvL8K9w5PDisOVw5TCtsKzw4xTRFBcclxuICAgICAgY29uc29sZS5sb2coJ8K9w5PDisOVwrXCvcK1w4RvZmZlcicsIG9mZmVyKTtcclxuICAgICAgbXlDb25uZWN0aW9uLnNldFJlbW90ZURlc2NyaXB0aW9uKG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24ob2ZmZXIpKTtcclxuICAgICAgLy9cclxuICAgICAgbXlDb25uZWN0aW9uLmNyZWF0ZUFuc3dlcihmdW5jdGlvbihhbnN3ZXIpe1xyXG4gICAgICAgICAgbXlDb25uZWN0aW9uLnNldExvY2FsRGVzY3JpcHRpb24oYW5zd2VyKTtcclxuICAgICAgICAgIHNlbmQoe1xyXG4gICAgICAgICAgICAgIHR5cGU6ICdhbnN3ZXInLFxyXG4gICAgICAgICAgICAgIGFuc3dlcjogYW5zd2VyXHJcbiAgICAgICAgICB9KVxyXG4gICAgICB9LCBmdW5jdGlvbihlcnJvcil7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJBbiBlcnJvciBoYXMgb2NjdXJyZWQgYXQgT2ZmZXJcIiwgZXJyb3IpO1xyXG4gICAgICAgICAgYWxlcnQoXCJBbiBlcnJvciBoYXMgb2NjdXJyZWQgYXQgT2ZmZXJcIilcclxuICAgICAgfSlcclxuICB9XHJcblxyXG4gIC8vw5PCpsK0w7BcclxuICBmdW5jdGlvbiBvbkFuc3dlcihhbnN3ZXIpe1xyXG4gICAgICBteUNvbm5lY3Rpb24uc2V0UmVtb3RlRGVzY3JpcHRpb24obmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbihhbnN3ZXIpKTtcclxuICB9XHJcbiAgLy8gaWNlIMK6w7LDkcKhw43CqMK1w4BcclxuICBmdW5jdGlvbiBvbkNhbmRpZGF0ZShjYW5kaWRhdGUpe1xyXG4gICAgICBjb25zb2xlLmxvZygnwr3Dk8OKw5XCtcK9wrXDhGNhbmRpZGF0ZScsIGNhbmRpZGF0ZSk7XHJcbiAgICAgIG15Q29ubmVjdGlvbi5hZGRJY2VDYW5kaWRhdGUobmV3IFJUQ0ljZUNhbmRpZGF0ZShjYW5kaWRhdGUpKTtcclxuICB9XHJcbiAgLy8gwrnDksK2w49cclxuICBmdW5jdGlvbiBvbkxlYXZlKCl7XHJcbiAgICAgIGNvbm5lY3RlZFVzZXIgPSBudWxsO1xyXG4gICAgICAvL3RoZWlyVmlkZW8uZWxlbS5zcmMgPSBudWxsO1xyXG4gICAgICBteUNvbm5lY3Rpb24uY2xvc2UoKTtcclxuICAgICAgbXlDb25uZWN0aW9uLm9uaWNlY2FuZGlkYXRlID0gbnVsbDtcclxuICAgICAgbXlDb25uZWN0aW9uLm9uYWRkc3RyZWFtID0gbnVsbDtcclxuICAgICAgRG9tKDMpO1xyXG4gICAgICBzZXR1cFBlZXJDb25uZWN0aW9uKHN0cmVhbSk7XHJcbiAgfVxyXG4gIGNvbm5lY3Rpb24ub25vcGVuID0gZnVuY3Rpb24oKXsgIC8vwrfDvsOOw7HDhsO3w4HCrMK9w5PCs8OJwrnCplxyXG4gICAgICBjb25zb2xlLmxvZyhcIkNvbm5lY3RlZFwiKTtcclxuICB9XHJcblxyXG4gIC8vw43CqMK5w71vbm1lc3NhZ2XCt8K9wrfCqMK7w7HDiMKhw4vDucOTw5DCu8O5w5PDmldlYlJUQ8K1w4TDj8O7w4/ColxyXG4gIGNvbm5lY3Rpb24ub25tZXNzYWdlID0gZnVuY3Rpb24obXNnKXtcclxuICAgICAgY29uc29sZS5sb2coJ21zZycsIG1zZyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiR290IG1lc3NhZ2VcIiwgSlNPTi5wYXJzZShtc2cuZGF0YSkgKTtcclxuICAgICAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKG1zZy5kYXRhKTtcclxuICAgICAgc3dpdGNoKGRhdGEudHlwZSl7XHJcbiAgICAgICAgICBjYXNlICdsb2dpbic6XHJcbiAgICAgICAgICAgICAgb25Mb2dpbihkYXRhLm1lc3NhZ2UubG9naW4pO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSAnb2ZmZXInOlxyXG4gICAgICAgICAgICAgIG9uT2ZmZXIoSlNPTi5wYXJzZShkYXRhLm1lc3NhZ2Uub2ZmZXIpLCBkYXRhLm1lc3NhZ2UudXNlck5hbWUpO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSAnYW5zd2VyJzpcclxuICAgICAgICAgICAgICBvbkFuc3dlcihKU09OLnBhcnNlKGRhdGEubWVzc2FnZS5hbnN3ZXIpKTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgJ2NhbmRpZGF0ZSc6XHJcbiAgICAgICAgICAgICAgb25DYW5kaWRhdGUoSlNPTi5wYXJzZShkYXRhLm1lc3NhZ2UuY2FuZGlkYXRlKSk7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlICdsZWF2ZSc6XHJcbiAgICAgICAgICAgICAgb25MZWF2ZSgpO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gIH1cclxuICBjb25uZWN0aW9uLm9uZXJyb3IgPSBmdW5jdGlvbihlcnIpe1xyXG4gICAgICBjb25zb2xlLmxvZyhcIkdvdCBlcnJvclwiLCBlcnIpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2VuZChtc2cpe1xyXG4gICAgICBpZiAoY29ubmVjdGVkVXNlcikge1xyXG4gICAgICAgICAgbXNnLmNvbm5lY3RlZFVzZXIgPSBjb25uZWN0ZWRVc2VyOyAgLy/CvcKrw4HCrMK9w5PCtsOUw4/Ds8K0w7jDiMOrXHJcbiAgICAgIH1cclxuICAgICAgbXNnLnVzZXJOYW1lID0gbmFtZTtcclxuICAgICAgY29uc29sZS5sb2coJ3NlbmQ6JywgIEpTT04uc3RyaW5naWZ5KG1zZykpO1xyXG4gICAgICBjb25uZWN0aW9uLnNlbmQoICBKU09OLnN0cmluZ2lmeShtc2cpKTtcclxuICB9XHJcblxyXG5cclxuICBmdW5jdGlvbiBzdGFydENvbm5lY3Rpb24oKXtcclxuICAgICAgaWYgKGhhc1VzZXJNZWRpYSgpKSB7IC8vwrvDscOIwqHDisOTw4bCtcOBw7dcclxuICAgICAgICB2YXIgb3B0cyA9IHtcclxuICAgICAgICAgIHZpZGVvOiB0cnVlLFxyXG4gICAgICAgICAgYXVkaW86IHRydWUsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMuXHJcbiAgICAgICAgZ2V0VXNlck1lZGlhKG9wdHMpLlxyXG4gICAgICAgIHRoZW4oZnVuY3Rpb24obXlTdHJlYW0pe1xyXG4gICAgICAgICAgc3RyZWFtID0gbXlTdHJlYW07XHJcbiAgICAgICAgICAvLyBteVZpZGVvLnNyYyA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKHN0cmVhbSk7XHJcbiAgICAgICAgICBteVZpZGVvLmVsZW0uc3JjT2JqZWN0ID0gc3RyZWFtO1xyXG4gICAgICAgICAgaWYgKGhhc1JUQ1BlZXJDb25uZWN0aW9uKCkpe1xyXG4gICAgICAgICAgICBzZXR1cFBlZXJDb25uZWN0aW9uKHN0cmVhbSk7XHJcbiAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgYWxlcnQoXCJzb3JyeSwgeW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgV2ViUlRDXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycil7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgICAgYWxlcnQoXCJzb3JyeSwgeW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgV2ViUlRDXCIpO1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIGZ1bmN0aW9uIHNldHVwUGVlckNvbm5lY3Rpb24oc3RyZWFtKXtcclxuICAgICAgdmFyIGNvbmZpZ3VyYXRpb24gPSB7XHJcbiAgICAgICAgICBcImljZVNlcnZlcnNcIjogW3tcclxuICAgICAgICAgICAgICBcInVybHNcIjogXCJzdHVuOnN0dW4ubC5nb29nbGUuY29tOjE5MzAyXCIgIC8vZ29vZ2xlIHN0dW5cclxuICAgICAgICAgIH1dXHJcbiAgICAgIH1cclxuICAgICAgbXlDb25uZWN0aW9uID0gbmV3IFJUQ1BlZXJDb25uZWN0aW9uKGNvbmZpZ3VyYXRpb24pO1xyXG4gICAgICAvL8OJw6jDlsODw4HDt8K1w4TCvMOgw4zDvVxyXG4gICAgICBteUNvbm5lY3Rpb24uYWRkU3RyZWFtKHN0cmVhbSk7XHJcbiAgICAgIG15Q29ubmVjdGlvbi5vbmFkZHN0cmVhbSA9IGZ1bmN0aW9uKGUpe1xyXG4gICAgICBEb20oMik7XHJcbiAgICAgIHRoZWlyVmlkZW8uZWxlbS5zcmNPYmplY3QgPSBlLnN0cmVhbTtcclxuICAgICAgfVxyXG4gICAgICAvL8OJw6jDlsODaWNlwrTCpsOAw63DisOCwrzDvlxyXG4gICAgICBteUNvbm5lY3Rpb24ub25pY2VjYW5kaWRhdGUgPSBmdW5jdGlvbihlKXtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdDb25uZWN0aW9uw4zDrcK8w5NjYW5kaWRhdGUnKVxyXG4gICAgICAgICAgaWYgKGUuY2FuZGlkYXRlKSB7XHJcbiAgICAgICAgICAgICAgc2VuZCh7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdjYW5kaWRhdGUnLFxyXG4gICAgICAgICAgICAgICAgICBjYW5kaWRhdGU6IGUuY2FuZGlkYXRlXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG4gIH1cclxuICBmdW5jdGlvbiBzdGFydFBlZXJDb25uZWN0aW9uKCl7XHJcbiAgICAgIC8vIGNvbm5lY3RlZFVzZXIgPSB1c2VyOyAgLy/CscKjwrTDpmNvbm5UYXJnZXRcclxuXHJcbiAgICAgIC8vwrTCtMK9wqhvZmZlclxyXG4gICAgICAvL1xyXG4gICAgICAvL215UGVlckNvbm5lY3Rpb24uY3JlYXRlT2ZmZXIoc3VjY2Vzc0NhbGxiYWNrLCBmYWlsdXJlQ2FsbGJhY2ssIFtvcHRpb25zXSlcclxuICAgICAgLy8gIE1ETiDCtsOUY3JlYXRlT2ZmZXLCtcOEw5fCosK9w6JcclxuICAgICAgLy9UaGUgY3JlYXRlT2ZmZXIoKSBtZXRob2Qgb2YgdGhlIFJUQ1BlZXJDb25uZWN0aW9uIGludGVyZmFjZSBpbml0aWF0ZXMgdGhlIGNyZWF0aW9uIG9mIGFuIFNEUCBvZmZlciB3aGljaCBpbmNsdWRlcyBpbmZvcm1hdGlvbiBhYm91dCBhbnkgTWVkaWFTdHJlYW1UcmFja3MgYWxyZWFkeSBhdHRhY2hlZCB0byB0aGUgV2ViUlRDIHNlc3Npb24sIGNvZGVjIGFuZCBvcHRpb25zIHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciwgYW5kIGFueSBjYW5kaWRhdGVzIGFscmVhZHkgZ2F0aGVyZWQgYnkgdGhlIElDRSBhZ2VudCwgZm9yIHRoZSBwdXJwb3NlIG9mIGJlaW5nIHNlbnQgb3ZlciB0aGUgc2lnbmFsaW5nIGNoYW5uZWwgdG8gYSBwb3RlbnRpYWwgcGVlciB0byByZXF1ZXN0IGEgY29ubmVjdGlvbiBvciB0byB1cGRhdGUgdGhlIGNvbmZpZ3VyYXRpb24gb2YgYW4gZXhpc3RpbmcgY29ubmVjdGlvbi5cclxuICAgICAgLy9cclxuICAgICAgLy/CtMK0wr3CqFNEUCjCsMO8w4DCqMOXw5TCvMK6w6TCr8OAw4DDhsO3wrXDhMK7w6HCu8KwLMKxw6DDksOrw4bDt8K6w43DicOowrHCuMOWwqfCs8OWw5DDhcOPwqIpXHJcbiAgICAgIG15Q29ubmVjdGlvbi5jcmVhdGVPZmZlcihmdW5jdGlvbihvZmZlcil7XHJcbiAgICAgICAgICBzZW5kKHtcclxuICAgICAgICAgICAgICB0eXBlOiAnb2ZmZXInLFxyXG4gICAgICAgICAgICAgIG9mZmVyOiBvZmZlciAgLy9TRFAgw5DDhcOPwqJcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAvL8K9wqtTRFDCt8OFw4jDq2Nvbm5lY3Rpb25cclxuICAgICAgICAgIG15Q29ubmVjdGlvbi5zZXRMb2NhbERlc2NyaXB0aW9uKG9mZmVyKTsgLy9hc3luXHJcbiAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkFuIGVycm9yIGhhcyBvY2N1cnJlZCBhdCBjcmVhdGVPZmZlclwiLCBlcnJvcik7XHJcbiAgICAgICAgYWxlcnQoXCJBbiBlcnJvciBoYXMgb2NjdXJyZWRcIik7XHJcbiAgICAgIH0pXHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuICBmdW5jdGlvbiBoYXNVc2VyTWVkaWEoKXtcclxuICAgICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSA9IG5hdmlnYXRvci53ZWJraXRHZXRVc2VyTWVkaWEgfHxcclxuICAgICAgICAgIG5hdmlnYXRvci5nZXRVc2VyTWVkaWEgfHxcclxuICAgICAgICAgIG5hdmlnYXRvci5tb3pHZXRVc2VyTWVkaWEgIHx8ICAvLyBtb3rDhMOawrrDi1xyXG4gICAgICAgICAgbmF2aWdhdG9yLm1zR2V0VXNlck1lZGlhO1xyXG4gICAgICByZXR1cm4gISFuYXZpZ2F0b3IuZ2V0VXNlck1lZGlhO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaGFzUlRDUGVlckNvbm5lY3Rpb24oKXtcclxuICAgICAgd2luZG93LlJUQ1BlZXJDb25uZWN0aW9uID0gd2luZG93LlJUQ1BlZXJDb25uZWN0aW9uIHx8XHJcbiAgICAgICAgICB3aW5kb3cud2Via2l0UlRDUGVlckNvbm5lY3Rpb24gfHxcclxuICAgICAgICAgIHdpbmRvdy5tb3pSVENQZWVyQ29ubmVjdGlvbiB8fFxyXG4gICAgICAgICAgd2luZG93Lm1zUlRDUGVlckNvbm5lY3Rpb247XHJcblxyXG4gICAgICB3aW5kb3cuUlRDU2Vzc2lvbkRlc2NyaXB0aW9uID0gd2luZG93LlJUQ1Nlc3Npb25EZXNjcmlwdGlvbiB8fFxyXG4gICAgICAgICAgd2luZG93LndlYmtpdFJUQ1Nlc3Npb25EZXNjcmlwdGlvbiB8fFxyXG4gICAgICAgICAgd2luZG93Lm1velJUQ1Nlc3Npb25EZXNjcmlwdGlvbiB8fFxyXG4gICAgICAgICAgd2luZG93Lm1zUlRDU2Vzc2lvbkRlc2NyaXB0aW9uO1xyXG5cclxuICAgICAgd2luZG93LlJUQ0ljZUNhbmRpZGF0ZSA9IHdpbmRvdy5SVENJY2VDYW5kaWRhdGUgfHxcclxuICAgICAgICAgIHdpbmRvdy53ZWJraXRJY2VDYW5kaWRhdGUgfHxcclxuICAgICAgICAgIHdpbmRvdy5tb3pJY2VDYW5kaWRhdGU7XHJcbiAgICAgICAgICAvLyB3aW5kb3cubXNJY2VDYW5kaWRhdGU7XHJcblxyXG4gICAgICByZXR1cm4gISF3aW5kb3cuUlRDUGVlckNvbm5lY3Rpb247XHJcbiAgfVxyXG5cclxufSkoalF1ZXJ5KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hbGwvanMvY2xpZW50LmpzIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uL25vZGVfbW9kdWxlcy9fY3NzLWxvYWRlckAwLjI4LjVAY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIkBmb250LWZhY2Uge1xcclxcbiAgZm9udC1mYW1pbHk6IFxcXCJwaW5nZmFuZ1xcXCI7XFxyXFxuICBzcmM6IHVybChcXFwiXCIgKyByZXF1aXJlKFwiLi4vZm9udHMvUGluZ0ZhbmcgTWVkaXVtLnR0ZlwiKSArIFwiXFxcIik7XFxyXFxuICBmb250LXNpemU6IDIwcHg7XFxyXFxufVxcclxcblxcclxcbmJvZHl7XFxyXFxuICBwYWRkaW5nOiAwO1xcclxcbiAgZm9udC1mYW1pbHk6IHBpbmdmYW5nO1xcclxcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNzE5ZGNhO1xcclxcbn1cXHJcXG5cXHJcXG4uYWN0aXZ7XFxyXFxuICBib3JkZXItdG9wOiAycHggc29saWQgIzcxOWRjYTtcXHJcXG59XFxyXFxuXFxyXFxuLm5hdmJhci1pbm5lcntcXHJcXG4gIGZvbnQtc2l6ZTogMTRweDtcXHJcXG4gIGNvbG9yOiAjYjdiYmNiO1xcclxcbiAgYmFja2dyb3VuZDogI2ZmZmZmZjtcXHJcXG59XFxyXFxuXFxyXFxuLm5hdmJhciAuYnJhbmR7XFxyXFxuICBwYWRkaW5nLXRvcDogMDtcXHJcXG59XFxyXFxuXFxyXFxuLmh0LW5hdiwuaHQtbmF2PmRpdixcXHJcXG4uaHQtbmF2IHVse1xcclxcbiAgaGVpZ2h0OiA2MHB4O1xcclxcbn1cXHJcXG5cXHJcXG4ubmF2YmFyIC5uYXY+bGl7XFxyXFxuICBtYXJnaW46IDIwcHggNDBweCAwIDA7XFxyXFxuICBwYWRkaW5nOiAxMHB4IDEwcHg7XFxyXFxuICAtd2Via2l0LXRyYW5zaXRpb246IGFsbCAuNXM7XFxyXFxuICAtbW96LXRyYW5zaXRpb246IGFsbCAuNXM7XFxyXFxuICAtbXMtdHJhbnNpdGlvbjogYWxsIC41cztcXHJcXG4gIC1vLXRyYW5zaXRpb246IGFsbCAuNXM7XFxyXFxuICB0cmFuc2l0aW9uOiBhbGwgLjVzO1xcclxcbn1cXHJcXG5cXHJcXG4ubmF2YmFyIC5uYXY+LmFjdGl2ZT5he1xcclxcbiAgYm94LXNoYWRvdzogbm9uZTtcXHJcXG4gIGJhY2tncm91bmQ6IG5vbmU7XFxyXFxufVxcclxcblxcclxcbi5uYXZiYXIgLm5hdj5saT5he1xcclxcbiAgcGFkZGluZzowO1xcclxcbn1cXHJcXG5cXHJcXG4ubmF2YmFyIC5idG57XFxyXFxuICBtYXJnaW4tdG9wOiAyMHB4O1xcclxcbn1cXHJcXG5cXHJcXG4ubmF2YmFyIC5uYXY+bGk6aG92ZXJ7XFxyXFxuICBib3JkZXItdG9wOiAwO1xcclxcbiAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMCwgMC41Mik7XFxyXFxufVxcclxcblxcclxcbi5odC1uYXYgaW1ne1xcclxcbiAgd2lkdGg6IDcwcHg7XFxyXFxuICBoZWlnaHQ6IDUwcHg7XFxyXFxufVxcclxcblxcclxcbkBtZWRpYSAobWF4LXdpZHRoOjEwMDBweCkge1xcclxcbiAgLmh0LW5hdiB1bHtcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBtaW4taGVpZ2h0OiAxODBweDtcXHJcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjQ0KTtcXHJcXG4gIH1cXHJcXG5cXHJcXG4gIC5odC1uYXYgdWw+bGl7XFxyXFxuICAgIGJvcmRlci10b3A6IG5vbmU7XFxyXFxuICB9XFxyXFxuXFxyXFxuICAuaHQtbmF2IHVsPmxpOmZpcnN0LWNoaWxke1xcclxcbiAgICBtYXJnaW4tdG9wOiA1cHg7XFxyXFxuICB9XFxyXFxufVxcclxcblxcclxcblxcclxcblxcclxcblxcclxcblxcclxcblxcclxcblxcclxcbi5jb250YWluZXI+aGVhZGVye1xcclxcbiAgbWFyZ2luOiAyMHB4IDAgMCAwO1xcclxcbiAgd2lkdGg6IDEwMCU7XFxyXFxuICBoZWlnaHQ6IDEwMHB4O1xcclxcbn1cXHJcXG5cXHJcXG4uY29udGFpbmVyPmhlYWRlcj5pbWd7XFxyXFxuICBkaXNwbGF5OiBibG9jaztcXHJcXG4gIG1hcmdpbjogMCBhdXRvO1xcclxcbiAgd2lkdGg6IDEzMHB4O1xcclxcbiAgaGVpZ2h0OiAxMDBweDtcXHJcXG59XFxyXFxuXFxyXFxuLmh0LXZpZGVve1xcclxcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbiAgbWFyZ2luOiAyMHB4IGF1dG8gMCBhdXRvO1xcclxcbiAgd2lkdGg6IDYwJTtcXHJcXG4gIG1pbi13aWR0aDogNzAwcHg7XFxyXFxuICBoZWlnaHQ6IDQ5MHB4O1xcclxcbiAgYmFja2dyb3VuZDogdXJsKFwiICsgcmVxdWlyZShcIi4uL2ltZy92aWRlby1iZy5qcGdcIikgKyBcIikgbm8tcmVwZWF0O1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcXHJcXG59XFxyXFxuXFxyXFxuLmh0LXZpZGVvIC5odC1oZXZpZGVve1xcclxcbiAgd2lkdGg6IDEwMCU7XFxyXFxuICBoZWlnaHQ6IDUwcHg7XFxyXFxufVxcclxcblxcclxcbi5odC12aWRlbyAuaHQtb3BhY2l0eXtcXHJcXG4gIGRpc3BsYXk6IG5vbmU7XFxyXFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICB0b3A6MDtcXHJcXG4gIGxlZnQ6IDA7XFxyXFxuICB3aWR0aDogMTAwJTtcXHJcXG4gIGhlaWdodDogNDkwcHg7XFxyXFxuICB6LWluZGV4OiAxMDtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7XFxyXFxufVxcclxcblxcclxcbi5odC12aWRlbyAuaHQtbXl2aWRlb3tcXHJcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gIHRvcDogMTBweDtcXHJcXG4gIHJpZ2h0OiAxMHB4O1xcclxcbiAgYm9yZGVyOjFweCBzb2xpZCAjZmZmZmZmO1xcclxcbiAgd2lkdGg6IDEwMHB4O1xcclxcbiAgaGVpZ2h0OiAxMjBweDtcXHJcXG4gIHotaW5kZXg6IDEwMDtcXHJcXG59XFxyXFxuXFxyXFxuLmh0LXZpZGVvIC5odC12aWRlby1nb3tcXHJcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gIGxlZnQ6IDA7XFxyXFxuICB0b3A6IDM1MHB4O1xcclxcbiAgd2lkdGg6IDEwMCU7XFxyXFxuICBoZWlnaHQ6IDExMHB4O1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjIpO1xcclxcbiAgei1pbmRleDogMjA7XFxyXFxufVxcclxcblxcclxcbi5odC12aWRlbyAuaHQtdmlkZW8tZ28+YnV0dG9ue1xcclxcbiAgZGlzcGxheTogYmxvY2s7XFxyXFxuICBtYXJnaW46IDVweCBhdXRvO1xcclxcbiAgYm9yZGVyOiAwO1xcclxcbiAgYm9yZGVyLXJhZGl1czogNTBweDtcXHJcXG4gIHdpZHRoOiAxMDBweDtcXHJcXG4gIGhlaWdodDogMTAwcHg7XFxyXFxuICBsaW5lLWhlaWdodDogODBweDtcXHJcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXHJcXG4gIGZvbnQtc2l6ZTogMjRweDtcXHJcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcclxcbiAgY29sb3I6ICNmZmZmZmY7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNCk7XFxyXFxuICAtd2Via2l0LXRyYW5zaXRpb246IGFsbCAuM3M7XFxyXFxuICAtbW96LXRyYW5zaXRpb246IGFsbCAuM3M7XFxyXFxuICAtbXMtdHJhbnNpdGlvbjogYWxsIC4zcztcXHJcXG4gIC1vLXRyYW5zaXRpb246IGFsbCAuM3M7XFxyXFxuICB0cmFuc2l0aW9uOiBhbGwgLjNzO1xcclxcbn1cXHJcXG5cXHJcXG4uaHQtdmlkZW8gLmh0LXZpZGVvLWdvPmJ1dHRvbjpob3ZlcntcXHJcXG4gIGNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNTMpO1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjYyKTtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLmh0LXZpZGVvIC5odC12aWRlby1iYWNre1xcclxcbiAgZGlzcGxheTogbm9uZTtcXHJcXG59XFxyXFxuXFxyXFxuLmh0LXZpZGVvIC5odC12aWRlby1nb3tcXHJcXG4gIGRpc3BsYXk6IG5vbmU7XFxyXFxufVxcclxcblxcclxcbi5odC12aWRlbyAuaHQtdmlkZW8tbG9naW57XFxyXFxuICBkaXNwbGF5OiBibG9jaztcXHJcXG59XFxyXFxuXFxyXFxuLmh0LWxlZnQsLmh0LXJpZ2h0e1xcclxcbiAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgdG9wOiA2MHB4O1xcclxcbiAgaGVpZ2h0OiA1MDBweDtcXHJcXG4gIHdpZHRoOiAxNTBweDtcXHJcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO1xcclxcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiBhbGwgLjVzO1xcclxcbiAgLW1vei10cmFuc2l0aW9uOiBhbGwgLjVzO1xcclxcbiAgLW1zLXRyYW5zaXRpb246IGFsbCAuNXM7XFxyXFxuICAtby10cmFuc2l0aW9uOiBhbGwgLjVzO1xcclxcbiAgdHJhbnNpdGlvbjogYWxsIC41cztcXHJcXG59XFxyXFxuXFxyXFxuLmh0LWxlZnQgdWwsLmh0LXJpZ2h0PnVse1xcclxcbiAgbGlzdC1zdHlsZS10eXBlOiBub25lO1xcclxcbiAgd2lkdGg6IDEyMCU7XFxyXFxuICBtYXJnaW46IDQwcHggMCAwIDA7XFxyXFxuICBtaW4taGVpZ2h0OiAxMjBweDtcXHJcXG4gIG1heC1oZWlnaHQ6IDQwMHB4O1xcclxcbiAgZm9udC1zaXplOiAxNHB4O1xcclxcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG4gIG92ZXJmbG93OiBhdXRvO1xcclxcbiAgY29sb3I6ICNjY2NjY2M7XFxyXFxufVxcclxcbi5odC1yaWdodD5oNXtcXHJcXG4gIG1hcmdpbjogMjBweCAwO1xcclxcbiAgd2lkdGg6IDEwMCU7XFxyXFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxyXFxuICBmb250LXNpemU6IDE2cHg7XFxyXFxuICBjb2xvcjogI2NjY2NjYztcXHJcXG59XFxyXFxuXFxyXFxuLmh0LWxlZnQ+dWwgbGksLmh0LXJpZ2h0PnVsPmxpe1xcclxcbiAgbGlzdC1zdHlsZS10eXBlOiBub25lO1xcclxcbiAgbWFyZ2luOiAwIDAgNDBweCAwcHg7XFxyXFxuICB3aWR0aDogMTAwJTtcXHJcXG4gIGhlaWdodDogNDBweDtcXHJcXG4gIGxpbmUtaGVpZ2h0OiA0MHB4O1xcclxcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG4gIGN1cnNvcjogcG9pbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuLmh0LXJpZ2h0PnVsPmxpPnNwYW46bm90KDpmaXJzdC1jaGlsZCl7XFxyXFxuICBmbG9hdDogcmlnaHQ7XFxyXFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuICBtYXJnaW4tbGVmdDogNXB4O1xcclxcbiAgZm9udC1zaXplOiAxMnB4O1xcclxcbn1cXHJcXG5cXHJcXG4uaHQtcmlnaHQ+dWw+bGk+c3BhbjpudGgtY2hpbGQoMil7XFxyXFxuICBjb2xvcjogcmdiYSgyNTUsIDAsIDAsIDAuNjgpO1xcclxcbn1cXHJcXG5cXHJcXG4uaHQtcmlnaHQ+dWw+bGk+c3BhbjpudGgtY2hpbGQoMyl7XFxyXFxuICBjb2xvcjogZ3JlZW47XFxyXFxufVxcclxcblxcclxcbi5odC1sZWZ0IGEsLmh0LXJpZ2h0IGF7XFxyXFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxyXFxuICBjb2xvcjogI2NjY2NjYztcXHJcXG59XFxyXFxuXFxyXFxuLmh0LWxlZnQ+dWwgbGk6aG92ZXIsLmh0LXJpZ2h0PnVsPmxpOmhvdmVye1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMCwgMC4yKTtcXHJcXG59XFxyXFxuXFxyXFxuLmFjdGl2ZWR7XFxyXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAwLCAwLjgpO1xcclxcbn1cXHJcXG5cXHJcXG4uaHQtbGVmdD51bCBsaXtcXHJcXG4gIHBhZGRpbmctbGVmdDogNzBweDtcXHJcXG59XFxyXFxuXFxyXFxuLmh0LXJpZ2h0PnVse1xcclxcbiAgbWFyZ2luLWxlZnQ6IC0yMCU7XFxyXFxufVxcclxcblxcclxcbi5odC1yaWdodD51bD5saXtcXHJcXG4gIHBhZGRpbmctbGVmdDogMzAlO1xcclxcbn1cXHJcXG5cXHJcXG4uaHQtbGVmdHtcXHJcXG4gIGxlZnQ6IC0xNTBweDtcXHJcXG59XFxyXFxuXFxyXFxuLmh0LWxlZnQ6aG92ZXJ7XFxyXFxuICBsZWZ0OiAwO1xcclxcbn1cXHJcXG5cXHJcXG4uaHQtcmlnaHR7XFxyXFxuICByaWdodDogLTE1MHB4O1xcclxcbn1cXHJcXG5cXHJcXG4uaHQtcmlnaHQ6aG92ZXJ7XFxyXFxuICByaWdodDogMDtcXHJcXG59XFxyXFxuXFxyXFxuLmh0LWpiLXRve1xcclxcbiAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgdG9wOi0zNTBweDtcXHJcXG4gIGxlZnQ6IDM1JTtcXHJcXG4gIC13ZWJraXQtYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG4gIC1tb3otYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxuICBwYWRkaW5nOiAyMHB4IDEwMHB4O1xcclxcbiAgd2lkdGg6IDMwJTtcXHJcXG4gIGhlaWdodDogMzAwcHg7XFxyXFxuICBiYWNrZ3JvdW5kOiByZ2JhKDE1NiwgMTU2LCAxNTYsIDAuNjQpO1xcclxcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiB0b3AgMXM7XFxyXFxuICAtbW96LXRyYW5zaXRpb246IHRvcCAxcztcXHJcXG4gIC1tcy10cmFuc2l0aW9uOiB0b3AgMXM7XFxyXFxuICAtby10cmFuc2l0aW9uOiB0b3AgMXM7XFxyXFxuICB0cmFuc2l0aW9uOiB0b3AgMXM7XFxyXFxufVxcclxcblxcclxcbi5odC1qYi10byB0ZXh0YXJlYXtcXHJcXG4gIHJlc2l6ZTogbm9uZTtcXHJcXG59XFxyXFxuXFxyXFxuLmh0LWpiLXRvPmRpdntcXHJcXG4gIG1hcmdpbi10b3A6IDVweDtcXHJcXG59XFxyXFxuXFxyXFxuLmh0LWpiLXRvIGJ1dHRvbntcXHJcXG4gIG1hcmdpbi10b3A6IDIwcHg7XFxyXFxufVxcclxcblxcclxcbi5odC1haHN7XFxyXFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICByaWdodDogMjAwcHg7XFxyXFxuICAtd2Via2l0LWJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxuICAtbW96LWJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxyXFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcXHJcXG4gIHBhZGRpbmc6IDIwcHggMTBweDtcXHJcXG4gIHdpZHRoOiAxMDBweDtcXHJcXG4gIGJhY2tncm91bmQ6IHJnYmEoMCwgMTI4LCAwLCAwLjQpO1xcclxcbiAgLXdlYmtpdC10cmFuc2l0aW9uOiBhbGwgLjVzO1xcclxcbiAgLW1vei10cmFuc2l0aW9uOiBhbGwgLjVzO1xcclxcbiAgLW1zLXRyYW5zaXRpb246IGFsbCAuNXM7XFxyXFxuICAtby10cmFuc2l0aW9uOiBhbGwgLjVzO1xcclxcbiAgdHJhbnNpdGlvbjogYWxsIC41cztcXHJcXG59XFxyXFxuXFxyXFxuLmh0LWFocyBzcGFue1xcclxcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcbiAgbWFyZ2luLWJvdHRvbTogMjBweDtcXHJcXG59XCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvX2Nzcy1sb2FkZXJAMC4yOC41QGNzcy1sb2FkZXIhLi9hbGwvY3NzL2luZGV4LmNzc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMiIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcIjE1OTc0ODUzYmMzMjk0ZWY2OGU3ZTZkNThmZTc0ZmQ3LnR0ZlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYWxsL2ZvbnRzL1BpbmdGYW5nIE1lZGl1bS50dGZcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDIiXSwic291cmNlUm9vdCI6IiJ9