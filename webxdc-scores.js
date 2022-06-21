window.highscores = (() => {
    let allPlayers = {
        easy: [],
        medium: [],
        hard: []
    },
    players = [],
        _appName = "",
        _level;

    function h(tag, attributes, ...children) {
        const element = document.createElement(tag);
        if (attributes) {
            Object.entries(attributes).forEach(entry => {
                element.setAttribute(entry[0], entry[1]);
            });
        }
        element.append(...children);
        return element;
    }
    
    function getScore(addr) {
        return players[addr] ? players[addr].score : 10000000000;
    }

    function getHighScores() {
        const selfAddr = window.webxdc.selfAddr;
        const scores = Object.keys(players).map((addr) => {
            return {
                current: addr === selfAddr,
                ...players[addr],
            };
        }).sort((a, b) => a.score - b.score);

        for (let i = 0; i < scores.length; i++) {
            scores[i].pos = i + 1;
        }

        return scores;
    }

    return {
        init: (appName,level) => {
            _appName = appName;
            players = allPlayers[level];
            _level = level;
            return window.webxdc.setUpdateListener((update) => {
                const player = update.payload;
                if (player.score <= getScore(player.addr,player.level) && player.level == _level) {
                    players[player.addr] = {name: player.name, score: player.score};
                }
            }, 0);
        },

        getScore: () => {
            return getScore(window.webxdc.selfAddr);
        },

        setScore: (score, level) => {
            const addr = window.webxdc.selfAddr;
            const old_score = getScore(addr);
            if (score <= old_score) {
                const name = window.webxdc.selfName;
                players[addr] = {name: name, score: score};
                let info = name + " scored " + score;
                if (_appName) {
                    info += " in " + _appName;
                }
                allPlayers[level] = players; // update the general array
                window.webxdc.sendUpdate(
                    {
                        payload: {
                            addr: addr,
                            name: name,
                            score: score,
                            level: level,
                        },
                        info: info,
                    },
                    info
                );
            } else {
                console.log("[webxdc-score] Ignoring score: " + score + " > " + old_score);
            }
        },

        getHighScores: getHighScores,

        getScoreboard: () => {
            let table = getHighScores();
            let div = h("div");
            for (let i = 0; i < table.length; i++) {
                const player = table[i];
                const pos = h("span", {class: "row-pos"}, player.pos);
                pos.innerHTML += ".&nbsp;&nbsp;";
                var writtenScore =  () => {
                   var t = Number(player.score);
                var h = Math.floor(t / 3600);
                var s = Math.floor((t % 3600) % 60);
                var m = Math.floor((t % 3600) / 60);
        
                var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
                var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
                var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        
                return hDisplay + mDisplay + sDisplay;
                }
                div.appendChild(
                    h("div", {class: "score-row" + (player.current ? " you" : "")},
                      pos,
                      h("span", {class: "row-name"}, player.name),
                      h("span", {class: "row-score"}, writtenScore()),
                     )
                );
            }
            console.log(allPlayers);
            return div;
        },
    };
})();
