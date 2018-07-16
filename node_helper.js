/* Magic Mirror
 * Module: MMM-ShowMe
 *
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const url = require("url");
const imageSearch = require("image-search-google");
const videoSearch = require("youtube-search");

module.exports = NodeHelper.create({

	start: function () {
		this.expressApp.get("/showme", (req, res) => {

			var query = url.parse(req.url, true).query;
			var message = query.message;
			var type = query.type;
			var silent = query.silent || false;

			if (message == null && type == null) {
				res.send({
					"status": "failed",
					"error": "No message and type given."
				});
			} else if (message == null) {
				res.send({
					"status": "failed",
					"error": "No message given."
				});
			} else if (type == null) {
				res.send({
					"status": "failed",
					"error": "No type given."
				});
			} else {
				var log = {
					"type": type,
					"message": message,
					"silent": silent,
					"timestamp": new Date()
				};
				res.send({
					"status": "success",
					"payload": log
				});

				this.parseSearchTerm(log.message);

			}
		});
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "CONNECT") {
			// this.logFile = payload.logFile;
			// this.loadLogs();

			this.APIkey = payload.APIkey;
			this.cseID = payload.cseID;
		}
	},

	parseSearchTerm: function (searchTerm) {
		let sentence = searchTerm.trim().toLowerCase();
		let invocation = "magic show me";
		let n = sentence.search(invocation);
		let newSearchTerm = sentence.substr(n + invocation.length);

		this.processRequest(newSearchTerm);
	},

	isTextLength: function (querySentence) {
		var type = "text";
		var n = querySentence.search(type);
		if (n != -1) {
			var x = querySentence.substr(n + type.length);
			return x.length;
		} else {
			return false;
		}
	},

	isImageLength: function (querySentence) {
		var type = "image";
		var n = querySentence.search(type);
		if (n != -1) {
			var x = querySentence.substr(n + type.length);
			return x.length;
		} else {
			return false;
		}
	},

	isVideoLength: function (querySentence) {
		var type = "video";
		var n = querySentence.search(type);
		if (n != -1) {
			var x = querySentence.substr(n + type.length);
			return x.length;
		} else {
			return false;
		}
	},

	isText: function (querySentence) {
		var textSynonim = ["text", "quote", "say", "message", "greet"]
		var replacedQueryString = querySentence;
		for (i in textSynonim) {
			var n = querySentence.search(textSynonim[i]);
			if (n != -1) {
				replacedQueryString = querySentence.replace(textSynonim[i], "text");
				return replacedQueryString;
			}
		}
		return "";
	},

	isImage: function (querySentence) {
		var imageSynonim = ["image", "picture", "photo", "portrait"]
		var replacedQueryString = querySentence;
		for (i in imageSynonim) {
			var n = querySentence.search(imageSynonim[i]);
			if (n != -1) {
				replacedQueryString = querySentence.replace(imageSynonim[i], "image");
				return replacedQueryString;
			}
		}
		return "";
	},

	isVideo: function (querySentence) {
		var videoSynonim = ["video", "film", "movie", "trailer", "motion"]
		var replacedQueryString = querySentence;
		for (i in videoSynonim) {
			var n = querySentence.search(videoSynonim[i]);
			if (n != -1) {
				replacedQueryString = querySentence.replace(videoSynonim[i], "video");
				return replacedQueryString;
			}
		}
		return "";
	},

	determineRequestType: function (querySentence) {
		var type = "text";
		var itIsImage = this.isImage(querySentence);
		var itIsVideo = this.isVideo(querySentence);
		var itIsText = this.isText(querySentence);

		if ((this.isVideoLength(itIsVideo) > this.isImageLength(itIsImage)) && (this.isVideoLength(itIsVideo) > this.isTextLength(itIsText))) {
			type = "videos"
		} else if ((this.isImageLength(itIsImage) > this.isVideoLength(itIsVideo)) && (this.isImageLength(itIsImage) > this.isTextLength(itIsText))) {
			type = "images";
		}
		return type;
	},

	processRequest: function (newSearchTerm) {
		var queryMessage = newSearchTerm.trim().toLowerCase();
		var error = false;
		var stop = false;

		if (queryMessage.indexOf("stop") != -1) {
			stop = true;
		}

		if (stop || error) {
			var log = {
				"type": "command",
				"message": "Stopping Show Me !",
				"silent": false,
				"timestamp": new Date()
			};
			this.sendSocketNotification("RESULT", log);
		} else {
			let type = this.determineRequestType(newSearchTerm);
			if (type === "images") {
				this.getImageURL(newSearchTerm);
			} else if (type === "videos") {
				this.getVideoURL(newSearchTerm);
			} else {
				var log = {
					"type": "text",
					"message": newSearchTerm,
					"silent": true,
					"timestamp": new Date()
				};
				this.sendSocketNotification("RESULT", log);
			}
		}
	},

	getImageURL: function (searchTerm) {
		var self = this;

		const client = new imageSearch(this.cseID, this.APIkey);
		client.search(searchTerm)
			.then(images => {
				let imageData = images;

				var log = {
					"type": "images",
					"message": imageData,
					"silent": true,
					"timestamp": new Date()
				};
				self.sendSocketNotification("RESULT", log);
			})
			.catch(error => {
				console.log(error)
			})
	},

	getVideoURL: function (searchTerm) {
		self = this;
		var opts = {
			maxResults: 1,
			key: this.APIkey,
		};
		videoSearch(searchTerm, opts, function (err, results) {
			let videoId = results[0].id;
			var log = {
				"type": "videos",
				"message": videoId,
				"silent": true,
				"timestamp": new Date()
			};
			console.log(videoId);
			self.sendSocketNotification("RESULT", log);
		});
	}
});