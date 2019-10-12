class OptionsMgr{
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
	}

	init() {
		this.setDate();
		this.setColor();
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
		let colors = await this.opt.get("feed");

		let $time = document.getElementById("time");
		$time.style.marginTop = "2%";
		$time.style.padding = "20px";

		this.fillFeed();

		setTimeout(() => {
			let $favourites = document.getElementById("favourites");
			$favourites.style.height = "0px";
		}, 1000)

	}

	async fillFeed(feed) {
		let feed = await this.opt.get("feed")
		feed.items.forEach((item) => {
			let name = document.createElement("a");
			name.className = "item";
			name.href = item.link;
			name.innerText = "";
			name.target = "_blank";
			if (item.hasOwnProperty("creator")) {
				name.innerText += feed.title + " | " + item.title;
			}
			
			feedEle.appendChild(name);
		})

		// get rss feed
		let parser = new RSSParser();
		// use cors proxy on web demo
		let CORS = !window.hasOwnProperty("browser")
		? "https://cors-anywhere.herokuapp.com/"
		: "";
		
		feeds = JSON.parse(await getOpt("feed"));
		feeds.forEach(
			async (item) => {
				console.log(CORS + item);
				let feed = await parser.parseURL(CORS + item);
				fillFeed(feed)
			}
		)
	}
}

// Main
main = new Main();
main.init();