package main

import (
	"syscall/js"

	"go.ytsaurus.tech/yt/go/yson"
)
 
func formatYsonWrapper() js.Func {
    return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
        var data any;
        err := yson.Unmarshal([]byte(args[0].String()), &data) 
        if err != nil {
            panic(err)
        }

        bytes, err := yson.MarshalFormat(&data, yson.FormatPretty)
        if err != nil {
            panic(err)
        }

        return string(bytes)
    })
}


    
func main() {
    js.Global().Set("formatYson", formatYsonWrapper())
    <-make(chan bool)
}