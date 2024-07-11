package main

import (
	"syscall/js"

	"go.ytsaurus.tech/yt/go/yson"
)
 
func formatYsonWrapper(pretty bool) js.Func {
    return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
        var data any;
        err := yson.Unmarshal([]byte(args[0].String()), &data) 
        if err != nil {
            panic(err)
        }

        var format yson.Format
        if pretty {
            format = yson.FormatPretty
        } else {
            format = yson.FormatText
        }
        
        bytes, err := yson.MarshalFormat(&data, format)
        if err != nil {
            panic(err)
        }

        return string(bytes)
    })
}


    
func main() {
    js.Global().Set("formatYson", formatYsonWrapper(false))
    js.Global().Set("formatYsonPretty", formatYsonWrapper(true))
    <-make(chan bool)
}