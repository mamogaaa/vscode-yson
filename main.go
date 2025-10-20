package main

import (
	"syscall/js"

	"go.ytsaurus.tech/yt/go/yson"

	formatter "github.com/lesf0/yson-tools/pretty-formatter"
)
 
func formatYsonWrapper(pretty bool) js.Func {
    return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
        var data any;
        err := yson.Unmarshal([]byte(args[0].String()), &data) 
        if err != nil {
            panic(err)
        }

        if pretty {
            formatter := formatter.NewYsonFormatter(4, true, false, "")
            return formatter.Dump(data) + "\n"
        } else {
            bytes, err := yson.MarshalFormat(&data, yson.FormatText)

            if err != nil {
                panic(err)
            }

            return string(bytes)
        }
    })
}


    
func main() {
    js.Global().Set("formatYson", formatYsonWrapper(false))
    js.Global().Set("formatYsonPretty", formatYsonWrapper(true))
    <-make(chan bool)
}