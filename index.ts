import {Engine, Actor, Color, Vector, Input, vec, Loader, Sound, CollisionGroup, CollisionGroupManager, CollisionType} from 'excalibur';
const coinSoundFile = require('url:./assets/sound/pickupCoin.wav');

const PLAYER_VELOCITY_MAX = 100;

const inputX = (engine: Engine) : number => {
    if (engine.input.keyboard.isHeld(Input.Keys.D))
    {
        return 1;
    }
    else if (engine.input.keyboard.isHeld(Input.Keys.A))
    {
        return -1;
    }
    else
    {
        return 0;
    }
}

const inputY = (engine: Engine) : number => {
    if (engine.input.keyboard.isHeld(Input.Keys.W))
    {
        return -1;
    }
    else if (engine.input.keyboard.isHeld(Input.Keys.S))
    {
        return 1;
    }
    else
    {
        return 0;
    }
}

const coinSound = new Sound(coinSoundFile);

const loader = new Loader();

loader.addResource(coinSound);

const game = new Engine({
    width: 800,
    height: 600,
});

const player = new Actor({
    pos: vec(100, 100),
    radius: 10,
    color: Color.Green,
    collisionGroup: CollisionGroupManager.create('Player'),
    collisionType: CollisionType.Active,
});

const coin = new Actor({
    pos: vec(500, 200),
    radius: 5,
    color: Color.Yellow,
    collisionGroup: CollisionGroupManager.create('Collectables'),
    collisionType: CollisionType.Passive,
    
})

coin.addTag('collectable');

const wall = new Actor({
    pos: vec(200, 100),
    height: 300,
    width: 10,
    color: Color.fromRGB(150, 100, 100),
    collisionGroup: CollisionGroupManager.create('Walls'),
    collisionType: CollisionType.Fixed,
});

player.on('postupdate', (event) => {
    player.vel = vec(PLAYER_VELOCITY_MAX * inputX(event.engine), PLAYER_VELOCITY_MAX * inputY(event.engine))
});

player.on('collisionstart', (event) => {
    const {other} = event;
    if (other.hasTag('collectable'))
    {
        coinSound.play();
    
        other.kill();
    }
});  

game.add(player);
game.add(coin);
game.add(wall);

game.start(loader);