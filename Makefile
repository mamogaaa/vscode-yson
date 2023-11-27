.PHONY: out/yson_formatter.wasm
out/yson_formatter.wasm:
	GOOS=js GOARCH=wasm go build -o out/yson_formatter.wasm
	cp "$$(go env GOROOT)/misc/wasm/wasm_exec.js" out