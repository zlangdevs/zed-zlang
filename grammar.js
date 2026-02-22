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
      $.error_declaration,
      $.function_declaration,
      $.struct_declaration,
      $.enum_declaration,
      $.union_declaration,
      $.global_variable,
      $.wrap_declaration,
    ),

    module_header: ($) => seq("module", $.module_path, ";"),
    use_statement: ($) => seq("use", $.module_path),

    module_path: ($) => seq(
      $.identifier,
      repeat(seq(".", $.identifier)),
    ),

    error_declaration: ($) => seq(
      "error",
      field("name", $.identifier),
      "=",
      choice($.number, $.identifier, "_"),
      ";",
    ),

    function_declaration: ($) => seq(
      "fun",
      field("name", $.identifier),
      "(",
      optional($.parameter_list),
      ")",
      optional($.guard_clause),
      optional(seq(">>", $.type)),
      $.block,
    ),

    guard_clause: ($) => seq("when", "(", $._expression, ")"),

    parameter_list: ($) => seq(
      $.parameter,
      repeat(seq(",", $.parameter)),
    ),

    parameter: ($) => seq(
      field("name", $.identifier),
      ":",
      field("type", $.type),
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
      $.enum_member,
      repeat(seq(",", $.enum_member)),
      optional(","),
    ),

    enum_member: ($) => seq(
      $.identifier,
      optional(seq("=", $._expression)),
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
      ":",
      $.type,
      optional(seq("=", $._expression)),
      optional(","),
    ),

    global_variable: ($) => seq(
      optional("const"),
      $.type,
      $.identifier,
      optional(seq("=", $._expression)),
      ";",
    ),

    statement: ($) => choice(
      $.variable_declaration,
      $.assignment,
      $.return_statement,
      $.send_statement,
      $.solicit_statement,
      $.if_statement,
      $.for_statement,
      $.match_statement,
      $.break_statement,
      $.continue_statement,
      $.goto_statement,
      $.label_statement,
      $.expression_statement,
      $.block,
    ),

    block: ($) => seq("{", repeat($.statement), "}"),

    variable_declaration_no_semi: ($) => seq(
      optional("const"),
      $.type,
      $.identifier,
      optional(seq("=", $._expression)),
    ),

    variable_declaration: ($) => seq($.variable_declaration_no_semi, ";"),

    assignment_no_semi: ($) => seq(
      choice($.identifier, $.member_expression, $.index_expression),
      choice("=", "+=", "-=", "*=", "/=", "%=", "<<=", ">>=", "&=", "|=", "^="),
      $._expression,
    ),

    assignment: ($) => seq($.assignment_no_semi, ";"),

    return_statement: ($) => seq("return", optional($._expression), ";"),
    send_statement: ($) => seq("send", $.identifier, ";"),
    solicit_statement: ($) => seq("solicit", $.identifier, ";"),
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

    for_statement: ($) => choice(
      seq("for", $.block),
      seq("for", $._expression, $.block),
      seq("for", $.variable_declaration_no_semi, ";", $._expression, ";", choice($.assignment_no_semi, $.unary_expression), $.block),
      seq("for", $.assignment_no_semi, ";", $._expression, ";", choice($.assignment_no_semi, $.unary_expression), $.block),
    ),

    match_statement: ($) => seq(
      "match",
      $._expression,
      "{",
      repeat($.match_case),
      "}",
    ),

    match_case: ($) => seq(
      $.match_value_list,
      $.block,
    ),

    match_value_list: ($) => seq(
      $._expression,
      repeat(seq(",", $._expression)),
    ),

    expression_statement: ($) => seq($._expression, ";"),
    paren_expression: ($) => seq("(", $._expression, ")"),

    _expression: ($) => choice(
      $.expression_block,
      $.handled_call_expression,
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

    handled_call_expression: ($) => prec.left(1, seq(
      $.call_expression,
      repeat1($.on_handler),
    )),

    on_handler: ($) => seq(
      "on",
      optional("solicit"),
      choice($.identifier, "_"),
      $.block,
    ),

    call_expression: ($) => prec.left(12, seq(
      field("function", choice($.identifier, $.member_expression, seq("@", $.identifier))),
      "(",
      optional($.argument_list),
      ")",
    )),

    argument_list: ($) => seq(
      $._expression,
      repeat(seq(",", $._expression)),
    ),

    member_expression: ($) => prec.left(11, seq(
      field("object", choice($.identifier, $.call_expression, $.member_expression, $.index_expression, $.paren_expression)),
      ".",
      field("property", $.identifier),
    )),

    index_expression: ($) => prec.left(11, seq(
      field("array", choice($.identifier, $.call_expression, $.member_expression, $.index_expression, $.paren_expression)),
      "[",
      field("index", $._expression),
      "]",
    )),

    cast_expression: ($) => prec.right(10, seq(
      $._expression,
      "as",
      choice($.type, "_"),
    )),

    unary_expression: ($) => prec(9, seq(
      choice("!", "-", "+", "&", "*", "~"),
      $._expression,
    )),

    binary_expression: ($) => choice(
      prec.left(1, seq($._expression, "||", $._expression)),
      prec.left(2, seq($._expression, "&&", $._expression)),
      prec.left(3, seq($._expression, choice("|", "^", "&"), $._expression)),
      prec.left(4, seq($._expression, choice("==", "!=", "<", ">", "<=", ">="), $._expression)),
      prec.left(5, seq($._expression, choice("<<", ">>"), $._expression)),
      prec.left(6, seq($._expression, choice("+", "-"), $._expression)),
      prec.left(7, seq($._expression, choice("*", "/", "%"), $._expression)),
    ),

    type: ($) => choice(
      $.pointer_type,
      $.array_type,
      $.function_type,
      $.type_identifier,
    ),

    pointer_type: ($) => seq("ptr", "<", $.type, ">"),
    array_type: ($) => seq("arr", "<", $.type, ",", choice($.number, "_"), ">"),
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
    number: () => token(choice(
      /0[xX][0-9a-fA-F]+/,
      /0[bB][01]+/,
      /\d+/,
      /\d+\.\d+([eE][+-]?\d+)?/,
      /\.\d+([eE][+-]?\d+)?/,
    )),
    string: () => token(seq('"', repeat(choice(/[^"\\\n]/, /\\./)), '"')),
    char: () => token(seq("'", choice(/[^'\\\n]/, /\\./), "'")),

    comment: () => token(choice(
      seq("??", /[^\n]*/),
      seq("...", /[\s\S]*?/, "..."),
    )),
  },
});
