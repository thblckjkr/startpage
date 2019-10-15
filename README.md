# Startpage
A startpage.

Displays the current time and date, and the items from an RSS feed (as many as can fit on screen).

You can use a custom RSS feed that has frequently visited sites, see `topSites.rss` as an example.

Options are stored in the browser, or localStorage for the web demo. Change options in options ui, or console for web demo.

See https://momentjs.com/docs/#/displaying/format/ for formatting the date and time.

 * Picks a random material design color for the bg color
 * Uses [Moment.js](https://momentjs.com)
 * Uses [rss-parser](https://www.npmjs.com/package/rss-parser)
 * Uses Roboto from [Google Fonts](https://fonts.google.com)


# How to use
There is a gear in the bottom left corner that opens a config page. It should also say "change config" in the center.

# Config
The config is JSON.
 - `day` is the hours that day lasts. `[6, 20]` means use the day theme from 6:00 to 20:59.
 - `colorscheme` contains the colors to use in the day and night themes. `bg` is background-color, and `fg` is color.
 - `text` is the text to display above the date. Can be different in day and night themes. First character will be inverted color.
 - `dateformat` is the format of the date/time. Using https://momentjs.com/docs/#/displaying/
 - `sites` is an array of sites to display. The first element should be display text, and the second should be a URL.

# Donations

Do you have any bucks in your wallet that you don't really need? Great!

You should consider donating to a charity or something more relevant.

If you really want to support me instead, here is a way to do it.

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/X8X315KOS)