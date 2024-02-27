# Task Tree

The advanced task manager app.

## For developers

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

### Run in debug mode

```bash
npm run tauri dev
```

or

```bash
yarn tauri dev
```

### Release build

```bash
npm run tauri build
```

or

```bash
yarn tauri build
```

The installer files should appear in the `src-tauri/target/release/bundle` folder.
