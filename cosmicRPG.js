const players = new Map();

function getPlayer(userId, username) {
    if (!players.has(userId)) {
        players.set(userId, {
            name: username,
            credits: 100,
            ship:"Rusty Scout",
            hull: 100,
            cargo: { stardust: 0, darkMatter:0 },
            lastAction:0
        });
    }
    return players.get(userID);
}

function exploreSpace(player) {
    const roll = Math.random();

    if (roll < 0.40) {
        const amount = Math.floor(Math.random() *15) + 5;
        player.cargo.stardust += amount;
        player.credits += amount * 2;
        return{
            type: "mine",
            text: "*Asteroid Mined!* You found a rich vein of stardust. \n Collected *${amount} Stardust* and earned *{amount * 2} credits*."
        };
    }

    else if (roll < 0.75) {
        const damage = Math.floor(Math.random() * 20) +10;
        const reward = Math.floor(Math.random() * 50) + 30;
        player.hull -= damage;

        if (player.hull <= 0) {
            player.hull = 50;
            player.credits = Math.max(0, player.credits - 20);
            return {
                type: "defeat",
                text: "*Ambush!* A Space Pirate fleet attacked. Your ship took catastrophic damage! \n Emegency warp activated. Required to 50% Hull. Lost *20 credits*."
            };
        }

        player.credits += reward;
        return {
            type: "Combat",
            text: "*Victory!* You defeated an automated rogue drone. \n Hullintegrity dropped by *${damage}%*. Recovered *${reward} credits* from the wreckage."
        };
    }
    else {
        player.hull = Math.min(100, player.hull + 20);
        return {
            type: "event",
            text: "*Nebula Drift:* You coasted through a glowing bio-luminiscent nebula. \n The radiation recharged your ship's shields and repaired *20% Hull*!"
        };
    }
}
module.exports = { getPlayer, exploreSpace };