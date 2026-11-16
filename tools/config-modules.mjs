// 設定ファイル (src/config/*.ts) を scripts/index.js にまとめず、scripts/config/*.js として残す tsdown (rolldown) プラグイン。
//
// - src/config/ の各ファイルと、それらが import しているファイルは本体のバンドルに入れず、別ファイルとして読み込ませる
// - 別ファイルは TypeScript の型だけを取り除いた JavaScript にする (コメントは残すので、そのまま編集できる)
// - 出力先は scripts/ の下に元と同じ構成 (例: src/config/server.ts → scripts/config/server.js)
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const norm = p => path.resolve(p).split(path.sep).join('/');

/** @param {string} root リポジトリのルート */
export function configModules(root) {
  const src = norm(path.join(root, 'src'));
  const configDir = `${src}/config/`;

  const toFile = (spec, importer) => {
    let p;
    if (spec.startsWith('@/')) p = `${src}/${spec.slice(2)}`;
    else if (spec.startsWith('.')) p = norm(path.join(path.dirname(importer), spec));
    else return undefined;
    p = p.replace(/\.js$/, '');
    for (const c of [`${p}.ts`, `${p}/index.ts`, `${p}.js`]) if (fs.existsSync(c)) return norm(c);
    return undefined;
  };
  const importsOf = file => {
    const code = fs.readFileSync(file, 'utf8');
    const info = ts.preProcessFile(code, true, true);
    return info.importedFiles.map(f => f.fileName);
  };

  /** 設定ファイルと、それが import しているファイル (再帰的に) */
  const separate = new Set();
  const stack = fs.readdirSync(configDir).filter(f => f.endsWith('.ts') && !f.endsWith('.d.ts')).map(f => norm(path.join(configDir, f)));
  while (stack.length) {
    const file = stack.pop();
    if (separate.has(file)) continue;
    separate.add(file);
    for (const spec of importsOf(file)) {
      const dep = toFile(spec, file);
      if (dep) stack.push(dep);
    }
  }
  /** scripts/ からの相対パス (例: config/server.js) */
  const outName = file => file.slice(src.length + 1).replace(/\.ts$/, '.js');
  const used = new Set();

  return {
    name: 'makecountry-config-modules',
    async resolveId(source, importer, options) {
      if (!importer) return null;
      const resolved = await this.resolve(source, importer, { ...options, skipSelf: true });
      if (!resolved) return null;
      const file = norm(resolved.id);
      if (!separate.has(file)) return null;
      used.add(file);
      return { id: `./${outName(file)}`, external: true };
    },
    generateBundle() {
      // 使われた設定ファイルと、その import 先をすべて出力する
      const emit = new Set();
      const queue = [...used];
      while (queue.length) {
        const file = queue.pop();
        if (emit.has(file)) continue;
        emit.add(file);
        for (const spec of importsOf(file)) { const dep = toFile(spec, file); if (dep && separate.has(dep)) queue.push(dep); }
      }
      for (const file of emit) {
        const out = outName(file);
        const code = fs.readFileSync(file, 'utf8');
        let js = ts.transpileModule(code, {
          fileName: file,
          compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, removeComments: false, verbatimModuleSyntax: false, isolatedModules: true },
        }).outputText;
        // @/ や拡張子なしの import を、出力先からの相対パスに直す
        js = js.replace(/(from\s*|import\s*\(?\s*)(['"])([^'"]+)\2/g, (m, head, q, spec) => {
          const dep = toFile(spec, file);
          if (!dep || !separate.has(dep)) return m;
          let rel = path.posix.relative(path.posix.dirname(out), outName(dep));
          if (!rel.startsWith('.')) rel = `./${rel}`;
          return `${head}${q}${rel}${q}`;
        });
        this.emitFile({ type: 'asset', fileName: out, source: js });
      }
    },
  };
}
