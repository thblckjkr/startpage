class Options{
	constructor(a){
		this.a = a;
	}

	get(opt){
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
	
}