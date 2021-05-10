class Game {
    constructor() {

    }
    getState() {
        var gameStateRef = database.ref('gameState');
        gameStateRef.on("value", function (data) {
            gameState = data.val();
        })

    }

    update(state) {
        database.ref('/').update({
            gameState: state
        });
    }
    async start() {
        if (gameState === 0) {
            player = new Player();
            var playerCountRef = await database.ref('playerCount').once("value");
            if (playerCountRef.exists()) {
                playerCount = playerCountRef.val();
                player.getCount();
            }
            form = new Form()
            form.display();
        }
        player1 = createSprite(200, 500);
        player1.addImage("player1", player_img);

        player2 = createSprite(800, 500);
        player2.addImage("player2", player_img);
        players = [player1, player2];

    }

    play() {

        form.hide();

        Player.getPlayerInfo();
        image(back_img, 0, 0, 1000, 800);
        var x = 100;
        var y = 500;
        var index = 0;
        drawSprites();
        for (var plr in allPlayers) {
            index = index + 1;
            x = 500 - allPlayers[plr].distance;
            //console.log(allPlayers[plr].distance);
          

            players[index - 1].x = x;
            players[index - 1].y = 500;
            if (index === player.index) {
                fill("green");
                textSize(25);
                text(allPlayers[plr].name, x - 25,600);
            }
            //text to display player score.
            var playerRef = database.ref("players/" + plr + "/name");
            var playerName;
            playerRef.on("value", function (data) {
                playerName = data.val();
            })
            push();
            textSize(10);
            fill("yellow");
            text(playerName + ": " + allPlayers[plr].score, 100, y);
            y += 30;
            pop();
            if(allPlayers[plr].score > 20){
                game.update(2);
            }
        }




        if (keyIsDown(RIGHT_ARROW) && player.index !== null) {
            player.distance -= 10
            player.update();
        }
        if (keyIsDown(LEFT_ARROW) && player.index !== null) {
            player.distance += 10
            player.update();
        }
        var i = 0; //(index of the fruit)
        if (frameCount % 20 === 0) {
            fruits = createSprite(random(100, 1000), 0, 100, 100);
            fruits.velocityY = 6;
            fruits.i = i;
            var rand = Math.round(random(1, 5));
            switch (rand) {
                case 1: fruits.addImage("fruit1", fruit1_img);
                    break;
                case 2: fruits.addImage("fruit1", fruit2_img);
                    break;
                case 3: fruits.addImage("fruit1", fruit3_img);
                    break;
                case 4: fruits.addImage("fruit1", fruit4_img);
                    break;
                case 5: fruits.addImage("fruit1", fruit5_img);
                    break;
            }
           
            fruitGroup.add(fruits);
            i = i+1;
        }
        //for(var i = 0; i<2; i++){ // i is the index of each player
        if(player.index !== null){
            for(var j = 0 ; j < fruitGroup.length; j++) // j is the index of a fruit in fruit group
                if(fruitGroup.get(j).isTouching(players)){
                    fruitGroup.get(j).destroy();
                    //if(i=== player.index){
                        player.score = player.score+1;
                        player.update();
                    //}
                }                
                // if(fruitGroup.get(j).y > 400){
                //     fruitGroup.get(j).destroy();
                //     fruitGroup.remove(fruitGroup.get(j));
                // }
        }

    }

    end() {
        console.log("Game Ended");
        clear();
        textSize(100);
        text("Game Over", 100,300);
        for(var plr in allPlayers){
            fill("black");
        if(player.score >= 20){
            text("You Won." , 600,500);
        }else{
            text("You Lost." , 600,500);
        }
        }
    }
}