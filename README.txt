Introduction
------------
This Google Chrome Browser extension demonstrates the inter/intra-lingual 
translation functionalities of PanLex (http://panlex.org/), a project aims to 
help express any lexical concept, developed by The Long Now Foundation 
(http://longnow.org/).  PanLex are consulting thousands of dictionaries and 
other knowledge sources to build an open-source database. The database already 
documents a billion lexical translations, from which billions more can be 
derived. This extension is built upon this database, by using its public API 
(http://api.panlex.org).

Features
--------
- When installed in Google Chrome, provide translations between 9231 languages, 
  by selecting words/phrases on webpages.
- Information about supported 9231 languages can be found at www.askjonathanpool.com
- Provide the option to automatically identify the source language of the 
  selected content. This automatic language identification supports 97 languages
  as described at https://github.com/saffsd/langid.py
- To install this extension, please visit www.googlechromeextensionstore.com

Acknowledgement
---------------
The development of this extension has been supported by many people, who made 
the release of this extension possible. Particular mention goes to people who 
have given me indispensable help and stimulation: Jonathan Pool 
<pool@panlex.org>, David Kamholz <kamholz@panlex.org>, Marco Lui 
<saffsd@gmail.com>, and Timothy Baldwin <tb@ldwin.net>.

This extension also extensively uses source code from the open source 
community, and borrows ideas from other similar applications:
- Thanks to Marco Lui <saffsd@gmail.com> who provided the Javascript version 
  (https://github.com/saffsd/langid.js) of his language identification tool 
  `langid.py` (https://github.com/saffsd/langid.py).
- This extension is heavily inspired by a similar translation extension from
  Google, namely Google Dictionary (http://goo.gl/bqrQ14), which mainly focuses 
  on 13 languages.
- This extension also makes use of jQuery (http://jquery.com/) and tablesorter 
  (https://github.com/christianbach/tablesorter).
- This extension also uses English lemmatization exception dictionaries from 
  WordNet (http://wordnet.princeton.edu/)
