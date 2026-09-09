"use strict"; 

console.log("مَن يزيد؟ — App loaded");


/* ============================================
   ELEMENTS
============================================ */

const connectionScreen =
    document.getElementById("connection-screen");

const registrationScreen =
    document.getElementById("registration-screen");

const gameScreen =
    document.getElementById("game-screen");

const connectionStatus =
    document.getElementById("connection-status");

const usernameInput =
    document.getElementById("tiktok-username");

const connectButton =
    document.getElementById("connect-button");

const connectionMessage =
    document.getElementById("connection-message");

const playersList =
    document.getElementById("players-list");

const playersCount =
    document.getElementById("players-count");

const startGameButton =
    document.getElementById("start-game-button");

const bidTimer =
    document.getElementById("bid-timer");

const gameStatus =
    document.getElementById("game-status");

const nextRoundButton =
    document.getElementById("next-round-button");


/* ============================================
   STATE
============================================ */

const state = {

    currentScreen: "connection",

    connected: false,

    username: "",

    registrationKeyword: "JOIN",

    players: [],

    gameStarted: false,

    roundActive: false,

    bidTime: 15,

    bidTimerInterval: null

};


/* ============================================
   SCREEN MANAGEMENT
============================================ */

function showScreen(screenName) {

    connectionScreen.classList.remove("active");
    registrationScreen.classList.remove("active");
    gameScreen.classList.remove("active");

    if (screenName === "connection") {

        connectionScreen.classList.add("active");

    }

    else if (screenName === "registration") {

        registrationScreen.classList.add("active");

    }

    else if (screenName === "game") {

        gameScreen.classList.add("active");

    }

    state.currentScreen = screenName;
}


/* ============================================
   CONNECTION
============================================ */

connectButton.addEventListener("click", connectToLive);


usernameInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {
        connectToLive();
    }

});


function connectToLive() {

    const username =
        usernameInput.value.trim();

    if (!username) {

        connectionMessage.textContent =
            "أدخل اسم مستخدم TikTok أولاً";

        connectionMessage.className =
            "message error";

        usernameInput.focus();

        return;
    }


    state.username = username;


    connectButton.disabled = true;

    connectionMessage.textContent =
        "جاري الاتصال بالـ LIVE...";

    connectionMessage.className =
        "message";


    /*
     * مؤقت فقط للاختبار.
     *
     * لاحقاً هنا سنضع اتصال TikTok الحقيقي.
     */

    setTimeout(() => {

        state.connected = true;

        connectionStatus.textContent =
            "متصل";

        connectionStatus.className =
            "connection-status online";

        connectionMessage.textContent =
            `تم الاتصال بـ @${username}`;

        connectionMessage.className =
            "message success";


        setTimeout(() => {

            connectButton.disabled = false;

            showRegistration();

        }, 600);

    }, 1000);
}


/* ============================================
   REGISTRATION
============================================ */

function showRegistration() {

    showScreen("registration");

    renderPlayers();

    updateStartButton();

}


/* ============================================
   PLAYERS
============================================ */

function renderPlayers() {

    playersList.innerHTML = "";


    if (state.players.length === 0) {

        playersList.innerHTML = `
            <div class="empty-players">

                <div class="empty-icon">
                    👥
                </div>

                <span>
                    بانتظار اللاعبين...
                </span>

            </div>
        `;

        playersCount.textContent = "0";

        return;
    }


    state.players.forEach(player => {

        const item =
            document.createElement("div");

        item.className =
            "player-item";


        item.innerHTML = `

            <img
                class="player-avatar"
                src="${escapeHtml(player.avatar)}"
                alt=""
            >

            <div class="player-info">

                <div class="player-name">
                    ${escapeHtml(player.name)}
                </div>

                <div class="player-username">
                    @${escapeHtml(player.username)}
                </div>

            </div>

            <button
                class="delete-player"
                data-id="${escapeHtml(player.id)}"
                title="حذف اللاعب"
            >
                ×
            </button>

        `;


        const deleteButton =
            item.querySelector(".delete-player");


        deleteButton.addEventListener(
            "click",
            () => {

                removePlayer(player.id);

            }
        );


        playersList.appendChild(item);

    });


    playersCount.textContent =
        state.players.length;
}


/* ============================================
   REMOVE PLAYER
============================================ */

function removePlayer(playerId) {

    state.players =
        state.players.filter(
            player => player.id !== playerId
        );

    renderPlayers();

    updateStartButton();
}


/* ============================================
   TEST PLAYER
============================================ */

/*
 * هذه الدالة مؤقتة فقط حتى نستطيع اختبار
 * شاشة التسجيل قبل ربط TikTok الحقيقي.
 *
 * لاحقاً سيتم استدعاؤها تلقائياً من TikTok
 * عندما يكتب المشاهد JOIN.
 */

function addTestPlayer() {

    const number =
        state.players.length + 1;


    state.players.push({

        id: `test-${Date.now()}`,

        name: `Player ${number}`,

        username: `player${number}`,

        avatar:
            `https://i.pravatar.cc/100?img=${number}`

    });


    renderPlayers();

    updateStartButton();
}


/* ============================================
   START GAME
============================================ */

startGameButton.addEventListener(
    "click",
    startGame
);


function startGame() {

    if (state.players.length === 0) {
        return;
    }


    state.gameStarted = true;

    showScreen("game");

    startBidRound();
}


/* ============================================
   START BID ROUND
============================================ */

function startBidRound() {

    state.roundActive = true;

    state.bidTime = 15;


    bidTimer.textContent =
        state.bidTime;

    gameStatus.textContent =
        "بانتظار المزايدات...";


    nextRoundButton.classList.add("hidden");


    startBidTimer();
}


/* ============================================
   BID TIMER
============================================ */

function startBidTimer() {

    clearInterval(
        state.bidTimerInterval
    );


    state.bidTimerInterval =
        setInterval(() => {

            state.bidTime--;

            bidTimer.textContent =
                state.bidTime;


            if (state.bidTime <= 0) {

                clearInterval(
                    state.bidTimerInterval
                );

                endBidding();

            }

        }, 1000);
}


/* ============================================
   END BIDDING
============================================ */

function endBidding() {

    state.roundActive = false;

    gameStatus.textContent =
        "انتهت المزايدة";


    /*
     * لاحقاً:
     *
     * 1. تجميد المزايدات
     * 2. اختيار أعلى مزايدة
     * 3. إظهار المتحدي
     * 4. بدء مرحلة الإجابات
     */


    setTimeout(() => {

        gameStatus.textContent =
            "سيتم تحديد المتحدي...";

    }, 2000);
}


/* ============================================
   NEXT ROUND
============================================ */

nextRoundButton.addEventListener(
    "click",
    () => {

        startBidRound();

    }
);


/* ============================================
   START BUTTON STATE
============================================ */

function updateStartButton() {

    startGameButton.disabled =
        state.players.length === 0;

}


/* ============================================
   HTML ESCAPE
============================================ */

function escapeHtml(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");
}


/* ============================================
   DEVELOPMENT TEST
============================================ */

/*
 * افتح Console واكتب:
 *
 * addTestPlayer()
 *
 * لإضافة لاعب تجريبي.
 *
 * مثال:
 *
 * addTestPlayer()
 * addTestPlayer()
 * addTestPlayer()
 *
 */

window.addTestPlayer =
    addTestPlayer;
