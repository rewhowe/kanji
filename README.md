# Kanji Search by Parts

**[Try it here](https://rewhowe.github.io/kanji/)**

Quickly search for kanji by typing in known radicals:

Example: `田 + 心 = 思`

It also supports searching by visually similar parts:

Example 1: `𠆢(U+201A2) + 口(U+53E3) = 合`

This can also be found using `^(circumflex) + ロ(katakana 'ro')`

Example 2: `⺅(U+2E85) + 匕(U+5315) = 化`

This can also be found using `イ(katakana 'i') + ヒ(katakana 'hi')`

See below for a list of "lookalike" radicals.

**Why is this useful?**

Searching through radicals by a list sometimes takes too long and drawing the kanji by hand is error-prone and often dependent on knowing the correct stroke order. If you're looking up an unknown kanji, you may not know the stroke order, and there are a lot of exceptions to the stroke order rules as well.

Example: `鬱` (29 strokes; 7 composing radicals; exceptional stroke order)

This can found in less than a second by typing `木缶` which are easily recognizable radicals within the kanji.

**Helpful Shortcuts**

Below is a list of "lookalike" radicals and the associated radicals included in the search. These can be used to make input easier or to allow more ambiguity in the search when the specific radical isn't certain.

| Input (Description)                          | Lookalike Radicals |
|----------------------------------------------|--------------------|
| - (hyphen) or ー (elongated-vowel)           | 一                 |
| ^ (circumflex) or ＾ (full-width circumflex) | 𠆢                 |
| + (plus) or ＋ (full-width plus)             | 十                 |
| &#124; (pipe) or ｜ (full-width pipe)        | ｜                 |
| J or Ｊ (full-width J)                       | 亅                 |
| B or Ｂ (full-width B)                       | ⻏, ⻖             |
| ル (katakana 'ru')                           | 儿                 |
| リ (katakana 'ri')                           | ⺉                 |
| カ (katakana 'ka')                           | 力                 |
| ヒ (katakana 'hi')                           | 匕                 |
| イ (katakana 'i')                            | ⺅                 |
| ト (katakana 'to')                           | 卜                 |
| ム (katakana 'mu')                           | 厶                 |
| エ (katakana 'e')                            | 工                 |
| ネ (katakana 'ne')                           | ⺭, ⻂             |
| 囗 (※) or 口 (※) or ロ (katakana 'ro')       | 囗, 口             |
| 土 (※) or 士 (※)                             | 土, 士             |
| 日 (※)                                       | 日, 曰             |
| 毋 (※) or 母 (※)                             | 毋, 母             |

※ These are, additionally, radicals themselves, but are easily mistaken by Japanese learners or readers of ridiculously small text.

By prefixing certain kanji with an exclamation point (!), they will be converted to alternate forms. The list of kanji with alternate forms, mostly based on the [Kangxi radical](https://en.wikipedia.org/wiki/Kangxi_radical) list, is shown below.

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

Example: `!水!火` → `⺡⺣` → `漁`

## Notice

This project uses information from "radkfile", "radkfile2", "kradfile", and "kradfile2" and the licenses therein are reproduced below, without modification:

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

```
#                           K R A D F I L E
#
#	Copyright 2001/2007 Michael Raine, James Breen and the Electronic
#       Dictionary Research & Development Group
#	See: http://www.edrdg.org/edrdg/licence.html
#       for permissions for use and redistribution.
```

```
#                           K R A D F I L E - 2
#
#       Copyright 2007 James Rose and the KanjiCafe.com.
#
#   Special GRANT OF LICENSE is hereby given to James Breen and the
#   Electronic Dictionary Research & Development Group
#   such that said licensees may maintain, modify, use,
#   and redistribute this file.  Derivatives should maintain this notice.
#   All other rights reserved.
```

## Data Sources

* [RADKFILE/KRADFILE source](http://www.edrdg.org/krad/kradinf.html)

* [List of kanji by stroke count](https://github.com/idreyn/quantifying-simplified-chinese/blob/master/data/strokes.csv) ([raw](https://raw.githubusercontent.com/idreyn/quantifying-simplified-chinese/master/data/strokes.csv))

* [List of kanji by usage (Japanese)](https://kanjicards.org/kanji-list-by-freq.html)

* [List of kanji by usage (Chinese)](http://technology.chtsai.org/charfreq/sorted.html)
