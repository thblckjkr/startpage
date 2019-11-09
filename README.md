# Startpage

> A startpage. Made with vanilla CSS & Javascript

`still on development`

A simple, minimalistic startpage with a RSS parser and some other features.

Options are stored in the browser, or localStorage for the web demo. *Change options in options UI* (Still working on that one).

See https://momentjs.com/docs/#/displaying/format/ for formatting the date and time.

* Picks a random material design color for the bg color
* Uses [Moment.js](https://momentjs.com)
* Uses [JQuery Feed API](https://jquery-plugins.net/feed-api) *URL of API overrideable via Options*
* Uses Roboto from [Google Fonts](https://fonts.google.com)

## How to use

There is a gear in the top right corner that opens a config page.

### Configurations

The config is JSON.

- `day` is the hours that day lasts. `[6, 20]` means use the day theme from 6:00 to 20:59.
- `colorscheme` contains the colors to use in the day and night themes. `bg` is background-color, and `fg` is color.
- `text` is the text to display above the date. Can be different in day and night themes. First character will be inverted color.
- `dateformat` is the format of the date/time. Using https://momentjs.com/docs/#/displaying/
- `sites` is an array of sites to display. The first element should be display text, and the second should be a URL.

## Donations

Do you have any bucks in your wallet that you don't really need? Great!

You should consider donating to a charity or something more relevant.

If you really want to support me instead, here is a way to do it.

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/X8X315KOS)