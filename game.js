var game = new Phaser.Game(512, 224, Phaser.AUTO, 'game', { init: init, preload: preload, create: create, update: update });

var player
var ground
var cursors
var pad1
var lpunchKey
var jumpTime = 0
var crouchTime = 0
var attacking = false
var idle = true
var jumping = false
var isCrouch = false, isIDLE = true;

function init(){

  Phaser.Canvas.setImageRenderingCrisp(game.canvas);
  game.renderer.renderSession.roundPixels = true;
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;

}

function preload(){

  game.load.image('background', 'assets/background.png');
  game.load.image('ground', 'assets/ground.png');
  game.load.atlas('guile', 'assets/sprites/atlas.png', 'assets/sprites/atlas.json')

}

function create(){

  game.add.image(0, 0, 'background');

  game.physics.startSystem(Phaser.Physics.ARCADE);

  ground = game.add.sprite(0, 198, 'ground');//198
  game.physics.arcade.enable(ground);
  ground.body.enable = true;
  ground.body.immovable = true;

  player = game.add.sprite(50, 50, 'guile', 'idle1.png');
  game.physics.arcade.enable(player);
  player.body.gravity.y = 300;

  player.body.collideWorldBounds = true;

  player.animations.add('idle', ['idle1.png','idle2.png','idle3.png']);
  player.animations.add('forward', ['walking1.png','walking2.png','walking3.png','walking4.png','walking5.png']);
  player.animations.add('backward', ['walking5.png','walking4.png','walking3.png','walking2.png','walking1.png']);
  player.animations.add('jump', ['jump2.png','jump3.png','jump4.png','jump3.png','jump2.png']);
  player.animations.add('crouch', ['crouch1.png','crouch2.png']);

  player.animations.add('lpunch', ['lpunch1.png','lpunch2.png','lpunch3.png']);

  inputsDeclarations();

}

function update(){

  game.physics.arcade.collide(player, ground);

  if (!attacking){

    if (cursors.right.isDown && !cursors.down.isDown && !cursors.up.isDown && player.body.touching.down)
    {
      idle = false;
      player.body.velocity.x = +80;
      player.animations.play('forward', 8).onComplete.add(function(){
        attacking = false;
        idle = true;
      }, this);
    }

    if(cursors.left.isDown && !cursors.down.isDown && !cursors.up.isDown && player.body.touching.down)
    {
      idle = false;
      player.body.velocity.x = -80;
      player.animations.play('backward', 8).onComplete.add(function(){
        attacking = false;
        idle = true;
      }, this);
    }

    if(cursors.down.isDown && game.time.now > crouchTime && player.body.touching.down)
    {
      idle = false;
      player.body.velocity.x = 0;
      crouchTime = game.time.now + 2000;
      player.animations.play('crouch', 8, false);
    }

    if(cursors.up.isDown && game.time.now > jumpTime)
    {
        idle = false;
        player.body.velocity.y = -240;
        jumpTime = game.time.now + 2000;
        player.animations.play('jump', 8, false).onComplete.add(function(){
          attacking = false;
          jumping = true;
        }, this);
    }

  }//not attacking

  if (idle) {
    player.animations.play('idle', 8, true);
    player.body.velocity.x = 0;
  }

  if (player.body.touching.down ) {
    if (jumping == true) {
      jumping = false;
      player.animations.play('idle', 8, true);
      player.body.velocity.x = 0;
    }
  }

  if (lightPunch.isDown)
    if (!cursors.right.isDown && !cursors.left.isDown)
    {
      idle = false;
      attacking = true;
      player.body.velocity.x = 0;
      player.animations.play('lpunch', 8).onComplete.add(function(){
        attacking = false;
        idle = true;
      }, this);
    } else if (cursors.right.isDow){
      idle = false;
      player.body.velocity.x = +80;
      player.animations.play('forward', 8).onComplete.add(function(){
        attacking = false;
        idle = true;
      }, this);
    } else if (cursors.left.isDown){
      idle = false;
      player.body.velocity.x = -80;
      player.animations.play('backward', 8).onComplete.add(function(){
        attacking = false;
        idle = true;
      }, this);
    }

}

function inputsDeclarations() {
    cursors = game.input.keyboard.createCursorKeys();
    lightPunch = game.input.keyboard.addKey(Phaser.Keyboard.C);
}
