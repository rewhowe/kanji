# Kanji Search by Parts

**[Try it here](https://rewhowe.github.io/kanji/)**

Quickly search for kanji by typing in known radicals:

Example: 田 + 心 = 思

It also supports searching by visually similar parts:

Example 1: 𠆢(U+201A2) + 口(U+53E3) = 合
This can also be found using ^(circumflex) + ロ(katakana 'ro')

Example 2: ⺅(U+2E85) + 匕(U+5315) = 化
This can also be found using イ(katakana 'i') + ヒ(katakana 'hi')

**Why is this useful?**

Searching through radicals by a list sometimes takes too long and drawing the kanji by hand is error-prone and often dependent on knowing the correct stroke order. If you're looking up an unknown kanji, you may not know the stroke order, and there are a lot of exceptions to the stroke order rules as well.

Example: 鬱 (29 strokes; 7 composing radicals; exceptional stroke order)

This can found in less than a second by typing 木缶 which are easily recognizable radicals within the kanji.

**Helpful Shortcuts**

By prefixing certain kanji with an exclamation point (!), they will be converted to their alternate forms. The list of kanji with alternate forms, mostly based on the [Kangxi radical](https://en.wikipedia.org/wiki/Kangxi_radical) list, is shown below.

| Radical | Alternate Form |
|---------|----------------|
| 人      | ⺅             |
| 八      | 丷             |
| 氷      | 冫             |
| 刀      | ⺉             |
| 小      | ⺌             |
| 川      | 巛             |
| 心      | ⺖             |
| 手      | ⺘             |
| 水      | ⺡             |
| 火      | 灬             |
| 犬      | ⺨             |
| 草      | ⺾             |

This is meant to make searching quicker as these radicals are common yet cumbersome to input.

Example: !水!火 → ⺡⺣ → 漁

## Notice

This project uses information from "radkfile" and "radkfile2" and the licenses therein are reproduced below, without modification:

```
#                           R A D K F I L E
#
#	Copyright 2001/2007 Michael Raine, James Breen and the Electronic
#       Dictionary Research & Development Group
#	See: http://www.edrdg.org/edrdg/licence.html
#       for permissions for use and redistribution.
```

```
#                           R A D K F I L E - 2
#
#       Copyright 2007 James Rose and the KanjiCafe.com.
#
#   Special GRANT OF LICENSE is hereby given to James Breen and the
#   Electronic Dictionary Research & Development Group-
#   such that said licensees may maintain, modify, use,
#   and redistribute this file.  Derivatives should maintain this notice.
#   All other rights reserved.
```

## Additional Data Sources

* [List of kanji by stroke count](https://github.com/idreyn/quantifying-simplified-chinese/blob/master/data/strokes.csv)

* [List of kanji by usage (Japanese)](https://kanjicards.org/kanji-list-by-freq.html)

* [List of kanji by usage (Chinese)](http://technology.chtsai.org/charfreq/sorted.html)
