// ==========================================================================
// fukuenyasan-hp / admin/admin.js
// 管理画面共通ロジック：
//  - File System Access API でサイトフォルダ（fukuenyasan-hp/）へ直接読み書き
//  - 編集履歴 admin/history.json への追記・読み出し
//  - 文言ポリシー（結果非保証・NGワード）チェック
//  - トースト / 接続バッジ UI
// フォルダ接続なしでも「生成HTMLのダウンロード」フォールバックで動作する。
// ==========================================================================

window.Admin = (function () {
  'use strict';

  var root = null; // FileSystemDirectoryHandle
  var supported = ('showDirectoryPicker' in window);

  /* ---------- IndexedDB（フォルダハンドルの永続化） ---------- */
  function idb() {
    return new Promise(function (res, rej) {
      var r = indexedDB.open('fukuen-admin', 1);
      r.onupgradeneeded = function () { r.result.createObjectStore('kv'); };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    });
  }
  function idbGet(k) {
    return idb().then(function (db) {
      return new Promise(function (res, rej) {
        var t = db.transaction('kv', 'readonly').objectStore('kv').get(k);
        t.onsuccess = function () { res(t.result); };
        t.onerror = function () { rej(t.error); };
      });
    });
  }
  function idbSet(k, v) {
    return idb().then(function (db) {
      return new Promise(function (res, rej) {
        var t = db.transaction('kv', 'readwrite');
        t.objectStore('kv').put(v, k);
        t.oncomplete = function () { res(); };
        t.onerror = function () { rej(t.error); };
      });
    });
  }

  /* ---------- フォルダ接続 ---------- */
  async function connect() {
    if (!supported) { toast('このブラウザはフォルダ接続に未対応です（Chrome / Edge をご利用ください）', false); return null; }
    try {
      var h = await window.showDirectoryPicker({ mode: 'readwrite', id: 'fukuen-hp' });
      // fukuenyasan-hp フォルダかどうかの簡易チェック
      try { await h.getDirectoryHandle('column'); await h.getDirectoryHandle('assets'); }
      catch (e) {
        toast('選択したフォルダに column/ と assets/ が見つかりません。「fukuenyasan-hp」フォルダを選択してください。', false);
        return null;
      }
      root = h;
      await idbSet('root', h).catch(function () {});
      renderConn();
      toast('サイトフォルダに接続しました：' + h.name);
      document.dispatchEvent(new CustomEvent('adm:connected'));
      return h;
    } catch (e) {
      if (e && e.name === 'AbortError') return null;
      toast('接続に失敗しました：' + e.message, false);
      return null;
    }
  }

  // ページ読み込み時に前回のハンドルを復元（権限はユーザー操作時に確認）
  async function restore() {
    if (!supported) { renderConn(); return null; }
    try {
      var h = await idbGet('root');
      if (h) {
        var p = await h.queryPermission({ mode: 'readwrite' });
        root = h;
        if (p === 'granted') document.dispatchEvent(new CustomEvent('adm:connected'));
      }
    } catch (e) { /* noop */ }
    renderConn();
    return root;
  }

  // 読み書き前に権限を確保（ユーザー操作起点で呼ぶこと）
  async function ensureReady() {
    if (!root) return false;
    var p = await root.queryPermission({ mode: 'readwrite' });
    if (p !== 'granted') p = await root.requestPermission({ mode: 'readwrite' });
    renderConn();
    if (p === 'granted') document.dispatchEvent(new CustomEvent('adm:connected'));
    return p === 'granted';
  }

  function isConnected() { return !!root; }

  /* ---------- パス操作 ---------- */
  function splitPath(path) {
    return path.replace(/^\.?\//, '').split('/').filter(Boolean);
  }
  async function getFileHandle(path, create) {
    if (!root) throw new Error('フォルダ未接続');
    var parts = splitPath(path);
    var dir = root;
    for (var i = 0; i < parts.length - 1; i++) {
      dir = await dir.getDirectoryHandle(parts[i], { create: !!create });
    }
    return dir.getFileHandle(parts[parts.length - 1], { create: !!create });
  }
  async function readText(path) {
    var fh = await getFileHandle(path, false);
    var f = await fh.getFile();
    return f.text();
  }
  async function writeText(path, text) {
    var fh = await getFileHandle(path, true);
    var w = await fh.createWritable();
    await w.write(text);
    await w.close();
  }
  async function writeBlob(path, blob) {
    var fh = await getFileHandle(path, true);
    var w = await fh.createWritable();
    await w.write(blob);
    await w.close();
  }
  async function exists(path) {
    try { await getFileHandle(path, false); return true; } catch (e) { return false; }
  }

  // サイト内の HTML ページ一覧（admin/ 等を除く）
  async function listPages() {
    if (!root) return null;
    var skip = { admin: 1, assets: 1, '.claude': 1, '.git': 1, tools: 1 };
    var out = [];
    async function walk(dir, prefix) {
      for await (var entry of dir.values()) {
        if (entry.kind === 'directory') {
          if (prefix === '' && skip[entry.name]) continue;
          await walk(entry, prefix + entry.name + '/');
        } else if (/\.html?$/i.test(entry.name)) {
          out.push(prefix + entry.name);
        }
      }
    }
    await walk(root, '');
    out.sort();
    return out;
  }

  /* ---------- 編集履歴（admin/history.json） ---------- */
  var HISTORY_PATH = 'admin/history.json';
  var LS_KEY = 'fukuen-admin-history';

  async function loadHistory() {
    // 1) 接続フォルダ 2) サーバ上の history.json 3) localStorage の順で探す
    if (root) {
      try {
        if (await exists(HISTORY_PATH)) return JSON.parse(await readText(HISTORY_PATH));
      } catch (e) { /* fallthrough */ }
    }
    try {
      var r = await fetch('./history.json', { cache: 'no-store' });
      if (r.ok) return await r.json();
    } catch (e) { /* fallthrough */ }
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{"entries":[]}'); }
    catch (e) { return { entries: [] }; }
  }

  // entry: {action, page, summary, changes:[{type, target, before, after}]}
  async function appendHistory(entry) {
    entry.id = 'h' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    entry.timestamp = new Date().toISOString();
    if (root) {
      var h = { entries: [] };
      try { if (await exists(HISTORY_PATH)) h = JSON.parse(await readText(HISTORY_PATH)); }
      catch (e) { /* 壊れていたら作り直す */ }
      if (!Array.isArray(h.entries)) h = { entries: [] };
      h.entries.unshift(entry);
      await writeText(HISTORY_PATH, JSON.stringify(h, null, 2));
    } else {
      var lh;
      try { lh = JSON.parse(localStorage.getItem(LS_KEY) || '{"entries":[]}'); }
      catch (e) { lh = { entries: [] }; }
      entry.note = 'フォルダ未接続のためブラウザ内(localStorage)に記録';
      lh.entries.unshift(entry);
      localStorage.setItem(LS_KEY, JSON.stringify(lh));
    }
    return entry;
  }

  /* ---------- 文言ポリシーチェック（CLAUDE.md の方針準拠） ---------- */
  var NG_WORDS = [
    '必ず復縁', '絶対に復縁', '100%', '100％', '成功率', '業界最安', '業界No.1', '業界ナンバーワン',
    '別れさせ', '接触工作', '心理戦略', '復縁工作', '工作員'
  ];
  function checkPolicy(text) {
    var found = [];
    NG_WORDS.forEach(function (w) {
      if (text.indexOf(w) !== -1) found.push(w);
    });
    return found;
  }

  /* ---------- ユーティリティ ---------- */
  function download(filename, content, type) {
    var blob = content instanceof Blob ? content : new Blob([content], { type: type || 'text/html;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fmtDate(d) { // 2026.07.03 形式
    d = d instanceof Date ? d : new Date(d);
    var p = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '.' + p(d.getMonth() + 1) + '.' + p(d.getDate());
  }
  function fmtDateTime(iso) {
    var d = new Date(iso);
    var p = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '/' + p(d.getMonth() + 1) + '/' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  /* ---------- トースト ---------- */
  var toastEl = null, toastTimer = null;
  function toast(msg, ok) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'adm-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.toggle('err', ok === false);
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, ok === false ? 6000 : 3200);
  }

  /* ---------- 接続バッジ（.adm-conn 要素があれば描画） ---------- */
  function renderConn() {
    var el = document.querySelector('.adm-conn');
    if (!el) return;
    if (!supported) {
      el.innerHTML = '<span class="dot"></span><span>フォルダ接続 非対応ブラウザ（保存はダウンロード方式）</span>';
      return;
    }
    if (root) {
      el.classList.add('ok');
      el.innerHTML = '<span class="dot"></span><span>接続中：' + esc(root.name) + '</span><button type="button" data-reconnect>変更</button>';
    } else {
      el.classList.remove('ok');
      el.innerHTML = '<span class="dot"></span><span>サイトフォルダ未接続</span><button type="button" data-reconnect>接続する</button>';
    }
    var btn = el.querySelector('[data-reconnect]');
    if (btn) btn.addEventListener('click', connect);
  }

  document.addEventListener('DOMContentLoaded', function () { restore(); });

  return {
    supported: supported,
    connect: connect,
    restore: restore,
    ensureReady: ensureReady,
    isConnected: isConnected,
    readText: readText,
    writeText: writeText,
    writeBlob: writeBlob,
    exists: exists,
    listPages: listPages,
    loadHistory: loadHistory,
    appendHistory: appendHistory,
    checkPolicy: checkPolicy,
    download: download,
    esc: esc,
    fmtDate: fmtDate,
    fmtDateTime: fmtDateTime,
    toast: toast,
    renderConn: renderConn
  };
})();
