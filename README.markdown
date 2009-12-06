Node Eval
========

Allows arbitrary javascript to be evaluated using V8. This is mostly useful for other servers to evaluate javascript, without needing a direct bridge.

/eval?js=12*12     => {"success":true,"result":144}

/eval?js=12*a      => {"success":false,"exception":"ReferenceError: a is not defined"}


Context is maintained

/eval?js=this.a=9  => {"success":true,"result":null}

/eval?js=12*a      => {"success":true,"result":108}


It's also possible to supply a source file on disk and a context name:

/eval?js=func()&file=/abs/path/to/file    => {"success":true,"result": "func output ok"}

Note that to be able to call functions, you'll need to expose them using the CommonJS "exports" declaration.

