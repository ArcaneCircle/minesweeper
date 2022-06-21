window.highscores = (() => {
    let players = {
        easy: [],
        medium: [],
        hard: []
    },
        _appName = "";

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
    
    function getScore(addr,level) {
        var playersLevel = players[level];
        return players[addr] ? players[addr].score : 0;
    }

    function getHighScores(level) {
        const selfAddr = window.webxdc.selfAddr;
        const scores = Object.keys(players[level]).map((addr) => {
            return {
                current: addr === selfAddr,
                ...players[level][addr],
            };
        }).sort((a, b) => a.score - b.score);

        for (let i = 0; i < scores.length; i++) {
            scores[i].pos = i + 1;
        }

        return scores;
    }

    return {
        init: (appName) => {
            _appName = appName;
            return window.webxdc.setUpdateListener((update) => {
                const player = update.payload;
                if(player.level )
                if (player.score > getScore(player.addr,player.level)) {
                    players[player.addr] = {name: player.name, score: player.score};
                }
            }, 0);
        },

        getScore: () => {
            return getScore(window.webxdc.selfAddr,params.level);
        },

        setScore: (score, level) => {
            const addr = window.webxdc.selfAddr;
            const old_score = getScore(addr,level);
            console.log("[wxdc-scores] old score in " + level + ": " + old_score);
            if (score <= old_score) {
                const name = window.webxdc.selfName;
                players[level][addr] = {name: name, score: score};
                let info = name + " scored " + score;
                if (_appName) {
                    info += " in " + _appName;
                }
                window.webxdc.sendUpdate(
                    {
                        payload: {
                            addr: addr,
                            name: name,
                            score: score,
                            level: level
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

        getScoreboard: (level) => {
            let table = getHighScores(level);
            let div = h("div");
            for (let i = 0; i < table.length; i++) {
                const player = table[i];
                const pos = h("span", {class: "row-pos"}, player.pos);
                const timeScore = ()=>{
                var t = Number(player.score);
                var h = Math.floor(t / 3600);
                var s = Math.floor(t % 3600 % 60);
                var m = Math.floor(t % 3600 / 60);
            
                var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
                var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
                var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
            
                    return hDisplay + mDisplay + sDisplay; 
                }

                pos.innerHTML += ".&nbsp;&nbsp;";
                div.appendChild(
                    h("div", {class: "score-row" + (player.current ? " you" : "")},
                      pos,
                      h("span", {class: "row-name"}, player.name),
                      h("span", {class: "row-score"}, timeScore()),
                     )
                );
            }
            return div;
        },
    };
})();
