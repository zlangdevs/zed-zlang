(comment) @comment

[
  "fun"
  "wrap"
  "module"
  "use"
  "error"
  "send"
  "solicit"
  "on"
  "if"
  "else"
  "for"
  "when"
  "match"
  "return"
  "break"
  "continue"
  "goto"
  "struct"
  "enum"
  "union"
  "const"
  "as"
] @keyword

[
  "ptr"
] @constant.builtin

(null) @constant.builtin
(boolean) @boolean

(type_identifier) @type

(function_declaration
  name: (identifier) @function)

(call_expression
  function: (identifier) @function)

(member_expression
  property: (identifier) @property)

(parameter
  (identifier) @variable.parameter)

(identifier) @variable

[
  (number)
] @number

(string) @string
(char) @string

[
  "="
  "+="
  "-="
  "*="
  "/="
  "%="
  "=="
  "!="
  "<"
  ">"
  "<="
  ">="
  "&&"
  "||"
  "&"
  "|"
  "^"
  "~"
  "<<"
  ">>"
  "+"
  "-"
  "*"
  "/"
  "%"
  "!"
] @operator

[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
  "<"
  ">"
] @punctuation.bracket

[
  ","
  "."
  ":"
  ";"
  "@"
] @punctuation.delimiter
