var game = new Phaser.Game(512, 224, Phaser.AUTO, 'game', { init: init, preload: preload, create: create, update: update });

var player, enemy
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
var lifeTween, life, cropRect
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
  game.load.atlas('guile', 'assets/sprites/guile/guile.png', 'assets/sprites/guile/guile.json');
  game.load.atlas('ryu', 'assets/sprites/ryu/ryu.png', 'assets/sprites/ryu/ryu.json');

  game.load.image('lifeBG', 'assets/lifeBG.png');
  game.load.image('life', 'assets/life.png');

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
  player.body.gravity.y = 500;

  enemy = game.add.sprite(400, 50, 'ryu', 'idle1.png');
  game.physics.arcade.enable(enemy);
  enemy.body.gravity.y = 500;

  player.body.collideWorldBounds = true;

  player.animations.add('idle', ['idle1.png','idle2.png','idle3.png']);
  player.animations.add('forward', ['walking1.png','walking2.png','walking3.png','walking4.png','walking5.png']);
  player.animations.add('backward', ['walking5.png','walking4.png','walking3.png','walking2.png','walking1.png']);
  player.animations.add('jump', ['jump2.png','jump3.png','jump4.png']);
  player.animations.add('fall', ['jump2.png']);
  player.animations.add('crouch', ['crouch1.png','crouch2.png']);

  player.animations.add('light-punch', ['light-punch1.png','light-punch2.png','light-punch3.png']);

  enemy.animations.add('idle', ['idle1.png','idle2.png','idle3.png','idle4.png']);

  inputsDeclarations();
  enemy.anchor.setTo(0.5);
  cursors.up.onDown.add(handlePlayerJump);

  createLife();
}

function update(){

  game.physics.arcade.collide(player, ground);
  game.physics.arcade.collide(enemy, ground);

  if (player.x < enemy.x){
    enemy.scale.setTo(-1, 1);
    player.scale.setTo(1, 1);
  } else {
    enemy.scale.setTo(1, 1);
    player.scale.setTo(-1, 1);
  }

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

    if (player.body.velocity.y > 0) {
      player.animations.play('fall', 8);
    } else if (player.body.velocity.y < 0) {
      player.animations.play('jump', 8)
    }

  }//not attacking

  if (idle) {
    player.animations.play('idle', 8, true);
    player.body.velocity.x = 0;

    enemy.animations.play('idle', 8, true);
    enemy.body.velocity.x = 0;
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
      player.animations.play('light-punch', 8).onComplete.add(function(){
        attacking = false;
        idle = true;
      }, this);
      if (game.physics.arcade.overlap(player, enemy)) cropLife();
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

function handlePlayerJump(){
  if(cursors.up.isDown && player.body.touching.down)
  {
    idle = false;
    attacking = false;
    jumping = true;
    player.body.velocity.y = -240;
  }
}

function inputsDeclarations() {
    cursors = game.input.keyboard.createCursorKeys();
    lightPunch = game.input.keyboard.addKey(Phaser.Keyboard.C);
}

function createLife(){
  lifeBG = game.add.image(50, 50, 'lifeBG');
  life = game.add.image(53, 53, 'life');
  cropRect = new Phaser.Rectangle(0, 0, 0, life.height);
}

function cropLife(){
  lifeTween = game.add.tween(cropRect).to( { width: (life.width - 10) }, 200, Phaser.Easing.Linear.None, true);
  lifeTween.onComplete.add(()=>{life.crop(cropRect)});
  lifeTween.start();
}
