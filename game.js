var game = new Phaser.Game(512, 224, Phaser.AUTO, 'game', { init: init, preload: preload, create: create, update: update });

var player
var ground
var cursors

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
  player.animations.add('walking', ['walking1.png','walking2.png','walking3.png','walking4.png','walking5.png']);

  cursors = game.input.keyboard.createCursorKeys();

}

function update(){

  game.physics.arcade.collide(player, ground);

  if (cursors.right.isDown)
  {
    player.body.velocity.x = 80;
    player.animations.play('walking', 6, true);
  }
  else if(cursors.left.isDown)
  {
    player.body.velocity.x = -80;
    player.animations.play('walking', 6, true);
  }
  else
  {
    player.body.velocity.x = 0;
    player.animations.play('idle', 6, true);
  }

  if(cursors.up.isDown)
  {

  }
  else if(cursors.down.isDown)
  {

  }
}
