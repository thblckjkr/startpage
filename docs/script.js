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
			if (["colors", "shuffle"].includes(opt)) {
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
		var that = this;
		that.setColor();
	}

	async setDate() {
		let timef = await this.opt.get("timeFormat");
		let datef = await this.opt.get("dateFormat");

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

	getFeed() {

	}
}

// Main
main = new Main();
main.init();