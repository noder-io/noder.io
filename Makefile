browser-build: browser-build-prod browser-build-dev

browser-build-prod:
	@webpack src/browser.js browser/noder.js --progress --colors -p

browser-build-dev:
	@webpack src/browser.js browser/noder-dev.js --progress --colors -d

.PHONY: browser-build