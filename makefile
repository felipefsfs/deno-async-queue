run: fmt
	echo "Running Mod.js..."
	deno run -A mod.js

test: fmt
	deno test

fmt:
	deno fmt -q
