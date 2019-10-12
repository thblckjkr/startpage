class OptionsMgr {
	constructor(){
		this.loadOptions()
	}

	async loadOptions() {
		if ( !window.hasOwnProperty("browser") ) {
			if (localStorage !== null) {
				let storage = await (await fetch("options.json")).json();

				localStorage.colors = JSON.stringify(storage.colors);
				localStorage.feed = JSON.stringify(storage.feed);
				localStorage.favourites = JSON.stringify(storage.favourites);
				
				localStorage.dateFormat = storage.dateFormat;
				localStorage.timeFormat = storage.timeFormat;
				localStorage.shuffle = storage.shuffle;
			}
		}
	}

	async get(opt){
		if (window.hasOwnProperty("browser")) {
			let res = browser.storage.local.get(opt);
			return res[opt];
		} else {
			if (["colors", "feed", "favourites"].includes(opt)) {
				return JSON.parse(localStorage[opt]);
			} else {
				return localStorage[opt];
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
		this.loadRSS();
		this.loadFavourites();
	}

	async setDate() {
		let timef = await this.opt.get("timeFormat");
		let datef = await this.opt.get("dateFormat");

		document.getElementById("t").innerText = moment().format(timef);
		document.getElementById("d").innerText = moment().format(datef);

		setInterval(() => {
			document.getElementById("t").innerText = moment().format(timef);
			document.getElementById("d").innerText = moment().format(datef);
		}, 500);
	}

	async setColor() {
		let colors = await this.opt.get("colors");
		let shuffle = await this.opt.get("shuffle");

		document.body.style.backgroundColor = 
			colors[Math.floor(Math.random() * colors.length)];
		
		// change color every 5s if shuffle is enabled
		if (shuffle) {
			setInterval( this.setColor.bind(null, colors), 5000);
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

		this.fillFeed();

		setTimeout(() => {
			let $favourites = document.getElementById("favourites");
			$favourites.style.height = "0px";
			$f.style.display = "flex";
		}, 1000)
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

		this.feed.forEach( (resource) => {

			resource.items.forEach( (item) => {
				let $a = document.createElement("a");
				$a.className = "item";
				$a.href = item.link;
				$a.innerText = "";
				$a.target = "_blank";
				if (item.hasOwnProperty("creator")) {
					$a.innerText += feed.title + " | " + item.title;
				}
				
				$f.appendChild($a);
			});
		});
	}
}

// Main
main = new Main();
main.init();