(comment) @comment

[
  "fun"
  "wrap"
  "module"
  "use"
  "if"
  "else"
  "for"
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
  "null"
  "true"
  "false"
] @constant.builtin

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
(boolean) @boolean

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
