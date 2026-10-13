#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
產生全站搜尋索引。

    python3 tools/build-search-index.py

掃描根目錄所有 .html，依 h1/h2/h3 切段，輸出
    assets/data/search-index.js      （window.NULEIV_SEARCH_INDEX = {...}）

輸出成 .js 而不是 .json，是為了讓 file:// 直接開也能載入（fetch 會被 CORS 擋）。
內容改過就要重跑一次，不然搜尋結果會是舊的。
只用標準函式庫，不需要安裝任何套件。
"""

import html
import json
import os
import re
import sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "data", "search-index.js")

# 麵包屑用的分類名稱，對應 <body data-page="...">
GROUP = {
    "home": "首頁",
    "about": "關於立德新能源",
    "services": "服務項目",
    "sustainability": "永續經營",
    "faq": "Q&A",
    "news": "最新消息",
    "contact": "聯絡我們",
}

SKIP_TAGS = {"script", "style", "svg", "noscript", "template", "iframe"}
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input",
        "link", "meta", "param", "source", "track", "wbr"}
HEADS = {"h1", "h2", "h3"}
# 這些標籤之間要補空白，否則相鄰區塊的字會黏成一個不存在的詞
BLOCK = {"p", "li", "div", "section", "td", "th", "tr", "br", "h1", "h2",
         "h3", "h4", "h5", "h6", "figcaption", "blockquote", "dt", "dd", "span"}


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ""
        self.desc = ""
        self.page = ""
        self.sub = ""
        self.sections = []          # [{h, a, parts[]}]
        self._cur = {"h": "", "a": "", "parts": []}
        self._skip = 0
        self._in_title = False
        self._head = None           # 正在收集的標題文字
        self._anchor = []           # 外層容器的 id 堆疊

    # --- 內部 ---
    def _flush(self):
        text = re.sub(r"\s+", " ", "".join(self._cur["parts"])).strip()
        if text or self._cur["h"]:
            self.sections.append({"h": self._cur["h"], "a": self._cur["a"], "b": text})
        self._cur = {"h": "", "a": "", "parts": []}

    def _id_now(self):
        return self._anchor[-1] if self._anchor else ""

    # --- HTMLParser ---
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "body":
            self.page = a.get("data-page", "")
            self.sub = a.get("data-sub", "")
        if tag == "meta" and a.get("name") == "description":
            self.desc = a.get("content", "")
        if tag == "title":
            self._in_title = True
        if tag in SKIP_TAGS:
            self._skip += 1
            return
        if self._skip:
            return
        if tag not in VOID and a.get("id"):
            self._anchor.append(a["id"])
        elif tag not in VOID:
            self._anchor.append(self._id_now())

        if tag in HEADS:
            self._flush()
            self._cur["a"] = a.get("id") or self._id_now()
            self._head = []
        elif tag in BLOCK:
            self._cur["parts"].append(" ")

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        if tag in SKIP_TAGS:
            self._skip = max(0, self._skip - 1)
            return
        if self._skip:
            return
        if tag not in VOID and self._anchor:
            self._anchor.pop()
        if tag in HEADS and self._head is not None:
            self._cur["h"] = re.sub(r"\s+", " ", "".join(self._head)).strip()
            self._head = None
        elif tag in BLOCK:
            self._cur["parts"].append(" ")

    def handle_data(self, data):
        if self._in_title:
            self.title += data
            return
        if self._skip:
            return
        if self._head is not None:
            self._head.append(data)
        else:
            self._cur["parts"].append(data)


def build():
    files = sorted(f for f in os.listdir(ROOT) if f.endswith(".html"))
    pages = []

    for f in files:
        with open(os.path.join(ROOT, f), encoding="utf-8") as fh:
            src = fh.read()
        p = Page()
        p.feed(src)
        p.close()
        p._flush()

        # <title> 是「頁名｜上層｜立德新能源 NULEIV」這種格式，
        # 只留第一段，站名與上層分類重複出現會干擾排序，麵包屑也已經有分類了
        title = html.unescape(p.title).strip()
        title = re.split(r"\s*[｜|]\s*", title)[0].strip() or title

        secs = [s for s in p.sections if s["b"] or s["h"]]
        # 整頁沒有任何標題時，至少留一段讓它還是搜得到
        if not secs:
            continue

        pages.append({
            "u": f,
            "t": title,
            "g": GROUP.get(p.page, ""),
            "d": html.unescape(p.desc).strip(),
            "s": secs,
        })
        print("  %-22s %2d 段  %6d 字" % (f, len(secs), sum(len(s["b"]) for s in secs)))

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    body = json.dumps({"pages": pages}, ensure_ascii=False, separators=(",", ":"))
    with open(OUT, "w", encoding="utf-8") as fh:
        fh.write("/* 自動產生，請勿手動修改 —— 由 tools/build-search-index.py 產出 */\n")
        fh.write("window.NULEIV_SEARCH_INDEX=" + body + ";\n")

    print("\n%d 頁 → %s（%.0f KB）" % (len(pages), os.path.relpath(OUT, ROOT),
                                      os.path.getsize(OUT) / 1024))


if __name__ == "__main__":
    sys.exit(build())
