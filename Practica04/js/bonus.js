
///////////////////////////
function BaseBonus(x,y,r,color ){

    this.x=x; this.y=y;             // posició, en píxels respecte el canvas
    this.radi = r;                  // radi del bonus
    this.vx = 0; this.vy = 0;
    this.color = color;
    this.hidden = true;
    this.active = true;
    this.punts = 0;
    this.trajectoria = undefined;
}
BaseBonus.prototype.draw = function(ctx){
    if(game.modus != game.MODES.PROVES && this.hidden) return;

    ctx.save();
    if(this.imatge) {
        ctx.drawImage(this.imatge, this.x-this.radi, this.y-this.radi,32, 32);
    } else {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radi, 0, 2*Math.PI);   // Cercle de collisio
        ctx.fill();
        ctx.stroke();

    }

    if(game.modus == game.MODES.PROVES && this.trajectoria) {
        ctx.beginPath();
        ctx.moveTo(this.trajectoria.p1.x,this.trajectoria.p1.y);
        ctx.lineTo(this.trajectoria.p2.x,this.trajectoria.p2.y);
        ctx.stroke();
    }

    ctx.restore();
};

BaseBonus.prototype.update = function(dt){

    this.trajectoria={};
    this.trajectoria.p1={x:this.x, y:this.y};
    var deltaX = this.vx*dt;
    var deltaY = this.vy*dt;
    this.trajectoria.p2={x:this.x + deltaX, y:this.y + deltaY};  // nova posició de la bola

    // Xoc amb la raqueta
    if (this.trajectoria.p2.y + this.radi > game.paddle.y){
        var rXoc=Utilitats.interseccioSegmentRectangle(this.trajectoria,{p:{x:game.paddle.x-this.radi,y:game.paddle.y-this.radi},
            w:game.paddle.width+2*this.radi,
            h:game.paddle.height+2*this.radi});
        if(rXoc) {
            this.active = false;

            if(this instanceof BonusBolaExtra) {
                game.notifica(game.EVENT.BOLA_EXTRA, this.bola);
                game.crearBolaExtra(this.x,this.y);
            }
            if(this instanceof BonusVida) {
                game.notifica(game.EVENT.VIDA_EXTRA);
                game.vides += this.vides;
                if(game.vides>game.VIDES_MAX) game.vides=game.VIDES_MAX;
            }
            if(this instanceof BonusMoneda) {
                game.notifica(game.EVENT.BONUS_MONEDA);
                game.puntuacio += this.punts;
            }
            if(this instanceof BonusBolaGran) {
                game.notifica(game.EVENT.BONUS_GEGANT);
                game.balls.forEach(function (b) {
                    b.radi = game.PILOTA_RADI_MAX;
                    b.radi = game.PILOTA_RADI_MAX;
                });
            }
            if(this instanceof BonusRaqueta) {
                game.notifica(game.EVENT.BONUS_RAQUETA);
                game.paddle.copsForts += game.COPS_RAQUETA_BONUS;
            }
            if(this instanceof BonusAtomic) {
                // La reacció en cadena s'activa al trencar la totxana
                var count = 5;
                for(var i =0; i < game.totxos.length && i < count; i++) {
                    var totxo = game.totxos[i];
                    if(totxo.active)
                        game.crearBolaExtra(totxo.x,totxo.y);
                }
            }

            // Queden totxanes o bonus?
            if(game.quantsTotxosQueden() == 0)
                if(game.quantsBonusQueden() == 0)
                    game.aturarBoles();

        }
    }
    this.x=this.trajectoria.p2.x;
    this.y=this.trajectoria.p2.y;

    if(this.y>game.height){
        game.notifica(game.EVENT.BONUS_PERDUT);
        this.active = false;

        // Queden totxanes o bonus?
        if(game.quantsTotxosQueden() == 0)
            if(game.quantsBonusQueden() == 0)
                game.aturarBoles();

    }

};

function BonusAtomic(x, y, r, color, vides ){
    BaseBonus.call(this,x,y,r,color);
    this.imatge = $("#atomic")[0];
}
BonusAtomic.prototype = Object.create(BaseBonus.prototype);
BonusAtomic.prototype.constructor = BonusAtomic;


function BonusRaqueta(x, y, r, color, vides ){
    BaseBonus.call(this,x,y,r,color);
    this.imatge = $("#raqueta")[0];
}
BonusRaqueta.prototype = Object.create(BaseBonus.prototype);
BonusRaqueta.prototype.constructor = BonusRaqueta;


function BonusVida(x,y,r,color, vides ){
    BaseBonus.call(this,x,y,r,color);
    this.imatge = $("#cor")[0];
    this.vides = 1;
}
BonusVida.prototype = Object.create(BaseBonus.prototype);
BonusVida.prototype.constructor = BonusVida;

///////////////////////////////////    Bonus Moneda
function BonusMoneda(x,y,r,color, punts ){
    BaseBonus.call(this,x,y,r,color);
    this.imatge = $("#moneda")[0];
    this.punts = (punts?punts:1);
}
BonusMoneda.prototype = Object.create(BaseBonus.prototype);
BonusMoneda.prototype.constructor = BonusMoneda;

///////////////////////////////////    Bonus Bola
function BonusBolaExtra(x, y, r, color, bolas){
    BaseBonus.call(this,x,y,r,color);
    this.imatge = $("#pilota")[0];
    this.bolas = (bolas?bolas:1);
}
BonusBolaExtra.prototype = Object.create(BaseBonus.prototype);
BonusBolaExtra.prototype.constructor = BonusBolaExtra;


function BonusBolaGran(x, y, r, color ){
    BaseBonus.call(this,x,y,r,color);
    this.imatge = $("#pizza")[0];
}
BonusBolaGran.prototype = Object.create(BaseBonus.prototype);
BonusBolaGran.prototype.constructor = BonusBolaGran;

