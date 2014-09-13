info='/*! Noder.io | (c) 2014 Nicolas Tallefourtane | http://noder.io */'

browser-build: browser-build-prod browser-build-dev

browser-build-prod:
	@webpack src/browser.js browser/noder.js --progress --colors -p \
		&& (echo $(info); cat browser/noder.js) > tmpn \
		&& mv tmpn browser/noder.js


browser-build-dev:
	@webpack src/browser.js browser/noder-dev.js --progress --colors -d \
		&& (echo $(info); cat browser/noder-dev.js) > tmpnd \
		&& mv tmpnd browser/noder-dev.js

.PHONY: browser-build