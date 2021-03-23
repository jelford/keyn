.DEFAULT_GOAL := run

build: js/*.js manifest.json lint
	web-ext build --overwrite-dest --ignore-files docs/

lint:
	web-ext lint

clean:
	rm -rf web-ext-artifacts

run:
	web-ext run