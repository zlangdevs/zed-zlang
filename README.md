# zed-zlang

Zed extension with syntax highlighting for `zlang` (`.zl`).

## What is included

- Language registration for `.zl`
- Tree-sitter grammar (`grammar.js`)
- Highlight queries (`languages/zlang/highlights.scm`)
- Bracket matching and indent queries

## Install (local dev extension)

1. Clone repo:

```bash
git clone <YOUR_REPO_URL> zed-zlang
```

2. Open Zed.
3. Run command: `zed: install dev extension`
4. Select the `zed-zlang` folder.

## Local development note

For local dev extension installs, keep grammar source pointing to this GitHub repo and pin to a commit SHA:

```toml
[grammars.zlang]
repository = "https://github.com/zlangdevs/zed-zlang"
commit = "<commit_sha>"
```

Use any commit from this repository.

## Publishing-ready setup

After pushing this repo to GitHub, switch grammar source to Git URL + commit SHA:

```toml
[grammars.zlang]
repository = "https://github.com/zlangdevs/zed-zlang"
commit = "<commit_sha>"
```

## Quick check

Create `test.zl`:

```zl
use std

fun main() >> i32 {
    i32 a = <i32> {
        1 + 2
    };
    printf("%d\n", a);
    return 0;
}
```

Open file in Zed and select language `Zlang`.
