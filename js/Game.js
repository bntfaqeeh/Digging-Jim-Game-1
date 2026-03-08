function Game(maps) {
  this.world = null;
  this.maps = maps;
  this.mapId = -1;
  this.score = 0;
  this.playerName = "";
  HomeScreen.initialize();

  (function (obj) {
    window.onresize = function () {
      if (
        obj.world !== null &&
        obj.world.player !== null &&
        !obj.world.isWorldStop
      ) {
        obj.world.moveScrollBar();
      }
    };
  })(this);

  (function (obj) {
    var Continue = document.getElementById("Continue");
    Continue.onclick = function () {
      obj.setLevelOnBar(obj.mapId + 1);
      $("#nextMap").hide();
      obj.world.end();
      obj.startGame();
    };
  })(this);

  (function (obj) {
    var Return = document.getElementById("CloseWin");
    Return.onclick = function () {
      $("#nextMap").hide();
      obj.reset();
    };
  })(this);

  (function (obj) {
    var Restart = document.getElementById("Restart2");
    Restart.onclick = function () {
      $("#gameLost").hide();
      obj.world.end();
      obj.startGame();
    };
  })(this);

  (function (obj) {
    var Close = document.getElementById("CloseLost");
    Close.onclick = function () {
      $("#gameLost").hide();
      obj.reset();
    };
  })(this);

  (function (obj) {
    var exitGame = document.getElementById("exitGame");
    exitGame.onclick = function () {
      window.close();
    };
  })(this);

  (function (obj) {
    var exitGame_01 = document.getElementById("exitGame_01");
    exitGame_01.onclick = function () {
      window.close();
    };
  })(this);

  (function (obj) {
    var restartAtGameOver = document.getElementById("restart");
    restartAtGameOver.onclick = function () {
      $("#gameOver").hide();
      obj.reset();
    };
  })(this);

  (function (obj) {
    var restartAtGameOver_01 = document.getElementById("restart_01");
    restartAtGameOver_01.onclick = function () {
      $("#winAll").hide();
      obj.reset();
    };
  })(this);

  this.showHomeScreen = function () {
    HomeScreen.showHomeScreen();
  };

  this.reset = function () {
    // if(this.world != null)
    this.world.end();
    this.world = null;
    this.mapId = 0;
    this.score = 0;
    this.playerName = "";
    this.hidebar();
    HomeScreen.showHomeScreen();
  };

  this.initializeGame = function (playerName) {
    this.drawbar();
    this.mapId = 0;
    this.lives = 3;
    this.score = 0;
    this.setScoreOnBar(this.score);
    this.setLevelOnBar(this.mapId + 1);
    this.setLivesOnBar(this.lives);
    this.drawbar();
    this.playerName = playerName;
    this.startGame();
  };

  this.startGame = function () {
    let tmap = JSON.parse(JSON.stringify(this.maps[this.mapId]));
    this.world = new World(tmap, game);
    this.world.start();
  };

  // Return the best stored score for a player (localStorage only)
  this.getStoredHighScore = function (playerName) {
    var key = `sc-${playerName}`;
    var best = NaN;

    try {
      var lsValue = parseInt(localStorage.getItem(key), 10);
      if (!isNaN(lsValue)) {
        best = lsValue;
      }
    } catch (e) {
      console.error("localStorage unavailable:", e);
    }

    return best;
  };

  // Save a player high score, only updating if the new score is higher than stored.
  this.saveHighScore = function (score) {
    if (!this.playerName) {
      console.error("Cannot save high score: playerName is empty");
      return;
    }
    var key = `sc-${this.playerName}`;
    var storedBest = this.getStoredHighScore(this.playerName);
    var shouldUpdate = isNaN(storedBest) || score > storedBest;
    var valueToWrite = shouldUpdate ? score : storedBest;

    console.log(
      "Saving high score:",
      key,
      "Score:",
      valueToWrite,
      "(stored best:",
      storedBest,
      "shouldUpdate:",
      shouldUpdate,
      ")"
    );

    try {
      localStorage.setItem(key, valueToWrite);
      console.log("✓ localStorage saved successfully:", key, "=", valueToWrite);
    } catch (e) {
      console.error("✗ Could not save score to localStorage:", e);
    }
    
    // Verify the save
    var verifyBest = this.getStoredHighScore(this.playerName);
    console.log("✓ Verification - stored high score is now:", verifyBest);
  };

  this.gameWon = function (score = 0) {
    console.log("gameWon called - level score:", score, "current game.score:", this.score, "mapId:", this.mapId);
    this.world.stop();
    this.mapId++;
    this.score += score;
    this.setScoreOnBar(this.score);
    console.log("After update - total score:", this.score, "next mapId:", this.mapId, "total maps:", this.maps.length);
    if (this.mapId == this.maps.length) {
      console.log("All maps completed! Calling saveHighScore with score:", this.score, "playerName:", this.playerName);
      this.saveHighScore(this.score);
      this.wonAllDiv(this.score);
    } else {
      this.nextMapDiv();
    }
  };

  this.gameLose = function (levelScore) {
    console.log("gameLose called - levelScore:", levelScore, "current game.score:", this.score, "lives:", this.lives);
    if (levelScore) {
      this.score += levelScore;
    }
    this.lives--;
    this.setLivesOnBar(this.lives);
    this.setScoreOnBar(this.score);
    console.log("After update - total score:", this.score, "remaining lives:", this.lives);
    if (this.lives == 0) {
      console.log("Game Over! Calling saveHighScore with score:", this.score, "playerName:", this.playerName);
      this.saveHighScore(this.score);
      this.gameOverDiv(this.playerName, this.score);
    } else {
      this.playAgainDiv();
    }
  };

  this.playAgainDiv = function () {
    window.scrollTo(0, 0);
    document.getElementById("scoreLost").innerHTML = this.score;
    document.getElementById("livesLeft").innerHTML = this.lives;
    $("#gameLost").show();
  };

  this.nextMapDiv = function () {
    $("#nextMap").show();
    window.scrollTo(0, 0);
  };

  this.gameOverDiv = function (nm, score) {
    window.scrollTo(0, 0);
    document.getElementById("Gname").innerHTML = nm;
    document.getElementById("score").innerHTML = score;
    
    // Show personal best
    var personalBest = this.getStoredHighScore(nm);
    var scoreElement = document.getElementById("score");
    if (!isNaN(personalBest) && score >= personalBest) {
      scoreElement.innerHTML = score + " 🏆 NEW HIGH SCORE!";
      scoreElement.style.color = "#FFD700";
    } else if (!isNaN(personalBest)) {
      scoreElement.innerHTML = score + " (Best: " + personalBest + ")";
      scoreElement.style.color = "";
    }
    
    $("#gameOver").show();
  };

  this.wonAllDiv = function (score) {
    window.scrollTo(0, 0);
    $("#winAll").show();
    document.getElementById("span6").innerHTML = score;
    
    // Show if it's a new high score
    var personalBest = this.getStoredHighScore(this.playerName);
    var scoreElement = document.getElementById("span6");
    if (!isNaN(personalBest) && score >= personalBest) {
      scoreElement.innerHTML = score + " 🏆 NEW HIGH SCORE!";
      scoreElement.style.color = "#FFD700";
    } else if (!isNaN(personalBest)) {
      scoreElement.innerHTML = score + " (Best: " + personalBest + ")";
      scoreElement.style.color = "";
    }
  };

  this.showPausedDiv = function () {
    $("#paused").show();
  };

  this.hidePausedDiv = function () {
    $("#paused").hide();
  };

  this.hidebar = function () {
    $("#footer").hide();
  };

  this.drawbar = function () {
    $("#footer").show();
  };

  this.setScoreOnBar = function (score) {
    document.getElementsByClassName("badge")[1].innerHTML = score;
  };

  this.setLevelOnBar = function (level) {
    document.getElementsByClassName("badge")[5].innerHTML = level;
  };

  this.setLivesOnBar = function (lives) {
    document.getElementsByClassName("badge")[3].innerHTML = lives;
  };
}
