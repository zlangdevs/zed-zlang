[(line_comment) (block_comment)] @comment

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
(string_content) @string
(string_dollar) @string
(escape_sequence) @string.escape
(interpolation ["${" "}"] @operator)
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
