class OptionsMgr {
	constructor(){
		this.loadOptions()
	}

	async get(opt){
		if (window.hasOwnProperty("browser")) {
			let res = browser.storage.local.get(opt);
			return res[opt];
		} else {
				return JSON.parse(localStorage[opt]);
		}
	}

	async getSetting(opt){
		let temp = await this.get("settings");
		return temp[opt];
	}

	async loadOptions() {
		if ( window.hasOwnProperty("browser") ) {
			if( browser.storage.local.get("colors") == null ){
				let storage = await (await fetch("options.json")).json(); // Get defaults from a JSON file
				browser.storage.local.set({"settings" : storage.settings});

				browser.storage.local.set({"feed" : storage.feed});
				browser.storage.local.set({"favourites" : storage.favourites});
			}
		} else {
			if (localStorage !== null) {
				let storage = await (await fetch("options.json")).json();

				localStorage.settings = JSON.stringify(storage.settings);
				localStorage.feed = JSON.stringify(storage.feed);
				localStorage.favourites = JSON.stringify(storage.favourites);
			}
		}
	}
}

class Main {
	constructor() {
		this.opt = new OptionsMgr();
		this.parser = new RSSParser();
		this.feed = [];
	}

	init() {
		this.setDate();
		this.setColor();
		if(this.opt.getSetting("preload"))
			this.loadRSS();
		this.loadFavourites();
	}

	async setDate() {
		let timef = await this.opt.getSetting("timeFormat");
		let datef = await this.opt.getSetting("dateFormat");

		document.getElementById("t").innerText = moment().format(timef);
		document.getElementById("d").innerText = moment().format(datef);

		setInterval(() => {
			document.getElementById("t").innerText = moment().format(timef);
			document.getElementById("d").innerText = moment().format(datef);
		}, 500);
	}

	async setColor() {
		let colors = await this.opt.getSetting("colors");
		let shuffle = await this.opt.getSetting("suffleColors");
		let interval = await this.opt.getSetting("suffleInterval");


		document.body.style.backgroundColor = 
			colors[Math.floor(Math.random() * colors.length)];
		
		// change color every Xs if shuffle is enabled
		if (shuffle) {
			// TODO: Fix this
			setInterval( () => {
				document.body.style.backgroundColor = 
					colors[Math.floor(Math.random() * colors.length)];
			}, interval * 1000);
		}
	}

	async loadFavourites(){
		let favourites = await this.opt.get("favourites");
		let $f = document.getElementById("favourites");

		favourites.forEach((item) => {
			let $a = document.createElement("a");
			$a.className = "favourite";
			$a.href = item.url;
			// $a.innerText = "";
			$a.target = "_blank";

			if (typeof(item.icon) !== "undefined") {
				$a.innerHTML = '<div style="font-size: 2em;"> <i class="fa fa-' + item.icon + '"></i> </div>';
			} else {
				$a.innerHTML = '<div style="font-size: 2em;">' + item.text + '</div>';
			}

			if (item.hasOwnProperty("creator")) {
				$a.innerText += feed.title + " | " + item.title;
			}
			
			$f.appendChild($a);
		})

	}

	async showFeed() {
		let $time = document.getElementById("time");
		let $f = document.getElementById("feed");
		$time.style.marginTop = "2%";
		$time.style.padding = "20px";

		setTimeout(() => {
			let $favourites = document.getElementById("favourites");
			$favourites.style.height = "0px";
			$f.style.display = "flex";
		}, 1000);

		this.fillFeed();
	}

	async loadRSS () {
		var that = this;
		let feedItems = await this.opt.get("feed");

		// use cors proxy on web demo
		let CORS = !window.hasOwnProperty("browser")
		? "https://cors-anywhere.herokuapp.com/"
		: "";
		
		feedItems.forEach(
			async (item) => {
				console.log(CORS + item);
				let a = await this.parser.parseURL(CORS + item);
				that.feed.push(a);
			}
		)
	}

	async fillFeed() {
		let $f = document.getElementById("feed");
		
		if(!this.opt.getSetting("preload"))
			await this.loadRSS();

		this.feed.forEach( (resource) => {

			resource.items.forEach( (item) => {
				let $a = document.createElement("a");
				$a.className = "item";
				$a.href = item.link;
				$a.innerText = "";
				$a.target = "_blank";

				$a.innerText += item.title;
				
				$f.appendChild($a);
			});
		});
	}
}

// Main
main = new Main();
main.init();

setTimeout(
	function(){
		main.showFeed();
	},
	2000
)