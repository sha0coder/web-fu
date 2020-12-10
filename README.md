# web-fu
The web hacking chrome extension

== license == 
GPL v3


== usage ==

Right Click          Action

input			load n wordlist
url				load 1 wordlist
otro			select attack


== pros ==
- Agility
- Pseudo manual
- Integrated
- Speed
- No copy paste get/post/cookies/ua/headers
- Proxy
- urllog antes de que salga la peticion
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

