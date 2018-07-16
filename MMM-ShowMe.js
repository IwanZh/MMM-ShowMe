/* Magic Mirror
 * Module: MMM-ShowMe
 *
 * MIT Licensed.
 */

Module.register("MMM-ShowMe", {

	messages: [],

	defaults: {
		alert: true,
		title: false,
		APIkey: "AIzaSyA-4gAlU5yssnyGBjFK2BbfFjUu_03UMsI",
		cseID: "012228210223420900145:_1-cfzaazuo"
	},

	getStyles: function () {

		return ["MMM-ShowMe.css"];

		//"MMM-ShowMe.css",
		//"https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"
	},

	getScripts: function () {
		return ["moment.js"];
	},

	start: function () {
		this.sendSocketNotification("CONNECT", {
			"APIkey": this.config.APIkey,
			"cseID": this.config.cseID
		});
		Log.info("Starting module: " + this.name);
		moment.locale(config.language);
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "RESULT") {
			this.result = payload;
			if (!payload.silent && this.config.alert) {
				this.sendNotification("SHOW_ALERT", {type: "notification", title: payload.type, message: payload.message});
			}
			this.updateDom(1000);
		}
	},

	getDom: function () {
		var wrapper = document.createElement("div");
		if (this.result.message != "stop") {
			if (this.config.title !== false) {
				var title = document.createElement("header");
				title.innerHTML = this.config.title;
				wrapper.appendChild(title);
			}
			if (this.result.type === "text") {
				var h1 = document.createElement("h1")
				h1.className = "animated fadeIn"
				var t = document.createTextNode(this.result.message)
				h1.appendChild(t)
				wrapper.appendChild(h1)
			}
			if (this.result.type === "images") {
				let images = this.result.message

				var row = document.createElement("div");
				row.className = "row";

				var mainImageSection = document.createElement("div");
				mainImageSection.className = "mainImageSection";

				for (k in images) {
					var mainImage = document.createElement("div")
					mainImage.className = "mainImage";
					var img = document.createElement("img");
					img.src = this.result.message[k].url;
					// img.context = this.result.message[k].context;
					img.className = "mySlides";
					if (k != 0) {
						img.style.display = "none";
					}
					mainImage.appendChild(img);
					mainImageSection.appendChild(mainImage)
				}
				row.appendChild(mainImageSection);

				var thumbnails = document.createElement("div");
				thumbnails.className = "thumbnails";

				for (k in images) {
					var thumbnail = document.createElement("div")
					thumbnail.className = "thumbnail";
					var img = document.createElement("img");
					img.src = this.result.message[k].thumbnail;
					// img.context = this.result.message[k].context;
					thumbnail.appendChild(img);
					thumbnails.appendChild(thumbnail);
				}
				row.appendChild(thumbnails);
				wrapper.appendChild(row)
			}
			if (this.result.type === "videos") {
				var youtubeID = this.result.message;
				var videoWrapper = document.createElement("div");
				videoWrapper.className = "videoWrapper";
				var iframe = document.createElement("iframe");
				iframe.src = "http://www.youtube.com/embed/" + youtubeID + "?autoplay=1&controls=0";
				videoWrapper.appendChild(iframe);
				wrapper.appendChild(videoWrapper);
			}
		}
		return wrapper;
	}
});