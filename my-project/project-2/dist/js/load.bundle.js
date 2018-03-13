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
/******/ 			var chunkId = 1;
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
/******/ 	return hotCreateRequire(21)(__webpack_require__.s = 21);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
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
/* 2 */
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
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "body{\r\n  min-width: 800px;\r\n  font-family: \"\\5FAE\\8F6F\\96C5\\9ED1\";\r\n  background: url(" + __webpack_require__(23) + ") no-repeat;\r\n  background-size: cover;\r\n  background-origin: padding-box;\r\n}\r\n\r\ninput::-webkit-input-placeholder{\r\n  color: #ffffff;\r\n}\r\ninput:-moz-placeholder{\r\n  color: #ffffff;\r\n}\r\ninput::-moz-placeholder{\r\n  color: #ffffff;\r\n}\r\ninput:-ms-input-placeholder{\r\n  color: #ffffff;\r\n}\r\n\r\n.content>div:nth-child(2){\r\n  position: absolute;\r\n  top:0;\r\n  left: 0;\r\n  width: 100%;\r\n}\r\n\r\n.ht-load{\r\n  margin: 0 auto;\r\n  box-sizing: border-box;\r\n  padding: 15px 50px 60px 50px;\r\n  min-width: 500px;\r\n  max-width: 600px;\r\n  min-height: 590px;\r\n  text-align: center;\r\n  font-size: 14px;\r\n  color: #ffffff;\r\n}\r\n\r\n.ht-load>header>h1{\r\n  font-size: 48px;\r\n}\r\n\r\n.ht-load>header>p{\r\n  margin: 20px 0;\r\n  font-size: 20px;\r\n}\r\n\r\n\r\n.ht-con>div{\r\n  width: 100%;\r\n  overflow: hidden;\r\n}\r\n\r\n.ht-con>div{\r\n  display: inline-block;\r\n}\r\n\r\n\r\n.ht-con>div:first-child{\r\n  width: 50%;\r\n  vertical-align: bottom;\r\n}\r\n\r\n\r\n.ht-con>div:nth-child(2){\r\n  width: 50%;\r\n  vertical-align: bottom;\r\n}\r\n\r\n.ht-input{\r\n  position: relative;\r\n}\r\n\r\n.ht-load .ht-input{\r\n  margin: 40px auto 0 auto;\r\n}\r\n\r\n.ht-load .ht-input>input,\r\n.ht-load .ht-input-s>input{\r\n  padding-bottom: 10px;\r\n  box-shadow: none;\r\n  border-style: none;\r\n  border-radius: inherit;\r\n  border-bottom: 2px solid rgba(255, 255, 255, 0.9);\r\n  height: 20px;\r\n  font-size: 16px;\r\n  color: #ededed;\r\n  background: none;\r\n}\r\n\r\n.ht-load .ht-input>input:focus{\r\n  outline: none;\r\n}\r\n\r\n.ht-load a{\r\n  text-decoration: none;\r\n  color: #000000;\r\n}\r\n\r\n.ht-load .controls{\r\n  margin-left: 0px;\r\n}\r\n\r\n.ht-load .control-label{\r\n  margin-right: 10px;\r\n  width: 70px;\r\n}\r\n\r\n.inputSure{\r\n  margin-left: 40px;\r\n  margin-bottom: 0;\r\n  text-align: left;\r\n}\r\n\r\n.inputSure>input{\r\n  border: 2px solid #ffffff;\r\n}\r\n\r\n.warning{\r\n  position: absolute;\r\n  right: 0;\r\n  top: 5px;\r\n  color: rgba(255, 0, 0, 0.5);\r\n}\r\n\r\n.ht-suretext{\r\n  padding-left: 18px;\r\n  margin: 30px auto;\r\n  width: 100%;\r\n  height: 50px;\r\n}\r\n\r\n.ht-suretext>div{\r\n  float: left;\r\n  box-sizing: border-box;\r\n  width: 43%;\r\n  height: 50px;\r\n  overflow: hidden;\r\n  vertical-align: top;\r\n}\r\n\r\n.ht-suretext>div:first-child{\r\n  padding-top: 14px;\r\n  margin-right: 2%;\r\n}\r\n\r\n.ht-suretext>div>input{\r\n  border-radius: 5px;\r\n  width: 100%;\r\n}\r\n\r\n.ht-suretext>div:last-child{\r\n  cursor: pointer;\r\n}\r\n\r\n.ht-suretext>div:last-child img{\r\n  float: left;\r\n  margin-left: 35px;\r\n  height: 50px;\r\n  width: 60%;\r\n}\r\n\r\n.ht-sign{\r\n  padding-left: 20px;\r\n  margin: 50px auto 0 auto;\r\n  width: 100%;\r\n}\r\n\r\n.ht-sign>div{\r\n  float: left;\r\n}\r\n\r\n.ht-sign button {\r\n  border: 2px solid #c9c9c9;\r\n  border-radius: 30px;\r\n  width: 150px;\r\n  height: 36px;\r\n  font-size: 18px;\r\n  color: #ffffff;\r\n  background: none;\r\n}\r\n\r\n.ht-sign .ht-bnt{\r\n  background-color: #c9c9c9;\r\n}\r\n\r\n.ht-sign .ht-bnt:hover{\r\n  background: none;\r\n}\r\n\r\n.ht-sign a{\r\n  color: #c9c9c9;\r\n}\r\n\r\n.ht-sign>div:first-child{\r\n  margin-right: 86px;\r\n}\r\n\r\n.ht-sign>p{\r\n  clear: left;\r\n  margin: 0 auto;\r\n  padding-top: 20px;\r\n  width: 55%;\r\n  font-size: 12px;\r\n  text-align: right;\r\n  cursor: pointer;\r\n}\r\n\r\n.ht-sign>p>a{\r\n  color: rgba(0, 0, 255, 0.6);\r\n}\r\n\r\n.ht-sign>p:hover{\r\n  font-weight: bold;\r\n}\r\n\r\n.ht-time{\r\n  position: absolute;\r\n  top: 0;\r\n  width: 100%;\r\n  height: 100%;\r\n  background-color: rgba(0,0,0,0.7);\r\n}\r\n\r\n.ht-time>div{\r\n  margin: 20% auto;\r\n  padding: 30px 40px;\r\n  width: 100px;\r\n  text-align: center;\r\n  font-size: 14px;\r\n  background-color: #cccccc;\r\n}", ""]);

// exports


/***/ }),
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by gqy on 2017/8/25.
 */
__webpack_require__(22); //引入css代码
const lodebody = __webpack_require__(24); //引入界面
$("body").prepend($(lodebody));
//下面是动态背景引入的js代码包
__webpack_require__(25);
__webpack_require__(26);
__webpack_require__(27);
__webpack_require__(28);

;(function ($) {
  var load = { //主对象
    //界面高度修改函数
    setHeight: function () {
      var loadHeight = $(".ht-load-to-load");
      var canvas = $("#demo-canvas");
      var height = document.body.clientHeight || document.documentElement.clientHeight;
      height += document.body.scrollTop;
      loadHeight.css("height", height);
      canvas.css("height", height);
    },
    //保存用户名
    saveUser: function () {
      localStorage.setItem("userName", $("#inputEmail").val());
    },
    //设置验证码链接，修改时间戳，避免浏览器缓存
    changUrl: function () {
      var timestamp = new Date().getTime();
      var src = "login/getCaptchaImage?timestamp=" + timestamp;
      return src;
    },
    //验证码链接设置
    changImg: function () {
      var $img = $("#ht-suretxt");
      $img.attr("src", this.changUrl());
    },

    dataSerialize: function () {
      //表单序列化
      var data = {
        userName: $("#inputEmail").val(),
        passWord: $("#inputPassword").val(),
        rememberMe: $("#inputSure").is(":checked")
      };
      return data;
    },
    //失焦事件绑定，以及输入格式验证
    onBlur: function () {
      var that = this;
      $("body").on('blur', 'input', function (event) {
        var target = event.target;
        var reg = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
        var $parent = $(target).parent();

        if (target.id === 'inputEmail') {
          if ($parent.has('.warning')) {
            $parent.find('.warning').remove();
          }
          if ($("#inputEmail").val() == "") {
            $parent.append("<strong class='warning onError'>用户名不能为空</strong>");
          }
        } else if (target.id === 'inputPassword') {
          if ($parent.has('.warning')) {
            $parent.find('.warning').remove();
          }
          if ($("#inputPassword").val() == "" || $("#inputPassword").val().length < 6 || $("#inputPassword").val().length > 8) {
            $parent.append("<strong class='warning onError'>输入6-8位密码</strong>");
          }
        }
      });
    },
    //点击事件绑定
    onClick: function () {
      var that = this;
      var reg = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
      //验证码改变间隔，以及登录按钮激活特征变量
      var su = true,
          sur = true;
      $("body").on('click', 'button,input,img', function (event) {
        event.stopPropagation();
        var target = event.target;
        //验证码改变
        if (target.id == "ht-suretxt") {
          if (sur) {
            that.changImg();
            sur = false;
          }
          setTimeout(function () {
            sur = true;
          }, 1000);
        };

        if (target.id == "signin") {
          $("form input").trigger('blur');
          var len = $("form").find(".onError").length;
          if (!len) {
            if ($("#inputYanzheng").val().length <= 0) {
              alert("验证码不能为空");
            } else {
              if (su) {
                //登录请求发起
                su = false;
                $.ajax({
                  url: "login/UP",
                  type: 'POST',
                  dataType: 'json',
                  async: true,
                  data: that.dataSerialize(),
                  success: function (data) {
                    if (data.code == 100) {
                      $.ajax({
                        url: "login/checkCaptcha",
                        type: 'POST',
                        dataType: 'json',
                        async: true,
                        data: {
                          code: $("#inputYanzheng").val().toLocaleLowerCase()
                        },
                        success: function (data) {
                          if (data.code == 100) {
                            that.saveUser();
                            localStorage.setItem('userName', $("#inputEmail").val());
                            console.log($("#inputEmail").val());
                            alert("登陆成功");
                            $("#inputEmail").val("");
                            $("#inputPassword").val("");
                            window.location.href = "index.html";
                          } else {
                            alert("验证码错误");
                          }
                        }
                      });
                    }
                    //对举报用户的惩罚
                    else if (data.code == 200 && data.extend.error == "用户被惩罚，账户锁定20分钟，") {
                        $('body').append('<div class="ht-time"><div id="ht-time">20:00</div></div>');
                        alert("由于账户被多次举报，20分钟内不能上线");
                        var min = 19,
                            tim = 60,
                            clearT;
                        clearT = setInterval(function () {
                          tim--;
                          if (tim == -1) {
                            min--;
                            tim = 60;
                          }
                          $("#ht-time").html(min + ":" + tim);

                          if (min < 0) {
                            clearInterval(clearT);
                            $.ajax({
                              url: "login/chengFaEnd",
                              type: 'GET',
                              dataType: 'json',
                              async: true,
                              data: {
                                userName: $("#inputUser").val()
                              },

                              success: function (data) {
                                if (data.code == 100) {
                                  $("body div[class='ht-time']").remove();
                                  alert("请点击登录");
                                }
                              }
                            });
                          }
                        }, 1000);
                      } else if (data.code == 200) {
                        alert(data.extend.error);
                      }
                  }
                });
              }
              setTimeout(function () {
                su = true;
              }, 1000);
              return false;
            }
          }
        }
      });
    },

    onResize: function () {
      //屏幕大小改变事件绑定
      var that = this;
      window.onresize = function () {
        setTimeout(function () {
          that.setHeight();
        }, 0);
      };
    },

    active: function () {
      this.onResize();
      this.setHeight();
      this.onBlur();
      this.onClick();
    }
  };
  window.onload = load.changImg();
  load.active();
})(jQuery);

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
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
		module.hot.accept(7, function() {
			var newContent = __webpack_require__(7);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "92be484c5b30856a0c00f2b4128b7beb.png";

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid\">\r\n  <div class=\"content\">\r\n    <!-- 动态背景 -->\r\n    <div id=\"large-header\" class=\"large-header\">\r\n      <canvas id=\"demo-canvas\" style=\"width: 100%\"></canvas>\r\n    </div>\r\n    <div>\r\n      <div class=\"ht-load\">\r\n        <header>\r\n          <h1>FTF</h1>\r\n          <p>我们拒绝面面相觑</p>\r\n        </header>\r\n        <form class=\"form-horizontal\">\r\n          <div class=\"ht-con\">\r\n            <div>\r\n              <div class=\"control-group\">\r\n                <div class=\"controls ht-input\">\r\n                  <input type=\"text\" style=\"display: none\"><!-- 浏览器密码缓存处理 -->\r\n                  <input type=\"text\" id=\"inputEmail\" placeholder=\"用户名\" autocomplete=\"off\">\r\n                </div>\r\n              </div>\r\n              <div class=\"control-group\">\r\n                <div class=\"controls  ht-input\">\r\n                  <input type=\"password\" style=\"display: none\"><!-- 浏览器密码缓存处理 -->\r\n                  <input type=\"password\" id=\"inputPassword\" placeholder=\"密码\"  autocomplete=\"off\">\r\n                </div>\r\n              </div>\r\n            </div><div class=\"control-group ht-sure\">\r\n            <div class=\"controls\">\r\n              <label class=\"inputSure\">\r\n                <input type=\"checkbox\" id=\"inputSure\" value=\"\">\r\n                七天之内免登陆\r\n              </label>\r\n            </div>\r\n          </div>\r\n          </div>\r\n          <div class=\"ht-suretext\">\r\n            <div class=\"ht-input-s\">\r\n              <input type=\"text\" id=\"inputYanzheng\" value=\"\" placeholder=\"验证码\" maxlength=\"4\">\r\n            </div><div>\r\n            <img src=\"#\" id=\"ht-suretxt\" width=\"100%\" height=\"50px\">\r\n          </div>\r\n          </div>\r\n          <div class=\"ht-sign\">\r\n            <div class=\"controls\">\r\n              <button type=\"button\" class=\"btn ht-bnt\" id=\"signin\">登录</button>\r\n            </div>\r\n            <div class=\"controls\">\r\n              <a href=\"signup.html \"><button type=\"button\" class=\"btn\">注册</button></a>\r\n            </div>\r\n            <p><a href=\"forgetPassword.html\">找回密码>></a></p>\r\n          </div>\r\n        </form>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>";

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/*!
 * VERSION: beta 1.9.4
 * DATE: 2014-07-17
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function () {
  "use strict";
  _gsScope._gsDefine("easing.Back", ["easing.Ease"], function (t) {
    var e,
        i,
        s,
        r = _gsScope.GreenSockGlobals || _gsScope,
        n = r.com.greensock,
        a = 2 * Math.PI,
        o = Math.PI / 2,
        h = n._class,
        l = function (e, i) {
      var s = h("easing." + e, function () {}, !0),
          r = s.prototype = new t();return r.constructor = s, r.getRatio = i, s;
    },
        _ = t.register || function () {},
        u = function (t, e, i, s) {
      var r = h("easing." + t, { easeOut: new e(), easeIn: new i(), easeInOut: new s() }, !0);return _(r, t), r;
    },
        c = function (t, e, i) {
      this.t = t, this.v = e, i && (this.next = i, i.prev = this, this.c = i.v - e, this.gap = i.t - t);
    },
        p = function (e, i) {
      var s = h("easing." + e, function (t) {
        this._p1 = t || 0 === t ? t : 1.70158, this._p2 = 1.525 * this._p1;
      }, !0),
          r = s.prototype = new t();return r.constructor = s, r.getRatio = i, r.config = function (t) {
        return new s(t);
      }, s;
    },
        f = u("Back", p("BackOut", function (t) {
      return (t -= 1) * t * ((this._p1 + 1) * t + this._p1) + 1;
    }), p("BackIn", function (t) {
      return t * t * ((this._p1 + 1) * t - this._p1);
    }), p("BackInOut", function (t) {
      return 1 > (t *= 2) ? .5 * t * t * ((this._p2 + 1) * t - this._p2) : .5 * ((t -= 2) * t * ((this._p2 + 1) * t + this._p2) + 2);
    })),
        m = h("easing.SlowMo", function (t, e, i) {
      e = e || 0 === e ? e : .7, null == t ? t = .7 : t > 1 && (t = 1), this._p = 1 !== t ? e : 0, this._p1 = (1 - t) / 2, this._p2 = t, this._p3 = this._p1 + this._p2, this._calcEnd = i === !0;
    }, !0),
        d = m.prototype = new t();return d.constructor = m, d.getRatio = function (t) {
      var e = t + (.5 - t) * this._p;return this._p1 > t ? this._calcEnd ? 1 - (t = 1 - t / this._p1) * t : e - (t = 1 - t / this._p1) * t * t * t * e : t > this._p3 ? this._calcEnd ? 1 - (t = (t - this._p3) / this._p1) * t : e + (t - e) * (t = (t - this._p3) / this._p1) * t * t * t : this._calcEnd ? 1 : e;
    }, m.ease = new m(.7, .7), d.config = m.config = function (t, e, i) {
      return new m(t, e, i);
    }, e = h("easing.SteppedEase", function (t) {
      t = t || 1, this._p1 = 1 / t, this._p2 = t + 1;
    }, !0), d = e.prototype = new t(), d.constructor = e, d.getRatio = function (t) {
      return 0 > t ? t = 0 : t >= 1 && (t = .999999999), (this._p2 * t >> 0) * this._p1;
    }, d.config = e.config = function (t) {
      return new e(t);
    }, i = h("easing.RoughEase", function (e) {
      e = e || {};for (var i, s, r, n, a, o, h = e.taper || "none", l = [], _ = 0, u = 0 | (e.points || 20), p = u, f = e.randomize !== !1, m = e.clamp === !0, d = e.template instanceof t ? e.template : null, g = "number" == typeof e.strength ? .4 * e.strength : .4; --p > -1;) i = f ? Math.random() : 1 / u * p, s = d ? d.getRatio(i) : i, "none" === h ? r = g : "out" === h ? (n = 1 - i, r = n * n * g) : "in" === h ? r = i * i * g : .5 > i ? (n = 2 * i, r = .5 * n * n * g) : (n = 2 * (1 - i), r = .5 * n * n * g), f ? s += Math.random() * r - .5 * r : p % 2 ? s += .5 * r : s -= .5 * r, m && (s > 1 ? s = 1 : 0 > s && (s = 0)), l[_++] = { x: i, y: s };for (l.sort(function (t, e) {
        return t.x - e.x;
      }), o = new c(1, 1, null), p = u; --p > -1;) a = l[p], o = new c(a.x, a.y, o);this._prev = new c(0, 0, 0 !== o.t ? o : o.next);
    }, !0), d = i.prototype = new t(), d.constructor = i, d.getRatio = function (t) {
      var e = this._prev;if (t > e.t) {
        for (; e.next && t >= e.t;) e = e.next;e = e.prev;
      } else for (; e.prev && e.t >= t;) e = e.prev;return this._prev = e, e.v + (t - e.t) / e.gap * e.c;
    }, d.config = function (t) {
      return new i(t);
    }, i.ease = new i(), u("Bounce", l("BounceOut", function (t) {
      return 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375;
    }), l("BounceIn", function (t) {
      return 1 / 2.75 > (t = 1 - t) ? 1 - 7.5625 * t * t : 2 / 2.75 > t ? 1 - (7.5625 * (t -= 1.5 / 2.75) * t + .75) : 2.5 / 2.75 > t ? 1 - (7.5625 * (t -= 2.25 / 2.75) * t + .9375) : 1 - (7.5625 * (t -= 2.625 / 2.75) * t + .984375);
    }), l("BounceInOut", function (t) {
      var e = .5 > t;return t = e ? 1 - 2 * t : 2 * t - 1, t = 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375, e ? .5 * (1 - t) : .5 * t + .5;
    })), u("Circ", l("CircOut", function (t) {
      return Math.sqrt(1 - (t -= 1) * t);
    }), l("CircIn", function (t) {
      return -(Math.sqrt(1 - t * t) - 1);
    }), l("CircInOut", function (t) {
      return 1 > (t *= 2) ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    })), s = function (e, i, s) {
      var r = h("easing." + e, function (t, e) {
        this._p1 = t || 1, this._p2 = e || s, this._p3 = this._p2 / a * (Math.asin(1 / this._p1) || 0);
      }, !0),
          n = r.prototype = new t();return n.constructor = r, n.getRatio = i, n.config = function (t, e) {
        return new r(t, e);
      }, r;
    }, u("Elastic", s("ElasticOut", function (t) {
      return this._p1 * Math.pow(2, -10 * t) * Math.sin((t - this._p3) * a / this._p2) + 1;
    }, .3), s("ElasticIn", function (t) {
      return -(this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * a / this._p2));
    }, .3), s("ElasticInOut", function (t) {
      return 1 > (t *= 2) ? -.5 * this._p1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - this._p3) * a / this._p2) : .5 * this._p1 * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - this._p3) * a / this._p2) + 1;
    }, .45)), u("Expo", l("ExpoOut", function (t) {
      return 1 - Math.pow(2, -10 * t);
    }), l("ExpoIn", function (t) {
      return Math.pow(2, 10 * (t - 1)) - .001;
    }), l("ExpoInOut", function (t) {
      return 1 > (t *= 2) ? .5 * Math.pow(2, 10 * (t - 1)) : .5 * (2 - Math.pow(2, -10 * (t - 1)));
    })), u("Sine", l("SineOut", function (t) {
      return Math.sin(t * o);
    }), l("SineIn", function (t) {
      return -Math.cos(t * o) + 1;
    }), l("SineInOut", function (t) {
      return -.5 * (Math.cos(Math.PI * t) - 1);
    })), h("easing.EaseLookup", { find: function (e) {
        return t.map[e];
      } }, !0), _(r.SlowMo, "SlowMo", "ease,"), _(i, "RoughEase", "ease,"), _(e, "SteppedEase", "ease,"), f;
  }, !0);
}), _gsScope._gsDefine && _gsScope._gsQueue.pop()();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 26 */
/***/ (function(module, exports) {

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };
})();

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * VERSION: 1.13.1
 * DATE: 2014-07-22
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
(function (t, e) {
  "use strict";
  var i = t.GreenSockGlobals = t.GreenSockGlobals || t;if (!i.TweenLite) {
    var s,
        n,
        r,
        a,
        o,
        l = function (t) {
      var e,
          s = t.split("."),
          n = i;for (e = 0; s.length > e; e++) n[s[e]] = n = n[s[e]] || {};return n;
    },
        h = l("com.greensock"),
        _ = 1e-10,
        u = function (t) {
      var e,
          i = [],
          s = t.length;for (e = 0; e !== s; i.push(t[e++]));return i;
    },
        f = function () {},
        m = function () {
      var t = Object.prototype.toString,
          e = t.call([]);return function (i) {
        return null != i && (i instanceof Array || "object" == typeof i && !!i.push && t.call(i) === e);
      };
    }(),
        p = {},
        c = function (s, n, r, a) {
      this.sc = p[s] ? p[s].sc : [], p[s] = this, this.gsClass = null, this.func = r;var o = [];this.check = function (h) {
        for (var _, u, f, m, d = n.length, v = d; --d > -1;) (_ = p[n[d]] || new c(n[d], [])).gsClass ? (o[d] = _.gsClass, v--) : h && _.sc.push(this);if (0 === v && r) for (u = ("com.greensock." + s).split("."), f = u.pop(), m = l(u.join("."))[f] = this.gsClass = r.apply(r, o), a && (i[f] = m,  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
          return m;
        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : s === e && "undefined" != typeof module && module.exports && (module.exports = m)), d = 0; this.sc.length > d; d++) this.sc[d].check();
      }, this.check(!0);
    },
        d = t._gsDefine = function (t, e, i, s) {
      return new c(t, e, i, s);
    },
        v = h._class = function (t, e, i) {
      return e = e || function () {}, d(t, [], function () {
        return e;
      }, i), e;
    };d.globals = i;var g = [0, 0, 1, 1],
        T = [],
        y = v("easing.Ease", function (t, e, i, s) {
      this._func = t, this._type = i || 0, this._power = s || 0, this._params = e ? g.concat(e) : g;
    }, !0),
        w = y.map = {},
        P = y.register = function (t, e, i, s) {
      for (var n, r, a, o, l = e.split(","), _ = l.length, u = (i || "easeIn,easeOut,easeInOut").split(","); --_ > -1;) for (r = l[_], n = s ? v("easing." + r, null, !0) : h.easing[r] || {}, a = u.length; --a > -1;) o = u[a], w[r + "." + o] = w[o + r] = n[o] = t.getRatio ? t : t[o] || new t();
    };for (r = y.prototype, r._calcEnd = !1, r.getRatio = function (t) {
      if (this._func) return this._params[0] = t, this._func.apply(null, this._params);var e = this._type,
          i = this._power,
          s = 1 === e ? 1 - t : 2 === e ? t : .5 > t ? 2 * t : 2 * (1 - t);return 1 === i ? s *= s : 2 === i ? s *= s * s : 3 === i ? s *= s * s * s : 4 === i && (s *= s * s * s * s), 1 === e ? 1 - s : 2 === e ? s : .5 > t ? s / 2 : 1 - s / 2;
    }, s = ["Linear", "Quad", "Cubic", "Quart", "Quint,Strong"], n = s.length; --n > -1;) r = s[n] + ",Power" + n, P(new y(null, null, 1, n), r, "easeOut", !0), P(new y(null, null, 2, n), r, "easeIn" + (0 === n ? ",easeNone" : "")), P(new y(null, null, 3, n), r, "easeInOut");w.linear = h.easing.Linear.easeIn, w.swing = h.easing.Quad.easeInOut;var b = v("events.EventDispatcher", function (t) {
      this._listeners = {}, this._eventTarget = t || this;
    });r = b.prototype, r.addEventListener = function (t, e, i, s, n) {
      n = n || 0;var r,
          l,
          h = this._listeners[t],
          _ = 0;for (null == h && (this._listeners[t] = h = []), l = h.length; --l > -1;) r = h[l], r.c === e && r.s === i ? h.splice(l, 1) : 0 === _ && n > r.pr && (_ = l + 1);h.splice(_, 0, { c: e, s: i, up: s, pr: n }), this !== a || o || a.wake();
    }, r.removeEventListener = function (t, e) {
      var i,
          s = this._listeners[t];if (s) for (i = s.length; --i > -1;) if (s[i].c === e) return s.splice(i, 1), void 0;
    }, r.dispatchEvent = function (t) {
      var e,
          i,
          s,
          n = this._listeners[t];if (n) for (e = n.length, i = this._eventTarget; --e > -1;) s = n[e], s.up ? s.c.call(s.s || i, { type: t, target: i }) : s.c.call(s.s || i);
    };var k = t.requestAnimationFrame,
        A = t.cancelAnimationFrame,
        S = Date.now || function () {
      return new Date().getTime();
    },
        x = S();for (s = ["ms", "moz", "webkit", "o"], n = s.length; --n > -1 && !k;) k = t[s[n] + "RequestAnimationFrame"], A = t[s[n] + "CancelAnimationFrame"] || t[s[n] + "CancelRequestAnimationFrame"];v("Ticker", function (t, e) {
      var i,
          s,
          n,
          r,
          l,
          h = this,
          u = S(),
          m = e !== !1 && k,
          p = 500,
          c = 33,
          d = function (t) {
        var e,
            a,
            o = S() - x;o > p && (u += o - c), x += o, h.time = (x - u) / 1e3, e = h.time - l, (!i || e > 0 || t === !0) && (h.frame++, l += e + (e >= r ? .004 : r - e), a = !0), t !== !0 && (n = s(d)), a && h.dispatchEvent("tick");
      };b.call(h), h.time = h.frame = 0, h.tick = function () {
        d(!0);
      }, h.lagSmoothing = function (t, e) {
        p = t || 1 / _, c = Math.min(e, p, 0);
      }, h.sleep = function () {
        null != n && (m && A ? A(n) : clearTimeout(n), s = f, n = null, h === a && (o = !1));
      }, h.wake = function () {
        null !== n ? h.sleep() : h.frame > 10 && (x = S() - p + 5), s = 0 === i ? f : m && k ? k : function (t) {
          return setTimeout(t, 0 | 1e3 * (l - h.time) + 1);
        }, h === a && (o = !0), d(2);
      }, h.fps = function (t) {
        return arguments.length ? (i = t, r = 1 / (i || 60), l = this.time + r, h.wake(), void 0) : i;
      }, h.useRAF = function (t) {
        return arguments.length ? (h.sleep(), m = t, h.fps(i), void 0) : m;
      }, h.fps(t), setTimeout(function () {
        m && (!n || 5 > h.frame) && h.useRAF(!1);
      }, 1500);
    }), r = h.Ticker.prototype = new h.events.EventDispatcher(), r.constructor = h.Ticker;var C = v("core.Animation", function (t, e) {
      if (this.vars = e = e || {}, this._duration = this._totalDuration = t || 0, this._delay = Number(e.delay) || 0, this._timeScale = 1, this._active = e.immediateRender === !0, this.data = e.data, this._reversed = e.reversed === !0, B) {
        o || a.wake();var i = this.vars.useFrames ? q : B;i.add(this, i._time), this.vars.paused && this.paused(!0);
      }
    });a = C.ticker = new h.Ticker(), r = C.prototype, r._dirty = r._gc = r._initted = r._paused = !1, r._totalTime = r._time = 0, r._rawPrevTime = -1, r._next = r._last = r._onUpdate = r._timeline = r.timeline = null, r._paused = !1;var R = function () {
      o && S() - x > 2e3 && a.wake(), setTimeout(R, 2e3);
    };R(), r.play = function (t, e) {
      return null != t && this.seek(t, e), this.reversed(!1).paused(!1);
    }, r.pause = function (t, e) {
      return null != t && this.seek(t, e), this.paused(!0);
    }, r.resume = function (t, e) {
      return null != t && this.seek(t, e), this.paused(!1);
    }, r.seek = function (t, e) {
      return this.totalTime(Number(t), e !== !1);
    }, r.restart = function (t, e) {
      return this.reversed(!1).paused(!1).totalTime(t ? -this._delay : 0, e !== !1, !0);
    }, r.reverse = function (t, e) {
      return null != t && this.seek(t || this.totalDuration(), e), this.reversed(!0).paused(!1);
    }, r.render = function () {}, r.invalidate = function () {
      return this;
    }, r.isActive = function () {
      var t,
          e = this._timeline,
          i = this._startTime;return !e || !this._gc && !this._paused && e.isActive() && (t = e.rawTime()) >= i && i + this.totalDuration() / this._timeScale > t;
    }, r._enabled = function (t, e) {
      return o || a.wake(), this._gc = !t, this._active = this.isActive(), e !== !0 && (t && !this.timeline ? this._timeline.add(this, this._startTime - this._delay) : !t && this.timeline && this._timeline._remove(this, !0)), !1;
    }, r._kill = function () {
      return this._enabled(!1, !1);
    }, r.kill = function (t, e) {
      return this._kill(t, e), this;
    }, r._uncache = function (t) {
      for (var e = t ? this : this.timeline; e;) e._dirty = !0, e = e.timeline;return this;
    }, r._swapSelfInParams = function (t) {
      for (var e = t.length, i = t.concat(); --e > -1;) "{self}" === t[e] && (i[e] = this);return i;
    }, r.eventCallback = function (t, e, i, s) {
      if ("on" === (t || "").substr(0, 2)) {
        var n = this.vars;if (1 === arguments.length) return n[t];null == e ? delete n[t] : (n[t] = e, n[t + "Params"] = m(i) && -1 !== i.join("").indexOf("{self}") ? this._swapSelfInParams(i) : i, n[t + "Scope"] = s), "onUpdate" === t && (this._onUpdate = e);
      }return this;
    }, r.delay = function (t) {
      return arguments.length ? (this._timeline.smoothChildTiming && this.startTime(this._startTime + t - this._delay), this._delay = t, this) : this._delay;
    }, r.duration = function (t) {
      return arguments.length ? (this._duration = this._totalDuration = t, this._uncache(!0), this._timeline.smoothChildTiming && this._time > 0 && this._time < this._duration && 0 !== t && this.totalTime(this._totalTime * (t / this._duration), !0), this) : (this._dirty = !1, this._duration);
    }, r.totalDuration = function (t) {
      return this._dirty = !1, arguments.length ? this.duration(t) : this._totalDuration;
    }, r.time = function (t, e) {
      return arguments.length ? (this._dirty && this.totalDuration(), this.totalTime(t > this._duration ? this._duration : t, e)) : this._time;
    }, r.totalTime = function (t, e, i) {
      if (o || a.wake(), !arguments.length) return this._totalTime;if (this._timeline) {
        if (0 > t && !i && (t += this.totalDuration()), this._timeline.smoothChildTiming) {
          this._dirty && this.totalDuration();var s = this._totalDuration,
              n = this._timeline;if (t > s && !i && (t = s), this._startTime = (this._paused ? this._pauseTime : n._time) - (this._reversed ? s - t : t) / this._timeScale, n._dirty || this._uncache(!1), n._timeline) for (; n._timeline;) n._timeline._time !== (n._startTime + n._totalTime) / n._timeScale && n.totalTime(n._totalTime, !0), n = n._timeline;
        }this._gc && this._enabled(!0, !1), (this._totalTime !== t || 0 === this._duration) && (this.render(t, e, !1), O.length && M());
      }return this;
    }, r.progress = r.totalProgress = function (t, e) {
      return arguments.length ? this.totalTime(this.duration() * t, e) : this._time / this.duration();
    }, r.startTime = function (t) {
      return arguments.length ? (t !== this._startTime && (this._startTime = t, this.timeline && this.timeline._sortChildren && this.timeline.add(this, t - this._delay)), this) : this._startTime;
    }, r.timeScale = function (t) {
      if (!arguments.length) return this._timeScale;if (t = t || _, this._timeline && this._timeline.smoothChildTiming) {
        var e = this._pauseTime,
            i = e || 0 === e ? e : this._timeline.totalTime();this._startTime = i - (i - this._startTime) * this._timeScale / t;
      }return this._timeScale = t, this._uncache(!1);
    }, r.reversed = function (t) {
      return arguments.length ? (t != this._reversed && (this._reversed = t, this.totalTime(this._timeline && !this._timeline.smoothChildTiming ? this.totalDuration() - this._totalTime : this._totalTime, !0)), this) : this._reversed;
    }, r.paused = function (t) {
      if (!arguments.length) return this._paused;if (t != this._paused && this._timeline) {
        o || t || a.wake();var e = this._timeline,
            i = e.rawTime(),
            s = i - this._pauseTime;!t && e.smoothChildTiming && (this._startTime += s, this._uncache(!1)), this._pauseTime = t ? i : null, this._paused = t, this._active = this.isActive(), !t && 0 !== s && this._initted && this.duration() && this.render(e.smoothChildTiming ? this._totalTime : (i - this._startTime) / this._timeScale, !0, !0);
      }return this._gc && !t && this._enabled(!0, !1), this;
    };var D = v("core.SimpleTimeline", function (t) {
      C.call(this, 0, t), this.autoRemoveChildren = this.smoothChildTiming = !0;
    });r = D.prototype = new C(), r.constructor = D, r.kill()._gc = !1, r._first = r._last = null, r._sortChildren = !1, r.add = r.insert = function (t, e) {
      var i, s;if (t._startTime = Number(e || 0) + t._delay, t._paused && this !== t._timeline && (t._pauseTime = t._startTime + (this.rawTime() - t._startTime) / t._timeScale), t.timeline && t.timeline._remove(t, !0), t.timeline = t._timeline = this, t._gc && t._enabled(!0, !0), i = this._last, this._sortChildren) for (s = t._startTime; i && i._startTime > s;) i = i._prev;return i ? (t._next = i._next, i._next = t) : (t._next = this._first, this._first = t), t._next ? t._next._prev = t : this._last = t, t._prev = i, this._timeline && this._uncache(!0), this;
    }, r._remove = function (t, e) {
      return t.timeline === this && (e || t._enabled(!1, !0), t._prev ? t._prev._next = t._next : this._first === t && (this._first = t._next), t._next ? t._next._prev = t._prev : this._last === t && (this._last = t._prev), t._next = t._prev = t.timeline = null, this._timeline && this._uncache(!0)), this;
    }, r.render = function (t, e, i) {
      var s,
          n = this._first;for (this._totalTime = this._time = this._rawPrevTime = t; n;) s = n._next, (n._active || t >= n._startTime && !n._paused) && (n._reversed ? n.render((n._dirty ? n.totalDuration() : n._totalDuration) - (t - n._startTime) * n._timeScale, e, i) : n.render((t - n._startTime) * n._timeScale, e, i)), n = s;
    }, r.rawTime = function () {
      return o || a.wake(), this._totalTime;
    };var I = v("TweenLite", function (e, i, s) {
      if (C.call(this, i, s), this.render = I.prototype.render, null == e) throw "Cannot tween a null target.";this.target = e = "string" != typeof e ? e : I.selector(e) || e;var n,
          r,
          a,
          o = e.jquery || e.length && e !== t && e[0] && (e[0] === t || e[0].nodeType && e[0].style && !e.nodeType),
          l = this.vars.overwrite;if (this._overwrite = l = null == l ? Q[I.defaultOverwrite] : "number" == typeof l ? l >> 0 : Q[l], (o || e instanceof Array || e.push && m(e)) && "number" != typeof e[0]) for (this._targets = a = u(e), this._propLookup = [], this._siblings = [], n = 0; a.length > n; n++) r = a[n], r ? "string" != typeof r ? r.length && r !== t && r[0] && (r[0] === t || r[0].nodeType && r[0].style && !r.nodeType) ? (a.splice(n--, 1), this._targets = a = a.concat(u(r))) : (this._siblings[n] = $(r, this, !1), 1 === l && this._siblings[n].length > 1 && K(r, this, null, 1, this._siblings[n])) : (r = a[n--] = I.selector(r), "string" == typeof r && a.splice(n + 1, 1)) : a.splice(n--, 1);else this._propLookup = {}, this._siblings = $(e, this, !1), 1 === l && this._siblings.length > 1 && K(e, this, null, 1, this._siblings);(this.vars.immediateRender || 0 === i && 0 === this._delay && this.vars.immediateRender !== !1) && (this._time = -_, this.render(-this._delay));
    }, !0),
        E = function (e) {
      return e.length && e !== t && e[0] && (e[0] === t || e[0].nodeType && e[0].style && !e.nodeType);
    },
        z = function (t, e) {
      var i,
          s = {};for (i in t) G[i] || i in e && "transform" !== i && "x" !== i && "y" !== i && "width" !== i && "height" !== i && "className" !== i && "border" !== i || !(!U[i] || U[i] && U[i]._autoCSS) || (s[i] = t[i], delete t[i]);t.css = s;
    };r = I.prototype = new C(), r.constructor = I, r.kill()._gc = !1, r.ratio = 0, r._firstPT = r._targets = r._overwrittenProps = r._startAt = null, r._notifyPluginsOfEnabled = r._lazy = !1, I.version = "1.13.1", I.defaultEase = r._ease = new y(null, null, 1, 1), I.defaultOverwrite = "auto", I.ticker = a, I.autoSleep = !0, I.lagSmoothing = function (t, e) {
      a.lagSmoothing(t, e);
    }, I.selector = t.$ || t.jQuery || function (e) {
      var i = t.$ || t.jQuery;return i ? (I.selector = i, i(e)) : "undefined" == typeof document ? e : document.querySelectorAll ? document.querySelectorAll(e) : document.getElementById("#" === e.charAt(0) ? e.substr(1) : e);
    };var O = [],
        L = {},
        N = I._internals = { isArray: m, isSelector: E, lazyTweens: O },
        U = I._plugins = {},
        F = N.tweenLookup = {},
        j = 0,
        G = N.reservedProps = { ease: 1, delay: 1, overwrite: 1, onComplete: 1, onCompleteParams: 1, onCompleteScope: 1, useFrames: 1, runBackwards: 1, startAt: 1, onUpdate: 1, onUpdateParams: 1, onUpdateScope: 1, onStart: 1, onStartParams: 1, onStartScope: 1, onReverseComplete: 1, onReverseCompleteParams: 1, onReverseCompleteScope: 1, onRepeat: 1, onRepeatParams: 1, onRepeatScope: 1, easeParams: 1, yoyo: 1, immediateRender: 1, repeat: 1, repeatDelay: 1, data: 1, paused: 1, reversed: 1, autoCSS: 1, lazy: 1 },
        Q = { none: 0, all: 1, auto: 2, concurrent: 3, allOnStart: 4, preexisting: 5, "true": 1, "false": 0 },
        q = C._rootFramesTimeline = new D(),
        B = C._rootTimeline = new D(),
        M = N.lazyRender = function () {
      var t = O.length;for (L = {}; --t > -1;) s = O[t], s && s._lazy !== !1 && (s.render(s._lazy, !1, !0), s._lazy = !1);O.length = 0;
    };B._startTime = a.time, q._startTime = a.frame, B._active = q._active = !0, setTimeout(M, 1), C._updateRoot = I.render = function () {
      var t, e, i;if (O.length && M(), B.render((a.time - B._startTime) * B._timeScale, !1, !1), q.render((a.frame - q._startTime) * q._timeScale, !1, !1), O.length && M(), !(a.frame % 120)) {
        for (i in F) {
          for (e = F[i].tweens, t = e.length; --t > -1;) e[t]._gc && e.splice(t, 1);0 === e.length && delete F[i];
        }if (i = B._first, (!i || i._paused) && I.autoSleep && !q._first && 1 === a._listeners.tick.length) {
          for (; i && i._paused;) i = i._next;i || a.sleep();
        }
      }
    }, a.addEventListener("tick", C._updateRoot);var $ = function (t, e, i) {
      var s,
          n,
          r = t._gsTweenID;if (F[r || (t._gsTweenID = r = "t" + j++)] || (F[r] = { target: t, tweens: [] }), e && (s = F[r].tweens, s[n = s.length] = e, i)) for (; --n > -1;) s[n] === e && s.splice(n, 1);return F[r].tweens;
    },
        K = function (t, e, i, s, n) {
      var r, a, o, l;if (1 === s || s >= 4) {
        for (l = n.length, r = 0; l > r; r++) if ((o = n[r]) !== e) o._gc || o._enabled(!1, !1) && (a = !0);else if (5 === s) break;return a;
      }var h,
          u = e._startTime + _,
          f = [],
          m = 0,
          p = 0 === e._duration;for (r = n.length; --r > -1;) (o = n[r]) === e || o._gc || o._paused || (o._timeline !== e._timeline ? (h = h || H(e, 0, p), 0 === H(o, h, p) && (f[m++] = o)) : u >= o._startTime && o._startTime + o.totalDuration() / o._timeScale > u && ((p || !o._initted) && 2e-10 >= u - o._startTime || (f[m++] = o)));for (r = m; --r > -1;) o = f[r], 2 === s && o._kill(i, t) && (a = !0), (2 !== s || !o._firstPT && o._initted) && o._enabled(!1, !1) && (a = !0);return a;
    },
        H = function (t, e, i) {
      for (var s = t._timeline, n = s._timeScale, r = t._startTime; s._timeline;) {
        if (r += s._startTime, n *= s._timeScale, s._paused) return -100;s = s._timeline;
      }return r /= n, r > e ? r - e : i && r === e || !t._initted && 2 * _ > r - e ? _ : (r += t.totalDuration() / t._timeScale / n) > e + _ ? 0 : r - e - _;
    };r._init = function () {
      var t,
          e,
          i,
          s,
          n,
          r = this.vars,
          a = this._overwrittenProps,
          o = this._duration,
          l = !!r.immediateRender,
          h = r.ease;if (r.startAt) {
        this._startAt && (this._startAt.render(-1, !0), this._startAt.kill()), n = {};for (s in r.startAt) n[s] = r.startAt[s];if (n.overwrite = !1, n.immediateRender = !0, n.lazy = l && r.lazy !== !1, n.startAt = n.delay = null, this._startAt = I.to(this.target, 0, n), l) if (this._time > 0) this._startAt = null;else if (0 !== o) return;
      } else if (r.runBackwards && 0 !== o) if (this._startAt) this._startAt.render(-1, !0), this._startAt.kill(), this._startAt = null;else {
        i = {};for (s in r) G[s] && "autoCSS" !== s || (i[s] = r[s]);if (i.overwrite = 0, i.data = "isFromStart", i.lazy = l && r.lazy !== !1, i.immediateRender = l, this._startAt = I.to(this.target, 0, i), l) {
          if (0 === this._time) return;
        } else this._startAt._init(), this._startAt._enabled(!1);
      }if (this._ease = h = h ? h instanceof y ? h : "function" == typeof h ? new y(h, r.easeParams) : w[h] || I.defaultEase : I.defaultEase, r.easeParams instanceof Array && h.config && (this._ease = h.config.apply(h, r.easeParams)), this._easeType = this._ease._type, this._easePower = this._ease._power, this._firstPT = null, this._targets) for (t = this._targets.length; --t > -1;) this._initProps(this._targets[t], this._propLookup[t] = {}, this._siblings[t], a ? a[t] : null) && (e = !0);else e = this._initProps(this.target, this._propLookup, this._siblings, a);if (e && I._onPluginEvent("_onInitAllProps", this), a && (this._firstPT || "function" != typeof this.target && this._enabled(!1, !1)), r.runBackwards) for (i = this._firstPT; i;) i.s += i.c, i.c = -i.c, i = i._next;this._onUpdate = r.onUpdate, this._initted = !0;
    }, r._initProps = function (e, i, s, n) {
      var r, a, o, l, h, _;if (null == e) return !1;L[e._gsTweenID] && M(), this.vars.css || e.style && e !== t && e.nodeType && U.css && this.vars.autoCSS !== !1 && z(this.vars, e);for (r in this.vars) {
        if (_ = this.vars[r], G[r]) _ && (_ instanceof Array || _.push && m(_)) && -1 !== _.join("").indexOf("{self}") && (this.vars[r] = _ = this._swapSelfInParams(_, this));else if (U[r] && (l = new U[r]())._onInitTween(e, this.vars[r], this)) {
          for (this._firstPT = h = { _next: this._firstPT, t: l, p: "setRatio", s: 0, c: 1, f: !0, n: r, pg: !0, pr: l._priority }, a = l._overwriteProps.length; --a > -1;) i[l._overwriteProps[a]] = this._firstPT;(l._priority || l._onInitAllProps) && (o = !0), (l._onDisable || l._onEnable) && (this._notifyPluginsOfEnabled = !0);
        } else this._firstPT = i[r] = h = { _next: this._firstPT, t: e, p: r, f: "function" == typeof e[r], n: r, pg: !1, pr: 0 }, h.s = h.f ? e[r.indexOf("set") || "function" != typeof e["get" + r.substr(3)] ? r : "get" + r.substr(3)]() : parseFloat(e[r]), h.c = "string" == typeof _ && "=" === _.charAt(1) ? parseInt(_.charAt(0) + "1", 10) * Number(_.substr(2)) : Number(_) - h.s || 0;h && h._next && (h._next._prev = h);
      }return n && this._kill(n, e) ? this._initProps(e, i, s, n) : this._overwrite > 1 && this._firstPT && s.length > 1 && K(e, this, i, this._overwrite, s) ? (this._kill(i, e), this._initProps(e, i, s, n)) : (this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration) && (L[e._gsTweenID] = !0), o);
    }, r.render = function (t, e, i) {
      var s,
          n,
          r,
          a,
          o = this._time,
          l = this._duration,
          h = this._rawPrevTime;if (t >= l) this._totalTime = this._time = l, this.ratio = this._ease._calcEnd ? this._ease.getRatio(1) : 1, this._reversed || (s = !0, n = "onComplete"), 0 === l && (this._initted || !this.vars.lazy || i) && (this._startTime === this._timeline._duration && (t = 0), (0 === t || 0 > h || h === _) && h !== t && (i = !0, h > _ && (n = "onReverseComplete")), this._rawPrevTime = a = !e || t || h === t ? t : _);else if (1e-7 > t) this._totalTime = this._time = 0, this.ratio = this._ease._calcEnd ? this._ease.getRatio(0) : 0, (0 !== o || 0 === l && h > 0 && h !== _) && (n = "onReverseComplete", s = this._reversed), 0 > t ? (this._active = !1, 0 === l && (this._initted || !this.vars.lazy || i) && (h >= 0 && (i = !0), this._rawPrevTime = a = !e || t || h === t ? t : _)) : this._initted || (i = !0);else if (this._totalTime = this._time = t, this._easeType) {
        var u = t / l,
            f = this._easeType,
            m = this._easePower;(1 === f || 3 === f && u >= .5) && (u = 1 - u), 3 === f && (u *= 2), 1 === m ? u *= u : 2 === m ? u *= u * u : 3 === m ? u *= u * u * u : 4 === m && (u *= u * u * u * u), this.ratio = 1 === f ? 1 - u : 2 === f ? u : .5 > t / l ? u / 2 : 1 - u / 2;
      } else this.ratio = this._ease.getRatio(t / l);if (this._time !== o || i) {
        if (!this._initted) {
          if (this._init(), !this._initted || this._gc) return;if (!i && this._firstPT && (this.vars.lazy !== !1 && this._duration || this.vars.lazy && !this._duration)) return this._time = this._totalTime = o, this._rawPrevTime = h, O.push(this), this._lazy = t, void 0;this._time && !s ? this.ratio = this._ease.getRatio(this._time / l) : s && this._ease._calcEnd && (this.ratio = this._ease.getRatio(0 === this._time ? 0 : 1));
        }for (this._lazy !== !1 && (this._lazy = !1), this._active || !this._paused && this._time !== o && t >= 0 && (this._active = !0), 0 === o && (this._startAt && (t >= 0 ? this._startAt.render(t, e, i) : n || (n = "_dummyGS")), this.vars.onStart && (0 !== this._time || 0 === l) && (e || this.vars.onStart.apply(this.vars.onStartScope || this, this.vars.onStartParams || T))), r = this._firstPT; r;) r.f ? r.t[r.p](r.c * this.ratio + r.s) : r.t[r.p] = r.c * this.ratio + r.s, r = r._next;this._onUpdate && (0 > t && this._startAt && this._startTime && this._startAt.render(t, e, i), e || (this._time !== o || s) && this._onUpdate.apply(this.vars.onUpdateScope || this, this.vars.onUpdateParams || T)), n && (!this._gc || i) && (0 > t && this._startAt && !this._onUpdate && this._startTime && this._startAt.render(t, e, i), s && (this._timeline.autoRemoveChildren && this._enabled(!1, !1), this._active = !1), !e && this.vars[n] && this.vars[n].apply(this.vars[n + "Scope"] || this, this.vars[n + "Params"] || T), 0 === l && this._rawPrevTime === _ && a !== _ && (this._rawPrevTime = 0));
      }
    }, r._kill = function (t, e) {
      if ("all" === t && (t = null), null == t && (null == e || e === this.target)) return this._lazy = !1, this._enabled(!1, !1);e = "string" != typeof e ? e || this._targets || this.target : I.selector(e) || e;var i, s, n, r, a, o, l, h;if ((m(e) || E(e)) && "number" != typeof e[0]) for (i = e.length; --i > -1;) this._kill(t, e[i]) && (o = !0);else {
        if (this._targets) {
          for (i = this._targets.length; --i > -1;) if (e === this._targets[i]) {
            a = this._propLookup[i] || {}, this._overwrittenProps = this._overwrittenProps || [], s = this._overwrittenProps[i] = t ? this._overwrittenProps[i] || {} : "all";break;
          }
        } else {
          if (e !== this.target) return !1;a = this._propLookup, s = this._overwrittenProps = t ? this._overwrittenProps || {} : "all";
        }if (a) {
          l = t || a, h = t !== s && "all" !== s && t !== a && ("object" != typeof t || !t._tempKill);for (n in l) (r = a[n]) && (r.pg && r.t._kill(l) && (o = !0), r.pg && 0 !== r.t._overwriteProps.length || (r._prev ? r._prev._next = r._next : r === this._firstPT && (this._firstPT = r._next), r._next && (r._next._prev = r._prev), r._next = r._prev = null), delete a[n]), h && (s[n] = 1);!this._firstPT && this._initted && this._enabled(!1, !1);
        }
      }return o;
    }, r.invalidate = function () {
      return this._notifyPluginsOfEnabled && I._onPluginEvent("_onDisable", this), this._firstPT = null, this._overwrittenProps = null, this._onUpdate = null, this._startAt = null, this._initted = this._active = this._notifyPluginsOfEnabled = this._lazy = !1, this._propLookup = this._targets ? {} : [], this;
    }, r._enabled = function (t, e) {
      if (o || a.wake(), t && this._gc) {
        var i,
            s = this._targets;if (s) for (i = s.length; --i > -1;) this._siblings[i] = $(s[i], this, !0);else this._siblings = $(this.target, this, !0);
      }return C.prototype._enabled.call(this, t, e), this._notifyPluginsOfEnabled && this._firstPT ? I._onPluginEvent(t ? "_onEnable" : "_onDisable", this) : !1;
    }, I.to = function (t, e, i) {
      return new I(t, e, i);
    }, I.from = function (t, e, i) {
      return i.runBackwards = !0, i.immediateRender = 0 != i.immediateRender, new I(t, e, i);
    }, I.fromTo = function (t, e, i, s) {
      return s.startAt = i, s.immediateRender = 0 != s.immediateRender && 0 != i.immediateRender, new I(t, e, s);
    }, I.delayedCall = function (t, e, i, s, n) {
      return new I(e, 0, { delay: t, onComplete: e, onCompleteParams: i, onCompleteScope: s, onReverseComplete: e, onReverseCompleteParams: i, onReverseCompleteScope: s, immediateRender: !1, useFrames: n, overwrite: 0 });
    }, I.set = function (t, e) {
      return new I(t, 0, e);
    }, I.getTweensOf = function (t, e) {
      if (null == t) return [];t = "string" != typeof t ? t : I.selector(t) || t;var i, s, n, r;if ((m(t) || E(t)) && "number" != typeof t[0]) {
        for (i = t.length, s = []; --i > -1;) s = s.concat(I.getTweensOf(t[i], e));for (i = s.length; --i > -1;) for (r = s[i], n = i; --n > -1;) r === s[n] && s.splice(i, 1);
      } else for (s = $(t).concat(), i = s.length; --i > -1;) (s[i]._gc || e && !s[i].isActive()) && s.splice(i, 1);return s;
    }, I.killTweensOf = I.killDelayedCallsTo = function (t, e, i) {
      "object" == typeof e && (i = e, e = !1);for (var s = I.getTweensOf(t, e), n = s.length; --n > -1;) s[n]._kill(i, t);
    };var J = v("plugins.TweenPlugin", function (t, e) {
      this._overwriteProps = (t || "").split(","), this._propName = this._overwriteProps[0], this._priority = e || 0, this._super = J.prototype;
    }, !0);if (r = J.prototype, J.version = "1.10.1", J.API = 2, r._firstPT = null, r._addTween = function (t, e, i, s, n, r) {
      var a, o;return null != s && (a = "number" == typeof s || "=" !== s.charAt(1) ? Number(s) - i : parseInt(s.charAt(0) + "1", 10) * Number(s.substr(2))) ? (this._firstPT = o = { _next: this._firstPT, t: t, p: e, s: i, c: a, f: "function" == typeof t[e], n: n || e, r: r }, o._next && (o._next._prev = o), o) : void 0;
    }, r.setRatio = function (t) {
      for (var e, i = this._firstPT, s = 1e-6; i;) e = i.c * t + i.s, i.r ? e = Math.round(e) : s > e && e > -s && (e = 0), i.f ? i.t[i.p](e) : i.t[i.p] = e, i = i._next;
    }, r._kill = function (t) {
      var e,
          i = this._overwriteProps,
          s = this._firstPT;if (null != t[this._propName]) this._overwriteProps = [];else for (e = i.length; --e > -1;) null != t[i[e]] && i.splice(e, 1);for (; s;) null != t[s.n] && (s._next && (s._next._prev = s._prev), s._prev ? (s._prev._next = s._next, s._prev = null) : this._firstPT === s && (this._firstPT = s._next)), s = s._next;return !1;
    }, r._roundProps = function (t, e) {
      for (var i = this._firstPT; i;) (t[this._propName] || null != i.n && t[i.n.split(this._propName + "_").join("")]) && (i.r = e), i = i._next;
    }, I._onPluginEvent = function (t, e) {
      var i,
          s,
          n,
          r,
          a,
          o = e._firstPT;if ("_onInitAllProps" === t) {
        for (; o;) {
          for (a = o._next, s = n; s && s.pr > o.pr;) s = s._next;(o._prev = s ? s._prev : r) ? o._prev._next = o : n = o, (o._next = s) ? s._prev = o : r = o, o = a;
        }o = e._firstPT = n;
      }for (; o;) o.pg && "function" == typeof o.t[t] && o.t[t]() && (i = !0), o = o._next;return i;
    }, J.activate = function (t) {
      for (var e = t.length; --e > -1;) t[e].API === J.API && (U[new t[e]()._propName] = t[e]);return !0;
    }, d.plugin = function (t) {
      if (!(t && t.propName && t.init && t.API)) throw "illegal plugin definition.";var e,
          i = t.propName,
          s = t.priority || 0,
          n = t.overwriteProps,
          r = { init: "_onInitTween", set: "setRatio", kill: "_kill", round: "_roundProps", initAll: "_onInitAllProps" },
          a = v("plugins." + i.charAt(0).toUpperCase() + i.substr(1) + "Plugin", function () {
        J.call(this, i, s), this._overwriteProps = n || [];
      }, t.global === !0),
          o = a.prototype = new J(i);o.constructor = a, a.API = t.API;for (e in r) "function" == typeof t[e] && (o[r[e]] = t[e]);return a.version = t.version, J.activate([a]), a;
    }, s = t._gsQueue) {
      for (n = 0; s.length > n; n++) s[n]();for (r in p) p[r].func || t.console.log("GSAP encountered missing dependency: com.greensock." + r);
    }o = !1;
  }
})("undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window, "TweenLite");
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14)))

/***/ }),
/* 28 */
/***/ (function(module, exports) {

(function () {

    var width,
        height,
        largeHeader,
        canvas,
        ctx,
        points,
        target,
        animateHeader = true;

    // Main
    initHeader();
    initAnimation();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = { x: width / 2, y: height / 2 };

        largeHeader = document.getElementById('large-header');
        largeHeader.style.height = height + 'px';

        canvas = document.getElementById('demo-canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create points
        points = [];
        for (var x = 0; x < width; x = x + width / 20) {
            for (var y = 0; y < height; y = y + height / 20) {
                var px = x + Math.random() * width / 20;
                var py = y + Math.random() * height / 20;
                var p = { x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }

        // for each point find the 5 closest points
        for (var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for (var j = 0; j < points.length; j++) {
                var p2 = points[j];
                if (!(p1 == p2)) {
                    var placed = false;
                    for (var k = 0; k < 5; k++) {
                        if (!placed) {
                            if (closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }

                    for (var k = 0; k < 5; k++) {
                        if (!placed) {
                            if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for (var i in points) {
            var c = new Circle(points[i], 2 + Math.random() * 2, 'rgba(255,255,255,0.3)');
            points[i].circle = c;
        }
    }

    // Event handling
    function addListeners() {
        if (!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function mouseMove(e) {
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    }

    function scrollCheck() {
        if (document.body.scrollTop > height) animateHeader = false;else animateHeader = true;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader.style.height = height + 'px';
        canvas.width = width;
        canvas.height = height;
    }

    // animation
    function initAnimation() {
        animate();
        for (var i in points) {
            shiftPoint(points[i]);
        }
    }

    function animate() {
        if (animateHeader) {
            ctx.clearRect(0, 0, width, height);
            for (var i in points) {
                // detect points in range
                if (Math.abs(getDistance(target, points[i])) < 4000) {
                    points[i].active = 0.3;
                    points[i].circle.active = 0.6;
                } else if (Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = 0.1;
                    points[i].circle.active = 0.3;
                } else if (Math.abs(getDistance(target, points[i])) < 40000) {
                    points[i].active = 0.02;
                    points[i].circle.active = 0.1;
                } else {
                    points[i].active = 0;
                    points[i].circle.active = 0;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
        TweenLite.to(p, 1 + 1 * Math.random(), { x: p.originX - 50 + Math.random() * 100,
            y: p.originY - 50 + Math.random() * 100, ease: Circ.easeInOut,
            onComplete: function () {
                shiftPoint(p);
            } });
    }

    // Canvas manipulation
    function drawLines(p) {
        if (!p.active) return;
        for (var i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = 'rgba(156,217,249,' + p.active + ')';
            ctx.stroke();
        }
    }

    function Circle(pos, rad, color) {
        var _this = this;

        // constructor
        (function () {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function () {
            if (!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(156,217,249,' + _this.active + ')';
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }
})();

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDQ3NTdlOGMzNDU3NWUxNzA5ODIiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL19jc3MtbG9hZGVyQDAuMjguNUBjc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvX3N0eWxlLWxvYWRlckAwLjE4LjJAc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL19zdHlsZS1sb2FkZXJAMC4xOC4yQHN0eWxlLWxvYWRlci9saWIvdXJscy5qcyIsIndlYnBhY2s6Ly8vLi9hbGwvY3NzL2xvYWQuY3NzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vYWxsL2pzL2xvYWQuanMiLCJ3ZWJwYWNrOi8vLy4vYWxsL2Nzcy9sb2FkLmNzcz8xOWU1Iiwid2VicGFjazovLy8uL2FsbC9pbWcvbG9hZC1iZy5wbmciLCJ3ZWJwYWNrOi8vLy4vYWxsL3ZpZXcvbG9hZC1ib2R5Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vYWxsL2pzL0Vhc2VQYWNrLm1pbi5qcyIsIndlYnBhY2s6Ly8vLi9hbGwvanMvckFGLmpzIiwid2VicGFjazovLy8uL2FsbC9qcy9Ud2VlbkxpdGUubWluLmpzIiwid2VicGFjazovLy8uL2FsbC9qcy9kZW1vLTEuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsImxvZGVib2R5IiwiJCIsInByZXBlbmQiLCJsb2FkIiwic2V0SGVpZ2h0IiwibG9hZEhlaWdodCIsImNhbnZhcyIsImhlaWdodCIsImRvY3VtZW50IiwiYm9keSIsImNsaWVudEhlaWdodCIsImRvY3VtZW50RWxlbWVudCIsInNjcm9sbFRvcCIsImNzcyIsInNhdmVVc2VyIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsInZhbCIsImNoYW5nVXJsIiwidGltZXN0YW1wIiwiRGF0ZSIsImdldFRpbWUiLCJzcmMiLCJjaGFuZ0ltZyIsIiRpbWciLCJhdHRyIiwiZGF0YVNlcmlhbGl6ZSIsImRhdGEiLCJ1c2VyTmFtZSIsInBhc3NXb3JkIiwicmVtZW1iZXJNZSIsImlzIiwib25CbHVyIiwidGhhdCIsIm9uIiwiZXZlbnQiLCJ0YXJnZXQiLCJyZWciLCIkcGFyZW50IiwicGFyZW50IiwiaWQiLCJoYXMiLCJmaW5kIiwicmVtb3ZlIiwiYXBwZW5kIiwibGVuZ3RoIiwib25DbGljayIsInN1Iiwic3VyIiwic3RvcFByb3BhZ2F0aW9uIiwic2V0VGltZW91dCIsInRyaWdnZXIiLCJsZW4iLCJhbGVydCIsImFqYXgiLCJ1cmwiLCJ0eXBlIiwiZGF0YVR5cGUiLCJhc3luYyIsInN1Y2Nlc3MiLCJjb2RlIiwidG9Mb2NhbGVMb3dlckNhc2UiLCJjb25zb2xlIiwibG9nIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwiZXh0ZW5kIiwiZXJyb3IiLCJtaW4iLCJ0aW0iLCJjbGVhclQiLCJzZXRJbnRlcnZhbCIsImh0bWwiLCJjbGVhckludGVydmFsIiwib25SZXNpemUiLCJvbnJlc2l6ZSIsImFjdGl2ZSIsIm9ubG9hZCIsImpRdWVyeSIsIl9nc1Njb3BlIiwibW9kdWxlIiwiZXhwb3J0cyIsImdsb2JhbCIsIl9nc1F1ZXVlIiwicHVzaCIsIl9nc0RlZmluZSIsInQiLCJlIiwiaSIsInMiLCJyIiwiR3JlZW5Tb2NrR2xvYmFscyIsIm4iLCJjb20iLCJncmVlbnNvY2siLCJhIiwiTWF0aCIsIlBJIiwibyIsImgiLCJfY2xhc3MiLCJsIiwicHJvdG90eXBlIiwiY29uc3RydWN0b3IiLCJnZXRSYXRpbyIsIl8iLCJyZWdpc3RlciIsInUiLCJlYXNlT3V0IiwiZWFzZUluIiwiZWFzZUluT3V0IiwiYyIsInYiLCJuZXh0IiwicHJldiIsImdhcCIsInAiLCJfcDEiLCJfcDIiLCJjb25maWciLCJmIiwibSIsIl9wIiwiX3AzIiwiX2NhbGNFbmQiLCJkIiwiZWFzZSIsInRhcGVyIiwicG9pbnRzIiwicmFuZG9taXplIiwiY2xhbXAiLCJ0ZW1wbGF0ZSIsImciLCJzdHJlbmd0aCIsInJhbmRvbSIsIngiLCJ5Iiwic29ydCIsIl9wcmV2Iiwic3FydCIsImFzaW4iLCJwb3ciLCJzaW4iLCJjb3MiLCJtYXAiLCJTbG93TW8iLCJwb3AiLCJsYXN0VGltZSIsInZlbmRvcnMiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjYW5jZWxBbmltYXRpb25GcmFtZSIsImNhbGxiYWNrIiwiZWxlbWVudCIsImN1cnJUaW1lIiwidGltZVRvQ2FsbCIsIm1heCIsImNsZWFyVGltZW91dCIsIlR3ZWVuTGl0ZSIsInNwbGl0IiwiT2JqZWN0IiwidG9TdHJpbmciLCJjYWxsIiwiQXJyYXkiLCJzYyIsImdzQ2xhc3MiLCJmdW5jIiwiY2hlY2siLCJqb2luIiwiYXBwbHkiLCJnbG9iYWxzIiwiVCIsIl9mdW5jIiwiX3R5cGUiLCJfcG93ZXIiLCJfcGFyYW1zIiwiY29uY2F0IiwidyIsIlAiLCJlYXNpbmciLCJsaW5lYXIiLCJMaW5lYXIiLCJzd2luZyIsIlF1YWQiLCJiIiwiX2xpc3RlbmVycyIsIl9ldmVudFRhcmdldCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzcGxpY2UiLCJwciIsInVwIiwid2FrZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwYXRjaEV2ZW50IiwiayIsIkEiLCJTIiwibm93IiwidGltZSIsImZyYW1lIiwidGljayIsImxhZ1Ntb290aGluZyIsInNsZWVwIiwiZnBzIiwiYXJndW1lbnRzIiwidXNlUkFGIiwiVGlja2VyIiwiZXZlbnRzIiwiRXZlbnREaXNwYXRjaGVyIiwiQyIsInZhcnMiLCJfZHVyYXRpb24iLCJfdG90YWxEdXJhdGlvbiIsIl9kZWxheSIsIk51bWJlciIsImRlbGF5IiwiX3RpbWVTY2FsZSIsIl9hY3RpdmUiLCJpbW1lZGlhdGVSZW5kZXIiLCJfcmV2ZXJzZWQiLCJyZXZlcnNlZCIsIkIiLCJ1c2VGcmFtZXMiLCJxIiwiYWRkIiwiX3RpbWUiLCJwYXVzZWQiLCJ0aWNrZXIiLCJfZGlydHkiLCJfZ2MiLCJfaW5pdHRlZCIsIl9wYXVzZWQiLCJfdG90YWxUaW1lIiwiX3Jhd1ByZXZUaW1lIiwiX25leHQiLCJfbGFzdCIsIl9vblVwZGF0ZSIsIl90aW1lbGluZSIsInRpbWVsaW5lIiwiUiIsInBsYXkiLCJzZWVrIiwicGF1c2UiLCJyZXN1bWUiLCJ0b3RhbFRpbWUiLCJyZXN0YXJ0IiwicmV2ZXJzZSIsInRvdGFsRHVyYXRpb24iLCJyZW5kZXIiLCJpbnZhbGlkYXRlIiwiaXNBY3RpdmUiLCJfc3RhcnRUaW1lIiwicmF3VGltZSIsIl9lbmFibGVkIiwiX3JlbW92ZSIsIl9raWxsIiwia2lsbCIsIl91bmNhY2hlIiwiX3N3YXBTZWxmSW5QYXJhbXMiLCJldmVudENhbGxiYWNrIiwic3Vic3RyIiwiaW5kZXhPZiIsInNtb290aENoaWxkVGltaW5nIiwic3RhcnRUaW1lIiwiZHVyYXRpb24iLCJfcGF1c2VUaW1lIiwiTyIsIk0iLCJwcm9ncmVzcyIsInRvdGFsUHJvZ3Jlc3MiLCJfc29ydENoaWxkcmVuIiwidGltZVNjYWxlIiwiRCIsImF1dG9SZW1vdmVDaGlsZHJlbiIsIl9maXJzdCIsImluc2VydCIsIkkiLCJzZWxlY3RvciIsImpxdWVyeSIsIm5vZGVUeXBlIiwic3R5bGUiLCJvdmVyd3JpdGUiLCJfb3ZlcndyaXRlIiwiUSIsImRlZmF1bHRPdmVyd3JpdGUiLCJfdGFyZ2V0cyIsIl9wcm9wTG9va3VwIiwiX3NpYmxpbmdzIiwiSyIsIkUiLCJ6IiwiRyIsIlUiLCJfYXV0b0NTUyIsInJhdGlvIiwiX2ZpcnN0UFQiLCJfb3ZlcndyaXR0ZW5Qcm9wcyIsIl9zdGFydEF0IiwiX25vdGlmeVBsdWdpbnNPZkVuYWJsZWQiLCJfbGF6eSIsInZlcnNpb24iLCJkZWZhdWx0RWFzZSIsIl9lYXNlIiwiYXV0b1NsZWVwIiwicXVlcnlTZWxlY3RvckFsbCIsImdldEVsZW1lbnRCeUlkIiwiY2hhckF0IiwiTCIsIk4iLCJfaW50ZXJuYWxzIiwiaXNBcnJheSIsImlzU2VsZWN0b3IiLCJsYXp5VHdlZW5zIiwiX3BsdWdpbnMiLCJGIiwidHdlZW5Mb29rdXAiLCJqIiwicmVzZXJ2ZWRQcm9wcyIsIm9uQ29tcGxldGUiLCJvbkNvbXBsZXRlUGFyYW1zIiwib25Db21wbGV0ZVNjb3BlIiwicnVuQmFja3dhcmRzIiwic3RhcnRBdCIsIm9uVXBkYXRlIiwib25VcGRhdGVQYXJhbXMiLCJvblVwZGF0ZVNjb3BlIiwib25TdGFydCIsIm9uU3RhcnRQYXJhbXMiLCJvblN0YXJ0U2NvcGUiLCJvblJldmVyc2VDb21wbGV0ZSIsIm9uUmV2ZXJzZUNvbXBsZXRlUGFyYW1zIiwib25SZXZlcnNlQ29tcGxldGVTY29wZSIsIm9uUmVwZWF0Iiwib25SZXBlYXRQYXJhbXMiLCJvblJlcGVhdFNjb3BlIiwiZWFzZVBhcmFtcyIsInlveW8iLCJyZXBlYXQiLCJyZXBlYXREZWxheSIsImF1dG9DU1MiLCJsYXp5Iiwibm9uZSIsImFsbCIsImF1dG8iLCJjb25jdXJyZW50IiwiYWxsT25TdGFydCIsInByZWV4aXN0aW5nIiwiX3Jvb3RGcmFtZXNUaW1lbGluZSIsIl9yb290VGltZWxpbmUiLCJsYXp5UmVuZGVyIiwiX3VwZGF0ZVJvb3QiLCJ0d2VlbnMiLCJfZ3NUd2VlbklEIiwiSCIsIl9pbml0IiwidG8iLCJfZWFzZVR5cGUiLCJfZWFzZVBvd2VyIiwiX2luaXRQcm9wcyIsIl9vblBsdWdpbkV2ZW50IiwiX29uSW5pdFR3ZWVuIiwicGciLCJfcHJpb3JpdHkiLCJfb3ZlcndyaXRlUHJvcHMiLCJfb25Jbml0QWxsUHJvcHMiLCJfb25EaXNhYmxlIiwiX29uRW5hYmxlIiwicGFyc2VGbG9hdCIsInBhcnNlSW50IiwiX3RlbXBLaWxsIiwiZnJvbSIsImZyb21UbyIsImRlbGF5ZWRDYWxsIiwic2V0IiwiZ2V0VHdlZW5zT2YiLCJraWxsVHdlZW5zT2YiLCJraWxsRGVsYXllZENhbGxzVG8iLCJKIiwiX3Byb3BOYW1lIiwiX3N1cGVyIiwiQVBJIiwiX2FkZFR3ZWVuIiwic2V0UmF0aW8iLCJyb3VuZCIsIl9yb3VuZFByb3BzIiwiYWN0aXZhdGUiLCJwbHVnaW4iLCJwcm9wTmFtZSIsImluaXQiLCJwcmlvcml0eSIsIm92ZXJ3cml0ZVByb3BzIiwiaW5pdEFsbCIsInRvVXBwZXJDYXNlIiwid2lkdGgiLCJsYXJnZUhlYWRlciIsImN0eCIsImFuaW1hdGVIZWFkZXIiLCJpbml0SGVhZGVyIiwiaW5pdEFuaW1hdGlvbiIsImFkZExpc3RlbmVycyIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsImdldENvbnRleHQiLCJweCIsInB5Iiwib3JpZ2luWCIsIm9yaWdpblkiLCJjbG9zZXN0IiwicDEiLCJwMiIsInBsYWNlZCIsInVuZGVmaW5lZCIsImdldERpc3RhbmNlIiwiQ2lyY2xlIiwiY2lyY2xlIiwibW91c2VNb3ZlIiwic2Nyb2xsQ2hlY2siLCJyZXNpemUiLCJwb3N4IiwicG9zeSIsInBhZ2VYIiwicGFnZVkiLCJjbGllbnRYIiwiY2xpZW50WSIsInNjcm9sbExlZnQiLCJhbmltYXRlIiwic2hpZnRQb2ludCIsImNsZWFyUmVjdCIsImFicyIsImRyYXdMaW5lcyIsImRyYXciLCJDaXJjIiwiYmVnaW5QYXRoIiwibW92ZVRvIiwibGluZVRvIiwic3Ryb2tlU3R5bGUiLCJzdHJva2UiLCJwb3MiLCJyYWQiLCJjb2xvciIsIl90aGlzIiwicmFkaXVzIiwiYXJjIiwiZmlsbFN0eWxlIiwiZmlsbCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBMkQ7QUFDM0Q7QUFDQTtBQUNBLFdBQUc7O0FBRUgsb0RBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdEQUFnRDtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjs7OztBQUlBO0FBQ0Esc0RBQThDO0FBQzlDO0FBQ0E7QUFDQSxvQ0FBNEI7QUFDNUIscUNBQTZCO0FBQzdCLHlDQUFpQzs7QUFFakMsK0NBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDhDQUFzQztBQUN0QztBQUNBO0FBQ0EscUNBQTZCO0FBQzdCLHFDQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQW9CLGdCQUFnQjtBQUNwQztBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsYUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5QkFBaUIsOEJBQThCO0FBQy9DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjs7QUFFQSw0REFBb0Q7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQW1CLDJCQUEyQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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ZXNDb250ZW50IjpbIiBcdGZ1bmN0aW9uIGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKSB7XG4gXHRcdGRlbGV0ZSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG4gXHR9XG4gXHR2YXIgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2sgPSB0aGlzW1wid2VicGFja0hvdFVwZGF0ZVwiXTtcbiBcdHRoaXNbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdID0gXHJcbiBcdGZ1bmN0aW9uIHdlYnBhY2tIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0aG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHRcdGlmKHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrKSBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XHJcbiBcdH0gO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcclxuIFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuIFx0XHRzY3JpcHQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XHJcbiBcdFx0c2NyaXB0LmNoYXJzZXQgPSBcInV0Zi04XCI7XHJcbiBcdFx0c2NyaXB0LnNyYyA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBjaHVua0lkICsgXCIuXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNcIjtcclxuIFx0XHRoZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkTWFuaWZlc3QocmVxdWVzdFRpbWVvdXQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHJlcXVlc3RUaW1lb3V0ID0gcmVxdWVzdFRpbWVvdXQgfHwgMTAwMDA7XHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gXHRcdFx0aWYodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihcIk5vIGJyb3dzZXIgc3VwcG9ydFwiKSk7XHJcbiBcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gXHRcdFx0XHR2YXIgcmVxdWVzdFBhdGggPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzb25cIjtcclxuIFx0XHRcdFx0cmVxdWVzdC5vcGVuKFwiR0VUXCIsIHJlcXVlc3RQYXRoLCB0cnVlKTtcclxuIFx0XHRcdFx0cmVxdWVzdC50aW1lb3V0ID0gcmVxdWVzdFRpbWVvdXQ7XHJcbiBcdFx0XHRcdHJlcXVlc3Quc2VuZChudWxsKTtcclxuIFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcbiBcdFx0XHRcdHJldHVybiByZWplY3QoZXJyKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdGlmKHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkgcmV0dXJuO1xyXG4gXHRcdFx0XHRpZihyZXF1ZXN0LnN0YXR1cyA9PT0gMCkge1xyXG4gXHRcdFx0XHRcdC8vIHRpbWVvdXRcclxuIFx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgdGltZWQgb3V0LlwiKSk7XHJcbiBcdFx0XHRcdH0gZWxzZSBpZihyZXF1ZXN0LnN0YXR1cyA9PT0gNDA0KSB7XHJcbiBcdFx0XHRcdFx0Ly8gbm8gdXBkYXRlIGF2YWlsYWJsZVxyXG4gXHRcdFx0XHRcdHJlc29sdmUoKTtcclxuIFx0XHRcdFx0fSBlbHNlIGlmKHJlcXVlc3Quc3RhdHVzICE9PSAyMDAgJiYgcmVxdWVzdC5zdGF0dXMgIT09IDMwNCkge1xyXG4gXHRcdFx0XHRcdC8vIG90aGVyIGZhaWx1cmVcclxuIFx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgZmFpbGVkLlwiKSk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0Ly8gc3VjY2Vzc1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHR2YXIgdXBkYXRlID0gSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiBcdFx0XHRcdFx0fSBjYXRjaChlKSB7XHJcbiBcdFx0XHRcdFx0XHRyZWplY3QoZSk7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm47XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdHJlc29sdmUodXBkYXRlKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdFxyXG4gXHRcclxuIFx0dmFyIGhvdEFwcGx5T25VcGRhdGUgPSB0cnVlO1xyXG4gXHR2YXIgaG90Q3VycmVudEhhc2ggPSBcIjQ0NzU3ZThjMzQ1NzVlMTcwOTgyXCI7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdFJlcXVlc3RUaW1lb3V0ID0gMTAwMDA7XHJcbiBcdHZhciBob3RDdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xyXG4gXHR2YXIgaG90Q3VycmVudENoaWxkTW9kdWxlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50cyA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50c1RlbXAgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0aWYoIW1lKSByZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXztcclxuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XHJcbiBcdFx0XHRpZihtZS5ob3QuYWN0aXZlKSB7XHJcbiBcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcclxuIFx0XHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCkgPCAwKVxyXG4gXHRcdFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSByZXF1ZXN0O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKG1lLmNoaWxkcmVuLmluZGV4T2YocmVxdWVzdCkgPCAwKVxyXG4gXHRcdFx0XHRcdG1lLmNoaWxkcmVuLnB1c2gocmVxdWVzdCk7XHJcbiBcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXF1ZXN0ICsgXCIpIGZyb20gZGlzcG9zZWQgbW9kdWxlIFwiICsgbW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFtdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ocmVxdWVzdCk7XHJcbiBcdFx0fTtcclxuIFx0XHR2YXIgT2JqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uIE9iamVjdEZhY3RvcnkobmFtZSkge1xyXG4gXHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdO1xyXG4gXHRcdFx0XHR9LFxyXG4gXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiBcdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXSA9IHZhbHVlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH07XHJcbiBcdFx0Zm9yKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChfX3dlYnBhY2tfcmVxdWlyZV9fLCBuYW1lKSAmJiBuYW1lICE9PSBcImVcIikge1xyXG4gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIE9iamVjdEZhY3RvcnkobmFtZSkpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRmbi5lID0gZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInJlYWR5XCIpXHJcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHRob3RDaHVua3NMb2FkaW5nKys7XHJcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5lKGNodW5rSWQpLnRoZW4oZmluaXNoQ2h1bmtMb2FkaW5nLCBmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0ZmluaXNoQ2h1bmtMb2FkaW5nKCk7XHJcbiBcdFx0XHRcdHRocm93IGVycjtcclxuIFx0XHRcdH0pO1xyXG4gXHRcclxuIFx0XHRcdGZ1bmN0aW9uIGZpbmlzaENodW5rTG9hZGluZygpIHtcclxuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZy0tO1xyXG4gXHRcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiKSB7XHJcbiBcdFx0XHRcdFx0aWYoIWhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fTtcclxuIFx0XHRyZXR1cm4gZm47XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhvdCA9IHtcclxuIFx0XHRcdC8vIHByaXZhdGUgc3R1ZmZcclxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X3NlbGZBY2NlcHRlZDogZmFsc2UsXHJcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcclxuIFx0XHRcdF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxyXG4gXHRcdFx0X21haW46IGhvdEN1cnJlbnRDaGlsZE1vZHVsZSAhPT0gbW9kdWxlSWQsXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTW9kdWxlIEFQSVxyXG4gXHRcdFx0YWN0aXZlOiB0cnVlLFxyXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBdID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkZWNsaW5lOiBmdW5jdGlvbihkZXApIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBbaV1dID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGlzcG9zZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTWFuYWdlbWVudCBBUElcclxuIFx0XHRcdGNoZWNrOiBob3RDaGVjayxcclxuIFx0XHRcdGFwcGx5OiBob3RBcHBseSxcclxuIFx0XHRcdHN0YXR1czogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRpZighbCkgcmV0dXJuIGhvdFN0YXR1cztcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90U3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvL2luaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcclxuIFx0XHRcdGRhdGE6IGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxyXG4gXHRcdH07XHJcbiBcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gdW5kZWZpbmVkO1xyXG4gXHRcdHJldHVybiBob3Q7XHJcbiBcdH1cclxuIFx0XHJcbiBcdHZhciBob3RTdGF0dXNIYW5kbGVycyA9IFtdO1xyXG4gXHR2YXIgaG90U3RhdHVzID0gXCJpZGxlXCI7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RTZXRTdGF0dXMobmV3U3RhdHVzKSB7XHJcbiBcdFx0aG90U3RhdHVzID0gbmV3U3RhdHVzO1xyXG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBob3RTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcclxuIFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzW2ldLmNhbGwobnVsbCwgbmV3U3RhdHVzKTtcclxuIFx0fVxyXG4gXHRcclxuIFx0Ly8gd2hpbGUgZG93bmxvYWRpbmdcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlcyA9IDA7XHJcbiBcdHZhciBob3RDaHVua3NMb2FkaW5nID0gMDtcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdEF2YWlsYWJsZUZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3REZWZlcnJlZDtcclxuIFx0XHJcbiBcdC8vIFRoZSB1cGRhdGUgaW5mb1xyXG4gXHR2YXIgaG90VXBkYXRlLCBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gdG9Nb2R1bGVJZChpZCkge1xyXG4gXHRcdHZhciBpc051bWJlciA9ICgraWQpICsgXCJcIiA9PT0gaWQ7XHJcbiBcdFx0cmV0dXJuIGlzTnVtYmVyID8gK2lkIDogaWQ7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5KSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcImlkbGVcIikgdGhyb3cgbmV3IEVycm9yKFwiY2hlY2soKSBpcyBvbmx5IGFsbG93ZWQgaW4gaWRsZSBzdGF0dXNcIik7XHJcbiBcdFx0aG90QXBwbHlPblVwZGF0ZSA9IGFwcGx5O1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xyXG4gXHRcdHJldHVybiBob3REb3dubG9hZE1hbmlmZXN0KGhvdFJlcXVlc3RUaW1lb3V0KS50aGVuKGZ1bmN0aW9uKHVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoIXVwZGF0ZSkge1xyXG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xyXG4gXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcclxuIFx0XHRcdGhvdEF2YWlsYWJsZUZpbGVzTWFwID0gdXBkYXRlLmM7XHJcbiBcdFx0XHRob3RVcGRhdGVOZXdIYXNoID0gdXBkYXRlLmg7XHJcbiBcdFxyXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcclxuIFx0XHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiBcdFx0XHRcdGhvdERlZmVycmVkID0ge1xyXG4gXHRcdFx0XHRcdHJlc29sdmU6IHJlc29sdmUsXHJcbiBcdFx0XHRcdFx0cmVqZWN0OiByZWplY3RcclxuIFx0XHRcdFx0fTtcclxuIFx0XHRcdH0pO1xyXG4gXHRcdFx0aG90VXBkYXRlID0ge307XHJcbiBcdFx0XHR2YXIgY2h1bmtJZCA9IDE7XHJcbiBcdFx0XHR7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbG9uZS1ibG9ja3NcclxuIFx0XHRcdFx0LypnbG9iYWxzIGNodW5rSWQgKi9cclxuIFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiICYmIGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XHJcbiBcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJldHVybiBwcm9taXNlO1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0aWYoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdIHx8ICFob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSlcclxuIFx0XHRcdHJldHVybjtcclxuIFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IGZhbHNlO1xyXG4gXHRcdGZvcih2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdGhvdFVwZGF0ZVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcdGlmKC0taG90V2FpdGluZ0ZpbGVzID09PSAwICYmIGhvdENodW5rc0xvYWRpbmcgPT09IDApIHtcclxuIFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpIHtcclxuIFx0XHRpZighaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0pIHtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0fSBlbHNlIHtcclxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlcysrO1xyXG4gXHRcdFx0aG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdFVwZGF0ZURvd25sb2FkZWQoKSB7XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwicmVhZHlcIik7XHJcbiBcdFx0dmFyIGRlZmVycmVkID0gaG90RGVmZXJyZWQ7XHJcbiBcdFx0aG90RGVmZXJyZWQgPSBudWxsO1xyXG4gXHRcdGlmKCFkZWZlcnJlZCkgcmV0dXJuO1xyXG4gXHRcdGlmKGhvdEFwcGx5T25VcGRhdGUpIHtcclxuIFx0XHRcdC8vIFdyYXAgZGVmZXJyZWQgb2JqZWN0IGluIFByb21pc2UgdG8gbWFyayBpdCBhcyBhIHdlbGwtaGFuZGxlZCBQcm9taXNlIHRvXHJcbiBcdFx0XHQvLyBhdm9pZCB0cmlnZ2VyaW5nIHVuY2F1Z2h0IGV4Y2VwdGlvbiB3YXJuaW5nIGluIENocm9tZS5cclxuIFx0XHRcdC8vIFNlZSBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD00NjU2NjZcclxuIFx0XHRcdFByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdHJldHVybiBob3RBcHBseShob3RBcHBseU9uVXBkYXRlKTtcclxuIFx0XHRcdH0pLnRoZW4oXHJcbiBcdFx0XHRcdGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gXHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcclxuIFx0XHRcdFx0fSxcclxuIFx0XHRcdFx0ZnVuY3Rpb24oZXJyKSB7XHJcbiBcdFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdCk7XHJcbiBcdFx0fSBlbHNlIHtcclxuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHRcdGZvcih2YXIgaWQgaW4gaG90VXBkYXRlKSB7XHJcbiBcdFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHRvTW9kdWxlSWQoaWQpKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QXBwbHkob3B0aW9ucykge1xyXG4gXHRcdGlmKGhvdFN0YXR1cyAhPT0gXCJyZWFkeVwiKSB0aHJvdyBuZXcgRXJyb3IoXCJhcHBseSgpIGlzIG9ubHkgYWxsb3dlZCBpbiByZWFkeSBzdGF0dXNcIik7XHJcbiBcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiBcdFxyXG4gXHRcdHZhciBjYjtcclxuIFx0XHR2YXIgaTtcclxuIFx0XHR2YXIgajtcclxuIFx0XHR2YXIgbW9kdWxlO1xyXG4gXHRcdHZhciBtb2R1bGVJZDtcclxuIFx0XHJcbiBcdFx0ZnVuY3Rpb24gZ2V0QWZmZWN0ZWRTdHVmZih1cGRhdGVNb2R1bGVJZCkge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFt1cGRhdGVNb2R1bGVJZF07XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKS5tYXAoZnVuY3Rpb24oaWQpIHtcclxuIFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRjaGFpbjogW2lkXSxcclxuIFx0XHRcdFx0XHRpZDogaWRcclxuIFx0XHRcdFx0fTtcclxuIFx0XHRcdH0pO1xyXG4gXHRcdFx0d2hpbGUocXVldWUubGVuZ3RoID4gMCkge1xyXG4gXHRcdFx0XHR2YXIgcXVldWVJdGVtID0gcXVldWUucG9wKCk7XHJcbiBcdFx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlSXRlbS5pZDtcclxuIFx0XHRcdFx0dmFyIGNoYWluID0gcXVldWVJdGVtLmNoYWluO1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYoIW1vZHVsZSB8fCBtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0Y29udGludWU7XHJcbiBcdFx0XHRcdGlmKG1vZHVsZS5ob3QuX3NlbGZEZWNsaW5lZCkge1xyXG4gXHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtZGVjbGluZWRcIixcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fbWFpbikge1xyXG4gXHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInVuYWNjZXB0ZWRcIixcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1vZHVsZS5wYXJlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0dmFyIHBhcmVudElkID0gbW9kdWxlLnBhcmVudHNbaV07XHJcbiBcdFx0XHRcdFx0dmFyIHBhcmVudCA9IGluc3RhbGxlZE1vZHVsZXNbcGFyZW50SWRdO1xyXG4gXHRcdFx0XHRcdGlmKCFwYXJlbnQpIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdGlmKHBhcmVudC5ob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xyXG4gXHRcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdHBhcmVudElkOiBwYXJlbnRJZFxyXG4gXHRcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYob3V0ZGF0ZWRNb2R1bGVzLmluZGV4T2YocGFyZW50SWQpID49IDApIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdGlmKHBhcmVudC5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xyXG4gXHRcdFx0XHRcdFx0aWYoIW91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSlcclxuIFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0sIFttb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdFx0Y29udGludWU7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2gocGFyZW50SWQpO1xyXG4gXHRcdFx0XHRcdHF1ZXVlLnB1c2goe1xyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcclxuIFx0XHRcdFx0XHRcdGlkOiBwYXJlbnRJZFxyXG4gXHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFxyXG4gXHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0dHlwZTogXCJhY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRtb2R1bGVJZDogdXBkYXRlTW9kdWxlSWQsXHJcbiBcdFx0XHRcdG91dGRhdGVkTW9kdWxlczogb3V0ZGF0ZWRNb2R1bGVzLFxyXG4gXHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llczogb3V0ZGF0ZWREZXBlbmRlbmNpZXNcclxuIFx0XHRcdH07XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBhZGRBbGxUb1NldChhLCBiKSB7XHJcbiBcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHR2YXIgaXRlbSA9IGJbaV07XHJcbiBcdFx0XHRcdGlmKGEuaW5kZXhPZihpdGVtKSA8IDApXHJcbiBcdFx0XHRcdFx0YS5wdXNoKGl0ZW0pO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gYXQgYmVnaW4gYWxsIHVwZGF0ZXMgbW9kdWxlcyBhcmUgb3V0ZGF0ZWRcclxuIFx0XHQvLyB0aGUgXCJvdXRkYXRlZFwiIHN0YXR1cyBjYW4gcHJvcGFnYXRlIHRvIHBhcmVudHMgaWYgdGhleSBkb24ndCBhY2NlcHQgdGhlIGNoaWxkcmVuXHJcbiBcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XHJcbiBcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdHZhciBhcHBsaWVkVXBkYXRlID0ge307XHJcbiBcdFxyXG4gXHRcdHZhciB3YXJuVW5leHBlY3RlZFJlcXVpcmUgPSBmdW5jdGlvbiB3YXJuVW5leHBlY3RlZFJlcXVpcmUoKSB7XHJcbiBcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIikgdG8gZGlzcG9zZWQgbW9kdWxlXCIpO1xyXG4gXHRcdH07XHJcbiBcdFxyXG4gXHRcdGZvcih2YXIgaWQgaW4gaG90VXBkYXRlKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlSWQgPSB0b01vZHVsZUlkKGlkKTtcclxuIFx0XHRcdFx0dmFyIHJlc3VsdDtcclxuIFx0XHRcdFx0aWYoaG90VXBkYXRlW2lkXSkge1xyXG4gXHRcdFx0XHRcdHJlc3VsdCA9IGdldEFmZmVjdGVkU3R1ZmYobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdHJlc3VsdCA9IHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwiZGlzcG9zZWRcIixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBpZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0dmFyIGFib3J0RXJyb3IgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGRvQXBwbHkgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGRvRGlzcG9zZSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW5JbmZvID0gXCJcIjtcclxuIFx0XHRcdFx0aWYocmVzdWx0LmNoYWluKSB7XHJcbiBcdFx0XHRcdFx0Y2hhaW5JbmZvID0gXCJcXG5VcGRhdGUgcHJvcGFnYXRpb246IFwiICsgcmVzdWx0LmNoYWluLmpvaW4oXCIgLT4gXCIpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdHN3aXRjaChyZXN1bHQudHlwZSkge1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJzZWxmLWRlY2xpbmVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2Ugb2Ygc2VsZiBkZWNsaW5lOiBcIiArIHJlc3VsdC5tb2R1bGVJZCArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBkZWNsaW5lZCBkZXBlbmRlbmN5OiBcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiIGluIFwiICsgcmVzdWx0LnBhcmVudElkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJ1bmFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vblVuYWNjZXB0ZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZVVuYWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2UgXCIgKyBtb2R1bGVJZCArIFwiIGlzIG5vdCBhY2NlcHRlZFwiICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJhY2NlcHRlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uQWNjZXB0ZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGRvQXBwbHkgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImRpc3Bvc2VkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGlzcG9zZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EaXNwb3NlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9EaXNwb3NlID0gdHJ1ZTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGRlZmF1bHQ6XHJcbiBcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmV4Y2VwdGlvbiB0eXBlIFwiICsgcmVzdWx0LnR5cGUpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGFib3J0RXJyb3IpIHtcclxuIFx0XHRcdFx0XHRob3RTZXRTdGF0dXMoXCJhYm9ydFwiKTtcclxuIFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoYWJvcnRFcnJvcik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoZG9BcHBseSkge1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gaG90VXBkYXRlW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIHJlc3VsdC5vdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdFx0XHRcdGZvcihtb2R1bGVJZCBpbiByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSA9IFtdO1xyXG4gXHRcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0sIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0Rpc3Bvc2UpIHtcclxuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIFtyZXN1bHQubW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IHdhcm5VbmV4cGVjdGVkUmVxdWlyZTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gU3RvcmUgc2VsZiBhY2NlcHRlZCBvdXRkYXRlZCBtb2R1bGVzIHRvIHJlcXVpcmUgdGhlbSBsYXRlciBieSB0aGUgbW9kdWxlIHN5c3RlbVxyXG4gXHRcdHZhciBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHRmb3IoaSA9IDA7IGkgPCBvdXRkYXRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdG1vZHVsZUlkID0gb3V0ZGF0ZWRNb2R1bGVzW2ldO1xyXG4gXHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gJiYgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5wdXNoKHtcclxuIFx0XHRcdFx0XHRtb2R1bGU6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdGVycm9ySGFuZGxlcjogaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWRcclxuIFx0XHRcdFx0fSk7XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBOb3cgaW4gXCJkaXNwb3NlXCIgcGhhc2VcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJkaXNwb3NlXCIpO1xyXG4gXHRcdE9iamVjdC5rZXlzKGhvdEF2YWlsYWJsZUZpbGVzTWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGNodW5rSWQpIHtcclxuIFx0XHRcdGlmKGhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdID09PSBmYWxzZSkge1xyXG4gXHRcdFx0XHRob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fSk7XHJcbiBcdFxyXG4gXHRcdHZhciBpZHg7XHJcbiBcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCk7XHJcbiBcdFx0d2hpbGUocXVldWUubGVuZ3RoID4gMCkge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0aWYoIW1vZHVsZSkgY29udGludWU7XHJcbiBcdFxyXG4gXHRcdFx0dmFyIGRhdGEgPSB7fTtcclxuIFx0XHJcbiBcdFx0XHQvLyBDYWxsIGRpc3Bvc2UgaGFuZGxlcnNcclxuIFx0XHRcdHZhciBkaXNwb3NlSGFuZGxlcnMgPSBtb2R1bGUuaG90Ll9kaXNwb3NlSGFuZGxlcnM7XHJcbiBcdFx0XHRmb3IoaiA9IDA7IGogPCBkaXNwb3NlSGFuZGxlcnMubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0Y2IgPSBkaXNwb3NlSGFuZGxlcnNbal07XHJcbiBcdFx0XHRcdGNiKGRhdGEpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdID0gZGF0YTtcclxuIFx0XHJcbiBcdFx0XHQvLyBkaXNhYmxlIG1vZHVsZSAodGhpcyBkaXNhYmxlcyByZXF1aXJlcyBmcm9tIHRoaXMgbW9kdWxlKVxyXG4gXHRcdFx0bW9kdWxlLmhvdC5hY3RpdmUgPSBmYWxzZTtcclxuIFx0XHJcbiBcdFx0XHQvLyByZW1vdmUgbW9kdWxlIGZyb20gY2FjaGVcclxuIFx0XHRcdGRlbGV0ZSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHJcbiBcdFx0XHQvLyB3aGVuIGRpc3Bvc2luZyB0aGVyZSBpcyBubyBuZWVkIHRvIGNhbGwgZGlzcG9zZSBoYW5kbGVyXHJcbiBcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXHJcbiBcdFx0XHRmb3IoaiA9IDA7IGogPCBtb2R1bGUuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0dmFyIGNoaWxkID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGUuY2hpbGRyZW5bal1dO1xyXG4gXHRcdFx0XHRpZighY2hpbGQpIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkge1xyXG4gXHRcdFx0XHRcdGNoaWxkLnBhcmVudHMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIHJlbW92ZSBvdXRkYXRlZCBkZXBlbmRlbmN5IGZyb20gbW9kdWxlIGNoaWxkcmVuXHJcbiBcdFx0dmFyIGRlcGVuZGVuY3k7XHJcbiBcdFx0dmFyIG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKG1vZHVsZSkge1xyXG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbal07XHJcbiBcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcclxuIFx0XHRcdFx0XHRcdGlmKGlkeCA+PSAwKSBtb2R1bGUuY2hpbGRyZW4uc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBOb3QgaW4gXCJhcHBseVwiIHBoYXNlXHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiYXBwbHlcIik7XHJcbiBcdFxyXG4gXHRcdGhvdEN1cnJlbnRIYXNoID0gaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdFx0Ly8gaW5zZXJ0IG5ldyBjb2RlXHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcHBsaWVkVXBkYXRlLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBhcHBsaWVkVXBkYXRlW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGNhbGwgYWNjZXB0IGhhbmRsZXJzXHJcbiBcdFx0dmFyIGVycm9yID0gbnVsbDtcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUpIHtcclxuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHR2YXIgY2FsbGJhY2tzID0gW107XHJcbiBcdFx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXTtcclxuIFx0XHRcdFx0XHRcdGNiID0gbW9kdWxlLmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV07XHJcbiBcdFx0XHRcdFx0XHRpZihjYikge1xyXG4gXHRcdFx0XHRcdFx0XHRpZihjYWxsYmFja3MuaW5kZXhPZihjYikgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0XHRcdGNhbGxiYWNrcy5wdXNoKGNiKTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0XHRjYiA9IGNhbGxiYWNrc1tpXTtcclxuIFx0XHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRcdGNiKG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzKTtcclxuIFx0XHRcdFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJhY2NlcHQtZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXSxcclxuIFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcclxuIFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIExvYWQgc2VsZiBhY2NlcHRlZCBtb2R1bGVzXHJcbiBcdFx0Zm9yKGkgPSAwOyBpIDwgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHR2YXIgaXRlbSA9IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlc1tpXTtcclxuIFx0XHRcdG1vZHVsZUlkID0gaXRlbS5tb2R1bGU7XHJcbiBcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XHJcbiBcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKTtcclxuIFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBpdGVtLmVycm9ySGFuZGxlciA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JIYW5kbGVyKGVycik7XHJcbiBcdFx0XHRcdFx0fSBjYXRjaChlcnIyKSB7XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvci1oYW5kbGVyLWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVycjIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3JnaW5hbEVycm9yOiBlcnJcclxuIFx0XHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjI7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGhhbmRsZSBlcnJvcnMgaW4gYWNjZXB0IGhhbmRsZXJzIGFuZCBzZWxmIGFjY2VwdGVkIG1vZHVsZSBsb2FkXHJcbiBcdFx0aWYoZXJyb3IpIHtcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcImZhaWxcIik7XHJcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xyXG4gXHRcdFx0cmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aG90OiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpLFxuIFx0XHRcdHBhcmVudHM6IChob3RDdXJyZW50UGFyZW50c1RlbXAgPSBob3RDdXJyZW50UGFyZW50cywgaG90Q3VycmVudFBhcmVudHMgPSBbXSwgaG90Q3VycmVudFBhcmVudHNUZW1wKSxcbiBcdFx0XHRjaGlsZHJlbjogW11cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkpO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBfX3dlYnBhY2tfaGFzaF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmggPSBmdW5jdGlvbigpIHsgcmV0dXJuIGhvdEN1cnJlbnRIYXNoOyB9O1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBob3RDcmVhdGVSZXF1aXJlKDIxKShfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNDQ3NTdlOGMzNDU3NWUxNzA5ODIiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXNlU291cmNlTWFwKSB7XG5cdHZhciBsaXN0ID0gW107XG5cblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHR2YXIgY29udGVudCA9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKTtcblx0XHRcdGlmKGl0ZW1bMl0pIHtcblx0XHRcdFx0cmV0dXJuIFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgY29udGVudCArIFwifVwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0fSkuam9pbihcIlwiKTtcblx0fTtcblxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuXHRcdH1cblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdHJldHVybiBsaXN0O1xufTtcblxuZnVuY3Rpb24gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApIHtcblx0dmFyIGNvbnRlbnQgPSBpdGVtWzFdIHx8ICcnO1xuXHR2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cdGlmICghY3NzTWFwcGluZykge1xuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG5cblx0aWYgKHVzZVNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHZhciBzb3VyY2VNYXBwaW5nID0gdG9Db21tZW50KGNzc01hcHBpbmcpO1xuXHRcdHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG5cdFx0XHRyZXR1cm4gJy8qIyBzb3VyY2VVUkw9JyArIGNzc01hcHBpbmcuc291cmNlUm9vdCArIHNvdXJjZSArICcgKi8nXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKCdcXG4nKTtcblx0fVxuXG5cdHJldHVybiBbY29udGVudF0uam9pbignXFxuJyk7XG59XG5cbi8vIEFkYXB0ZWQgZnJvbSBjb252ZXJ0LXNvdXJjZS1tYXAgKE1JVClcbmZ1bmN0aW9uIHRvQ29tbWVudChzb3VyY2VNYXApIHtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG5cdHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpO1xuXHR2YXIgZGF0YSA9ICdzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwnICsgYmFzZTY0O1xuXG5cdHJldHVybiAnLyojICcgKyBkYXRhICsgJyAqLyc7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9fY3NzLWxvYWRlckAwLjI4LjVAY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cblxudmFyIHN0eWxlc0luRG9tID0ge307XG5cbnZhclx0bWVtb2l6ZSA9IGZ1bmN0aW9uIChmbikge1xuXHR2YXIgbWVtbztcblxuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdGlmICh0eXBlb2YgbWVtbyA9PT0gXCJ1bmRlZmluZWRcIikgbWVtbyA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0cmV0dXJuIG1lbW87XG5cdH07XG59O1xuXG52YXIgaXNPbGRJRSA9IG1lbW9pemUoZnVuY3Rpb24gKCkge1xuXHQvLyBUZXN0IGZvciBJRSA8PSA5IGFzIHByb3Bvc2VkIGJ5IEJyb3dzZXJoYWNrc1xuXHQvLyBAc2VlIGh0dHA6Ly9icm93c2VyaGFja3MuY29tLyNoYWNrLWU3MWQ4NjkyZjY1MzM0MTczZmVlNzE1YzIyMmNiODA1XG5cdC8vIFRlc3RzIGZvciBleGlzdGVuY2Ugb2Ygc3RhbmRhcmQgZ2xvYmFscyBpcyB0byBhbGxvdyBzdHlsZS1sb2FkZXJcblx0Ly8gdG8gb3BlcmF0ZSBjb3JyZWN0bHkgaW50byBub24tc3RhbmRhcmQgZW52aXJvbm1lbnRzXG5cdC8vIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2stY29udHJpYi9zdHlsZS1sb2FkZXIvaXNzdWVzLzE3N1xuXHRyZXR1cm4gd2luZG93ICYmIGRvY3VtZW50ICYmIGRvY3VtZW50LmFsbCAmJiAhd2luZG93LmF0b2I7XG59KTtcblxudmFyIGdldEVsZW1lbnQgPSAoZnVuY3Rpb24gKGZuKSB7XG5cdHZhciBtZW1vID0ge307XG5cblx0cmV0dXJuIGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdFx0aWYgKHR5cGVvZiBtZW1vW3NlbGVjdG9yXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0bWVtb1tzZWxlY3Rvcl0gPSBmbi5jYWxsKHRoaXMsIHNlbGVjdG9yKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbWVtb1tzZWxlY3Rvcl1cblx0fTtcbn0pKGZ1bmN0aW9uICh0YXJnZXQpIHtcblx0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KVxufSk7XG5cbnZhciBzaW5nbGV0b24gPSBudWxsO1xudmFyXHRzaW5nbGV0b25Db3VudGVyID0gMDtcbnZhclx0c3R5bGVzSW5zZXJ0ZWRBdFRvcCA9IFtdO1xuXG52YXJcdGZpeFVybHMgPSByZXF1aXJlKFwiLi91cmxzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcblx0aWYgKHR5cGVvZiBERUJVRyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBERUJVRykge1xuXHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHlsZS1sb2FkZXIgY2Fubm90IGJlIHVzZWQgaW4gYSBub24tYnJvd3NlciBlbnZpcm9ubWVudFwiKTtcblx0fVxuXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdG9wdGlvbnMuYXR0cnMgPSB0eXBlb2Ygb3B0aW9ucy5hdHRycyA9PT0gXCJvYmplY3RcIiA/IG9wdGlvbnMuYXR0cnMgOiB7fTtcblxuXHQvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxuXHRpZiAoIW9wdGlvbnMuc2luZ2xldG9uKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSA8aGVhZD4gZWxlbWVudFxuXHRpZiAoIW9wdGlvbnMuaW5zZXJ0SW50bykgb3B0aW9ucy5pbnNlcnRJbnRvID0gXCJoZWFkXCI7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgYm90dG9tIG9mIHRoZSB0YXJnZXRcblx0aWYgKCFvcHRpb25zLmluc2VydEF0KSBvcHRpb25zLmluc2VydEF0ID0gXCJib3R0b21cIjtcblxuXHR2YXIgc3R5bGVzID0gbGlzdFRvU3R5bGVzKGxpc3QsIG9wdGlvbnMpO1xuXG5cdGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucyk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZSAobmV3TGlzdCkge1xuXHRcdHZhciBtYXlSZW1vdmUgPSBbXTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXG5cdFx0XHRkb21TdHlsZS5yZWZzLS07XG5cdFx0XHRtYXlSZW1vdmUucHVzaChkb21TdHlsZSk7XG5cdFx0fVxuXG5cdFx0aWYobmV3TGlzdCkge1xuXHRcdFx0dmFyIG5ld1N0eWxlcyA9IGxpc3RUb1N0eWxlcyhuZXdMaXN0LCBvcHRpb25zKTtcblx0XHRcdGFkZFN0eWxlc1RvRG9tKG5ld1N0eWxlcywgb3B0aW9ucyk7XG5cdFx0fVxuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtYXlSZW1vdmUubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBkb21TdHlsZSA9IG1heVJlbW92ZVtpXTtcblxuXHRcdFx0aWYoZG9tU3R5bGUucmVmcyA9PT0gMCkge1xuXHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSBkb21TdHlsZS5wYXJ0c1tqXSgpO1xuXG5cdFx0XHRcdGRlbGV0ZSBzdHlsZXNJbkRvbVtkb21TdHlsZS5pZF07XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcblxuZnVuY3Rpb24gYWRkU3R5bGVzVG9Eb20gKHN0eWxlcywgb3B0aW9ucykge1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXG5cdFx0aWYoZG9tU3R5bGUpIHtcblx0XHRcdGRvbVN0eWxlLnJlZnMrKztcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKGl0ZW0ucGFydHNbal0pO1xuXHRcdFx0fVxuXG5cdFx0XHRmb3IoOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHBhcnRzID0gW107XG5cblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdHBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXG5cdFx0XHRzdHlsZXNJbkRvbVtpdGVtLmlkXSA9IHtpZDogaXRlbS5pZCwgcmVmczogMSwgcGFydHM6IHBhcnRzfTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbGlzdFRvU3R5bGVzIChsaXN0LCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZXMgPSBbXTtcblx0dmFyIG5ld1N0eWxlcyA9IHt9O1xuXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gbGlzdFtpXTtcblx0XHR2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcblx0XHR2YXIgY3NzID0gaXRlbVsxXTtcblx0XHR2YXIgbWVkaWEgPSBpdGVtWzJdO1xuXHRcdHZhciBzb3VyY2VNYXAgPSBpdGVtWzNdO1xuXHRcdHZhciBwYXJ0ID0ge2NzczogY3NzLCBtZWRpYTogbWVkaWEsIHNvdXJjZU1hcDogc291cmNlTWFwfTtcblxuXHRcdGlmKCFuZXdTdHlsZXNbaWRdKSBzdHlsZXMucHVzaChuZXdTdHlsZXNbaWRdID0ge2lkOiBpZCwgcGFydHM6IFtwYXJ0XX0pO1xuXHRcdGVsc2UgbmV3U3R5bGVzW2lkXS5wYXJ0cy5wdXNoKHBhcnQpO1xuXHR9XG5cblx0cmV0dXJuIHN0eWxlcztcbn1cblxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50IChvcHRpb25zLCBzdHlsZSkge1xuXHR2YXIgdGFyZ2V0ID0gZ2V0RWxlbWVudChvcHRpb25zLmluc2VydEludG8pXG5cblx0aWYgKCF0YXJnZXQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydEludG8nIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcblx0fVxuXG5cdHZhciBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCA9IHN0eWxlc0luc2VydGVkQXRUb3Bbc3R5bGVzSW5zZXJ0ZWRBdFRvcC5sZW5ndGggLSAxXTtcblxuXHRpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ0b3BcIikge1xuXHRcdGlmICghbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3ApIHtcblx0XHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIHRhcmdldC5maXJzdENoaWxkKTtcblx0XHR9IGVsc2UgaWYgKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XG5cdFx0XHR0YXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG5cdFx0fVxuXHRcdHN0eWxlc0luc2VydGVkQXRUb3AucHVzaChzdHlsZSk7XG5cdH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJib3R0b21cIikge1xuXHRcdHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyICdpbnNlcnRBdCcuIE11c3QgYmUgJ3RvcCcgb3IgJ2JvdHRvbScuXCIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudCAoc3R5bGUpIHtcblx0aWYgKHN0eWxlLnBhcmVudE5vZGUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblx0c3R5bGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZSk7XG5cblx0dmFyIGlkeCA9IHN0eWxlc0luc2VydGVkQXRUb3AuaW5kZXhPZihzdHlsZSk7XG5cdGlmKGlkeCA+PSAwKSB7XG5cdFx0c3R5bGVzSW5zZXJ0ZWRBdFRvcC5zcGxpY2UoaWR4LCAxKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdHlsZUVsZW1lbnQgKG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuXG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblxuXHRhZGRBdHRycyhzdHlsZSwgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZSk7XG5cblx0cmV0dXJuIHN0eWxlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVMaW5rRWxlbWVudCAob3B0aW9ucykge1xuXHR2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xuXG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblx0b3B0aW9ucy5hdHRycy5yZWwgPSBcInN0eWxlc2hlZXRcIjtcblxuXHRhZGRBdHRycyhsaW5rLCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIGxpbmspO1xuXG5cdHJldHVybiBsaW5rO1xufVxuXG5mdW5jdGlvbiBhZGRBdHRycyAoZWwsIGF0dHJzKSB7XG5cdE9iamVjdC5rZXlzKGF0dHJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRlbC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGFkZFN0eWxlIChvYmosIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlLCB1cGRhdGUsIHJlbW92ZSwgcmVzdWx0O1xuXG5cdC8vIElmIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIHdhcyBkZWZpbmVkLCBydW4gaXQgb24gdGhlIGNzc1xuXHRpZiAob3B0aW9ucy50cmFuc2Zvcm0gJiYgb2JqLmNzcykge1xuXHQgICAgcmVzdWx0ID0gb3B0aW9ucy50cmFuc2Zvcm0ob2JqLmNzcyk7XG5cblx0ICAgIGlmIChyZXN1bHQpIHtcblx0ICAgIFx0Ly8gSWYgdHJhbnNmb3JtIHJldHVybnMgYSB2YWx1ZSwgdXNlIHRoYXQgaW5zdGVhZCBvZiB0aGUgb3JpZ2luYWwgY3NzLlxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBydW5uaW5nIHJ1bnRpbWUgdHJhbnNmb3JtYXRpb25zIG9uIHRoZSBjc3MuXG5cdCAgICBcdG9iai5jc3MgPSByZXN1bHQ7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgXHQvLyBJZiB0aGUgdHJhbnNmb3JtIGZ1bmN0aW9uIHJldHVybnMgYSBmYWxzeSB2YWx1ZSwgZG9uJ3QgYWRkIHRoaXMgY3NzLlxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBjb25kaXRpb25hbCBsb2FkaW5nIG9mIGNzc1xuXHQgICAgXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICBcdFx0Ly8gbm9vcFxuXHQgICAgXHR9O1xuXHQgICAgfVxuXHR9XG5cblx0aWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XG5cdFx0dmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKys7XG5cblx0XHRzdHlsZSA9IHNpbmdsZXRvbiB8fCAoc2luZ2xldG9uID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpKTtcblxuXHRcdHVwZGF0ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgZmFsc2UpO1xuXHRcdHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZSwgc3R5bGVJbmRleCwgdHJ1ZSk7XG5cblx0fSBlbHNlIGlmIChcblx0XHRvYmouc291cmNlTWFwICYmXG5cdFx0dHlwZW9mIFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5jcmVhdGVPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwucmV2b2tlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgQmxvYiA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIlxuXHQpIHtcblx0XHRzdHlsZSA9IGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IHVwZGF0ZUxpbmsuYmluZChudWxsLCBzdHlsZSwgb3B0aW9ucyk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlKTtcblxuXHRcdFx0aWYoc3R5bGUuaHJlZikgVVJMLnJldm9rZU9iamVjdFVSTChzdHlsZS5ocmVmKTtcblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdHN0eWxlID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZSk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlKTtcblx0XHR9O1xuXHR9XG5cblx0dXBkYXRlKG9iaik7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlIChuZXdPYmopIHtcblx0XHRpZiAobmV3T2JqKSB7XG5cdFx0XHRpZiAoXG5cdFx0XHRcdG5ld09iai5jc3MgPT09IG9iai5jc3MgJiZcblx0XHRcdFx0bmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiZcblx0XHRcdFx0bmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcFxuXHRcdFx0KSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dXBkYXRlKG9iaiA9IG5ld09iaik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbW92ZSgpO1xuXHRcdH1cblx0fTtcbn1cblxudmFyIHJlcGxhY2VUZXh0ID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIHRleHRTdG9yZSA9IFtdO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XG5cdFx0dGV4dFN0b3JlW2luZGV4XSA9IHJlcGxhY2VtZW50O1xuXG5cdFx0cmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XG5cdH07XG59KSgpO1xuXG5mdW5jdGlvbiBhcHBseVRvU2luZ2xldG9uVGFnIChzdHlsZSwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XG5cdHZhciBjc3MgPSByZW1vdmUgPyBcIlwiIDogb2JqLmNzcztcblxuXHRpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJlcGxhY2VUZXh0KGluZGV4LCBjc3MpO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBjc3NOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcblx0XHR2YXIgY2hpbGROb2RlcyA9IHN0eWxlLmNoaWxkTm9kZXM7XG5cblx0XHRpZiAoY2hpbGROb2Rlc1tpbmRleF0pIHN0eWxlLnJlbW92ZUNoaWxkKGNoaWxkTm9kZXNbaW5kZXhdKTtcblxuXHRcdGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xuXHRcdFx0c3R5bGUuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3R5bGUuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGFwcGx5VG9UYWcgKHN0eWxlLCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBtZWRpYSA9IG9iai5tZWRpYTtcblxuXHRpZihtZWRpYSkge1xuXHRcdHN0eWxlLnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKVxuXHR9XG5cblx0aWYoc3R5bGUuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcblx0fSBlbHNlIHtcblx0XHR3aGlsZShzdHlsZS5maXJzdENoaWxkKSB7XG5cdFx0XHRzdHlsZS5yZW1vdmVDaGlsZChzdHlsZS5maXJzdENoaWxkKTtcblx0XHR9XG5cblx0XHRzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVMaW5rIChsaW5rLCBvcHRpb25zLCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG5cdC8qXG5cdFx0SWYgY29udmVydFRvQWJzb2x1dGVVcmxzIGlzbid0IGRlZmluZWQsIGJ1dCBzb3VyY2VtYXBzIGFyZSBlbmFibGVkXG5cdFx0YW5kIHRoZXJlIGlzIG5vIHB1YmxpY1BhdGggZGVmaW5lZCB0aGVuIGxldHMgdHVybiBjb252ZXJ0VG9BYnNvbHV0ZVVybHNcblx0XHRvbiBieSBkZWZhdWx0LiAgT3RoZXJ3aXNlIGRlZmF1bHQgdG8gdGhlIGNvbnZlcnRUb0Fic29sdXRlVXJscyBvcHRpb25cblx0XHRkaXJlY3RseVxuXHQqL1xuXHR2YXIgYXV0b0ZpeFVybHMgPSBvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyA9PT0gdW5kZWZpbmVkICYmIHNvdXJjZU1hcDtcblxuXHRpZiAob3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgfHwgYXV0b0ZpeFVybHMpIHtcblx0XHRjc3MgPSBmaXhVcmxzKGNzcyk7XG5cdH1cblxuXHRpZiAoc291cmNlTWFwKSB7XG5cdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjY2MDM4NzVcblx0XHRjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSArIFwiICovXCI7XG5cdH1cblxuXHR2YXIgYmxvYiA9IG5ldyBCbG9iKFtjc3NdLCB7IHR5cGU6IFwidGV4dC9jc3NcIiB9KTtcblxuXHR2YXIgb2xkU3JjID0gbGluay5ocmVmO1xuXG5cdGxpbmsuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cblx0aWYob2xkU3JjKSBVUkwucmV2b2tlT2JqZWN0VVJMKG9sZFNyYyk7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9fc3R5bGUtbG9hZGVyQDAuMTguMkBzdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IDYiLCJcbi8qKlxuICogV2hlbiBzb3VyY2UgbWFwcyBhcmUgZW5hYmxlZCwgYHN0eWxlLWxvYWRlcmAgdXNlcyBhIGxpbmsgZWxlbWVudCB3aXRoIGEgZGF0YS11cmkgdG9cbiAqIGVtYmVkIHRoZSBjc3Mgb24gdGhlIHBhZ2UuIFRoaXMgYnJlYWtzIGFsbCByZWxhdGl2ZSB1cmxzIGJlY2F1c2Ugbm93IHRoZXkgYXJlIHJlbGF0aXZlIHRvIGFcbiAqIGJ1bmRsZSBpbnN0ZWFkIG9mIHRoZSBjdXJyZW50IHBhZ2UuXG4gKlxuICogT25lIHNvbHV0aW9uIGlzIHRvIG9ubHkgdXNlIGZ1bGwgdXJscywgYnV0IHRoYXQgbWF5IGJlIGltcG9zc2libGUuXG4gKlxuICogSW5zdGVhZCwgdGhpcyBmdW5jdGlvbiBcImZpeGVzXCIgdGhlIHJlbGF0aXZlIHVybHMgdG8gYmUgYWJzb2x1dGUgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHBhZ2UgbG9jYXRpb24uXG4gKlxuICogQSBydWRpbWVudGFyeSB0ZXN0IHN1aXRlIGlzIGxvY2F0ZWQgYXQgYHRlc3QvZml4VXJscy5qc2AgYW5kIGNhbiBiZSBydW4gdmlhIHRoZSBgbnBtIHRlc3RgIGNvbW1hbmQuXG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzcykge1xuICAvLyBnZXQgY3VycmVudCBsb2NhdGlvblxuICB2YXIgbG9jYXRpb24gPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdy5sb2NhdGlvbjtcblxuICBpZiAoIWxvY2F0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZml4VXJscyByZXF1aXJlcyB3aW5kb3cubG9jYXRpb25cIik7XG4gIH1cblxuXHQvLyBibGFuayBvciBudWxsP1xuXHRpZiAoIWNzcyB8fCB0eXBlb2YgY3NzICE9PSBcInN0cmluZ1wiKSB7XG5cdCAgcmV0dXJuIGNzcztcbiAgfVxuXG4gIHZhciBiYXNlVXJsID0gbG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyBsb2NhdGlvbi5ob3N0O1xuICB2YXIgY3VycmVudERpciA9IGJhc2VVcmwgKyBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC9bXlxcL10qJC8sIFwiL1wiKTtcblxuXHQvLyBjb252ZXJ0IGVhY2ggdXJsKC4uLilcblx0Lypcblx0VGhpcyByZWd1bGFyIGV4cHJlc3Npb24gaXMganVzdCBhIHdheSB0byByZWN1cnNpdmVseSBtYXRjaCBicmFja2V0cyB3aXRoaW5cblx0YSBzdHJpbmcuXG5cblx0IC91cmxcXHMqXFwoICA9IE1hdGNoIG9uIHRoZSB3b3JkIFwidXJsXCIgd2l0aCBhbnkgd2hpdGVzcGFjZSBhZnRlciBpdCBhbmQgdGhlbiBhIHBhcmVuc1xuXHQgICAoICA9IFN0YXJ0IGEgY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgKD86ICA9IFN0YXJ0IGEgbm9uLWNhcHR1cmluZyBncm91cFxuXHQgICAgICAgICBbXikoXSAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKD86ICA9IFN0YXJ0IGFub3RoZXIgbm9uLWNhcHR1cmluZyBncm91cHNcblx0ICAgICAgICAgICAgICAgICBbXikoXSsgID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgICAgIFteKShdKiAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICBcXCkgID0gTWF0Y2ggYSBlbmQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICkgID0gRW5kIEdyb3VwXG4gICAgICAgICAgICAgICpcXCkgPSBNYXRjaCBhbnl0aGluZyBhbmQgdGhlbiBhIGNsb3NlIHBhcmVuc1xuICAgICAgICAgICkgID0gQ2xvc2Ugbm9uLWNhcHR1cmluZyBncm91cFxuICAgICAgICAgICogID0gTWF0Y2ggYW55dGhpbmdcbiAgICAgICApICA9IENsb3NlIGNhcHR1cmluZyBncm91cFxuXHQgXFwpICA9IE1hdGNoIGEgY2xvc2UgcGFyZW5zXG5cblx0IC9naSAgPSBHZXQgYWxsIG1hdGNoZXMsIG5vdCB0aGUgZmlyc3QuICBCZSBjYXNlIGluc2Vuc2l0aXZlLlxuXHQgKi9cblx0dmFyIGZpeGVkQ3NzID0gY3NzLnJlcGxhY2UoL3VybFxccypcXCgoKD86W14pKF18XFwoKD86W14pKF0rfFxcKFteKShdKlxcKSkqXFwpKSopXFwpL2dpLCBmdW5jdGlvbihmdWxsTWF0Y2gsIG9yaWdVcmwpIHtcblx0XHQvLyBzdHJpcCBxdW90ZXMgKGlmIHRoZXkgZXhpc3QpXG5cdFx0dmFyIHVucXVvdGVkT3JpZ1VybCA9IG9yaWdVcmxcblx0XHRcdC50cmltKClcblx0XHRcdC5yZXBsYWNlKC9eXCIoLiopXCIkLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pXG5cdFx0XHQucmVwbGFjZSgvXicoLiopJyQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSk7XG5cblx0XHQvLyBhbHJlYWR5IGEgZnVsbCB1cmw/IG5vIGNoYW5nZVxuXHRcdGlmICgvXigjfGRhdGE6fGh0dHA6XFwvXFwvfGh0dHBzOlxcL1xcL3xmaWxlOlxcL1xcL1xcLykvaS50ZXN0KHVucXVvdGVkT3JpZ1VybCkpIHtcblx0XHQgIHJldHVybiBmdWxsTWF0Y2g7XG5cdFx0fVxuXG5cdFx0Ly8gY29udmVydCB0aGUgdXJsIHRvIGEgZnVsbCB1cmxcblx0XHR2YXIgbmV3VXJsO1xuXG5cdFx0aWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiLy9cIikgPT09IDApIHtcblx0XHQgIFx0Ly9UT0RPOiBzaG91bGQgd2UgYWRkIHByb3RvY29sP1xuXHRcdFx0bmV3VXJsID0gdW5xdW90ZWRPcmlnVXJsO1xuXHRcdH0gZWxzZSBpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvXCIpID09PSAwKSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgYmFzZSB1cmxcblx0XHRcdG5ld1VybCA9IGJhc2VVcmwgKyB1bnF1b3RlZE9yaWdVcmw7IC8vIGFscmVhZHkgc3RhcnRzIHdpdGggJy8nXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIGN1cnJlbnQgZGlyZWN0b3J5XG5cdFx0XHRuZXdVcmwgPSBjdXJyZW50RGlyICsgdW5xdW90ZWRPcmlnVXJsLnJlcGxhY2UoL15cXC5cXC8vLCBcIlwiKTsgLy8gU3RyaXAgbGVhZGluZyAnLi8nXG5cdFx0fVxuXG5cdFx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCB1cmwoLi4uKVxuXHRcdHJldHVybiBcInVybChcIiArIEpTT04uc3RyaW5naWZ5KG5ld1VybCkgKyBcIilcIjtcblx0fSk7XG5cblx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCBjc3Ncblx0cmV0dXJuIGZpeGVkQ3NzO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL19zdHlsZS1sb2FkZXJAMC4xOC4yQHN0eWxlLWxvYWRlci9saWIvdXJscy5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IDYiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL19jc3MtbG9hZGVyQDAuMjguNUBjc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiYm9keXtcXHJcXG4gIG1pbi13aWR0aDogODAwcHg7XFxyXFxuICBmb250LWZhbWlseTogXFxcIlxcXFw1RkFFXFxcXDhGNkZcXFxcOTZDNVxcXFw5RUQxXFxcIjtcXHJcXG4gIGJhY2tncm91bmQ6IHVybChcIiArIHJlcXVpcmUoXCIuLi9pbWcvbG9hZC1iZy5wbmdcIikgKyBcIikgbm8tcmVwZWF0O1xcclxcbiAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcXHJcXG4gIGJhY2tncm91bmQtb3JpZ2luOiBwYWRkaW5nLWJveDtcXHJcXG59XFxyXFxuXFxyXFxuaW5wdXQ6Oi13ZWJraXQtaW5wdXQtcGxhY2Vob2xkZXJ7XFxyXFxuICBjb2xvcjogI2ZmZmZmZjtcXHJcXG59XFxyXFxuaW5wdXQ6LW1vei1wbGFjZWhvbGRlcntcXHJcXG4gIGNvbG9yOiAjZmZmZmZmO1xcclxcbn1cXHJcXG5pbnB1dDo6LW1vei1wbGFjZWhvbGRlcntcXHJcXG4gIGNvbG9yOiAjZmZmZmZmO1xcclxcbn1cXHJcXG5pbnB1dDotbXMtaW5wdXQtcGxhY2Vob2xkZXJ7XFxyXFxuICBjb2xvcjogI2ZmZmZmZjtcXHJcXG59XFxyXFxuXFxyXFxuLmNvbnRlbnQ+ZGl2Om50aC1jaGlsZCgyKXtcXHJcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXHJcXG4gIHRvcDowO1xcclxcbiAgbGVmdDogMDtcXHJcXG4gIHdpZHRoOiAxMDAlO1xcclxcbn1cXHJcXG5cXHJcXG4uaHQtbG9hZHtcXHJcXG4gIG1hcmdpbjogMCBhdXRvO1xcclxcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXHJcXG4gIHBhZGRpbmc6IDE1cHggNTBweCA2MHB4IDUwcHg7XFxyXFxuICBtaW4td2lkdGg6IDUwMHB4O1xcclxcbiAgbWF4LXdpZHRoOiA2MDBweDtcXHJcXG4gIG1pbi1oZWlnaHQ6IDU5MHB4O1xcclxcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcclxcbiAgZm9udC1zaXplOiAxNHB4O1xcclxcbiAgY29sb3I6ICNmZmZmZmY7XFxyXFxufVxcclxcblxcclxcbi5odC1sb2FkPmhlYWRlcj5oMXtcXHJcXG4gIGZvbnQtc2l6ZTogNDhweDtcXHJcXG59XFxyXFxuXFxyXFxuLmh0LWxvYWQ+aGVhZGVyPnB7XFxyXFxuICBtYXJnaW46IDIwcHggMDtcXHJcXG4gIGZvbnQtc2l6ZTogMjBweDtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLmh0LWNvbj5kaXZ7XFxyXFxuICB3aWR0aDogMTAwJTtcXHJcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxyXFxufVxcclxcblxcclxcbi5odC1jb24+ZGl2e1xcclxcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG4uaHQtY29uPmRpdjpmaXJzdC1jaGlsZHtcXHJcXG4gIHdpZHRoOiA1MCU7XFxyXFxuICB2ZXJ0aWNhbC1hbGlnbjogYm90dG9tO1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG4uaHQtY29uPmRpdjpudGgtY2hpbGQoMil7XFxyXFxuICB3aWR0aDogNTAlO1xcclxcbiAgdmVydGljYWwtYWxpZ246IGJvdHRvbTtcXHJcXG59XFxyXFxuXFxyXFxuLmh0LWlucHV0e1xcclxcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcclxcbn1cXHJcXG5cXHJcXG4uaHQtbG9hZCAuaHQtaW5wdXR7XFxyXFxuICBtYXJnaW46IDQwcHggYXV0byAwIGF1dG87XFxyXFxufVxcclxcblxcclxcbi5odC1sb2FkIC5odC1pbnB1dD5pbnB1dCxcXHJcXG4uaHQtbG9hZCAuaHQtaW5wdXQtcz5pbnB1dHtcXHJcXG4gIHBhZGRpbmctYm90dG9tOiAxMHB4O1xcclxcbiAgYm94LXNoYWRvdzogbm9uZTtcXHJcXG4gIGJvcmRlci1zdHlsZTogbm9uZTtcXHJcXG4gIGJvcmRlci1yYWRpdXM6IGluaGVyaXQ7XFxyXFxuICBib3JkZXItYm90dG9tOiAycHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpO1xcclxcbiAgaGVpZ2h0OiAyMHB4O1xcclxcbiAgZm9udC1zaXplOiAxNnB4O1xcclxcbiAgY29sb3I6ICNlZGVkZWQ7XFxyXFxuICBiYWNrZ3JvdW5kOiBub25lO1xcclxcbn1cXHJcXG5cXHJcXG4uaHQtbG9hZCAuaHQtaW5wdXQ+aW5wdXQ6Zm9jdXN7XFxyXFxuICBvdXRsaW5lOiBub25lO1xcclxcbn1cXHJcXG5cXHJcXG4uaHQtbG9hZCBhe1xcclxcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcclxcbiAgY29sb3I6ICMwMDAwMDA7XFxyXFxufVxcclxcblxcclxcbi5odC1sb2FkIC5jb250cm9sc3tcXHJcXG4gIG1hcmdpbi1sZWZ0OiAwcHg7XFxyXFxufVxcclxcblxcclxcbi5odC1sb2FkIC5jb250cm9sLWxhYmVse1xcclxcbiAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xcclxcbiAgd2lkdGg6IDcwcHg7XFxyXFxufVxcclxcblxcclxcbi5pbnB1dFN1cmV7XFxyXFxuICBtYXJnaW4tbGVmdDogNDBweDtcXHJcXG4gIG1hcmdpbi1ib3R0b206IDA7XFxyXFxuICB0ZXh0LWFsaWduOiBsZWZ0O1xcclxcbn1cXHJcXG5cXHJcXG4uaW5wdXRTdXJlPmlucHV0e1xcclxcbiAgYm9yZGVyOiAycHggc29saWQgI2ZmZmZmZjtcXHJcXG59XFxyXFxuXFxyXFxuLndhcm5pbmd7XFxyXFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICByaWdodDogMDtcXHJcXG4gIHRvcDogNXB4O1xcclxcbiAgY29sb3I6IHJnYmEoMjU1LCAwLCAwLCAwLjUpO1xcclxcbn1cXHJcXG5cXHJcXG4uaHQtc3VyZXRleHR7XFxyXFxuICBwYWRkaW5nLWxlZnQ6IDE4cHg7XFxyXFxuICBtYXJnaW46IDMwcHggYXV0bztcXHJcXG4gIHdpZHRoOiAxMDAlO1xcclxcbiAgaGVpZ2h0OiA1MHB4O1xcclxcbn1cXHJcXG5cXHJcXG4uaHQtc3VyZXRleHQ+ZGl2e1xcclxcbiAgZmxvYXQ6IGxlZnQ7XFxyXFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbiAgd2lkdGg6IDQzJTtcXHJcXG4gIGhlaWdodDogNTBweDtcXHJcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxyXFxuICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xcclxcbn1cXHJcXG5cXHJcXG4uaHQtc3VyZXRleHQ+ZGl2OmZpcnN0LWNoaWxke1xcclxcbiAgcGFkZGluZy10b3A6IDE0cHg7XFxyXFxuICBtYXJnaW4tcmlnaHQ6IDIlO1xcclxcbn1cXHJcXG5cXHJcXG4uaHQtc3VyZXRleHQ+ZGl2PmlucHV0e1xcclxcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xcclxcbiAgd2lkdGg6IDEwMCU7XFxyXFxufVxcclxcblxcclxcbi5odC1zdXJldGV4dD5kaXY6bGFzdC1jaGlsZHtcXHJcXG4gIGN1cnNvcjogcG9pbnRlcjtcXHJcXG59XFxyXFxuXFxyXFxuLmh0LXN1cmV0ZXh0PmRpdjpsYXN0LWNoaWxkIGltZ3tcXHJcXG4gIGZsb2F0OiBsZWZ0O1xcclxcbiAgbWFyZ2luLWxlZnQ6IDM1cHg7XFxyXFxuICBoZWlnaHQ6IDUwcHg7XFxyXFxuICB3aWR0aDogNjAlO1xcclxcbn1cXHJcXG5cXHJcXG4uaHQtc2lnbntcXHJcXG4gIHBhZGRpbmctbGVmdDogMjBweDtcXHJcXG4gIG1hcmdpbjogNTBweCBhdXRvIDAgYXV0bztcXHJcXG4gIHdpZHRoOiAxMDAlO1xcclxcbn1cXHJcXG5cXHJcXG4uaHQtc2lnbj5kaXZ7XFxyXFxuICBmbG9hdDogbGVmdDtcXHJcXG59XFxyXFxuXFxyXFxuLmh0LXNpZ24gYnV0dG9uIHtcXHJcXG4gIGJvcmRlcjogMnB4IHNvbGlkICNjOWM5Yzk7XFxyXFxuICBib3JkZXItcmFkaXVzOiAzMHB4O1xcclxcbiAgd2lkdGg6IDE1MHB4O1xcclxcbiAgaGVpZ2h0OiAzNnB4O1xcclxcbiAgZm9udC1zaXplOiAxOHB4O1xcclxcbiAgY29sb3I6ICNmZmZmZmY7XFxyXFxuICBiYWNrZ3JvdW5kOiBub25lO1xcclxcbn1cXHJcXG5cXHJcXG4uaHQtc2lnbiAuaHQtYm50e1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogI2M5YzljOTtcXHJcXG59XFxyXFxuXFxyXFxuLmh0LXNpZ24gLmh0LWJudDpob3ZlcntcXHJcXG4gIGJhY2tncm91bmQ6IG5vbmU7XFxyXFxufVxcclxcblxcclxcbi5odC1zaWduIGF7XFxyXFxuICBjb2xvcjogI2M5YzljOTtcXHJcXG59XFxyXFxuXFxyXFxuLmh0LXNpZ24+ZGl2OmZpcnN0LWNoaWxke1xcclxcbiAgbWFyZ2luLXJpZ2h0OiA4NnB4O1xcclxcbn1cXHJcXG5cXHJcXG4uaHQtc2lnbj5we1xcclxcbiAgY2xlYXI6IGxlZnQ7XFxyXFxuICBtYXJnaW46IDAgYXV0bztcXHJcXG4gIHBhZGRpbmctdG9wOiAyMHB4O1xcclxcbiAgd2lkdGg6IDU1JTtcXHJcXG4gIGZvbnQtc2l6ZTogMTJweDtcXHJcXG4gIHRleHQtYWxpZ246IHJpZ2h0O1xcclxcbiAgY3Vyc29yOiBwb2ludGVyO1xcclxcbn1cXHJcXG5cXHJcXG4uaHQtc2lnbj5wPmF7XFxyXFxuICBjb2xvcjogcmdiYSgwLCAwLCAyNTUsIDAuNik7XFxyXFxufVxcclxcblxcclxcbi5odC1zaWduPnA6aG92ZXJ7XFxyXFxuICBmb250LXdlaWdodDogYm9sZDtcXHJcXG59XFxyXFxuXFxyXFxuLmh0LXRpbWV7XFxyXFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICB0b3A6IDA7XFxyXFxuICB3aWR0aDogMTAwJTtcXHJcXG4gIGhlaWdodDogMTAwJTtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwwLDAsMC43KTtcXHJcXG59XFxyXFxuXFxyXFxuLmh0LXRpbWU+ZGl2e1xcclxcbiAgbWFyZ2luOiAyMCUgYXV0bztcXHJcXG4gIHBhZGRpbmc6IDMwcHggNDBweDtcXHJcXG4gIHdpZHRoOiAxMDBweDtcXHJcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXHJcXG4gIGZvbnQtc2l6ZTogMTRweDtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6ICNjY2NjY2M7XFxyXFxufVwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL19jc3MtbG9hZGVyQDAuMjguNUBjc3MtbG9hZGVyIS4vYWxsL2Nzcy9sb2FkLmNzc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgZztcclxuXHJcbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXHJcbmcgPSAoZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn0pKCk7XHJcblxyXG50cnkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxyXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSxldmFsKShcInRoaXNcIik7XHJcbn0gY2F0Y2goZSkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXHJcblx0aWYodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIilcclxuXHRcdGcgPSB3aW5kb3c7XHJcbn1cclxuXHJcbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cclxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3NcclxuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IDE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IGdxeSBvbiAyMDE3LzgvMjUuXHJcbiAqL1xyXG5yZXF1aXJlKCcuLi9jc3MvbG9hZC5jc3MnKTsvL+W8leWFpWNzc+S7o+eggVxyXG5jb25zdCBsb2RlYm9keSA9IHJlcXVpcmUoJy4uL3ZpZXcvbG9hZC1ib2R5Lmh0bWwnKTsvL+W8leWFpeeVjOmdolxyXG4kKFwiYm9keVwiKS5wcmVwZW5kKCQobG9kZWJvZHkpKTtcclxuLy/kuIvpnaLmmK/liqjmgIHog4zmma/lvJXlhaXnmoRqc+S7o+eggeWMhVxyXG5yZXF1aXJlKCcuLi9qcy9FYXNlUGFjay5taW4uanMnKTtcclxucmVxdWlyZSgnLi4vanMvckFGLmpzJyk7XHJcbnJlcXVpcmUoJy4uL2pzL1R3ZWVuTGl0ZS5taW4uanMnKTtcclxucmVxdWlyZSgnLi4vanMvZGVtby0xLmpzJyk7XHJcblxyXG47KGZ1bmN0aW9uICgkKSB7XHJcbiAgdmFyIGxvYWQgPSB7Ly/kuLvlr7nosaFcclxuICAgIC8v55WM6Z2i6auY5bqm5L+u5pS55Ye95pWwXHJcbiAgICBzZXRIZWlnaHQ6ZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgbG9hZEhlaWdodCA9ICQoXCIuaHQtbG9hZC10by1sb2FkXCIpO1xyXG4gICAgICB2YXIgY2FudmFzID0gJChcIiNkZW1vLWNhbnZhc1wiKTtcclxuICAgICAgdmFyIGhlaWdodCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7XHJcbiAgICAgIGhlaWdodCArPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcclxuICAgICAgbG9hZEhlaWdodC5jc3MoXCJoZWlnaHRcIixoZWlnaHQpO1xyXG4gICAgICBjYW52YXMuY3NzKFwiaGVpZ2h0XCIsaGVpZ2h0KTtcclxuICAgIH0sXHJcbi8v5L+d5a2Y55So5oi35ZCNXHJcbiAgICBzYXZlVXNlcjpmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidXNlck5hbWVcIiwkKFwiI2lucHV0RW1haWxcIikudmFsKCkpO1xyXG4gICAgfSxcclxuLy/orr7nva7pqozor4HnoIHpk77mjqXvvIzkv67mlLnml7bpl7TmiLPvvIzpgb/lhY3mtY/op4jlmajnvJPlrZhcclxuICAgIGNoYW5nVXJsOmZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICB2YXIgc3JjID0gXCJsb2dpbi9nZXRDYXB0Y2hhSW1hZ2U/dGltZXN0YW1wPVwiICsgdGltZXN0YW1wO1xyXG4gICAgICByZXR1cm4gc3JjO1xyXG4gICAgfSxcclxuLy/pqozor4HnoIHpk77mjqXorr7nva5cclxuICAgIGNoYW5nSW1nOmZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyICRpbWcgPSAkKFwiI2h0LXN1cmV0eHRcIik7XHJcbiAgICAgICRpbWcuYXR0cihcInNyY1wiLHRoaXMuY2hhbmdVcmwoKSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGRhdGFTZXJpYWxpemU6ZnVuY3Rpb24gKCkgey8v6KGo5Y2V5bqP5YiX5YyWXHJcbiAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgIHVzZXJOYW1lOiQoXCIjaW5wdXRFbWFpbFwiKS52YWwoKSxcclxuICAgICAgICBwYXNzV29yZDokKFwiI2lucHV0UGFzc3dvcmRcIikudmFsKCksXHJcbiAgICAgICAgcmVtZW1iZXJNZTokKFwiI2lucHV0U3VyZVwiKS5pcyhcIjpjaGVja2VkXCIpXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICB9LFxyXG4vL+WkseeEpuS6i+S7tue7keWumu+8jOS7peWPiui+k+WFpeagvOW8j+mqjOivgVxyXG4gICAgb25CbHVyOmZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICAkKFwiYm9keVwiKS5vbignYmx1cicsJ2lucHV0JyxmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgIHZhciByZWcgPSAvXltBLVphLXpkXSsoWy1fLl1bQS1aYS16ZF0rKSpAKFtBLVphLXpkXStbLS5dKStbQS1aYS16ZF17Miw1fSQvO1xyXG4gICAgICAgIHZhciAkcGFyZW50ID0gJCh0YXJnZXQpLnBhcmVudCgpO1xyXG5cclxuICAgICAgICBpZih0YXJnZXQuaWQgPT09ICdpbnB1dEVtYWlsJyl7XHJcbiAgICAgICAgICBpZigkcGFyZW50LmhhcygnLndhcm5pbmcnKSl7XHJcbiAgICAgICAgICAgICRwYXJlbnQuZmluZCgnLndhcm5pbmcnKS5yZW1vdmUoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmKCQoXCIjaW5wdXRFbWFpbFwiKS52YWwoKSA9PSBcIlwiKXtcclxuICAgICAgICAgICAgJHBhcmVudC5hcHBlbmQoXCI8c3Ryb25nIGNsYXNzPSd3YXJuaW5nIG9uRXJyb3InPueUqOaIt+WQjeS4jeiDveS4uuepujwvc3Ryb25nPlwiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZih0YXJnZXQuaWQgPT09ICdpbnB1dFBhc3N3b3JkJyl7XHJcbiAgICAgICAgICBpZigkcGFyZW50LmhhcygnLndhcm5pbmcnKSl7XHJcbiAgICAgICAgICAgICRwYXJlbnQuZmluZCgnLndhcm5pbmcnKS5yZW1vdmUoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmKCQoXCIjaW5wdXRQYXNzd29yZFwiKS52YWwoKSA9PSBcIlwiIHx8ICQoXCIjaW5wdXRQYXNzd29yZFwiKS52YWwoKS5sZW5ndGggPCA2IHx8ICQoXCIjaW5wdXRQYXNzd29yZFwiKS52YWwoKS5sZW5ndGggPiA4KXtcclxuICAgICAgICAgICAgJHBhcmVudC5hcHBlbmQoXCI8c3Ryb25nIGNsYXNzPSd3YXJuaW5nIG9uRXJyb3InPui+k+WFpTYtOOS9jeWvhueggTwvc3Ryb25nPlwiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4vL+eCueWHu+S6i+S7tue7keWumlxyXG4gICAgb25DbGljazpmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgICAgdmFyIHJlZyA9IC9eW0EtWmEtemRdKyhbLV8uXVtBLVphLXpkXSspKkAoW0EtWmEtemRdK1stLl0pK1tBLVphLXpkXXsyLDV9JC87XHJcbiAgICAgIC8v6aqM6K+B56CB5pS55Y+Y6Ze06ZqU77yM5Lul5Y+K55m75b2V5oyJ6ZKu5r+A5rS754m55b6B5Y+Y6YePXHJcbiAgICAgIHZhciBzdSA9IHRydWUsc3VyID0gdHJ1ZTtcclxuICAgICAgJChcImJvZHlcIikub24oJ2NsaWNrJywnYnV0dG9uLGlucHV0LGltZycsZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcclxuICAgICAgICAvL+mqjOivgeeggeaUueWPmFxyXG4gICAgICAgIGlmKHRhcmdldC5pZCA9PSBcImh0LXN1cmV0eHRcIil7XHJcbiAgICAgICAgICBpZihzdXIpe1xyXG4gICAgICAgICAgICB0aGF0LmNoYW5nSW1nKCk7XHJcbiAgICAgICAgICAgIHN1ciA9IGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHN1ciA9IHRydWU7XHJcbiAgICAgICAgICB9LDEwMDApO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZih0YXJnZXQuaWQgPT0gXCJzaWduaW5cIil7XHJcbiAgICAgICAgICAkKFwiZm9ybSBpbnB1dFwiKS50cmlnZ2VyKCdibHVyJyk7XHJcbiAgICAgICAgICB2YXIgbGVuID0gJChcImZvcm1cIikuZmluZChcIi5vbkVycm9yXCIpLmxlbmd0aDtcclxuICAgICAgICAgIGlmKCFsZW4pe1xyXG4gICAgICAgICAgICBpZigkKFwiI2lucHV0WWFuemhlbmdcIikudmFsKCkubGVuZ3RoIDw9IDApe1xyXG4gICAgICAgICAgICAgIGFsZXJ0KFwi6aqM6K+B56CB5LiN6IO95Li656m6XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgIGlmKHN1KXsvL+eZu+W9leivt+axguWPkei1t1xyXG4gICAgICAgICAgICAgICAgc3UgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgIHVybDpcImxvZ2luL1VQXCIsXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6J1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhVHlwZTonanNvbicsXHJcbiAgICAgICAgICAgICAgICAgIGFzeW5jOnRydWUsXHJcbiAgICAgICAgICAgICAgICAgIGRhdGE6dGhhdC5kYXRhU2VyaWFsaXplKCksXHJcbiAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6ZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihkYXRhLmNvZGUgPT0gMTAwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDpcImxvZ2luL2NoZWNrQ2FwdGNoYVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOidQT1NUJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6J2pzb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3luYzp0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiQoXCIjaW5wdXRZYW56aGVuZ1wiKS52YWwoKS50b0xvY2FsZUxvd2VyQ2FzZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6ZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBpZihkYXRhLmNvZGUgPT0gMTAwKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuc2F2ZVVzZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VyTmFtZScsJChcIiNpbnB1dEVtYWlsXCIpLnZhbCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCQoXCIjaW5wdXRFbWFpbFwiKS52YWwoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIueZu+mZhuaIkOWKn1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoXCIjaW5wdXRFbWFpbFwiKS52YWwoXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKFwiI2lucHV0UGFzc3dvcmRcIikudmFsKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcImluZGV4Lmh0bWxcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIumqjOivgeeggemUmeivr1wiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvL+WvueS4vuaKpeeUqOaIt+eahOaDqee9mlxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoZGF0YS5jb2RlID09IDIwMCAmJiBkYXRhLmV4dGVuZC5lcnJvciA9PSBcIueUqOaIt+iiq+aDqee9mu+8jOi0puaIt+mUgeWumjIw5YiG6ZKf77yMXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLmFwcGVuZCgnPGRpdiBjbGFzcz1cImh0LXRpbWVcIj48ZGl2IGlkPVwiaHQtdGltZVwiPjIwOjAwPC9kaXY+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIueUseS6jui0puaIt+iiq+WkmuasoeS4vuaKpe+8jDIw5YiG6ZKf5YaF5LiN6IO95LiK57q/XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgdmFyIG1pbiA9IDE5LHRpbSA9IDYwLGNsZWFyVDtcclxuICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltLS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRpbSA9PSAtMSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbWluLS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGltID0gNjA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgJChcIiNodC10aW1lXCIpLmh0bWwobWluICsgXCI6XCIgKyB0aW0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYobWluIDwgMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChjbGVhclQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6XCJsb2dpbi9jaGVuZ0ZhRW5kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOidHRVQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6J2pzb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmM6dHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyTmFtZTokKFwiI2lucHV0VXNlclwiKS52YWwoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRhdGEuY29kZSA9PSAxMDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoXCJib2R5IGRpdltjbGFzcz0naHQtdGltZSddXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi6K+354K55Ye755m75b2VXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgfSwxMDAwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZihkYXRhLmNvZGUgPT0gMjAwKXtcclxuICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KGRhdGEuZXh0ZW5kLmVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHN1ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICB9LDEwMDApO1xyXG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBvblJlc2l6ZTpmdW5jdGlvbiAoKSB7Ly/lsY/luZXlpKflsI/mlLnlj5jkuovku7bnu5HlrppcclxuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgICB3aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB0aGF0LnNldEhlaWdodCgpO1xyXG4gICAgICAgIH0sMCk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgYWN0aXZlOmZ1bmN0aW9uICgpIHtcclxuICAgICAgdGhpcy5vblJlc2l6ZSgpO1xyXG4gICAgICB0aGlzLnNldEhlaWdodCgpO1xyXG4gICAgICB0aGlzLm9uQmx1cigpO1xyXG4gICAgICB0aGlzLm9uQ2xpY2soKTtcclxuICAgIH1cclxuICB9O1xyXG4gIHdpbmRvdy5vbmxvYWQgPSBsb2FkLmNoYW5nSW1nKCk7XHJcbiAgbG9hZC5hY3RpdmUoKTtcclxufSkoalF1ZXJ5KTtcclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYWxsL2pzL2xvYWQuanMiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL19jc3MtbG9hZGVyQDAuMjguNUBjc3MtbG9hZGVyL2luZGV4LmpzIS4vbG9hZC5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi9ub2RlX21vZHVsZXMvX3N0eWxlLWxvYWRlckAwLjE4LjJAc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9fY3NzLWxvYWRlckAwLjI4LjVAY3NzLWxvYWRlci9pbmRleC5qcyEuL2xvYWQuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi9ub2RlX21vZHVsZXMvX2Nzcy1sb2FkZXJAMC4yOC41QGNzcy1sb2FkZXIvaW5kZXguanMhLi9sb2FkLmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hbGwvY3NzL2xvYWQuY3NzXG4vLyBtb2R1bGUgaWQgPSAyMlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCI5MmJlNDg0YzViMzA4NTZhMGMwMGYyYjQxMjhiN2JlYi5wbmdcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2FsbC9pbWcvbG9hZC1iZy5wbmdcbi8vIG1vZHVsZSBpZCA9IDIzXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIm1vZHVsZS5leHBvcnRzID0gXCI8ZGl2IGNsYXNzPVxcXCJjb250YWluZXItZmx1aWRcXFwiPlxcclxcbiAgPGRpdiBjbGFzcz1cXFwiY29udGVudFxcXCI+XFxyXFxuICAgIDwhLS0g5Yqo5oCB6IOM5pmvIC0tPlxcclxcbiAgICA8ZGl2IGlkPVxcXCJsYXJnZS1oZWFkZXJcXFwiIGNsYXNzPVxcXCJsYXJnZS1oZWFkZXJcXFwiPlxcclxcbiAgICAgIDxjYW52YXMgaWQ9XFxcImRlbW8tY2FudmFzXFxcIiBzdHlsZT1cXFwid2lkdGg6IDEwMCVcXFwiPjwvY2FudmFzPlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gICAgPGRpdj5cXHJcXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJodC1sb2FkXFxcIj5cXHJcXG4gICAgICAgIDxoZWFkZXI+XFxyXFxuICAgICAgICAgIDxoMT5GVEY8L2gxPlxcclxcbiAgICAgICAgICA8cD7miJHku6zmi5Lnu53pnaLpnaLnm7jop5E8L3A+XFxyXFxuICAgICAgICA8L2hlYWRlcj5cXHJcXG4gICAgICAgIDxmb3JtIGNsYXNzPVxcXCJmb3JtLWhvcml6b250YWxcXFwiPlxcclxcbiAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJodC1jb25cXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXY+XFxyXFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb250cm9sLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29udHJvbHMgaHQtaW5wdXRcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBzdHlsZT1cXFwiZGlzcGxheTogbm9uZVxcXCI+PCEtLSDmtY/op4jlmajlr4bnoIHnvJPlrZjlpITnkIYgLS0+XFxyXFxuICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGlkPVxcXCJpbnB1dEVtYWlsXFxcIiBwbGFjZWhvbGRlcj1cXFwi55So5oi35ZCNXFxcIiBhdXRvY29tcGxldGU9XFxcIm9mZlxcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb250cm9sLWdyb3VwXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29udHJvbHMgIGh0LWlucHV0XFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwicGFzc3dvcmRcXFwiIHN0eWxlPVxcXCJkaXNwbGF5OiBub25lXFxcIj48IS0tIOa1j+iniOWZqOWvhueggee8k+WtmOWkhOeQhiAtLT5cXHJcXG4gICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwicGFzc3dvcmRcXFwiIGlkPVxcXCJpbnB1dFBhc3N3b3JkXFxcIiBwbGFjZWhvbGRlcj1cXFwi5a+G56CBXFxcIiAgYXV0b2NvbXBsZXRlPVxcXCJvZmZcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDwvZGl2PjxkaXYgY2xhc3M9XFxcImNvbnRyb2wtZ3JvdXAgaHQtc3VyZVxcXCI+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiY29udHJvbHNcXFwiPlxcclxcbiAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVxcXCJpbnB1dFN1cmVcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwiY2hlY2tib3hcXFwiIGlkPVxcXCJpbnB1dFN1cmVcXFwiIHZhbHVlPVxcXCJcXFwiPlxcclxcbiAgICAgICAgICAgICAgICDkuIPlpKnkuYvlhoXlhY3nmbvpmYZcXHJcXG4gICAgICAgICAgICAgIDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgPGRpdiBjbGFzcz1cXFwiaHQtc3VyZXRleHRcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImh0LWlucHV0LXNcXFwiPlxcclxcbiAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGlkPVxcXCJpbnB1dFlhbnpoZW5nXFxcIiB2YWx1ZT1cXFwiXFxcIiBwbGFjZWhvbGRlcj1cXFwi6aqM6K+B56CBXFxcIiBtYXhsZW5ndGg9XFxcIjRcXFwiPlxcclxcbiAgICAgICAgICAgIDwvZGl2PjxkaXY+XFxyXFxuICAgICAgICAgICAgPGltZyBzcmM9XFxcIiNcXFwiIGlkPVxcXCJodC1zdXJldHh0XFxcIiB3aWR0aD1cXFwiMTAwJVxcXCIgaGVpZ2h0PVxcXCI1MHB4XFxcIj5cXHJcXG4gICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJodC1zaWduXFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJjb250cm9sc1xcXCI+XFxyXFxuICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XFxcImJ1dHRvblxcXCIgY2xhc3M9XFxcImJ0biBodC1ibnRcXFwiIGlkPVxcXCJzaWduaW5cXFwiPueZu+W9lTwvYnV0dG9uPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImNvbnRyb2xzXFxcIj5cXHJcXG4gICAgICAgICAgICAgIDxhIGhyZWY9XFxcInNpZ251cC5odG1sIFxcXCI+PGJ1dHRvbiB0eXBlPVxcXCJidXR0b25cXFwiIGNsYXNzPVxcXCJidG5cXFwiPuazqOWGjDwvYnV0dG9uPjwvYT5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8cD48YSBocmVmPVxcXCJmb3JnZXRQYXNzd29yZC5odG1sXFxcIj7mib7lm57lr4bnoIE+PjwvYT48L3A+XFxyXFxuICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9mb3JtPlxcclxcbiAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG4gIDwvZGl2PlxcclxcbjwvZGl2PlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYWxsL3ZpZXcvbG9hZC1ib2R5Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDI0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qIVxuICogVkVSU0lPTjogYmV0YSAxLjkuNFxuICogREFURTogMjAxNC0wNy0xN1xuICogVVBEQVRFUyBBTkQgRE9DUyBBVDogaHR0cDovL3d3dy5ncmVlbnNvY2suY29tXG4gKlxuICogQGxpY2Vuc2UgQ29weXJpZ2h0IChjKSAyMDA4LTIwMTQsIEdyZWVuU29jay4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqIFRoaXMgd29yayBpcyBzdWJqZWN0IHRvIHRoZSB0ZXJtcyBhdCBodHRwOi8vd3d3LmdyZWVuc29jay5jb20vdGVybXNfb2ZfdXNlLmh0bWwgb3IgZm9yXG4gKiBDbHViIEdyZWVuU29jayBtZW1iZXJzLCB0aGUgc29mdHdhcmUgYWdyZWVtZW50IHRoYXQgd2FzIGlzc3VlZCB3aXRoIHlvdXIgbWVtYmVyc2hpcC5cbiAqIFxuICogQGF1dGhvcjogSmFjayBEb3lsZSwgamFja0BncmVlbnNvY2suY29tXG4gKiovXG52YXIgX2dzU2NvcGU9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBnbG9iYWw/Z2xvYmFsOnRoaXN8fHdpbmRvdzsoX2dzU2NvcGUuX2dzUXVldWV8fChfZ3NTY29wZS5fZ3NRdWV1ZT1bXSkpLnB1c2goZnVuY3Rpb24oKXtcInVzZSBzdHJpY3RcIjtfZ3NTY29wZS5fZ3NEZWZpbmUoXCJlYXNpbmcuQmFja1wiLFtcImVhc2luZy5FYXNlXCJdLGZ1bmN0aW9uKHQpe3ZhciBlLGkscyxyPV9nc1Njb3BlLkdyZWVuU29ja0dsb2JhbHN8fF9nc1Njb3BlLG49ci5jb20uZ3JlZW5zb2NrLGE9MipNYXRoLlBJLG89TWF0aC5QSS8yLGg9bi5fY2xhc3MsbD1mdW5jdGlvbihlLGkpe3ZhciBzPWgoXCJlYXNpbmcuXCIrZSxmdW5jdGlvbigpe30sITApLHI9cy5wcm90b3R5cGU9bmV3IHQ7cmV0dXJuIHIuY29uc3RydWN0b3I9cyxyLmdldFJhdGlvPWksc30sXz10LnJlZ2lzdGVyfHxmdW5jdGlvbigpe30sdT1mdW5jdGlvbih0LGUsaSxzKXt2YXIgcj1oKFwiZWFzaW5nLlwiK3Qse2Vhc2VPdXQ6bmV3IGUsZWFzZUluOm5ldyBpLGVhc2VJbk91dDpuZXcgc30sITApO3JldHVybiBfKHIsdCkscn0sYz1mdW5jdGlvbih0LGUsaSl7dGhpcy50PXQsdGhpcy52PWUsaSYmKHRoaXMubmV4dD1pLGkucHJldj10aGlzLHRoaXMuYz1pLnYtZSx0aGlzLmdhcD1pLnQtdCl9LHA9ZnVuY3Rpb24oZSxpKXt2YXIgcz1oKFwiZWFzaW5nLlwiK2UsZnVuY3Rpb24odCl7dGhpcy5fcDE9dHx8MD09PXQ/dDoxLjcwMTU4LHRoaXMuX3AyPTEuNTI1KnRoaXMuX3AxfSwhMCkscj1zLnByb3RvdHlwZT1uZXcgdDtyZXR1cm4gci5jb25zdHJ1Y3Rvcj1zLHIuZ2V0UmF0aW89aSxyLmNvbmZpZz1mdW5jdGlvbih0KXtyZXR1cm4gbmV3IHModCl9LHN9LGY9dShcIkJhY2tcIixwKFwiQmFja091dFwiLGZ1bmN0aW9uKHQpe3JldHVybih0LT0xKSp0KigodGhpcy5fcDErMSkqdCt0aGlzLl9wMSkrMX0pLHAoXCJCYWNrSW5cIixmdW5jdGlvbih0KXtyZXR1cm4gdCp0KigodGhpcy5fcDErMSkqdC10aGlzLl9wMSl9KSxwKFwiQmFja0luT3V0XCIsZnVuY3Rpb24odCl7cmV0dXJuIDE+KHQqPTIpPy41KnQqdCooKHRoaXMuX3AyKzEpKnQtdGhpcy5fcDIpOi41KigodC09MikqdCooKHRoaXMuX3AyKzEpKnQrdGhpcy5fcDIpKzIpfSkpLG09aChcImVhc2luZy5TbG93TW9cIixmdW5jdGlvbih0LGUsaSl7ZT1lfHwwPT09ZT9lOi43LG51bGw9PXQ/dD0uNzp0PjEmJih0PTEpLHRoaXMuX3A9MSE9PXQ/ZTowLHRoaXMuX3AxPSgxLXQpLzIsdGhpcy5fcDI9dCx0aGlzLl9wMz10aGlzLl9wMSt0aGlzLl9wMix0aGlzLl9jYWxjRW5kPWk9PT0hMH0sITApLGQ9bS5wcm90b3R5cGU9bmV3IHQ7cmV0dXJuIGQuY29uc3RydWN0b3I9bSxkLmdldFJhdGlvPWZ1bmN0aW9uKHQpe3ZhciBlPXQrKC41LXQpKnRoaXMuX3A7cmV0dXJuIHRoaXMuX3AxPnQ/dGhpcy5fY2FsY0VuZD8xLSh0PTEtdC90aGlzLl9wMSkqdDplLSh0PTEtdC90aGlzLl9wMSkqdCp0KnQqZTp0PnRoaXMuX3AzP3RoaXMuX2NhbGNFbmQ/MS0odD0odC10aGlzLl9wMykvdGhpcy5fcDEpKnQ6ZSsodC1lKSoodD0odC10aGlzLl9wMykvdGhpcy5fcDEpKnQqdCp0OnRoaXMuX2NhbGNFbmQ/MTplfSxtLmVhc2U9bmV3IG0oLjcsLjcpLGQuY29uZmlnPW0uY29uZmlnPWZ1bmN0aW9uKHQsZSxpKXtyZXR1cm4gbmV3IG0odCxlLGkpfSxlPWgoXCJlYXNpbmcuU3RlcHBlZEVhc2VcIixmdW5jdGlvbih0KXt0PXR8fDEsdGhpcy5fcDE9MS90LHRoaXMuX3AyPXQrMX0sITApLGQ9ZS5wcm90b3R5cGU9bmV3IHQsZC5jb25zdHJ1Y3Rvcj1lLGQuZ2V0UmF0aW89ZnVuY3Rpb24odCl7cmV0dXJuIDA+dD90PTA6dD49MSYmKHQ9Ljk5OTk5OTk5OSksKHRoaXMuX3AyKnQ+PjApKnRoaXMuX3AxfSxkLmNvbmZpZz1lLmNvbmZpZz1mdW5jdGlvbih0KXtyZXR1cm4gbmV3IGUodCl9LGk9aChcImVhc2luZy5Sb3VnaEVhc2VcIixmdW5jdGlvbihlKXtlPWV8fHt9O2Zvcih2YXIgaSxzLHIsbixhLG8saD1lLnRhcGVyfHxcIm5vbmVcIixsPVtdLF89MCx1PTB8KGUucG9pbnRzfHwyMCkscD11LGY9ZS5yYW5kb21pemUhPT0hMSxtPWUuY2xhbXA9PT0hMCxkPWUudGVtcGxhdGUgaW5zdGFuY2VvZiB0P2UudGVtcGxhdGU6bnVsbCxnPVwibnVtYmVyXCI9PXR5cGVvZiBlLnN0cmVuZ3RoPy40KmUuc3RyZW5ndGg6LjQ7LS1wPi0xOylpPWY/TWF0aC5yYW5kb20oKToxL3UqcCxzPWQ/ZC5nZXRSYXRpbyhpKTppLFwibm9uZVwiPT09aD9yPWc6XCJvdXRcIj09PWg/KG49MS1pLHI9bipuKmcpOlwiaW5cIj09PWg/cj1pKmkqZzouNT5pPyhuPTIqaSxyPS41Km4qbipnKToobj0yKigxLWkpLHI9LjUqbipuKmcpLGY/cys9TWF0aC5yYW5kb20oKSpyLS41KnI6cCUyP3MrPS41KnI6cy09LjUqcixtJiYocz4xP3M9MTowPnMmJihzPTApKSxsW18rK109e3g6aSx5OnN9O2ZvcihsLnNvcnQoZnVuY3Rpb24odCxlKXtyZXR1cm4gdC54LWUueH0pLG89bmV3IGMoMSwxLG51bGwpLHA9dTstLXA+LTE7KWE9bFtwXSxvPW5ldyBjKGEueCxhLnksbyk7dGhpcy5fcHJldj1uZXcgYygwLDAsMCE9PW8udD9vOm8ubmV4dCl9LCEwKSxkPWkucHJvdG90eXBlPW5ldyB0LGQuY29uc3RydWN0b3I9aSxkLmdldFJhdGlvPWZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMuX3ByZXY7aWYodD5lLnQpe2Zvcig7ZS5uZXh0JiZ0Pj1lLnQ7KWU9ZS5uZXh0O2U9ZS5wcmV2fWVsc2UgZm9yKDtlLnByZXYmJmUudD49dDspZT1lLnByZXY7cmV0dXJuIHRoaXMuX3ByZXY9ZSxlLnYrKHQtZS50KS9lLmdhcCplLmN9LGQuY29uZmlnPWZ1bmN0aW9uKHQpe3JldHVybiBuZXcgaSh0KX0saS5lYXNlPW5ldyBpLHUoXCJCb3VuY2VcIixsKFwiQm91bmNlT3V0XCIsZnVuY3Rpb24odCl7cmV0dXJuIDEvMi43NT50PzcuNTYyNSp0KnQ6Mi8yLjc1PnQ/Ny41NjI1Kih0LT0xLjUvMi43NSkqdCsuNzU6Mi41LzIuNzU+dD83LjU2MjUqKHQtPTIuMjUvMi43NSkqdCsuOTM3NTo3LjU2MjUqKHQtPTIuNjI1LzIuNzUpKnQrLjk4NDM3NX0pLGwoXCJCb3VuY2VJblwiLGZ1bmN0aW9uKHQpe3JldHVybiAxLzIuNzU+KHQ9MS10KT8xLTcuNTYyNSp0KnQ6Mi8yLjc1PnQ/MS0oNy41NjI1Kih0LT0xLjUvMi43NSkqdCsuNzUpOjIuNS8yLjc1PnQ/MS0oNy41NjI1Kih0LT0yLjI1LzIuNzUpKnQrLjkzNzUpOjEtKDcuNTYyNSoodC09Mi42MjUvMi43NSkqdCsuOTg0Mzc1KX0pLGwoXCJCb3VuY2VJbk91dFwiLGZ1bmN0aW9uKHQpe3ZhciBlPS41PnQ7cmV0dXJuIHQ9ZT8xLTIqdDoyKnQtMSx0PTEvMi43NT50PzcuNTYyNSp0KnQ6Mi8yLjc1PnQ/Ny41NjI1Kih0LT0xLjUvMi43NSkqdCsuNzU6Mi41LzIuNzU+dD83LjU2MjUqKHQtPTIuMjUvMi43NSkqdCsuOTM3NTo3LjU2MjUqKHQtPTIuNjI1LzIuNzUpKnQrLjk4NDM3NSxlPy41KigxLXQpOi41KnQrLjV9KSksdShcIkNpcmNcIixsKFwiQ2lyY091dFwiLGZ1bmN0aW9uKHQpe3JldHVybiBNYXRoLnNxcnQoMS0odC09MSkqdCl9KSxsKFwiQ2lyY0luXCIsZnVuY3Rpb24odCl7cmV0dXJuLShNYXRoLnNxcnQoMS10KnQpLTEpfSksbChcIkNpcmNJbk91dFwiLGZ1bmN0aW9uKHQpe3JldHVybiAxPih0Kj0yKT8tLjUqKE1hdGguc3FydCgxLXQqdCktMSk6LjUqKE1hdGguc3FydCgxLSh0LT0yKSp0KSsxKX0pKSxzPWZ1bmN0aW9uKGUsaSxzKXt2YXIgcj1oKFwiZWFzaW5nLlwiK2UsZnVuY3Rpb24odCxlKXt0aGlzLl9wMT10fHwxLHRoaXMuX3AyPWV8fHMsdGhpcy5fcDM9dGhpcy5fcDIvYSooTWF0aC5hc2luKDEvdGhpcy5fcDEpfHwwKX0sITApLG49ci5wcm90b3R5cGU9bmV3IHQ7cmV0dXJuIG4uY29uc3RydWN0b3I9cixuLmdldFJhdGlvPWksbi5jb25maWc9ZnVuY3Rpb24odCxlKXtyZXR1cm4gbmV3IHIodCxlKX0scn0sdShcIkVsYXN0aWNcIixzKFwiRWxhc3RpY091dFwiLGZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLl9wMSpNYXRoLnBvdygyLC0xMCp0KSpNYXRoLnNpbigodC10aGlzLl9wMykqYS90aGlzLl9wMikrMX0sLjMpLHMoXCJFbGFzdGljSW5cIixmdW5jdGlvbih0KXtyZXR1cm4tKHRoaXMuX3AxKk1hdGgucG93KDIsMTAqKHQtPTEpKSpNYXRoLnNpbigodC10aGlzLl9wMykqYS90aGlzLl9wMikpfSwuMykscyhcIkVsYXN0aWNJbk91dFwiLGZ1bmN0aW9uKHQpe3JldHVybiAxPih0Kj0yKT8tLjUqdGhpcy5fcDEqTWF0aC5wb3coMiwxMCoodC09MSkpKk1hdGguc2luKCh0LXRoaXMuX3AzKSphL3RoaXMuX3AyKTouNSp0aGlzLl9wMSpNYXRoLnBvdygyLC0xMCoodC09MSkpKk1hdGguc2luKCh0LXRoaXMuX3AzKSphL3RoaXMuX3AyKSsxfSwuNDUpKSx1KFwiRXhwb1wiLGwoXCJFeHBvT3V0XCIsZnVuY3Rpb24odCl7cmV0dXJuIDEtTWF0aC5wb3coMiwtMTAqdCl9KSxsKFwiRXhwb0luXCIsZnVuY3Rpb24odCl7cmV0dXJuIE1hdGgucG93KDIsMTAqKHQtMSkpLS4wMDF9KSxsKFwiRXhwb0luT3V0XCIsZnVuY3Rpb24odCl7cmV0dXJuIDE+KHQqPTIpPy41Kk1hdGgucG93KDIsMTAqKHQtMSkpOi41KigyLU1hdGgucG93KDIsLTEwKih0LTEpKSl9KSksdShcIlNpbmVcIixsKFwiU2luZU91dFwiLGZ1bmN0aW9uKHQpe3JldHVybiBNYXRoLnNpbih0Km8pfSksbChcIlNpbmVJblwiLGZ1bmN0aW9uKHQpe3JldHVybi1NYXRoLmNvcyh0Km8pKzF9KSxsKFwiU2luZUluT3V0XCIsZnVuY3Rpb24odCl7cmV0dXJuLS41KihNYXRoLmNvcyhNYXRoLlBJKnQpLTEpfSkpLGgoXCJlYXNpbmcuRWFzZUxvb2t1cFwiLHtmaW5kOmZ1bmN0aW9uKGUpe3JldHVybiB0Lm1hcFtlXX19LCEwKSxfKHIuU2xvd01vLFwiU2xvd01vXCIsXCJlYXNlLFwiKSxfKGksXCJSb3VnaEVhc2VcIixcImVhc2UsXCIpLF8oZSxcIlN0ZXBwZWRFYXNlXCIsXCJlYXNlLFwiKSxmfSwhMCl9KSxfZ3NTY29wZS5fZ3NEZWZpbmUmJl9nc1Njb3BlLl9nc1F1ZXVlLnBvcCgpKCk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYWxsL2pzL0Vhc2VQYWNrLm1pbi5qcyIsIi8vIGh0dHA6Ly9wYXVsaXJpc2guY29tLzIwMTEvcmVxdWVzdGFuaW1hdGlvbmZyYW1lLWZvci1zbWFydC1hbmltYXRpbmcvXG4vLyBodHRwOi8vbXkub3BlcmEuY29tL2Vtb2xsZXIvYmxvZy8yMDExLzEyLzIwL3JlcXVlc3RhbmltYXRpb25mcmFtZS1mb3Itc21hcnQtZXItYW5pbWF0aW5nXG5cbi8vIHJlcXVlc3RBbmltYXRpb25GcmFtZSBwb2x5ZmlsbCBieSBFcmlrIE3DtmxsZXIuIGZpeGVzIGZyb20gUGF1bCBJcmlzaCBhbmQgVGlubyBaaWpkZWxcblxuLy8gTUlUIGxpY2Vuc2VcblxuKGZ1bmN0aW9uKCkge1xuICAgIHZhciBsYXN0VGltZSA9IDA7XG4gICAgdmFyIHZlbmRvcnMgPSBbJ21zJywgJ21veicsICd3ZWJraXQnLCAnbyddO1xuICAgIGZvcih2YXIgeCA9IDA7IHggPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKyt4KSB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSsnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdKydDYW5jZWxBbmltYXRpb25GcmFtZSddXG4gICAgICAgICAgICB8fCB3aW5kb3dbdmVuZG9yc1t4XSsnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gICAgfVxuXG4gICAgaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKVxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oY2FsbGJhY2ssIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSk7XG4gICAgICAgICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTsgfSxcbiAgICAgICAgICAgICAgICB0aW1lVG9DYWxsKTtcbiAgICAgICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9O1xuXG4gICAgaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpXG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xuICAgICAgICB9O1xufSgpKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9hbGwvanMvckFGLmpzIiwiLyohXG4gKiBWRVJTSU9OOiAxLjEzLjFcbiAqIERBVEU6IDIwMTQtMDctMjJcbiAqIFVQREFURVMgQU5EIERPQ1MgQVQ6IGh0dHA6Ly93d3cuZ3JlZW5zb2NrLmNvbVxuICpcbiAqIEBsaWNlbnNlIENvcHlyaWdodCAoYykgMjAwOC0yMDE0LCBHcmVlblNvY2suIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBUaGlzIHdvcmsgaXMgc3ViamVjdCB0byB0aGUgdGVybXMgYXQgaHR0cDovL3d3dy5ncmVlbnNvY2suY29tL3Rlcm1zX29mX3VzZS5odG1sIG9yIGZvclxuICogQ2x1YiBHcmVlblNvY2sgbWVtYmVycywgdGhlIHNvZnR3YXJlIGFncmVlbWVudCB0aGF0IHdhcyBpc3N1ZWQgd2l0aCB5b3VyIG1lbWJlcnNoaXAuXG4gKiBcbiAqIEBhdXRob3I6IEphY2sgRG95bGUsIGphY2tAZ3JlZW5zb2NrLmNvbVxuICovXG4oZnVuY3Rpb24odCxlKXtcInVzZSBzdHJpY3RcIjt2YXIgaT10LkdyZWVuU29ja0dsb2JhbHM9dC5HcmVlblNvY2tHbG9iYWxzfHx0O2lmKCFpLlR3ZWVuTGl0ZSl7dmFyIHMsbixyLGEsbyxsPWZ1bmN0aW9uKHQpe3ZhciBlLHM9dC5zcGxpdChcIi5cIiksbj1pO2ZvcihlPTA7cy5sZW5ndGg+ZTtlKyspbltzW2VdXT1uPW5bc1tlXV18fHt9O3JldHVybiBufSxoPWwoXCJjb20uZ3JlZW5zb2NrXCIpLF89MWUtMTAsdT1mdW5jdGlvbih0KXt2YXIgZSxpPVtdLHM9dC5sZW5ndGg7Zm9yKGU9MDtlIT09cztpLnB1c2godFtlKytdKSk7cmV0dXJuIGl9LGY9ZnVuY3Rpb24oKXt9LG09ZnVuY3Rpb24oKXt2YXIgdD1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLGU9dC5jYWxsKFtdKTtyZXR1cm4gZnVuY3Rpb24oaSl7cmV0dXJuIG51bGwhPWkmJihpIGluc3RhbmNlb2YgQXJyYXl8fFwib2JqZWN0XCI9PXR5cGVvZiBpJiYhIWkucHVzaCYmdC5jYWxsKGkpPT09ZSl9fSgpLHA9e30sYz1mdW5jdGlvbihzLG4scixhKXt0aGlzLnNjPXBbc10/cFtzXS5zYzpbXSxwW3NdPXRoaXMsdGhpcy5nc0NsYXNzPW51bGwsdGhpcy5mdW5jPXI7dmFyIG89W107dGhpcy5jaGVjaz1mdW5jdGlvbihoKXtmb3IodmFyIF8sdSxmLG0sZD1uLmxlbmd0aCx2PWQ7LS1kPi0xOykoXz1wW25bZF1dfHxuZXcgYyhuW2RdLFtdKSkuZ3NDbGFzcz8ob1tkXT1fLmdzQ2xhc3Msdi0tKTpoJiZfLnNjLnB1c2godGhpcyk7aWYoMD09PXYmJnIpZm9yKHU9KFwiY29tLmdyZWVuc29jay5cIitzKS5zcGxpdChcIi5cIiksZj11LnBvcCgpLG09bCh1LmpvaW4oXCIuXCIpKVtmXT10aGlzLmdzQ2xhc3M9ci5hcHBseShyLG8pLGEmJihpW2ZdPW0sXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZSgodC5HcmVlblNvY2tBTURQYXRoP3QuR3JlZW5Tb2NrQU1EUGF0aCtcIi9cIjpcIlwiKStzLnNwbGl0KFwiLlwiKS5wb3AoKSxbXSxmdW5jdGlvbigpe3JldHVybiBtfSk6cz09PWUmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzJiYobW9kdWxlLmV4cG9ydHM9bSkpLGQ9MDt0aGlzLnNjLmxlbmd0aD5kO2QrKyl0aGlzLnNjW2RdLmNoZWNrKCl9LHRoaXMuY2hlY2soITApfSxkPXQuX2dzRGVmaW5lPWZ1bmN0aW9uKHQsZSxpLHMpe3JldHVybiBuZXcgYyh0LGUsaSxzKX0sdj1oLl9jbGFzcz1mdW5jdGlvbih0LGUsaSl7cmV0dXJuIGU9ZXx8ZnVuY3Rpb24oKXt9LGQodCxbXSxmdW5jdGlvbigpe3JldHVybiBlfSxpKSxlfTtkLmdsb2JhbHM9aTt2YXIgZz1bMCwwLDEsMV0sVD1bXSx5PXYoXCJlYXNpbmcuRWFzZVwiLGZ1bmN0aW9uKHQsZSxpLHMpe3RoaXMuX2Z1bmM9dCx0aGlzLl90eXBlPWl8fDAsdGhpcy5fcG93ZXI9c3x8MCx0aGlzLl9wYXJhbXM9ZT9nLmNvbmNhdChlKTpnfSwhMCksdz15Lm1hcD17fSxQPXkucmVnaXN0ZXI9ZnVuY3Rpb24odCxlLGkscyl7Zm9yKHZhciBuLHIsYSxvLGw9ZS5zcGxpdChcIixcIiksXz1sLmxlbmd0aCx1PShpfHxcImVhc2VJbixlYXNlT3V0LGVhc2VJbk91dFwiKS5zcGxpdChcIixcIik7LS1fPi0xOylmb3Iocj1sW19dLG49cz92KFwiZWFzaW5nLlwiK3IsbnVsbCwhMCk6aC5lYXNpbmdbcl18fHt9LGE9dS5sZW5ndGg7LS1hPi0xOylvPXVbYV0sd1tyK1wiLlwiK29dPXdbbytyXT1uW29dPXQuZ2V0UmF0aW8/dDp0W29dfHxuZXcgdH07Zm9yKHI9eS5wcm90b3R5cGUsci5fY2FsY0VuZD0hMSxyLmdldFJhdGlvPWZ1bmN0aW9uKHQpe2lmKHRoaXMuX2Z1bmMpcmV0dXJuIHRoaXMuX3BhcmFtc1swXT10LHRoaXMuX2Z1bmMuYXBwbHkobnVsbCx0aGlzLl9wYXJhbXMpO3ZhciBlPXRoaXMuX3R5cGUsaT10aGlzLl9wb3dlcixzPTE9PT1lPzEtdDoyPT09ZT90Oi41PnQ/Mip0OjIqKDEtdCk7cmV0dXJuIDE9PT1pP3MqPXM6Mj09PWk/cyo9cypzOjM9PT1pP3MqPXMqcypzOjQ9PT1pJiYocyo9cypzKnMqcyksMT09PWU/MS1zOjI9PT1lP3M6LjU+dD9zLzI6MS1zLzJ9LHM9W1wiTGluZWFyXCIsXCJRdWFkXCIsXCJDdWJpY1wiLFwiUXVhcnRcIixcIlF1aW50LFN0cm9uZ1wiXSxuPXMubGVuZ3RoOy0tbj4tMTspcj1zW25dK1wiLFBvd2VyXCIrbixQKG5ldyB5KG51bGwsbnVsbCwxLG4pLHIsXCJlYXNlT3V0XCIsITApLFAobmV3IHkobnVsbCxudWxsLDIsbikscixcImVhc2VJblwiKygwPT09bj9cIixlYXNlTm9uZVwiOlwiXCIpKSxQKG5ldyB5KG51bGwsbnVsbCwzLG4pLHIsXCJlYXNlSW5PdXRcIik7dy5saW5lYXI9aC5lYXNpbmcuTGluZWFyLmVhc2VJbix3LnN3aW5nPWguZWFzaW5nLlF1YWQuZWFzZUluT3V0O3ZhciBiPXYoXCJldmVudHMuRXZlbnREaXNwYXRjaGVyXCIsZnVuY3Rpb24odCl7dGhpcy5fbGlzdGVuZXJzPXt9LHRoaXMuX2V2ZW50VGFyZ2V0PXR8fHRoaXN9KTtyPWIucHJvdG90eXBlLHIuYWRkRXZlbnRMaXN0ZW5lcj1mdW5jdGlvbih0LGUsaSxzLG4pe249bnx8MDt2YXIgcixsLGg9dGhpcy5fbGlzdGVuZXJzW3RdLF89MDtmb3IobnVsbD09aCYmKHRoaXMuX2xpc3RlbmVyc1t0XT1oPVtdKSxsPWgubGVuZ3RoOy0tbD4tMTspcj1oW2xdLHIuYz09PWUmJnIucz09PWk/aC5zcGxpY2UobCwxKTowPT09XyYmbj5yLnByJiYoXz1sKzEpO2guc3BsaWNlKF8sMCx7YzplLHM6aSx1cDpzLHByOm59KSx0aGlzIT09YXx8b3x8YS53YWtlKCl9LHIucmVtb3ZlRXZlbnRMaXN0ZW5lcj1mdW5jdGlvbih0LGUpe3ZhciBpLHM9dGhpcy5fbGlzdGVuZXJzW3RdO2lmKHMpZm9yKGk9cy5sZW5ndGg7LS1pPi0xOylpZihzW2ldLmM9PT1lKXJldHVybiBzLnNwbGljZShpLDEpLHZvaWQgMH0sci5kaXNwYXRjaEV2ZW50PWZ1bmN0aW9uKHQpe3ZhciBlLGkscyxuPXRoaXMuX2xpc3RlbmVyc1t0XTtpZihuKWZvcihlPW4ubGVuZ3RoLGk9dGhpcy5fZXZlbnRUYXJnZXQ7LS1lPi0xOylzPW5bZV0scy51cD9zLmMuY2FsbChzLnN8fGkse3R5cGU6dCx0YXJnZXQ6aX0pOnMuYy5jYWxsKHMuc3x8aSl9O3ZhciBrPXQucmVxdWVzdEFuaW1hdGlvbkZyYW1lLEE9dC5jYW5jZWxBbmltYXRpb25GcmFtZSxTPURhdGUubm93fHxmdW5jdGlvbigpe3JldHVybihuZXcgRGF0ZSkuZ2V0VGltZSgpfSx4PVMoKTtmb3Iocz1bXCJtc1wiLFwibW96XCIsXCJ3ZWJraXRcIixcIm9cIl0sbj1zLmxlbmd0aDstLW4+LTEmJiFrOylrPXRbc1tuXStcIlJlcXVlc3RBbmltYXRpb25GcmFtZVwiXSxBPXRbc1tuXStcIkNhbmNlbEFuaW1hdGlvbkZyYW1lXCJdfHx0W3Nbbl0rXCJDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIl07dihcIlRpY2tlclwiLGZ1bmN0aW9uKHQsZSl7dmFyIGkscyxuLHIsbCxoPXRoaXMsdT1TKCksbT1lIT09ITEmJmsscD01MDAsYz0zMyxkPWZ1bmN0aW9uKHQpe3ZhciBlLGEsbz1TKCkteDtvPnAmJih1Kz1vLWMpLHgrPW8saC50aW1lPSh4LXUpLzFlMyxlPWgudGltZS1sLCghaXx8ZT4wfHx0PT09ITApJiYoaC5mcmFtZSsrLGwrPWUrKGU+PXI/LjAwNDpyLWUpLGE9ITApLHQhPT0hMCYmKG49cyhkKSksYSYmaC5kaXNwYXRjaEV2ZW50KFwidGlja1wiKX07Yi5jYWxsKGgpLGgudGltZT1oLmZyYW1lPTAsaC50aWNrPWZ1bmN0aW9uKCl7ZCghMCl9LGgubGFnU21vb3RoaW5nPWZ1bmN0aW9uKHQsZSl7cD10fHwxL18sYz1NYXRoLm1pbihlLHAsMCl9LGguc2xlZXA9ZnVuY3Rpb24oKXtudWxsIT1uJiYobSYmQT9BKG4pOmNsZWFyVGltZW91dChuKSxzPWYsbj1udWxsLGg9PT1hJiYobz0hMSkpfSxoLndha2U9ZnVuY3Rpb24oKXtudWxsIT09bj9oLnNsZWVwKCk6aC5mcmFtZT4xMCYmKHg9UygpLXArNSkscz0wPT09aT9mOm0mJms/azpmdW5jdGlvbih0KXtyZXR1cm4gc2V0VGltZW91dCh0LDB8MWUzKihsLWgudGltZSkrMSl9LGg9PT1hJiYobz0hMCksZCgyKX0saC5mcHM9ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KGk9dCxyPTEvKGl8fDYwKSxsPXRoaXMudGltZStyLGgud2FrZSgpLHZvaWQgMCk6aX0saC51c2VSQUY9ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KGguc2xlZXAoKSxtPXQsaC5mcHMoaSksdm9pZCAwKTptfSxoLmZwcyh0KSxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bSYmKCFufHw1PmguZnJhbWUpJiZoLnVzZVJBRighMSl9LDE1MDApfSkscj1oLlRpY2tlci5wcm90b3R5cGU9bmV3IGguZXZlbnRzLkV2ZW50RGlzcGF0Y2hlcixyLmNvbnN0cnVjdG9yPWguVGlja2VyO3ZhciBDPXYoXCJjb3JlLkFuaW1hdGlvblwiLGZ1bmN0aW9uKHQsZSl7aWYodGhpcy52YXJzPWU9ZXx8e30sdGhpcy5fZHVyYXRpb249dGhpcy5fdG90YWxEdXJhdGlvbj10fHwwLHRoaXMuX2RlbGF5PU51bWJlcihlLmRlbGF5KXx8MCx0aGlzLl90aW1lU2NhbGU9MSx0aGlzLl9hY3RpdmU9ZS5pbW1lZGlhdGVSZW5kZXI9PT0hMCx0aGlzLmRhdGE9ZS5kYXRhLHRoaXMuX3JldmVyc2VkPWUucmV2ZXJzZWQ9PT0hMCxCKXtvfHxhLndha2UoKTt2YXIgaT10aGlzLnZhcnMudXNlRnJhbWVzP3E6QjtpLmFkZCh0aGlzLGkuX3RpbWUpLHRoaXMudmFycy5wYXVzZWQmJnRoaXMucGF1c2VkKCEwKX19KTthPUMudGlja2VyPW5ldyBoLlRpY2tlcixyPUMucHJvdG90eXBlLHIuX2RpcnR5PXIuX2djPXIuX2luaXR0ZWQ9ci5fcGF1c2VkPSExLHIuX3RvdGFsVGltZT1yLl90aW1lPTAsci5fcmF3UHJldlRpbWU9LTEsci5fbmV4dD1yLl9sYXN0PXIuX29uVXBkYXRlPXIuX3RpbWVsaW5lPXIudGltZWxpbmU9bnVsbCxyLl9wYXVzZWQ9ITE7dmFyIFI9ZnVuY3Rpb24oKXtvJiZTKCkteD4yZTMmJmEud2FrZSgpLHNldFRpbWVvdXQoUiwyZTMpfTtSKCksci5wbGF5PWZ1bmN0aW9uKHQsZSl7cmV0dXJuIG51bGwhPXQmJnRoaXMuc2Vlayh0LGUpLHRoaXMucmV2ZXJzZWQoITEpLnBhdXNlZCghMSl9LHIucGF1c2U9ZnVuY3Rpb24odCxlKXtyZXR1cm4gbnVsbCE9dCYmdGhpcy5zZWVrKHQsZSksdGhpcy5wYXVzZWQoITApfSxyLnJlc3VtZT1mdW5jdGlvbih0LGUpe3JldHVybiBudWxsIT10JiZ0aGlzLnNlZWsodCxlKSx0aGlzLnBhdXNlZCghMSl9LHIuc2Vlaz1mdW5jdGlvbih0LGUpe3JldHVybiB0aGlzLnRvdGFsVGltZShOdW1iZXIodCksZSE9PSExKX0sci5yZXN0YXJ0PWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRoaXMucmV2ZXJzZWQoITEpLnBhdXNlZCghMSkudG90YWxUaW1lKHQ/LXRoaXMuX2RlbGF5OjAsZSE9PSExLCEwKX0sci5yZXZlcnNlPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIG51bGwhPXQmJnRoaXMuc2Vlayh0fHx0aGlzLnRvdGFsRHVyYXRpb24oKSxlKSx0aGlzLnJldmVyc2VkKCEwKS5wYXVzZWQoITEpfSxyLnJlbmRlcj1mdW5jdGlvbigpe30sci5pbnZhbGlkYXRlPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9LHIuaXNBY3RpdmU9ZnVuY3Rpb24oKXt2YXIgdCxlPXRoaXMuX3RpbWVsaW5lLGk9dGhpcy5fc3RhcnRUaW1lO3JldHVybiFlfHwhdGhpcy5fZ2MmJiF0aGlzLl9wYXVzZWQmJmUuaXNBY3RpdmUoKSYmKHQ9ZS5yYXdUaW1lKCkpPj1pJiZpK3RoaXMudG90YWxEdXJhdGlvbigpL3RoaXMuX3RpbWVTY2FsZT50fSxyLl9lbmFibGVkPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIG98fGEud2FrZSgpLHRoaXMuX2djPSF0LHRoaXMuX2FjdGl2ZT10aGlzLmlzQWN0aXZlKCksZSE9PSEwJiYodCYmIXRoaXMudGltZWxpbmU/dGhpcy5fdGltZWxpbmUuYWRkKHRoaXMsdGhpcy5fc3RhcnRUaW1lLXRoaXMuX2RlbGF5KTohdCYmdGhpcy50aW1lbGluZSYmdGhpcy5fdGltZWxpbmUuX3JlbW92ZSh0aGlzLCEwKSksITF9LHIuX2tpbGw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fZW5hYmxlZCghMSwhMSl9LHIua2lsbD1mdW5jdGlvbih0LGUpe3JldHVybiB0aGlzLl9raWxsKHQsZSksdGhpc30sci5fdW5jYWNoZT1mdW5jdGlvbih0KXtmb3IodmFyIGU9dD90aGlzOnRoaXMudGltZWxpbmU7ZTspZS5fZGlydHk9ITAsZT1lLnRpbWVsaW5lO3JldHVybiB0aGlzfSxyLl9zd2FwU2VsZkluUGFyYW1zPWZ1bmN0aW9uKHQpe2Zvcih2YXIgZT10Lmxlbmd0aCxpPXQuY29uY2F0KCk7LS1lPi0xOylcIntzZWxmfVwiPT09dFtlXSYmKGlbZV09dGhpcyk7cmV0dXJuIGl9LHIuZXZlbnRDYWxsYmFjaz1mdW5jdGlvbih0LGUsaSxzKXtpZihcIm9uXCI9PT0odHx8XCJcIikuc3Vic3RyKDAsMikpe3ZhciBuPXRoaXMudmFycztpZigxPT09YXJndW1lbnRzLmxlbmd0aClyZXR1cm4gblt0XTtudWxsPT1lP2RlbGV0ZSBuW3RdOihuW3RdPWUsblt0K1wiUGFyYW1zXCJdPW0oaSkmJi0xIT09aS5qb2luKFwiXCIpLmluZGV4T2YoXCJ7c2VsZn1cIik/dGhpcy5fc3dhcFNlbGZJblBhcmFtcyhpKTppLG5bdCtcIlNjb3BlXCJdPXMpLFwib25VcGRhdGVcIj09PXQmJih0aGlzLl9vblVwZGF0ZT1lKX1yZXR1cm4gdGhpc30sci5kZWxheT1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8odGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmcmJnRoaXMuc3RhcnRUaW1lKHRoaXMuX3N0YXJ0VGltZSt0LXRoaXMuX2RlbGF5KSx0aGlzLl9kZWxheT10LHRoaXMpOnRoaXMuX2RlbGF5fSxyLmR1cmF0aW9uPWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0aGlzLl9kdXJhdGlvbj10aGlzLl90b3RhbER1cmF0aW9uPXQsdGhpcy5fdW5jYWNoZSghMCksdGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmcmJnRoaXMuX3RpbWU+MCYmdGhpcy5fdGltZTx0aGlzLl9kdXJhdGlvbiYmMCE9PXQmJnRoaXMudG90YWxUaW1lKHRoaXMuX3RvdGFsVGltZSoodC90aGlzLl9kdXJhdGlvbiksITApLHRoaXMpOih0aGlzLl9kaXJ0eT0hMSx0aGlzLl9kdXJhdGlvbil9LHIudG90YWxEdXJhdGlvbj1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5fZGlydHk9ITEsYXJndW1lbnRzLmxlbmd0aD90aGlzLmR1cmF0aW9uKHQpOnRoaXMuX3RvdGFsRHVyYXRpb259LHIudGltZT1mdW5jdGlvbih0LGUpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0aGlzLl9kaXJ0eSYmdGhpcy50b3RhbER1cmF0aW9uKCksdGhpcy50b3RhbFRpbWUodD50aGlzLl9kdXJhdGlvbj90aGlzLl9kdXJhdGlvbjp0LGUpKTp0aGlzLl90aW1lfSxyLnRvdGFsVGltZT1mdW5jdGlvbih0LGUsaSl7aWYob3x8YS53YWtlKCksIWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuIHRoaXMuX3RvdGFsVGltZTtpZih0aGlzLl90aW1lbGluZSl7aWYoMD50JiYhaSYmKHQrPXRoaXMudG90YWxEdXJhdGlvbigpKSx0aGlzLl90aW1lbGluZS5zbW9vdGhDaGlsZFRpbWluZyl7dGhpcy5fZGlydHkmJnRoaXMudG90YWxEdXJhdGlvbigpO3ZhciBzPXRoaXMuX3RvdGFsRHVyYXRpb24sbj10aGlzLl90aW1lbGluZTtpZih0PnMmJiFpJiYodD1zKSx0aGlzLl9zdGFydFRpbWU9KHRoaXMuX3BhdXNlZD90aGlzLl9wYXVzZVRpbWU6bi5fdGltZSktKHRoaXMuX3JldmVyc2VkP3MtdDp0KS90aGlzLl90aW1lU2NhbGUsbi5fZGlydHl8fHRoaXMuX3VuY2FjaGUoITEpLG4uX3RpbWVsaW5lKWZvcig7bi5fdGltZWxpbmU7KW4uX3RpbWVsaW5lLl90aW1lIT09KG4uX3N0YXJ0VGltZStuLl90b3RhbFRpbWUpL24uX3RpbWVTY2FsZSYmbi50b3RhbFRpbWUobi5fdG90YWxUaW1lLCEwKSxuPW4uX3RpbWVsaW5lfXRoaXMuX2djJiZ0aGlzLl9lbmFibGVkKCEwLCExKSwodGhpcy5fdG90YWxUaW1lIT09dHx8MD09PXRoaXMuX2R1cmF0aW9uKSYmKHRoaXMucmVuZGVyKHQsZSwhMSksTy5sZW5ndGgmJk0oKSl9cmV0dXJuIHRoaXN9LHIucHJvZ3Jlc3M9ci50b3RhbFByb2dyZXNzPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/dGhpcy50b3RhbFRpbWUodGhpcy5kdXJhdGlvbigpKnQsZSk6dGhpcy5fdGltZS90aGlzLmR1cmF0aW9uKCl9LHIuc3RhcnRUaW1lPWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0IT09dGhpcy5fc3RhcnRUaW1lJiYodGhpcy5fc3RhcnRUaW1lPXQsdGhpcy50aW1lbGluZSYmdGhpcy50aW1lbGluZS5fc29ydENoaWxkcmVuJiZ0aGlzLnRpbWVsaW5lLmFkZCh0aGlzLHQtdGhpcy5fZGVsYXkpKSx0aGlzKTp0aGlzLl9zdGFydFRpbWV9LHIudGltZVNjYWxlPWZ1bmN0aW9uKHQpe2lmKCFhcmd1bWVudHMubGVuZ3RoKXJldHVybiB0aGlzLl90aW1lU2NhbGU7aWYodD10fHxfLHRoaXMuX3RpbWVsaW5lJiZ0aGlzLl90aW1lbGluZS5zbW9vdGhDaGlsZFRpbWluZyl7dmFyIGU9dGhpcy5fcGF1c2VUaW1lLGk9ZXx8MD09PWU/ZTp0aGlzLl90aW1lbGluZS50b3RhbFRpbWUoKTt0aGlzLl9zdGFydFRpbWU9aS0oaS10aGlzLl9zdGFydFRpbWUpKnRoaXMuX3RpbWVTY2FsZS90fXJldHVybiB0aGlzLl90aW1lU2NhbGU9dCx0aGlzLl91bmNhY2hlKCExKX0sci5yZXZlcnNlZD1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8odCE9dGhpcy5fcmV2ZXJzZWQmJih0aGlzLl9yZXZlcnNlZD10LHRoaXMudG90YWxUaW1lKHRoaXMuX3RpbWVsaW5lJiYhdGhpcy5fdGltZWxpbmUuc21vb3RoQ2hpbGRUaW1pbmc/dGhpcy50b3RhbER1cmF0aW9uKCktdGhpcy5fdG90YWxUaW1lOnRoaXMuX3RvdGFsVGltZSwhMCkpLHRoaXMpOnRoaXMuX3JldmVyc2VkfSxyLnBhdXNlZD1mdW5jdGlvbih0KXtpZighYXJndW1lbnRzLmxlbmd0aClyZXR1cm4gdGhpcy5fcGF1c2VkO2lmKHQhPXRoaXMuX3BhdXNlZCYmdGhpcy5fdGltZWxpbmUpe298fHR8fGEud2FrZSgpO3ZhciBlPXRoaXMuX3RpbWVsaW5lLGk9ZS5yYXdUaW1lKCkscz1pLXRoaXMuX3BhdXNlVGltZTshdCYmZS5zbW9vdGhDaGlsZFRpbWluZyYmKHRoaXMuX3N0YXJ0VGltZSs9cyx0aGlzLl91bmNhY2hlKCExKSksdGhpcy5fcGF1c2VUaW1lPXQ/aTpudWxsLHRoaXMuX3BhdXNlZD10LHRoaXMuX2FjdGl2ZT10aGlzLmlzQWN0aXZlKCksIXQmJjAhPT1zJiZ0aGlzLl9pbml0dGVkJiZ0aGlzLmR1cmF0aW9uKCkmJnRoaXMucmVuZGVyKGUuc21vb3RoQ2hpbGRUaW1pbmc/dGhpcy5fdG90YWxUaW1lOihpLXRoaXMuX3N0YXJ0VGltZSkvdGhpcy5fdGltZVNjYWxlLCEwLCEwKX1yZXR1cm4gdGhpcy5fZ2MmJiF0JiZ0aGlzLl9lbmFibGVkKCEwLCExKSx0aGlzfTt2YXIgRD12KFwiY29yZS5TaW1wbGVUaW1lbGluZVwiLGZ1bmN0aW9uKHQpe0MuY2FsbCh0aGlzLDAsdCksdGhpcy5hdXRvUmVtb3ZlQ2hpbGRyZW49dGhpcy5zbW9vdGhDaGlsZFRpbWluZz0hMH0pO3I9RC5wcm90b3R5cGU9bmV3IEMsci5jb25zdHJ1Y3Rvcj1ELHIua2lsbCgpLl9nYz0hMSxyLl9maXJzdD1yLl9sYXN0PW51bGwsci5fc29ydENoaWxkcmVuPSExLHIuYWRkPXIuaW5zZXJ0PWZ1bmN0aW9uKHQsZSl7dmFyIGkscztpZih0Ll9zdGFydFRpbWU9TnVtYmVyKGV8fDApK3QuX2RlbGF5LHQuX3BhdXNlZCYmdGhpcyE9PXQuX3RpbWVsaW5lJiYodC5fcGF1c2VUaW1lPXQuX3N0YXJ0VGltZSsodGhpcy5yYXdUaW1lKCktdC5fc3RhcnRUaW1lKS90Ll90aW1lU2NhbGUpLHQudGltZWxpbmUmJnQudGltZWxpbmUuX3JlbW92ZSh0LCEwKSx0LnRpbWVsaW5lPXQuX3RpbWVsaW5lPXRoaXMsdC5fZ2MmJnQuX2VuYWJsZWQoITAsITApLGk9dGhpcy5fbGFzdCx0aGlzLl9zb3J0Q2hpbGRyZW4pZm9yKHM9dC5fc3RhcnRUaW1lO2kmJmkuX3N0YXJ0VGltZT5zOylpPWkuX3ByZXY7cmV0dXJuIGk/KHQuX25leHQ9aS5fbmV4dCxpLl9uZXh0PXQpOih0Ll9uZXh0PXRoaXMuX2ZpcnN0LHRoaXMuX2ZpcnN0PXQpLHQuX25leHQ/dC5fbmV4dC5fcHJldj10OnRoaXMuX2xhc3Q9dCx0Ll9wcmV2PWksdGhpcy5fdGltZWxpbmUmJnRoaXMuX3VuY2FjaGUoITApLHRoaXN9LHIuX3JlbW92ZT1mdW5jdGlvbih0LGUpe3JldHVybiB0LnRpbWVsaW5lPT09dGhpcyYmKGV8fHQuX2VuYWJsZWQoITEsITApLHQuX3ByZXY/dC5fcHJldi5fbmV4dD10Ll9uZXh0OnRoaXMuX2ZpcnN0PT09dCYmKHRoaXMuX2ZpcnN0PXQuX25leHQpLHQuX25leHQ/dC5fbmV4dC5fcHJldj10Ll9wcmV2OnRoaXMuX2xhc3Q9PT10JiYodGhpcy5fbGFzdD10Ll9wcmV2KSx0Ll9uZXh0PXQuX3ByZXY9dC50aW1lbGluZT1udWxsLHRoaXMuX3RpbWVsaW5lJiZ0aGlzLl91bmNhY2hlKCEwKSksdGhpc30sci5yZW5kZXI9ZnVuY3Rpb24odCxlLGkpe3ZhciBzLG49dGhpcy5fZmlyc3Q7Zm9yKHRoaXMuX3RvdGFsVGltZT10aGlzLl90aW1lPXRoaXMuX3Jhd1ByZXZUaW1lPXQ7bjspcz1uLl9uZXh0LChuLl9hY3RpdmV8fHQ+PW4uX3N0YXJ0VGltZSYmIW4uX3BhdXNlZCkmJihuLl9yZXZlcnNlZD9uLnJlbmRlcigobi5fZGlydHk/bi50b3RhbER1cmF0aW9uKCk6bi5fdG90YWxEdXJhdGlvbiktKHQtbi5fc3RhcnRUaW1lKSpuLl90aW1lU2NhbGUsZSxpKTpuLnJlbmRlcigodC1uLl9zdGFydFRpbWUpKm4uX3RpbWVTY2FsZSxlLGkpKSxuPXN9LHIucmF3VGltZT1mdW5jdGlvbigpe3JldHVybiBvfHxhLndha2UoKSx0aGlzLl90b3RhbFRpbWV9O3ZhciBJPXYoXCJUd2VlbkxpdGVcIixmdW5jdGlvbihlLGkscyl7aWYoQy5jYWxsKHRoaXMsaSxzKSx0aGlzLnJlbmRlcj1JLnByb3RvdHlwZS5yZW5kZXIsbnVsbD09ZSl0aHJvd1wiQ2Fubm90IHR3ZWVuIGEgbnVsbCB0YXJnZXQuXCI7dGhpcy50YXJnZXQ9ZT1cInN0cmluZ1wiIT10eXBlb2YgZT9lOkkuc2VsZWN0b3IoZSl8fGU7dmFyIG4scixhLG89ZS5qcXVlcnl8fGUubGVuZ3RoJiZlIT09dCYmZVswXSYmKGVbMF09PT10fHxlWzBdLm5vZGVUeXBlJiZlWzBdLnN0eWxlJiYhZS5ub2RlVHlwZSksbD10aGlzLnZhcnMub3ZlcndyaXRlO2lmKHRoaXMuX292ZXJ3cml0ZT1sPW51bGw9PWw/UVtJLmRlZmF1bHRPdmVyd3JpdGVdOlwibnVtYmVyXCI9PXR5cGVvZiBsP2w+PjA6UVtsXSwob3x8ZSBpbnN0YW5jZW9mIEFycmF5fHxlLnB1c2gmJm0oZSkpJiZcIm51bWJlclwiIT10eXBlb2YgZVswXSlmb3IodGhpcy5fdGFyZ2V0cz1hPXUoZSksdGhpcy5fcHJvcExvb2t1cD1bXSx0aGlzLl9zaWJsaW5ncz1bXSxuPTA7YS5sZW5ndGg+bjtuKyspcj1hW25dLHI/XCJzdHJpbmdcIiE9dHlwZW9mIHI/ci5sZW5ndGgmJnIhPT10JiZyWzBdJiYoclswXT09PXR8fHJbMF0ubm9kZVR5cGUmJnJbMF0uc3R5bGUmJiFyLm5vZGVUeXBlKT8oYS5zcGxpY2Uobi0tLDEpLHRoaXMuX3RhcmdldHM9YT1hLmNvbmNhdCh1KHIpKSk6KHRoaXMuX3NpYmxpbmdzW25dPSQocix0aGlzLCExKSwxPT09bCYmdGhpcy5fc2libGluZ3Nbbl0ubGVuZ3RoPjEmJksocix0aGlzLG51bGwsMSx0aGlzLl9zaWJsaW5nc1tuXSkpOihyPWFbbi0tXT1JLnNlbGVjdG9yKHIpLFwic3RyaW5nXCI9PXR5cGVvZiByJiZhLnNwbGljZShuKzEsMSkpOmEuc3BsaWNlKG4tLSwxKTtlbHNlIHRoaXMuX3Byb3BMb29rdXA9e30sdGhpcy5fc2libGluZ3M9JChlLHRoaXMsITEpLDE9PT1sJiZ0aGlzLl9zaWJsaW5ncy5sZW5ndGg+MSYmSyhlLHRoaXMsbnVsbCwxLHRoaXMuX3NpYmxpbmdzKTsodGhpcy52YXJzLmltbWVkaWF0ZVJlbmRlcnx8MD09PWkmJjA9PT10aGlzLl9kZWxheSYmdGhpcy52YXJzLmltbWVkaWF0ZVJlbmRlciE9PSExKSYmKHRoaXMuX3RpbWU9LV8sdGhpcy5yZW5kZXIoLXRoaXMuX2RlbGF5KSl9LCEwKSxFPWZ1bmN0aW9uKGUpe3JldHVybiBlLmxlbmd0aCYmZSE9PXQmJmVbMF0mJihlWzBdPT09dHx8ZVswXS5ub2RlVHlwZSYmZVswXS5zdHlsZSYmIWUubm9kZVR5cGUpfSx6PWZ1bmN0aW9uKHQsZSl7dmFyIGkscz17fTtmb3IoaSBpbiB0KUdbaV18fGkgaW4gZSYmXCJ0cmFuc2Zvcm1cIiE9PWkmJlwieFwiIT09aSYmXCJ5XCIhPT1pJiZcIndpZHRoXCIhPT1pJiZcImhlaWdodFwiIT09aSYmXCJjbGFzc05hbWVcIiE9PWkmJlwiYm9yZGVyXCIhPT1pfHwhKCFVW2ldfHxVW2ldJiZVW2ldLl9hdXRvQ1NTKXx8KHNbaV09dFtpXSxkZWxldGUgdFtpXSk7dC5jc3M9c307cj1JLnByb3RvdHlwZT1uZXcgQyxyLmNvbnN0cnVjdG9yPUksci5raWxsKCkuX2djPSExLHIucmF0aW89MCxyLl9maXJzdFBUPXIuX3RhcmdldHM9ci5fb3ZlcndyaXR0ZW5Qcm9wcz1yLl9zdGFydEF0PW51bGwsci5fbm90aWZ5UGx1Z2luc09mRW5hYmxlZD1yLl9sYXp5PSExLEkudmVyc2lvbj1cIjEuMTMuMVwiLEkuZGVmYXVsdEVhc2U9ci5fZWFzZT1uZXcgeShudWxsLG51bGwsMSwxKSxJLmRlZmF1bHRPdmVyd3JpdGU9XCJhdXRvXCIsSS50aWNrZXI9YSxJLmF1dG9TbGVlcD0hMCxJLmxhZ1Ntb290aGluZz1mdW5jdGlvbih0LGUpe2EubGFnU21vb3RoaW5nKHQsZSl9LEkuc2VsZWN0b3I9dC4kfHx0LmpRdWVyeXx8ZnVuY3Rpb24oZSl7dmFyIGk9dC4kfHx0LmpRdWVyeTtyZXR1cm4gaT8oSS5zZWxlY3Rvcj1pLGkoZSkpOlwidW5kZWZpbmVkXCI9PXR5cGVvZiBkb2N1bWVudD9lOmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGw/ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlKTpkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIiNcIj09PWUuY2hhckF0KDApP2Uuc3Vic3RyKDEpOmUpfTt2YXIgTz1bXSxMPXt9LE49SS5faW50ZXJuYWxzPXtpc0FycmF5Om0saXNTZWxlY3RvcjpFLGxhenlUd2VlbnM6T30sVT1JLl9wbHVnaW5zPXt9LEY9Ti50d2Vlbkxvb2t1cD17fSxqPTAsRz1OLnJlc2VydmVkUHJvcHM9e2Vhc2U6MSxkZWxheToxLG92ZXJ3cml0ZToxLG9uQ29tcGxldGU6MSxvbkNvbXBsZXRlUGFyYW1zOjEsb25Db21wbGV0ZVNjb3BlOjEsdXNlRnJhbWVzOjEscnVuQmFja3dhcmRzOjEsc3RhcnRBdDoxLG9uVXBkYXRlOjEsb25VcGRhdGVQYXJhbXM6MSxvblVwZGF0ZVNjb3BlOjEsb25TdGFydDoxLG9uU3RhcnRQYXJhbXM6MSxvblN0YXJ0U2NvcGU6MSxvblJldmVyc2VDb21wbGV0ZToxLG9uUmV2ZXJzZUNvbXBsZXRlUGFyYW1zOjEsb25SZXZlcnNlQ29tcGxldGVTY29wZToxLG9uUmVwZWF0OjEsb25SZXBlYXRQYXJhbXM6MSxvblJlcGVhdFNjb3BlOjEsZWFzZVBhcmFtczoxLHlveW86MSxpbW1lZGlhdGVSZW5kZXI6MSxyZXBlYXQ6MSxyZXBlYXREZWxheToxLGRhdGE6MSxwYXVzZWQ6MSxyZXZlcnNlZDoxLGF1dG9DU1M6MSxsYXp5OjF9LFE9e25vbmU6MCxhbGw6MSxhdXRvOjIsY29uY3VycmVudDozLGFsbE9uU3RhcnQ6NCxwcmVleGlzdGluZzo1LFwidHJ1ZVwiOjEsXCJmYWxzZVwiOjB9LHE9Qy5fcm9vdEZyYW1lc1RpbWVsaW5lPW5ldyBELEI9Qy5fcm9vdFRpbWVsaW5lPW5ldyBELE09Ti5sYXp5UmVuZGVyPWZ1bmN0aW9uKCl7dmFyIHQ9Ty5sZW5ndGg7Zm9yKEw9e307LS10Pi0xOylzPU9bdF0scyYmcy5fbGF6eSE9PSExJiYocy5yZW5kZXIocy5fbGF6eSwhMSwhMCkscy5fbGF6eT0hMSk7Ty5sZW5ndGg9MH07Qi5fc3RhcnRUaW1lPWEudGltZSxxLl9zdGFydFRpbWU9YS5mcmFtZSxCLl9hY3RpdmU9cS5fYWN0aXZlPSEwLHNldFRpbWVvdXQoTSwxKSxDLl91cGRhdGVSb290PUkucmVuZGVyPWZ1bmN0aW9uKCl7dmFyIHQsZSxpO2lmKE8ubGVuZ3RoJiZNKCksQi5yZW5kZXIoKGEudGltZS1CLl9zdGFydFRpbWUpKkIuX3RpbWVTY2FsZSwhMSwhMSkscS5yZW5kZXIoKGEuZnJhbWUtcS5fc3RhcnRUaW1lKSpxLl90aW1lU2NhbGUsITEsITEpLE8ubGVuZ3RoJiZNKCksIShhLmZyYW1lJTEyMCkpe2ZvcihpIGluIEYpe2ZvcihlPUZbaV0udHdlZW5zLHQ9ZS5sZW5ndGg7LS10Pi0xOyllW3RdLl9nYyYmZS5zcGxpY2UodCwxKTswPT09ZS5sZW5ndGgmJmRlbGV0ZSBGW2ldfWlmKGk9Qi5fZmlyc3QsKCFpfHxpLl9wYXVzZWQpJiZJLmF1dG9TbGVlcCYmIXEuX2ZpcnN0JiYxPT09YS5fbGlzdGVuZXJzLnRpY2subGVuZ3RoKXtmb3IoO2kmJmkuX3BhdXNlZDspaT1pLl9uZXh0O2l8fGEuc2xlZXAoKX19fSxhLmFkZEV2ZW50TGlzdGVuZXIoXCJ0aWNrXCIsQy5fdXBkYXRlUm9vdCk7dmFyICQ9ZnVuY3Rpb24odCxlLGkpe3ZhciBzLG4scj10Ll9nc1R3ZWVuSUQ7aWYoRltyfHwodC5fZ3NUd2VlbklEPXI9XCJ0XCIraisrKV18fChGW3JdPXt0YXJnZXQ6dCx0d2VlbnM6W119KSxlJiYocz1GW3JdLnR3ZWVucyxzW249cy5sZW5ndGhdPWUsaSkpZm9yKDstLW4+LTE7KXNbbl09PT1lJiZzLnNwbGljZShuLDEpO3JldHVybiBGW3JdLnR3ZWVuc30sSz1mdW5jdGlvbih0LGUsaSxzLG4pe3ZhciByLGEsbyxsO2lmKDE9PT1zfHxzPj00KXtmb3IobD1uLmxlbmd0aCxyPTA7bD5yO3IrKylpZigobz1uW3JdKSE9PWUpby5fZ2N8fG8uX2VuYWJsZWQoITEsITEpJiYoYT0hMCk7ZWxzZSBpZig1PT09cylicmVhaztyZXR1cm4gYX12YXIgaCx1PWUuX3N0YXJ0VGltZStfLGY9W10sbT0wLHA9MD09PWUuX2R1cmF0aW9uO2ZvcihyPW4ubGVuZ3RoOy0tcj4tMTspKG89bltyXSk9PT1lfHxvLl9nY3x8by5fcGF1c2VkfHwoby5fdGltZWxpbmUhPT1lLl90aW1lbGluZT8oaD1ofHxIKGUsMCxwKSwwPT09SChvLGgscCkmJihmW20rK109bykpOnU+PW8uX3N0YXJ0VGltZSYmby5fc3RhcnRUaW1lK28udG90YWxEdXJhdGlvbigpL28uX3RpbWVTY2FsZT51JiYoKHB8fCFvLl9pbml0dGVkKSYmMmUtMTA+PXUtby5fc3RhcnRUaW1lfHwoZlttKytdPW8pKSk7Zm9yKHI9bTstLXI+LTE7KW89ZltyXSwyPT09cyYmby5fa2lsbChpLHQpJiYoYT0hMCksKDIhPT1zfHwhby5fZmlyc3RQVCYmby5faW5pdHRlZCkmJm8uX2VuYWJsZWQoITEsITEpJiYoYT0hMCk7cmV0dXJuIGF9LEg9ZnVuY3Rpb24odCxlLGkpe2Zvcih2YXIgcz10Ll90aW1lbGluZSxuPXMuX3RpbWVTY2FsZSxyPXQuX3N0YXJ0VGltZTtzLl90aW1lbGluZTspe2lmKHIrPXMuX3N0YXJ0VGltZSxuKj1zLl90aW1lU2NhbGUscy5fcGF1c2VkKXJldHVybi0xMDA7cz1zLl90aW1lbGluZX1yZXR1cm4gci89bixyPmU/ci1lOmkmJnI9PT1lfHwhdC5faW5pdHRlZCYmMipfPnItZT9fOihyKz10LnRvdGFsRHVyYXRpb24oKS90Ll90aW1lU2NhbGUvbik+ZStfPzA6ci1lLV99O3IuX2luaXQ9ZnVuY3Rpb24oKXt2YXIgdCxlLGkscyxuLHI9dGhpcy52YXJzLGE9dGhpcy5fb3ZlcndyaXR0ZW5Qcm9wcyxvPXRoaXMuX2R1cmF0aW9uLGw9ISFyLmltbWVkaWF0ZVJlbmRlcixoPXIuZWFzZTtpZihyLnN0YXJ0QXQpe3RoaXMuX3N0YXJ0QXQmJih0aGlzLl9zdGFydEF0LnJlbmRlcigtMSwhMCksdGhpcy5fc3RhcnRBdC5raWxsKCkpLG49e307Zm9yKHMgaW4gci5zdGFydEF0KW5bc109ci5zdGFydEF0W3NdO2lmKG4ub3ZlcndyaXRlPSExLG4uaW1tZWRpYXRlUmVuZGVyPSEwLG4ubGF6eT1sJiZyLmxhenkhPT0hMSxuLnN0YXJ0QXQ9bi5kZWxheT1udWxsLHRoaXMuX3N0YXJ0QXQ9SS50byh0aGlzLnRhcmdldCwwLG4pLGwpaWYodGhpcy5fdGltZT4wKXRoaXMuX3N0YXJ0QXQ9bnVsbDtlbHNlIGlmKDAhPT1vKXJldHVybn1lbHNlIGlmKHIucnVuQmFja3dhcmRzJiYwIT09bylpZih0aGlzLl9zdGFydEF0KXRoaXMuX3N0YXJ0QXQucmVuZGVyKC0xLCEwKSx0aGlzLl9zdGFydEF0LmtpbGwoKSx0aGlzLl9zdGFydEF0PW51bGw7ZWxzZXtpPXt9O2ZvcihzIGluIHIpR1tzXSYmXCJhdXRvQ1NTXCIhPT1zfHwoaVtzXT1yW3NdKTtpZihpLm92ZXJ3cml0ZT0wLGkuZGF0YT1cImlzRnJvbVN0YXJ0XCIsaS5sYXp5PWwmJnIubGF6eSE9PSExLGkuaW1tZWRpYXRlUmVuZGVyPWwsdGhpcy5fc3RhcnRBdD1JLnRvKHRoaXMudGFyZ2V0LDAsaSksbCl7aWYoMD09PXRoaXMuX3RpbWUpcmV0dXJufWVsc2UgdGhpcy5fc3RhcnRBdC5faW5pdCgpLHRoaXMuX3N0YXJ0QXQuX2VuYWJsZWQoITEpfWlmKHRoaXMuX2Vhc2U9aD1oP2ggaW5zdGFuY2VvZiB5P2g6XCJmdW5jdGlvblwiPT10eXBlb2YgaD9uZXcgeShoLHIuZWFzZVBhcmFtcyk6d1toXXx8SS5kZWZhdWx0RWFzZTpJLmRlZmF1bHRFYXNlLHIuZWFzZVBhcmFtcyBpbnN0YW5jZW9mIEFycmF5JiZoLmNvbmZpZyYmKHRoaXMuX2Vhc2U9aC5jb25maWcuYXBwbHkoaCxyLmVhc2VQYXJhbXMpKSx0aGlzLl9lYXNlVHlwZT10aGlzLl9lYXNlLl90eXBlLHRoaXMuX2Vhc2VQb3dlcj10aGlzLl9lYXNlLl9wb3dlcix0aGlzLl9maXJzdFBUPW51bGwsdGhpcy5fdGFyZ2V0cylmb3IodD10aGlzLl90YXJnZXRzLmxlbmd0aDstLXQ+LTE7KXRoaXMuX2luaXRQcm9wcyh0aGlzLl90YXJnZXRzW3RdLHRoaXMuX3Byb3BMb29rdXBbdF09e30sdGhpcy5fc2libGluZ3NbdF0sYT9hW3RdOm51bGwpJiYoZT0hMCk7ZWxzZSBlPXRoaXMuX2luaXRQcm9wcyh0aGlzLnRhcmdldCx0aGlzLl9wcm9wTG9va3VwLHRoaXMuX3NpYmxpbmdzLGEpO2lmKGUmJkkuX29uUGx1Z2luRXZlbnQoXCJfb25Jbml0QWxsUHJvcHNcIix0aGlzKSxhJiYodGhpcy5fZmlyc3RQVHx8XCJmdW5jdGlvblwiIT10eXBlb2YgdGhpcy50YXJnZXQmJnRoaXMuX2VuYWJsZWQoITEsITEpKSxyLnJ1bkJhY2t3YXJkcylmb3IoaT10aGlzLl9maXJzdFBUO2k7KWkucys9aS5jLGkuYz0taS5jLGk9aS5fbmV4dDt0aGlzLl9vblVwZGF0ZT1yLm9uVXBkYXRlLHRoaXMuX2luaXR0ZWQ9ITB9LHIuX2luaXRQcm9wcz1mdW5jdGlvbihlLGkscyxuKXt2YXIgcixhLG8sbCxoLF87aWYobnVsbD09ZSlyZXR1cm4hMTtMW2UuX2dzVHdlZW5JRF0mJk0oKSx0aGlzLnZhcnMuY3NzfHxlLnN0eWxlJiZlIT09dCYmZS5ub2RlVHlwZSYmVS5jc3MmJnRoaXMudmFycy5hdXRvQ1NTIT09ITEmJnoodGhpcy52YXJzLGUpO2ZvcihyIGluIHRoaXMudmFycyl7aWYoXz10aGlzLnZhcnNbcl0sR1tyXSlfJiYoXyBpbnN0YW5jZW9mIEFycmF5fHxfLnB1c2gmJm0oXykpJiYtMSE9PV8uam9pbihcIlwiKS5pbmRleE9mKFwie3NlbGZ9XCIpJiYodGhpcy52YXJzW3JdPV89dGhpcy5fc3dhcFNlbGZJblBhcmFtcyhfLHRoaXMpKTtlbHNlIGlmKFVbcl0mJihsPW5ldyBVW3JdKS5fb25Jbml0VHdlZW4oZSx0aGlzLnZhcnNbcl0sdGhpcykpe2Zvcih0aGlzLl9maXJzdFBUPWg9e19uZXh0OnRoaXMuX2ZpcnN0UFQsdDpsLHA6XCJzZXRSYXRpb1wiLHM6MCxjOjEsZjohMCxuOnIscGc6ITAscHI6bC5fcHJpb3JpdHl9LGE9bC5fb3ZlcndyaXRlUHJvcHMubGVuZ3RoOy0tYT4tMTspaVtsLl9vdmVyd3JpdGVQcm9wc1thXV09dGhpcy5fZmlyc3RQVDsobC5fcHJpb3JpdHl8fGwuX29uSW5pdEFsbFByb3BzKSYmKG89ITApLChsLl9vbkRpc2FibGV8fGwuX29uRW5hYmxlKSYmKHRoaXMuX25vdGlmeVBsdWdpbnNPZkVuYWJsZWQ9ITApfWVsc2UgdGhpcy5fZmlyc3RQVD1pW3JdPWg9e19uZXh0OnRoaXMuX2ZpcnN0UFQsdDplLHA6cixmOlwiZnVuY3Rpb25cIj09dHlwZW9mIGVbcl0sbjpyLHBnOiExLHByOjB9LGgucz1oLmY/ZVtyLmluZGV4T2YoXCJzZXRcIil8fFwiZnVuY3Rpb25cIiE9dHlwZW9mIGVbXCJnZXRcIityLnN1YnN0cigzKV0/cjpcImdldFwiK3Iuc3Vic3RyKDMpXSgpOnBhcnNlRmxvYXQoZVtyXSksaC5jPVwic3RyaW5nXCI9PXR5cGVvZiBfJiZcIj1cIj09PV8uY2hhckF0KDEpP3BhcnNlSW50KF8uY2hhckF0KDApK1wiMVwiLDEwKSpOdW1iZXIoXy5zdWJzdHIoMikpOk51bWJlcihfKS1oLnN8fDA7aCYmaC5fbmV4dCYmKGguX25leHQuX3ByZXY9aCl9cmV0dXJuIG4mJnRoaXMuX2tpbGwobixlKT90aGlzLl9pbml0UHJvcHMoZSxpLHMsbik6dGhpcy5fb3ZlcndyaXRlPjEmJnRoaXMuX2ZpcnN0UFQmJnMubGVuZ3RoPjEmJksoZSx0aGlzLGksdGhpcy5fb3ZlcndyaXRlLHMpPyh0aGlzLl9raWxsKGksZSksdGhpcy5faW5pdFByb3BzKGUsaSxzLG4pKToodGhpcy5fZmlyc3RQVCYmKHRoaXMudmFycy5sYXp5IT09ITEmJnRoaXMuX2R1cmF0aW9ufHx0aGlzLnZhcnMubGF6eSYmIXRoaXMuX2R1cmF0aW9uKSYmKExbZS5fZ3NUd2VlbklEXT0hMCksbyl9LHIucmVuZGVyPWZ1bmN0aW9uKHQsZSxpKXt2YXIgcyxuLHIsYSxvPXRoaXMuX3RpbWUsbD10aGlzLl9kdXJhdGlvbixoPXRoaXMuX3Jhd1ByZXZUaW1lO2lmKHQ+PWwpdGhpcy5fdG90YWxUaW1lPXRoaXMuX3RpbWU9bCx0aGlzLnJhdGlvPXRoaXMuX2Vhc2UuX2NhbGNFbmQ/dGhpcy5fZWFzZS5nZXRSYXRpbygxKToxLHRoaXMuX3JldmVyc2VkfHwocz0hMCxuPVwib25Db21wbGV0ZVwiKSwwPT09bCYmKHRoaXMuX2luaXR0ZWR8fCF0aGlzLnZhcnMubGF6eXx8aSkmJih0aGlzLl9zdGFydFRpbWU9PT10aGlzLl90aW1lbGluZS5fZHVyYXRpb24mJih0PTApLCgwPT09dHx8MD5ofHxoPT09XykmJmghPT10JiYoaT0hMCxoPl8mJihuPVwib25SZXZlcnNlQ29tcGxldGVcIikpLHRoaXMuX3Jhd1ByZXZUaW1lPWE9IWV8fHR8fGg9PT10P3Q6Xyk7ZWxzZSBpZigxZS03PnQpdGhpcy5fdG90YWxUaW1lPXRoaXMuX3RpbWU9MCx0aGlzLnJhdGlvPXRoaXMuX2Vhc2UuX2NhbGNFbmQ/dGhpcy5fZWFzZS5nZXRSYXRpbygwKTowLCgwIT09b3x8MD09PWwmJmg+MCYmaCE9PV8pJiYobj1cIm9uUmV2ZXJzZUNvbXBsZXRlXCIscz10aGlzLl9yZXZlcnNlZCksMD50Pyh0aGlzLl9hY3RpdmU9ITEsMD09PWwmJih0aGlzLl9pbml0dGVkfHwhdGhpcy52YXJzLmxhenl8fGkpJiYoaD49MCYmKGk9ITApLHRoaXMuX3Jhd1ByZXZUaW1lPWE9IWV8fHR8fGg9PT10P3Q6XykpOnRoaXMuX2luaXR0ZWR8fChpPSEwKTtlbHNlIGlmKHRoaXMuX3RvdGFsVGltZT10aGlzLl90aW1lPXQsdGhpcy5fZWFzZVR5cGUpe3ZhciB1PXQvbCxmPXRoaXMuX2Vhc2VUeXBlLG09dGhpcy5fZWFzZVBvd2VyOygxPT09Znx8Mz09PWYmJnU+PS41KSYmKHU9MS11KSwzPT09ZiYmKHUqPTIpLDE9PT1tP3UqPXU6Mj09PW0/dSo9dSp1OjM9PT1tP3UqPXUqdSp1OjQ9PT1tJiYodSo9dSp1KnUqdSksdGhpcy5yYXRpbz0xPT09Zj8xLXU6Mj09PWY/dTouNT50L2w/dS8yOjEtdS8yfWVsc2UgdGhpcy5yYXRpbz10aGlzLl9lYXNlLmdldFJhdGlvKHQvbCk7aWYodGhpcy5fdGltZSE9PW98fGkpe2lmKCF0aGlzLl9pbml0dGVkKXtpZih0aGlzLl9pbml0KCksIXRoaXMuX2luaXR0ZWR8fHRoaXMuX2djKXJldHVybjtpZighaSYmdGhpcy5fZmlyc3RQVCYmKHRoaXMudmFycy5sYXp5IT09ITEmJnRoaXMuX2R1cmF0aW9ufHx0aGlzLnZhcnMubGF6eSYmIXRoaXMuX2R1cmF0aW9uKSlyZXR1cm4gdGhpcy5fdGltZT10aGlzLl90b3RhbFRpbWU9byx0aGlzLl9yYXdQcmV2VGltZT1oLE8ucHVzaCh0aGlzKSx0aGlzLl9sYXp5PXQsdm9pZCAwO3RoaXMuX3RpbWUmJiFzP3RoaXMucmF0aW89dGhpcy5fZWFzZS5nZXRSYXRpbyh0aGlzLl90aW1lL2wpOnMmJnRoaXMuX2Vhc2UuX2NhbGNFbmQmJih0aGlzLnJhdGlvPXRoaXMuX2Vhc2UuZ2V0UmF0aW8oMD09PXRoaXMuX3RpbWU/MDoxKSl9Zm9yKHRoaXMuX2xhenkhPT0hMSYmKHRoaXMuX2xhenk9ITEpLHRoaXMuX2FjdGl2ZXx8IXRoaXMuX3BhdXNlZCYmdGhpcy5fdGltZSE9PW8mJnQ+PTAmJih0aGlzLl9hY3RpdmU9ITApLDA9PT1vJiYodGhpcy5fc3RhcnRBdCYmKHQ+PTA/dGhpcy5fc3RhcnRBdC5yZW5kZXIodCxlLGkpOm58fChuPVwiX2R1bW15R1NcIikpLHRoaXMudmFycy5vblN0YXJ0JiYoMCE9PXRoaXMuX3RpbWV8fDA9PT1sKSYmKGV8fHRoaXMudmFycy5vblN0YXJ0LmFwcGx5KHRoaXMudmFycy5vblN0YXJ0U2NvcGV8fHRoaXMsdGhpcy52YXJzLm9uU3RhcnRQYXJhbXN8fFQpKSkscj10aGlzLl9maXJzdFBUO3I7KXIuZj9yLnRbci5wXShyLmMqdGhpcy5yYXRpbytyLnMpOnIudFtyLnBdPXIuYyp0aGlzLnJhdGlvK3IucyxyPXIuX25leHQ7dGhpcy5fb25VcGRhdGUmJigwPnQmJnRoaXMuX3N0YXJ0QXQmJnRoaXMuX3N0YXJ0VGltZSYmdGhpcy5fc3RhcnRBdC5yZW5kZXIodCxlLGkpLGV8fCh0aGlzLl90aW1lIT09b3x8cykmJnRoaXMuX29uVXBkYXRlLmFwcGx5KHRoaXMudmFycy5vblVwZGF0ZVNjb3BlfHx0aGlzLHRoaXMudmFycy5vblVwZGF0ZVBhcmFtc3x8VCkpLG4mJighdGhpcy5fZ2N8fGkpJiYoMD50JiZ0aGlzLl9zdGFydEF0JiYhdGhpcy5fb25VcGRhdGUmJnRoaXMuX3N0YXJ0VGltZSYmdGhpcy5fc3RhcnRBdC5yZW5kZXIodCxlLGkpLHMmJih0aGlzLl90aW1lbGluZS5hdXRvUmVtb3ZlQ2hpbGRyZW4mJnRoaXMuX2VuYWJsZWQoITEsITEpLHRoaXMuX2FjdGl2ZT0hMSksIWUmJnRoaXMudmFyc1tuXSYmdGhpcy52YXJzW25dLmFwcGx5KHRoaXMudmFyc1tuK1wiU2NvcGVcIl18fHRoaXMsdGhpcy52YXJzW24rXCJQYXJhbXNcIl18fFQpLDA9PT1sJiZ0aGlzLl9yYXdQcmV2VGltZT09PV8mJmEhPT1fJiYodGhpcy5fcmF3UHJldlRpbWU9MCkpfX0sci5fa2lsbD1mdW5jdGlvbih0LGUpe2lmKFwiYWxsXCI9PT10JiYodD1udWxsKSxudWxsPT10JiYobnVsbD09ZXx8ZT09PXRoaXMudGFyZ2V0KSlyZXR1cm4gdGhpcy5fbGF6eT0hMSx0aGlzLl9lbmFibGVkKCExLCExKTtlPVwic3RyaW5nXCIhPXR5cGVvZiBlP2V8fHRoaXMuX3RhcmdldHN8fHRoaXMudGFyZ2V0Okkuc2VsZWN0b3IoZSl8fGU7dmFyIGkscyxuLHIsYSxvLGwsaDtpZigobShlKXx8RShlKSkmJlwibnVtYmVyXCIhPXR5cGVvZiBlWzBdKWZvcihpPWUubGVuZ3RoOy0taT4tMTspdGhpcy5fa2lsbCh0LGVbaV0pJiYobz0hMCk7ZWxzZXtpZih0aGlzLl90YXJnZXRzKXtmb3IoaT10aGlzLl90YXJnZXRzLmxlbmd0aDstLWk+LTE7KWlmKGU9PT10aGlzLl90YXJnZXRzW2ldKXthPXRoaXMuX3Byb3BMb29rdXBbaV18fHt9LHRoaXMuX292ZXJ3cml0dGVuUHJvcHM9dGhpcy5fb3ZlcndyaXR0ZW5Qcm9wc3x8W10scz10aGlzLl9vdmVyd3JpdHRlblByb3BzW2ldPXQ/dGhpcy5fb3ZlcndyaXR0ZW5Qcm9wc1tpXXx8e306XCJhbGxcIjticmVha319ZWxzZXtpZihlIT09dGhpcy50YXJnZXQpcmV0dXJuITE7YT10aGlzLl9wcm9wTG9va3VwLHM9dGhpcy5fb3ZlcndyaXR0ZW5Qcm9wcz10P3RoaXMuX292ZXJ3cml0dGVuUHJvcHN8fHt9OlwiYWxsXCJ9aWYoYSl7bD10fHxhLGg9dCE9PXMmJlwiYWxsXCIhPT1zJiZ0IT09YSYmKFwib2JqZWN0XCIhPXR5cGVvZiB0fHwhdC5fdGVtcEtpbGwpO2ZvcihuIGluIGwpKHI9YVtuXSkmJihyLnBnJiZyLnQuX2tpbGwobCkmJihvPSEwKSxyLnBnJiYwIT09ci50Ll9vdmVyd3JpdGVQcm9wcy5sZW5ndGh8fChyLl9wcmV2P3IuX3ByZXYuX25leHQ9ci5fbmV4dDpyPT09dGhpcy5fZmlyc3RQVCYmKHRoaXMuX2ZpcnN0UFQ9ci5fbmV4dCksci5fbmV4dCYmKHIuX25leHQuX3ByZXY9ci5fcHJldiksci5fbmV4dD1yLl9wcmV2PW51bGwpLGRlbGV0ZSBhW25dKSxoJiYoc1tuXT0xKTshdGhpcy5fZmlyc3RQVCYmdGhpcy5faW5pdHRlZCYmdGhpcy5fZW5hYmxlZCghMSwhMSl9fXJldHVybiBvfSxyLmludmFsaWRhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fbm90aWZ5UGx1Z2luc09mRW5hYmxlZCYmSS5fb25QbHVnaW5FdmVudChcIl9vbkRpc2FibGVcIix0aGlzKSx0aGlzLl9maXJzdFBUPW51bGwsdGhpcy5fb3ZlcndyaXR0ZW5Qcm9wcz1udWxsLHRoaXMuX29uVXBkYXRlPW51bGwsdGhpcy5fc3RhcnRBdD1udWxsLHRoaXMuX2luaXR0ZWQ9dGhpcy5fYWN0aXZlPXRoaXMuX25vdGlmeVBsdWdpbnNPZkVuYWJsZWQ9dGhpcy5fbGF6eT0hMSx0aGlzLl9wcm9wTG9va3VwPXRoaXMuX3RhcmdldHM/e306W10sdGhpc30sci5fZW5hYmxlZD1mdW5jdGlvbih0LGUpe2lmKG98fGEud2FrZSgpLHQmJnRoaXMuX2djKXt2YXIgaSxzPXRoaXMuX3RhcmdldHM7aWYocylmb3IoaT1zLmxlbmd0aDstLWk+LTE7KXRoaXMuX3NpYmxpbmdzW2ldPSQoc1tpXSx0aGlzLCEwKTtlbHNlIHRoaXMuX3NpYmxpbmdzPSQodGhpcy50YXJnZXQsdGhpcywhMCl9cmV0dXJuIEMucHJvdG90eXBlLl9lbmFibGVkLmNhbGwodGhpcyx0LGUpLHRoaXMuX25vdGlmeVBsdWdpbnNPZkVuYWJsZWQmJnRoaXMuX2ZpcnN0UFQ/SS5fb25QbHVnaW5FdmVudCh0P1wiX29uRW5hYmxlXCI6XCJfb25EaXNhYmxlXCIsdGhpcyk6ITF9LEkudG89ZnVuY3Rpb24odCxlLGkpe3JldHVybiBuZXcgSSh0LGUsaSl9LEkuZnJvbT1mdW5jdGlvbih0LGUsaSl7cmV0dXJuIGkucnVuQmFja3dhcmRzPSEwLGkuaW1tZWRpYXRlUmVuZGVyPTAhPWkuaW1tZWRpYXRlUmVuZGVyLG5ldyBJKHQsZSxpKX0sSS5mcm9tVG89ZnVuY3Rpb24odCxlLGkscyl7cmV0dXJuIHMuc3RhcnRBdD1pLHMuaW1tZWRpYXRlUmVuZGVyPTAhPXMuaW1tZWRpYXRlUmVuZGVyJiYwIT1pLmltbWVkaWF0ZVJlbmRlcixuZXcgSSh0LGUscyl9LEkuZGVsYXllZENhbGw9ZnVuY3Rpb24odCxlLGkscyxuKXtyZXR1cm4gbmV3IEkoZSwwLHtkZWxheTp0LG9uQ29tcGxldGU6ZSxvbkNvbXBsZXRlUGFyYW1zOmksb25Db21wbGV0ZVNjb3BlOnMsb25SZXZlcnNlQ29tcGxldGU6ZSxvblJldmVyc2VDb21wbGV0ZVBhcmFtczppLG9uUmV2ZXJzZUNvbXBsZXRlU2NvcGU6cyxpbW1lZGlhdGVSZW5kZXI6ITEsdXNlRnJhbWVzOm4sb3ZlcndyaXRlOjB9KX0sSS5zZXQ9ZnVuY3Rpb24odCxlKXtyZXR1cm4gbmV3IEkodCwwLGUpfSxJLmdldFR3ZWVuc09mPWZ1bmN0aW9uKHQsZSl7aWYobnVsbD09dClyZXR1cm5bXTt0PVwic3RyaW5nXCIhPXR5cGVvZiB0P3Q6SS5zZWxlY3Rvcih0KXx8dDt2YXIgaSxzLG4scjtpZigobSh0KXx8RSh0KSkmJlwibnVtYmVyXCIhPXR5cGVvZiB0WzBdKXtmb3IoaT10Lmxlbmd0aCxzPVtdOy0taT4tMTspcz1zLmNvbmNhdChJLmdldFR3ZWVuc09mKHRbaV0sZSkpO2ZvcihpPXMubGVuZ3RoOy0taT4tMTspZm9yKHI9c1tpXSxuPWk7LS1uPi0xOylyPT09c1tuXSYmcy5zcGxpY2UoaSwxKX1lbHNlIGZvcihzPSQodCkuY29uY2F0KCksaT1zLmxlbmd0aDstLWk+LTE7KShzW2ldLl9nY3x8ZSYmIXNbaV0uaXNBY3RpdmUoKSkmJnMuc3BsaWNlKGksMSk7cmV0dXJuIHN9LEkua2lsbFR3ZWVuc09mPUkua2lsbERlbGF5ZWRDYWxsc1RvPWZ1bmN0aW9uKHQsZSxpKXtcIm9iamVjdFwiPT10eXBlb2YgZSYmKGk9ZSxlPSExKTtmb3IodmFyIHM9SS5nZXRUd2VlbnNPZih0LGUpLG49cy5sZW5ndGg7LS1uPi0xOylzW25dLl9raWxsKGksdCl9O3ZhciBKPXYoXCJwbHVnaW5zLlR3ZWVuUGx1Z2luXCIsZnVuY3Rpb24odCxlKXt0aGlzLl9vdmVyd3JpdGVQcm9wcz0odHx8XCJcIikuc3BsaXQoXCIsXCIpLHRoaXMuX3Byb3BOYW1lPXRoaXMuX292ZXJ3cml0ZVByb3BzWzBdLHRoaXMuX3ByaW9yaXR5PWV8fDAsdGhpcy5fc3VwZXI9Si5wcm90b3R5cGV9LCEwKTtpZihyPUoucHJvdG90eXBlLEoudmVyc2lvbj1cIjEuMTAuMVwiLEouQVBJPTIsci5fZmlyc3RQVD1udWxsLHIuX2FkZFR3ZWVuPWZ1bmN0aW9uKHQsZSxpLHMsbixyKXt2YXIgYSxvO3JldHVybiBudWxsIT1zJiYoYT1cIm51bWJlclwiPT10eXBlb2Ygc3x8XCI9XCIhPT1zLmNoYXJBdCgxKT9OdW1iZXIocyktaTpwYXJzZUludChzLmNoYXJBdCgwKStcIjFcIiwxMCkqTnVtYmVyKHMuc3Vic3RyKDIpKSk/KHRoaXMuX2ZpcnN0UFQ9bz17X25leHQ6dGhpcy5fZmlyc3RQVCx0OnQscDplLHM6aSxjOmEsZjpcImZ1bmN0aW9uXCI9PXR5cGVvZiB0W2VdLG46bnx8ZSxyOnJ9LG8uX25leHQmJihvLl9uZXh0Ll9wcmV2PW8pLG8pOnZvaWQgMH0sci5zZXRSYXRpbz1mdW5jdGlvbih0KXtmb3IodmFyIGUsaT10aGlzLl9maXJzdFBULHM9MWUtNjtpOyllPWkuYyp0K2kucyxpLnI/ZT1NYXRoLnJvdW5kKGUpOnM+ZSYmZT4tcyYmKGU9MCksaS5mP2kudFtpLnBdKGUpOmkudFtpLnBdPWUsaT1pLl9uZXh0fSxyLl9raWxsPWZ1bmN0aW9uKHQpe3ZhciBlLGk9dGhpcy5fb3ZlcndyaXRlUHJvcHMscz10aGlzLl9maXJzdFBUO2lmKG51bGwhPXRbdGhpcy5fcHJvcE5hbWVdKXRoaXMuX292ZXJ3cml0ZVByb3BzPVtdO2Vsc2UgZm9yKGU9aS5sZW5ndGg7LS1lPi0xOyludWxsIT10W2lbZV1dJiZpLnNwbGljZShlLDEpO2Zvcig7czspbnVsbCE9dFtzLm5dJiYocy5fbmV4dCYmKHMuX25leHQuX3ByZXY9cy5fcHJldikscy5fcHJldj8ocy5fcHJldi5fbmV4dD1zLl9uZXh0LHMuX3ByZXY9bnVsbCk6dGhpcy5fZmlyc3RQVD09PXMmJih0aGlzLl9maXJzdFBUPXMuX25leHQpKSxzPXMuX25leHQ7cmV0dXJuITF9LHIuX3JvdW5kUHJvcHM9ZnVuY3Rpb24odCxlKXtmb3IodmFyIGk9dGhpcy5fZmlyc3RQVDtpOykodFt0aGlzLl9wcm9wTmFtZV18fG51bGwhPWkubiYmdFtpLm4uc3BsaXQodGhpcy5fcHJvcE5hbWUrXCJfXCIpLmpvaW4oXCJcIildKSYmKGkucj1lKSxpPWkuX25leHR9LEkuX29uUGx1Z2luRXZlbnQ9ZnVuY3Rpb24odCxlKXt2YXIgaSxzLG4scixhLG89ZS5fZmlyc3RQVDtpZihcIl9vbkluaXRBbGxQcm9wc1wiPT09dCl7Zm9yKDtvOyl7Zm9yKGE9by5fbmV4dCxzPW47cyYmcy5wcj5vLnByOylzPXMuX25leHQ7KG8uX3ByZXY9cz9zLl9wcmV2OnIpP28uX3ByZXYuX25leHQ9bzpuPW8sKG8uX25leHQ9cyk/cy5fcHJldj1vOnI9byxvPWF9bz1lLl9maXJzdFBUPW59Zm9yKDtvOylvLnBnJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBvLnRbdF0mJm8udFt0XSgpJiYoaT0hMCksbz1vLl9uZXh0O3JldHVybiBpfSxKLmFjdGl2YXRlPWZ1bmN0aW9uKHQpe2Zvcih2YXIgZT10Lmxlbmd0aDstLWU+LTE7KXRbZV0uQVBJPT09Si5BUEkmJihVWyhuZXcgdFtlXSkuX3Byb3BOYW1lXT10W2VdKTtyZXR1cm4hMH0sZC5wbHVnaW49ZnVuY3Rpb24odCl7aWYoISh0JiZ0LnByb3BOYW1lJiZ0LmluaXQmJnQuQVBJKSl0aHJvd1wiaWxsZWdhbCBwbHVnaW4gZGVmaW5pdGlvbi5cIjt2YXIgZSxpPXQucHJvcE5hbWUscz10LnByaW9yaXR5fHwwLG49dC5vdmVyd3JpdGVQcm9wcyxyPXtpbml0OlwiX29uSW5pdFR3ZWVuXCIsc2V0Olwic2V0UmF0aW9cIixraWxsOlwiX2tpbGxcIixyb3VuZDpcIl9yb3VuZFByb3BzXCIsaW5pdEFsbDpcIl9vbkluaXRBbGxQcm9wc1wifSxhPXYoXCJwbHVnaW5zLlwiK2kuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkraS5zdWJzdHIoMSkrXCJQbHVnaW5cIixmdW5jdGlvbigpe0ouY2FsbCh0aGlzLGkscyksdGhpcy5fb3ZlcndyaXRlUHJvcHM9bnx8W119LHQuZ2xvYmFsPT09ITApLG89YS5wcm90b3R5cGU9bmV3IEooaSk7by5jb25zdHJ1Y3Rvcj1hLGEuQVBJPXQuQVBJO2ZvcihlIGluIHIpXCJmdW5jdGlvblwiPT10eXBlb2YgdFtlXSYmKG9bcltlXV09dFtlXSk7cmV0dXJuIGEudmVyc2lvbj10LnZlcnNpb24sSi5hY3RpdmF0ZShbYV0pLGF9LHM9dC5fZ3NRdWV1ZSl7Zm9yKG49MDtzLmxlbmd0aD5uO24rKylzW25dKCk7Zm9yKHIgaW4gcClwW3JdLmZ1bmN8fHQuY29uc29sZS5sb2coXCJHU0FQIGVuY291bnRlcmVkIG1pc3NpbmcgZGVwZW5kZW5jeTogY29tLmdyZWVuc29jay5cIityKX1vPSExfX0pKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2dsb2JhbDp0aGlzfHx3aW5kb3csXCJUd2VlbkxpdGVcIik7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vYWxsL2pzL1R3ZWVuTGl0ZS5taW4uanMiLCIoZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgd2lkdGgsIGhlaWdodCwgbGFyZ2VIZWFkZXIsIGNhbnZhcywgY3R4LCBwb2ludHMsIHRhcmdldCwgYW5pbWF0ZUhlYWRlciA9IHRydWU7XG5cbiAgICAvLyBNYWluXG4gICAgaW5pdEhlYWRlcigpO1xuICAgIGluaXRBbmltYXRpb24oKTtcbiAgICBhZGRMaXN0ZW5lcnMoKTtcblxuICAgIGZ1bmN0aW9uIGluaXRIZWFkZXIoKSB7XG4gICAgICAgIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgdGFyZ2V0ID0ge3g6IHdpZHRoLzIsIHk6IGhlaWdodC8yfTtcblxuICAgICAgICBsYXJnZUhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsYXJnZS1oZWFkZXInKTtcbiAgICAgICAgbGFyZ2VIZWFkZXIuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0KydweCc7XG5cbiAgICAgICAgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbW8tY2FudmFzJyk7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICAvLyBjcmVhdGUgcG9pbnRzXG4gICAgICAgIHBvaW50cyA9IFtdO1xuICAgICAgICBmb3IodmFyIHggPSAwOyB4IDwgd2lkdGg7IHggPSB4ICsgd2lkdGgvMjApIHtcbiAgICAgICAgICAgIGZvcih2YXIgeSA9IDA7IHkgPCBoZWlnaHQ7IHkgPSB5ICsgaGVpZ2h0LzIwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHB4ID0geCArIE1hdGgucmFuZG9tKCkqd2lkdGgvMjA7XG4gICAgICAgICAgICAgICAgdmFyIHB5ID0geSArIE1hdGgucmFuZG9tKCkqaGVpZ2h0LzIwO1xuICAgICAgICAgICAgICAgIHZhciBwID0ge3g6IHB4LCBvcmlnaW5YOiBweCwgeTogcHksIG9yaWdpblk6IHB5IH07XG4gICAgICAgICAgICAgICAgcG9pbnRzLnB1c2gocCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmb3IgZWFjaCBwb2ludCBmaW5kIHRoZSA1IGNsb3Nlc3QgcG9pbnRzXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjbG9zZXN0ID0gW107XG4gICAgICAgICAgICB2YXIgcDEgPSBwb2ludHNbaV07XG4gICAgICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgcG9pbnRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHAyID0gcG9pbnRzW2pdXG4gICAgICAgICAgICAgICAgaWYoIShwMSA9PSBwMikpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBsYWNlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGsgPSAwOyBrIDwgNTsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZighcGxhY2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoY2xvc2VzdFtrXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VzdFtrXSA9IHAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgayA9IDA7IGsgPCA1OyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFwbGFjZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihnZXREaXN0YW5jZShwMSwgcDIpIDwgZ2V0RGlzdGFuY2UocDEsIGNsb3Nlc3Rba10pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb3Nlc3Rba10gPSBwMjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwMS5jbG9zZXN0ID0gY2xvc2VzdDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFzc2lnbiBhIGNpcmNsZSB0byBlYWNoIHBvaW50XG4gICAgICAgIGZvcih2YXIgaSBpbiBwb2ludHMpIHtcbiAgICAgICAgICAgIHZhciBjID0gbmV3IENpcmNsZShwb2ludHNbaV0sIDIrTWF0aC5yYW5kb20oKSoyLCAncmdiYSgyNTUsMjU1LDI1NSwwLjMpJyk7XG4gICAgICAgICAgICBwb2ludHNbaV0uY2lyY2xlID0gYztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEV2ZW50IGhhbmRsaW5nXG4gICAgZnVuY3Rpb24gYWRkTGlzdGVuZXJzKCkge1xuICAgICAgICBpZighKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykpIHtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3VzZU1vdmUpO1xuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBzY3JvbGxDaGVjayk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vdXNlTW92ZShlKSB7XG4gICAgICAgIHZhciBwb3N4ID0gcG9zeSA9IDA7XG4gICAgICAgIGlmIChlLnBhZ2VYIHx8IGUucGFnZVkpIHtcbiAgICAgICAgICAgIHBvc3ggPSBlLnBhZ2VYO1xuICAgICAgICAgICAgcG9zeSA9IGUucGFnZVk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZS5jbGllbnRYIHx8IGUuY2xpZW50WSkgICAge1xuICAgICAgICAgICAgcG9zeCA9IGUuY2xpZW50WCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgICAgICAgICAgcG9zeSA9IGUuY2xpZW50WSArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcbiAgICAgICAgfVxuICAgICAgICB0YXJnZXQueCA9IHBvc3g7XG4gICAgICAgIHRhcmdldC55ID0gcG9zeTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY3JvbGxDaGVjaygpIHtcbiAgICAgICAgaWYoZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPiBoZWlnaHQpIGFuaW1hdGVIZWFkZXIgPSBmYWxzZTtcbiAgICAgICAgZWxzZSBhbmltYXRlSGVhZGVyID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXNpemUoKSB7XG4gICAgICAgIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgbGFyZ2VIZWFkZXIuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0KydweCc7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIH1cblxuICAgIC8vIGFuaW1hdGlvblxuICAgIGZ1bmN0aW9uIGluaXRBbmltYXRpb24oKSB7XG4gICAgICAgIGFuaW1hdGUoKTtcbiAgICAgICAgZm9yKHZhciBpIGluIHBvaW50cykge1xuICAgICAgICAgICAgc2hpZnRQb2ludChwb2ludHNbaV0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYW5pbWF0ZSgpIHtcbiAgICAgICAgaWYoYW5pbWF0ZUhlYWRlcikge1xuICAgICAgICAgICAgY3R4LmNsZWFyUmVjdCgwLDAsd2lkdGgsaGVpZ2h0KTtcbiAgICAgICAgICAgIGZvcih2YXIgaSBpbiBwb2ludHMpIHtcbiAgICAgICAgICAgICAgICAvLyBkZXRlY3QgcG9pbnRzIGluIHJhbmdlXG4gICAgICAgICAgICAgICAgaWYoTWF0aC5hYnMoZ2V0RGlzdGFuY2UodGFyZ2V0LCBwb2ludHNbaV0pKSA8IDQwMDApIHtcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2ldLmFjdGl2ZSA9IDAuMztcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2ldLmNpcmNsZS5hY3RpdmUgPSAwLjY7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKE1hdGguYWJzKGdldERpc3RhbmNlKHRhcmdldCwgcG9pbnRzW2ldKSkgPCAyMDAwMCkge1xuICAgICAgICAgICAgICAgICAgICBwb2ludHNbaV0uYWN0aXZlID0gMC4xO1xuICAgICAgICAgICAgICAgICAgICBwb2ludHNbaV0uY2lyY2xlLmFjdGl2ZSA9IDAuMztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoTWF0aC5hYnMoZ2V0RGlzdGFuY2UodGFyZ2V0LCBwb2ludHNbaV0pKSA8IDQwMDAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvaW50c1tpXS5hY3RpdmUgPSAwLjAyO1xuICAgICAgICAgICAgICAgICAgICBwb2ludHNbaV0uY2lyY2xlLmFjdGl2ZSA9IDAuMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwb2ludHNbaV0uYWN0aXZlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgcG9pbnRzW2ldLmNpcmNsZS5hY3RpdmUgPSAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGRyYXdMaW5lcyhwb2ludHNbaV0pO1xuICAgICAgICAgICAgICAgIHBvaW50c1tpXS5jaXJjbGUuZHJhdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaGlmdFBvaW50KHApIHtcbiAgICAgICAgVHdlZW5MaXRlLnRvKHAsIDErMSpNYXRoLnJhbmRvbSgpLCB7eDpwLm9yaWdpblgtNTArTWF0aC5yYW5kb20oKSoxMDAsXG4gICAgICAgICAgICB5OiBwLm9yaWdpblktNTArTWF0aC5yYW5kb20oKSoxMDAsIGVhc2U6Q2lyYy5lYXNlSW5PdXQsXG4gICAgICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBzaGlmdFBvaW50KHApO1xuICAgICAgICAgICAgfX0pO1xuICAgIH1cblxuICAgIC8vIENhbnZhcyBtYW5pcHVsYXRpb25cbiAgICBmdW5jdGlvbiBkcmF3TGluZXMocCkge1xuICAgICAgICBpZighcC5hY3RpdmUpIHJldHVybjtcbiAgICAgICAgZm9yKHZhciBpIGluIHAuY2xvc2VzdCkge1xuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY3R4Lm1vdmVUbyhwLngsIHAueSk7XG4gICAgICAgICAgICBjdHgubGluZVRvKHAuY2xvc2VzdFtpXS54LCBwLmNsb3Nlc3RbaV0ueSk7XG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSgxNTYsMjE3LDI0OSwnKyBwLmFjdGl2ZSsnKSc7XG4gICAgICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBDaXJjbGUocG9zLHJhZCxjb2xvcikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIC8vIGNvbnN0cnVjdG9yXG4gICAgICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIF90aGlzLnBvcyA9IHBvcyB8fCBudWxsO1xuICAgICAgICAgICAgX3RoaXMucmFkaXVzID0gcmFkIHx8IG51bGw7XG4gICAgICAgICAgICBfdGhpcy5jb2xvciA9IGNvbG9yIHx8IG51bGw7XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgdGhpcy5kcmF3ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZighX3RoaXMuYWN0aXZlKSByZXR1cm47XG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjdHguYXJjKF90aGlzLnBvcy54LCBfdGhpcy5wb3MueSwgX3RoaXMucmFkaXVzLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDE1NiwyMTcsMjQ5LCcrIF90aGlzLmFjdGl2ZSsnKSc7XG4gICAgICAgICAgICBjdHguZmlsbCgpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIFV0aWxcbiAgICBmdW5jdGlvbiBnZXREaXN0YW5jZShwMSwgcDIpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucG93KHAxLnggLSBwMi54LCAyKSArIE1hdGgucG93KHAxLnkgLSBwMi55LCAyKTtcbiAgICB9XG4gICAgXG59KSgpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2FsbC9qcy9kZW1vLTEuanMiXSwic291cmNlUm9vdCI6IiJ9