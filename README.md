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


== cons ==
- no user agent change¿?
- no sever daemon 


== components ==

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

