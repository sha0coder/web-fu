# web-fu
The web hacking chrome extension

![Web-Fu](img/nuke_128.png)


== license == 

GPL v3


== install == 

(...) button -> more tools -> Extensions -> developer mode on -> load unpacked

clone the repo and load unpacked

== usage ==

Right Click          Action

Extensions icon for more features


== pros ==
- Agility
- Pseudo manual
- Integrated
- Speed
- No copy paste get/post/cookies/ua/headers
- no proxy needed
- integrated in chrome
- ssl friendly
- urllog logs before sending the request
- user-event-hooks
- no sever daemon 

== cons ==
- no user agent change¿?

== features ==
- bruteforcing folders, files, params names, param values on get/post.
- false positive reduction with gauss
- default wordlists or load worlist
- cookie editor
- notes
- log
- visual crawl
- visual bruteforce (experimental)
- clever params auditor expert system
- request interceptor
- base64 and url encoding/decoding
- danger bytes, all encoded bytes
- portscan
- build request



== components ==

<pre>
Bar-Button -> main.html ->  main.js -> settings.html -> settings.js
                                |                           |
                                |                           |
(RighClick) -----+              |                           |
                 |              |                           |
                 v              |                           |
Background -+--> menu.js        |                           |
            |                   |                           |
            +--> attackAPI.js <-+-----> ATTACKS             |
            |                                               |
            +--> storageAPI.js <----------------------------+
                       |
                       V
                   WORDLISTS

</pre>
