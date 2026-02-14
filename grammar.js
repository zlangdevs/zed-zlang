module.exports = grammar({
  name: "zlang",

  extras: ($) => [
    /\s/,
    $.comment,
  ],

  word: ($) => $.identifier,

  rules: {
    source_file: ($) => repeat($._top_level),

    _top_level: ($) => choice(
      $.module_header,
      $.use_statement,
      $.function_declaration,
      $.struct_declaration,
      $.enum_declaration,
      $.union_declaration,
      $.global_variable,
      $.wrap_declaration,
    ),

    module_header: ($) => seq(
      "module",
      $.module_path,
      ";",
    ),

    use_statement: ($) => seq(
      "use",
      $.module_path,
    ),

    module_path: ($) => seq(
      $.identifier,
      repeat(seq(".", $.identifier)),
    ),

    function_declaration: ($) => seq(
      "fun",
      field("name", $.identifier),
      "(",
      optional($.parameter_list),
      ")",
      optional(seq(">>", $.type)),
      $.block,
    ),

    parameter_list: ($) => seq(
      $.parameter,
      repeat(seq(",", $.parameter)),
    ),

    parameter: ($) => seq(
      $.type,
      $.identifier,
    ),

    wrap_declaration: ($) => seq(
      "wrap",
      "@",
      $.identifier,
      "(",
      optional($.parameter_list),
      ")",
      optional(seq(">>", $.type)),
      ";",
    ),

    struct_declaration: ($) => seq(
      "struct",
      field("name", $.identifier),
      "{",
      repeat($.field_declaration),
      "}",
    ),

    enum_declaration: ($) => seq(
      "enum",
      field("name", $.identifier),
      "{",
      optional($.enum_member_list),
      "}",
    ),

    enum_member_list: ($) => seq(
      $.identifier,
      repeat(seq(",", $.identifier)),
      optional(","),
    ),

    union_declaration: ($) => seq(
      "union",
      field("name", $.identifier),
      "{",
      repeat($.field_declaration),
      "}",
    ),

    field_declaration: ($) => seq(
      $.identifier,
      $.type,
      optional(seq("=", $._expression)),
      optional(","),
    ),

    global_variable: ($) => seq(
      optional("const"),
      $.type,
      $.identifier,
      "=",
      $._expression,
      ";",
    ),

    statement: ($) => choice(
      $.variable_declaration,
      $.assignment,
      $.return_statement,
      $.if_statement,
      $.for_statement,
      $.break_statement,
      $.continue_statement,
      $.goto_statement,
      $.label_statement,
      $.expression_statement,
      $.block,
    ),

    block: ($) => seq("{", repeat($.statement), "}"),

    variable_declaration: ($) => seq(
      optional("const"),
      $.type,
      $.identifier,
      "=",
      $._expression,
      ";",
    ),

    assignment: ($) => seq(
      $.identifier,
      choice("=", "+=", "-=", "*=", "/=", "%="),
      $._expression,
      ";",
    ),

    return_statement: ($) => seq("return", optional($._expression), ";"),
    break_statement: () => seq("break", ";"),
    continue_statement: () => seq("continue", ";"),
    goto_statement: ($) => seq("goto", $.identifier, ";"),
    label_statement: ($) => seq($.identifier, ":"),

    if_statement: ($) => seq(
      "if",
      $._expression,
      $.block,
      optional(seq("else", choice($.if_statement, $.block))),
    ),

    for_statement: ($) => seq(
      "for",
      $._expression,
      $.block,
    ),

    expression_statement: ($) => seq($._expression, ";"),

    paren_expression: ($) => seq("(", $._expression, ")"),

    _expression: ($) => choice(
      $.expression_block,
      $.call_expression,
      $.member_expression,
      $.index_expression,
      $.cast_expression,
      $.binary_expression,
      $.unary_expression,
      $.identifier,
      $.number,
      $.string,
      $.char,
      $.boolean,
      $.null,
      $.paren_expression,
    ),

    expression_block: ($) => seq(
      "<",
      $.type,
      ">",
      "{",
      repeat($.statement),
      $._expression,
      "}",
    ),

    call_expression: ($) => seq(
      field("function", choice($.identifier, $.member_expression, seq("@", $.identifier))),
      "(",
      optional($.argument_list),
      ")",
    ),

    argument_list: ($) => seq(
      $._expression,
      repeat(seq(",", $._expression)),
    ),

    member_expression: ($) => prec.left(9, seq(
      field("object", choice($.identifier, $.call_expression, $.member_expression, $.index_expression)),
      ".",
      field("property", $.identifier),
    )),

    index_expression: ($) => prec.left(9, seq(
      field("array", choice($.identifier, $.call_expression, $.member_expression, $.index_expression)),
      "[",
      field("index", $._expression),
      "]",
    )),

    cast_expression: ($) => prec.right(8, seq(
      $._expression,
      "as",
      choice($.type, "_"),
    )),

    unary_expression: ($) => prec(7, seq(
      choice("!", "-", "+", "&", "*", "~"),
      $._expression,
    )),

    binary_expression: ($) => choice(
      prec.left(1, seq($._expression, "||", $._expression)),
      prec.left(2, seq($._expression, "&&", $._expression)),
      prec.left(3, seq($._expression, choice("|", "^", "&"), $._expression)),
      prec.left(4, seq($._expression, choice("==", "!=", "<", ">", "<=", ">="), $._expression)),
      prec.left(5, seq($._expression, choice("<<", ">>"), $._expression)),
      prec.left(6, seq($._expression, choice("+", "-", "*", "/", "%"), $._expression)),
    ),

    type: ($) => choice(
      $.type_identifier,
      $.pointer_type,
      $.array_type,
      $.function_type,
    ),

    pointer_type: ($) => seq("ptr", "<", $.type, ">"),
    array_type: ($) => seq("[", optional($.number), "]", $.type),
    function_type: ($) => seq("fun", "<", optional($.type_list), ">"),
    type_list: ($) => seq($.type, repeat(seq(",", $.type))),

    type_identifier: ($) => choice(
      $.identifier,
      $.qualified_type_identifier,
    ),
    qualified_type_identifier: ($) => seq(
      $.identifier,
      repeat1(seq(".", $.identifier)),
    ),
    identifier: ($) => token(seq(/[A-Za-z_]/, /[A-Za-z0-9_]*/)),

    boolean: () => choice("true", "false"),
    null: () => "null",
    number: () => token(choice(/0[xX][0-9a-fA-F]+/, /0[bB][01]+/, /\d+/, /\d+\.\d+([eE][+-]?\d+)?/, /\.\d+([eE][+-]?\d+)?/)),
    string: () => token(seq('"', repeat(choice(/[^"\\\n]/, /\\./)), '"')),
    char: () => token(seq("'", choice(/[^'\\\n]/, /\\./), "'")),

    comment: () => token(choice(
      seq("??", /[^\n]*/),
      seq("...", /[\s\S]*?/, "..."),
    )),
  },
});
