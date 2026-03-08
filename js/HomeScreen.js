const HomeScreen = {
  backgroundMusic: null,
  isMuted: true,

  initialize: function () {
    // Initialize background music
    this.backgroundMusic = new Audio("WAVE/01. Sunglass Hutttt.mp3");
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.3;
    this.backgroundMusic.muted = true; // Start muted by default

    var obj = this;

    // Mute button functionality
    document.getElementById("muteButton").onclick = function () {
      obj.toggleMute();
    };

    // Try to play music (muted initially)
    var playPromise = this.backgroundMusic.play();
    if (playPromise !== undefined) {
      playPromise.catch(function (error) {
        console.log(
          "Autoplay prevented. Music will start on first interaction.",
        );
      });
    }

    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    };
    document.addEventListener(
      "DOMMouseScroll",
      function (eve) {
        eve.preventDefault();
      },
      { passive: false },
    );

    document.addEventListener(
      "mousewheel",
      function (eve) {
        eve.preventDefault();
      },
      { passive: false },
    );

    document.addEventListener(
      "touchmove",
      function (eve) {
        eve.preventDefault();
      },
      { passive: false },
    );

    var obj = this;

    // Start music on any user interaction
    document.addEventListener(
      "click",
      function startMusic() {
        if (obj.backgroundMusic && obj.backgroundMusic.paused) {
          obj.backgroundMusic.play().catch(function (e) {
            console.log("Could not play music:", e);
          });
        }
      },
      { once: false },
    );

    document.getElementById("newgame").onclick = function () {
      obj.hideAll();
      document.getElementById("popupUserName").style.display = "block";
      document.getElementById("pName").focus();
    };

    document.getElementById("testScore").onclick = function () {
      console.log("=== TESTING SCORE SAVE/LOAD (localStorage only) ===");
      
      // Test 1: Save a test score
      var testName = "TestPlayer";
      var testScore = 999;
      var key = `sc-${testName}`;
      
      console.log("Test 1: Saving score", testScore, "for player", testName);
      
      try {
        localStorage.setItem(key, testScore);
        console.log("✓ localStorage saved");
      } catch (e) {
        console.error("✗ localStorage save failed:", e);
      }
      
      // Test 2: Read it back
      console.log("\nTest 2: Reading score back");
      
      try {
        var lsValue = localStorage.getItem(key);
        console.log("✓ localStorage value:", lsValue);
      } catch (e) {
        console.error("✗ localStorage read failed:", e);
      }
      
      // Test 3: Check all localStorage
      console.log("\nTest 3: All localStorage items with 'sc-' prefix");
      try {
        var found = false;
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k.startsWith('sc-')) {
            console.log("  ", k, "=", localStorage.getItem(k));
            found = true;
          }
        }
        if (!found) {
          console.log("  No scores found in localStorage");
        }
      } catch (e) {
        console.error("✗ Failed to read localStorage:", e);
      }
      
      alert("Test complete! Check the console (F12) for results.\nThen click 'HIGHEST SCORES' to see if TestPlayer appears.");
    };

    document.getElementById("dashbord").onclick = function () {
      obj.hideAll();
      document.getElementById("olHighScore").innerHTML = "";
      
      console.log("=== Loading High Scores ===");

      // Get all scores from localStorage only
      var scoreMap = {};

      try {
        for (var i = 0; i < localStorage.length; i++) {
          var key = localStorage.key(i);
          if (/^(sc-)/i.test(key)) {
            var player = key.substr(3);
            var score = parseInt(localStorage.getItem(key), 10);
            if (!isNaN(score)) {
              scoreMap[player] = score;
              console.log("Found score - Player:", player, "Score:", score);
            }
          }
        }
      } catch (e) {
        console.error("localStorage unavailable:", e);
      }

      console.log("Final scoreMap:", scoreMap);

      var allScores = Object.keys(scoreMap).map(function (player) {
        return { key: player, value: scoreMap[player] };
      });

      console.log("All scores found:", allScores);
      allScores.sort(function (a, b) {
        return b.value - a.value;
      });

      if (allScores.length === 0) {
        var noScores = document.createElement("li");
        noScores.innerHTML =
          "No high scores yet. Play the game to set a record!";
        noScores.style.color = "#666";
        noScores.style.fontStyle = "italic";
        noScores.style.listStyle = "none";
        document.getElementById("olHighScore").appendChild(noScores);
      } else {
        for (var i = 0; i < allScores.length && i < 10; i++) {
          var op = document.createElement("li");
          op.innerHTML = allScores[i].key + " : " + allScores[i].value;
          document.getElementById("olHighScore").appendChild(op);
        }
      }
      document.getElementById("highestScorePOPUP").style.display = "block";
    };

    document.getElementById("highspan").onclick = function () {
      document.getElementById("highestScorePOPUP").style.display = "none";
    };

    document.getElementById("clearAllScores").onclick = function () {
      if (confirm("Are you sure you want to clear ALL high scores? This cannot be undone!")) {
        // Clear all score items from localStorage
        try {
          var keysToDelete = [];
          for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (/^(sc-)/i.test(key)) {
              keysToDelete.push(key);
            }
          }
          keysToDelete.forEach(function(key) {
            localStorage.removeItem(key);
            console.log("Deleted from localStorage:", key);
          });
        } catch (e) {
          console.error("Could not clear localStorage:", e);
        }
        
        // Refresh the display
        document.getElementById("olHighScore").innerHTML = "";
        var noScores = document.createElement("li");
        noScores.innerHTML = "All scores cleared!";
        noScores.style.color = "#e74c3c";
        noScores.style.fontStyle = "italic";
        noScores.style.listStyle = "none";
        document.getElementById("olHighScore").appendChild(noScores);
        
        alert("All high scores have been cleared!");
      }
    };

    document.getElementById("aboutus").onclick = function () {
      obj.hideAll();
      document.getElementById("popupAboutus").style.display = "block";
    };

    document.getElementById("aboutusspan").onclick = function () {
      document.getElementById("popupAboutus").style.display = "none";
    };

    document.getElementById("exit").onclick = function () {
      obj.hideAll();
      document.getElementById("exitPopUp").style.display = "block";
      document.getElementById("no").onclick = function () {
        document.getElementById("exitPopUp").style.display = "none";
      };
      document.getElementById("yes").onclick = function () {
        window.close();
      };
    };

    document.getElementById("x").onclick = function () {
      document.getElementById("popupUserName").style.display = "none";
      document.getElementById("pName").style = "border: 3px solid #555";
      document.getElementById("temp").innerHTML = "";
    };

    document.getElementById("getPName").onclick = function () {
      var Name = document.getElementById("pName").value;
      var valid = obj.checkValidation(Name);
      document.getElementById("pName").focus();

      switch (valid) {
        case 0:
          document.getElementById("temp").innerHTML = "NOT VALID!!";
          document.getElementById("pName").style =
            "border: 3px solid rgb(248, 0, 0); animation: shake 0.5s; ";
          break;
        case 1:
          document.getElementById("popupUserName").style =
            "animation: goup 1s; display:none;";
          document.getElementById("startHome").style.display = "none";
          game.initializeGame(Name);
          break;
        case 5:
          document.getElementById("temp").innerHTML =
            "NAME SHOULD BE 5 CHARACTER AT LEAST!!";
          document.getElementById("pName").style =
            "border: 3px solid rgb(248, 0, 0); animation: shake 0.5s;";
          document.getElementById("pName").focus();
          break;
      }
    };

    document.getElementById("pName").onclick = function () {
      document.getElementById("pName").style = "border: 3px solid #555";
      document.getElementById("temp").innerHTML = "";
    };
  },
  hideAll: function () {
    document.getElementById("popupUserName").style.display = "none";
    document.getElementById("highestScorePOPUP").style.display = "none";
    document.getElementById("popupAboutus").style.display = "none";
    document.getElementById("exitPopUp").style.display = "none";
  },
  checkValidation: function (name) {
    if (name.replace(/^\s+|\s+$/g, "").length == 0) return 0;
    else if (name.length < 5) return 5;
    else return 1;
  },
  showHomeScreen: function () {
    document.getElementById("pName").value = "";
    document.getElementById("startHome").style.display = "block";
    // Resume background music when returning to home screen
    if (this.backgroundMusic && this.backgroundMusic.paused) {
      this.backgroundMusic.play().catch(function (e) {
        console.log("Could not play music:", e);
      });
    }
  },
  hideHomeScreen: function () {
    document.getElementById("startHome").style.display = "none";
    // Stop background music when leaving home screen
    if (this.backgroundMusic && !this.backgroundMusic.paused) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  },
  toggleMute: function () {
    this.isMuted = !this.isMuted;
    if (this.backgroundMusic) {
      this.backgroundMusic.muted = this.isMuted;
      // Update button icon
      var muteBtn = document.getElementById("muteButton");
      if (muteBtn) {
        muteBtn.innerHTML = this.isMuted ? "🔇" : "🔊";
      }
      // Ensure music is playing
      if (this.backgroundMusic.paused) {
        this.backgroundMusic.play().catch(function (e) {
          console.log("Could not play music:", e);
        });
      }
    }
  },
};
