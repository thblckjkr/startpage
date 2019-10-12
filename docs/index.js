/* globals moment RSSParser */
const feedEle = document.getElementById("feed");

function changeColor(colors) {
	document.body.style.backgroundColor =
	colors[Math.floor(Math.random() * colors.length)];
}

function fillFeed(feed) {
	let time = document.getElementById("time");
	time.style.marginTop = "2%";
	time.style.padding = "20px";

	feed.items.forEach((item) =>{
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
}

function changeTime(time, date) {
	document.getElementById("t").innerText = moment().format(time);
	document.getElementById("d").innerText = moment().format(date);
}

async function getOpt(opt) {
	if (window.hasOwnProperty("browser")) {
		let res = await browser.storage.local.get(opt);
		return res[opt];
	} else {
		if (["colors", "shuffle"].includes(opt)) {
			return JSON.parse(localStorage[opt]);
		} else {
			return localStorage[opt];
		}
	}
}

async function main() {
	// for web demo
	if (!window.hasOwnProperty("browser")) {
		console.log("Ex: localStorage.feed = 'https://reddit.com/r/popular/.rss'");
		let storage = await (await fetch("options.json")).json();
		if (localStorage !== null) {
			localStorage.colors = JSON.stringify(storage.colors);
			localStorage.feed = JSON.stringify(storage.feed);
			localStorage.favourites = JSON.stringify(storage.favourites);
			
			localStorage.date = storage.date;
			localStorage.time = storage.time;
			localStorage.shuffle = storage.shuffle;
		}
	}
	
	// set color
	let colors = await getOpt("colors");
	let shuffle = await getOpt("shuffle");
	changeColor(colors);
	// change color every 5s if shuffle is enabled
	if (shuffle) {
		setInterval(changeColor.bind(null, colors), 5000);
		document.body.style.transition = "5s";
	}
	
	// change time
	let date = await getOpt("date");
	let time = await getOpt("time");
	changeTime(time, date);
	setInterval(changeTime.bind(null, time, date), 1000);
	
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
	
	document.addEventListener("DOMContentLoaded", main);
	