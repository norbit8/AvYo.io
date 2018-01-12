  "use strict";
  /* GLOBAL VARIABLES*/
  var client;
  var mic;
  var micLevel;
  var canvas;
  var lol;
  var x = 30;
  var y = 30;
  var x2 = 24;
  var y2 = 24;
  var points = 100;
  var powerReloder = 0;
  var counter = 0;
  var ewidth;
  var ehight;
  var Activated = 0;
  var textColor = 'black';
  var distanceFromImpact;
  var socket;
  var player2 = [0, 0];
  var fiveMinutes = 60 * 5;
  var timer;
  var Pressed = false;
  var windowView;
  var clientsArr = [];
  var rain = [];
  var drop;
  var i;
  var ep = [];
  var rowNumber;
  var tbl = [];
  var spam = [];
  var spammer;
  var counter = 0;
  var vari;
  var xxxx;
  var invited = false;
  var invitedBy;
  var whoImPlayingWith;
  var dataAccepted;
  var started = false;
  var stars = [];
  let himY;
  let himX;
  var gotIt;
  var durationStar = 3;
  var alpah = 255;
  var newStars = [];
  var me;
  var v2;
  var starToSend;
  let countStarsSent = 0;

  function setup() {
    v2 = createVector(0, 0);
    windowView = 1;
    canvas = createCanvas(940, 940);
    canvas.id("myCanvas");
    mic = new p5.AudioIn()
    mic.start();
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
    x = width - 30;
    y = 0;
    x2 = width - 30;
    y2 = height;
    powerReloder = width / 5;
    // --- Socket Connection:
    socket = io('http://127.0.0.1:3000'); // ip address of the server could be localhost or 127.0.0.0
    // callback function gets the data id of the other players
    socket.on('mouse', getOpponentData); // callback function gets the data from the other players.

    //frameRate = 80;



  }

  function draw(data) {
    if (windowView == 1) {
      first();
    } else if (windowView == 2) {
      let table = document.getElementById("table1");
      table.style.visibility = "hidden";
      game();
    } else if (windowView == 3) {
      result();
    }


  }

  // --------------------------- END OF DRAW FUNCTION ----------------------------

  function result() {

    let table = document.getElementById("table1");
    table.style.visibility = "hidden";
    background(125, 65, 244);
    makeItRain();
    textStyle(BOLD);
    textSize(30);
    noStroke();
    fill(255, 255, 255, 50);
    rect((width / 2) - 145, ((height / 2) - 320), 300, 200);
    if (points > player2[5]) { // I won
      fill(0, 204, 0);
      text("You Won!!!", (width / 2) - 90, 200);
    } else if (points == player2[5]) {
      fill(51, 153, 255);
      text("Draw", (width / 2) - 40, 200);
    } else { // I lost
      fill(204, 0, 0);
      text("You Lost :(", (width / 2) - 90, 200);
    }
    fill(0);
    textSize(21);
    textStyle(NORMAL);
    text("Your Points: " + points, (width / 2) - 130, 280);
    text("Opponent\'s points: " + player2[5], (width / 2) - 130, 310);
    if (mouseX > (width / 2) - 125 && mouseX < ((width / 2) - 125) + 250 && mouseY > 800 && mouseY < (800) + 70) {
      fill(209, 4, 34);
      rect((width / 2) - 125, 800, 250, 70);
      fill(125, 65, 244);
      textSize(30);
      text(" BACK", (width / 2) - 50, 800 + 45);
    } else {
      fill(209, 29, 56);
      rect((width / 2) - 125, 800, 250, 70);
      fill(125, 65, 244);
      textSize(30);
      text(" BACK", (width / 2) - 50, 800 + 45);
    }
    if (mouseIsPressed == true && mouseX > (width / 2) - 125 && mouseX < ((width / 2) - 125) + 250 && mouseY > 800 && mouseY < (800) + 70) {
      windowView = 1;
      mouseIsPressed = false;
      table.style.visibility = "visible";
    }
  }

  function first() {


    if (frameCount % 120 == 0) {
      socket.on('getClients', clientsCount);
      socket.emit('idle');
    }
    //  sendData();
    background(125, 65, 244);
    makeItRain(); //MAKE IT RAIN -- its here becuase it makes it behinde the button
    noStroke();

    textSize(30);
    fill(255);
    text("AvYo.io", (width / 2) - 50, 50);
    textSize(16);
    text("ID: " + socket.id, (width / 2) - 450, 50);

    setTable();
    if (frameCount % 120 == 0) {
      socket.on('gotInvite', getTheInvite); // check for invites every 120 frames
      socket.on('isAccepeted', startGameWithSomeoneYouInvited); // check if accepted your invite
    }

    if (frameCount % 1000 == 0) { // reset spams once in a while
      spam.splice(0, spam.length);
    }

    //CHECK IF USER GOT invited
    if (invited == true) {
      inviteBox();
    }

    // check if pressed on any invitation option
    checkInviteStatus();


  }


  // ---- GAME -----
  function game() {
    me = createVector(mouseX, mouseY);

    if (timer <= 0) { // when it end's
      windowView = 3;
      //let table = document.getElementById("table1");
      //table.style.visibility="visible";
    }

    noStroke();
    background(125, 65, 244); // Background color
    statusBar(); // Top sidebar design (Lvl text and superpower)


    micLevel = mic.getLevel(); // Mic level

    //movment of the line >>>>>>>>>>
    if (x > width) {
      x = 0;
      x2 = 0;
    }
    x += 1;
    x2 += 1;
    stroke(0);
    strokeWeight(20);
    line(x, y, x2, y2);
    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<

    //ellipse structure:
    ewidth = (height / 7) - micLevel * 100;
    ehight = (height / 7) - micLevel * 100;
    noStroke();
    fill(255, 255, 0);

    // ------------- SUPER POWER ----------------
    if (mouseIsPressed && powerReloder == width / 5) { // Makes you to be able to activate super power by pressing the mouse.
      Pressed = true;
    }

    if ((micLevel > 0.4 || Pressed) && powerReloder == width / 5) { // Check's if player activated the super power.
      counter++;
      superPowerActivate(counter);
    }
    // ------------- SUPER POWER (END) ----------
    //-------------- SIMPLE DRAW ELLIPSE --------
    else {
      ellipse(mouseX, mouseY, ewidth, ehight);
    }
    //-------------- SIMPLE DRAW ELLIPSE (END) --------

    /* check's for crash and takes action
      (-1 points and points color turns red if hit else back to normal (black)).
    */
    if (frameCount % 5 == 0) { // makes points go down slower / faster.
      if (checkCrash() === true && points != 0) {
        points = points - 1;
        textColor = "red";
      } else {
        textColor = "black";
      }
    }

    // Players points counter:
    if (frameCount % 120 == 0) {
      points += 1;
    }

    /*distance from impact calculation,
    which is distance from the ellipse's center (mouseX) to the lines outter
    point (left or right)
    */
    if (mouseX > x) {
      distanceFromImpact = Math.abs(mouseX - (x + 10));
    } else {
      //line(mouseX, mouseY, x-10, mouseY);
      distanceFromImpact = Math.abs((x - 10) - mouseX);
    }

    addStars();
    refreshPower(); // Refreshes the super power.
    sendData(); // Send's data to server (soket.io).
    drawOpponent(); // Draws opponent's data to the canvas.
    checkBoarders(); // Check if player hit the boarder and takes action -->die();
    if (gotIt) {
      gotItf();
    }


  }


  // ------------------- START OF ALL THE ESSIANSIAL FUNCTIONS -------------------

  function refreshPower() {
    // Realoads the super power.
    fill(0, 200, 255);
    rect(30, 45, powerReloder, 55);
    if (powerReloder < width / 5) {
      powerReloder += 1;
    }
  }

  function superPowerActivate() {
    // Activates super power.
    if (counter == 20) {
      powerReloder = 0;
      counter = 0;
      Activated = 0;
      Pressed = false;
    } else {
      ellipse(mouseX, mouseY, 0, 0);
      Activated = 1;
      Pressed = true;
    }
  }

  function checkCrash() {
    // !!IMPORTENT!! this function checks for collosions
    // of the player and any objects. (returns boolean)
    if (distanceFromImpact <= (ewidth / 2) && Activated == 0) {
      return true;
    } else return false;
  }

  function statusBar() {
    // Handles the design all the players data panel.
    fill(textColor);
    textSize(width / 50);
    text("Points: " + points, width / 1.2, 55);
    fill("black");
    text("Id: ", width / 1.2, 85);
    textSize(12);
    text(socket.id, width / 1.2, 115);
    textSize(width / 50);
    // TIMER (START)
    text("Timer: ", width / 1.2, 145);
    text(floor(timer / 60) + ":" + parseInt(timer % 60, 10), width / 1.1, 145);
    // TIMER (END)
    rect(30, 45, width / 5, 55);
    noFill();
    strokeWeight(width / 125);
    stroke(255, 204, 0);
    rect(width / 1.21, 10, width / 6, height / 5);
    noStroke();
  }

  function sendData() {
    // This function allocated the data into one  object and then sends it to the server to handle.
    var data2 = {
      playerX: mouseX,
      playerY: mouseY,
      playerWidth: ewidth,
      playerheight: ehight,
      superPower: Activated,
      score: points,
      id: socket.id,
      to: whoImPlayingWith,
      stars2: starToSend
    };

    socket.emit('mouse', data2); // Send data (goodbye).
  }

  function getOpponentData(data) {
    // This function get's the oppenent data from the soket.io,
    // and stores it in an array form.
    player2[0] = data.playerX; // opponent's x
    player2[1] = data.playerY; // opponent's y
    player2[2] = data.playerWidth; // opponent's width
    player2[3] = data.playerheight; // opponent's height
    player2[4] = data.superPower; // oppenent's superPower (atctivated or not)
    player2[5] = data.score; // opponent's score
    player2[6] = data.id; // opponent's is
    player2[7] = data.to; //
    player2[8] = data.stars2; // stars
  }

  function drawOpponent() {
    // This function draws the oppenent if
    // he isn't using the super power.
    if (player2[4] == 0) { // *checks if superPower isn't activated*
      noStroke();
      fill(255, 0, 100);
      ellipse(player2[0], player2[1], player2[2], player2[3]);
      fill(0);
      textSize(13);
      text("Player\'s nickname", (player2[0] - player2[2] / 4) - 15, player2[1]);
      text("Player\'s score: " + player2[5], (player2[0] - player2[2] / 4) - 15, player2[1] + 15);
    }
  }

  function startTimer() {
    // Function used to calculate time passing (every second).
    if (!started) {
      setInterval(function() {
        timer = timer - 1;
      }, 1000);
    }
    started = true;
  }

  function checkBoarders() {
    // Function used to check if player crossed the boarder.
    if (mouseX < 0 || mouseX > width || mouseY > height || mouseY < 0) {
      die();
    }
  }

  function die() {
    // Player how violated the terms get this function to run.
    // alert("DIE MOTHER FUCKER!");

  }

  function clientsCount(clients) {
    clientsArr.splice(0, clientsArr.length);
    for (client of clients) {
      clientsArr.push(client);
    }

  }

  function makeItRain() {
    // White rain :)
    if (frameCount % 20 == 0) {
      rain.push(new Rain(random(1, width), -10));
      rain.push(new Rain(-50, random(1, width)));
    }
    for (i = rain.length - 1; i >= 0; i--) {
      rain[i].update();
      if (rain[i].x > width || rain[i].y > height) {
        rain.splice(i, 1);
      }
    }
  }

  function setTable() {

    for (i = 0; i < tbl.length; i++) {
      tbl[i].remove();
    }

    for (i = 0; i < clientsArr.length; i++) {
      tbl.push(createElement('tr').parent('table1'));
      tbl.push(createElement('td', i + 1).parent('table1'));
      tbl.push(createElement('td', clientsArr[i]).parent('table1').id(i)); // client id
      tbl.push(createElement('td').parent('table1'));
      if (clientsArr[i] == socket.id) { // if its the client paint blocks in red + me sign
        tbl[tbl.length - 3].style('background-color', 'red');
        tbl[tbl.length - 2].style('background-color', 'red');
        tbl[tbl.length - 1].html("Me!")
      } else { // else add button and configure it
        inviteBtn(tbl[tbl.length - 1], clientsArr[i]);
      }

    }
  }

  function inviteBtn(vari, xxxx) {
    tbl.push(createElement('button', "Invite").parent(vari).id(xxxx));
    tbl[tbl.length - 1].style('background-color', '#555555');
    tbl[tbl.length - 1].style('border', 'none');
    tbl[tbl.length - 1].style('padding', '10px 15px');
    tbl[tbl.length - 1].style('text-align', 'center');
    tbl[tbl.length - 1].style('font-size', '16px');
    tbl[tbl.length - 1].style('display', 'inline-block');
    tbl[tbl.length - 1].style('cursor', 'pointer');
    tbl[tbl.length - 1].style('color', 'white');
    tbl[tbl.length - 1].mousePressed(function() {
      sendTheInvite(xxxx);
    });
  }

  function sendTheInvite(xxxx) {
    spammer = false;
    console.log(xxxx);
    for (let sp of spam) {
      if (sp == xxxx) {
        spammer = true;
      }
    }
    if (spammer != true) {
      socket.emit('invite', {
        whoAmI: socket.id,
        whoIWant: xxxx
      });
    }
    spam.push(xxxx);

  }

  function getTheInvite(inviteInfo) {
    invitedBy = inviteInfo;
    invited = true;
  }

  function inviteBox() {
    fill(0);
    textStyle(BOLD);
    textSize(16);
    text("You have been invited by: \n" + invitedBy, (width / 1.45) + 5, 50);
    fill(0, 0, 0, 95);
    rect((width / 1.45), 20, 270, 70);
    fill(0, 191, 24, 20);
    rect((width / 1.45) - 5, 15, 280, 80);
    fill(0, 191, 24, 20);
    rect((width / 1.45) - 5, 15, 280, 80);
    fill(2, 242, 32);
    rect((width / 1.45) + 225, 30, 20, 20); // accept
    fill(193, 1, 1);
    rect((width / 1.45) + 225, 60, 20, 20); // cancel
    fill(0);
    text("X", (width / 1.45) + 229.5, 76);
    text("V", (width / 1.45) + 229.5, 46);
    textStyle(NORMAL);
  }

  function cancelInvite() {
    invitedBy = null;
    invited = false;
  }

  function startGameWith() {
    console.log("gameOn");
    windowView = 2;
    whoImPlayingWith = invitedBy;
    socket.emit('accepted', {
      whoAmI: socket.id,
      whoIWant: whoImPlayingWith
    });
    timer = 180;
    invited = false;
    startTimer();

  }

  function checkInviteStatus() {
    if (mouseIsPressed == true && mouseX > (width / 1.45) + 225 && mouseX < (width / 1.45) + 225 + 20 && mouseY > 60 && mouseY < 80) {
      cancelInvite();
    }
    if (mouseIsPressed == true && mouseX > (width / 1.45) + 225 && mouseX < (width / 1.45) + 225 + 20 && mouseY > 30 && mouseY < 50) {
      startGameWith();
      points = 100;
    }
  }

  function startGameWithSomeoneYouInvited(dataAccepted) {
    windowView = 2;
    timer = 180;
    startTimer();
    invited = false;
    whoImPlayingWith = dataAccepted.whoAmI;
  }

  function addStars() {
    // this function adds stars which will give points if a player gets them.
    if (frameCount % 600 == 0) {
      stars.push(new Star(random(50, width - 100), random(50, height - 100)));
      starToSend = {
        who: player2[6],
        star: {
          starNumber: countStarsSent,
          w: stars[stars.length - 1].w,
          h: stars[stars.length - 1].h
        }
      };
      socket.emit('star', starToSend);
      countStarsSent++;
    }

    socket.on('star2', pushTheStar); // the othr player's star

    for (let i = stars.length - 1; i >= 0; i--) {
      if (frameCount % 60 == 0) {
        stars[i].duration--;
      }
      stars[i].show();
    }

    if (stars.length > 0) {
      newStars = stars.filter(isTouch);
      stars = newStars;
    }

    for (let i = stars.length - 1; i >= 0; i--) {
      if (stars[i].duration <= 0) {
        stars.splice(i, 1);
      }
    }

  }

  function gotItf() {
    push();
    himY -= 0.5;
    if (frameCount % 60 == 0) {
      durationStar--;
      console.log(himX + ", " + himY);
    }
    textSize(18);
    fill(66, 160, 255, alpah);
    text("+10!", himX, himY);
    if (durationStar == 0) {
      gotIt = false;
      durationStar = 3;
      alpah = 255;
    }
    alpah -= 1;
    pop();
  }

  function isTouch(star) {
    if ((me.sub((star.v))).dist(v2) >= (ewidth / 2) + 24.5) {
      return star;
    } else {
      points += 10;
      himX = star.w;
      himY = star.h;
      gotIt = true;
    }
  }

    function pushTheStar(star2){
      if(stars.length < 2){
      stars.push(new Star(star2.w, star2.h));
    }
    }
