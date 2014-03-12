REPORTER = spec

test:
	@NODE_ENV=test node ./node_modules/unit.js/bin/test \
	--reporter $(REPORTER) \
	--recursive

.PHONY: test