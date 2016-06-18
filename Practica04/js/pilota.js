
///////////////////////////////////    Pilota
function Ball(){
    this.x = 0; this.y = 0;         // posició del centre de la pilota
    this.vx = 0;  this.vy = 0;      // velocitat
    this.radi = game.PILOTA_RADI;   // radi de la pilota
    this.color = "#abefef";         // gris fosc
    this.gradient = true;
    this.active = true;

    this.trajectoria = undefined;
}


Ball.prototype.draw = function(ctx){
    if(!this.active) return;

    ctx.save();
    if (this.gradient){
        var grad = ctx.createRadialGradient(this.x,this.y,0,this.x-5,this.y-5,this.radi);
        grad.addColorStop(0,'#ffffff');
        grad.addColorStop(1,this.color);
        ctx.fillStyle = grad;
    }else {
        ctx.fillStyle = this.color;
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radi, 0, 2*Math.PI);   // pilota rodona
    ctx.fill();
    ctx.stroke();

    if(game.modus == game.MODES.PROVES && this.trajectoria) {
        ctx.beginPath();
        ctx.moveTo(this.trajectoria.p1.x,this.trajectoria.p1.y);
        ctx.lineTo(this.trajectoria.p2.x,this.trajectoria.p2.y);
        ctx.stroke();
    }

    ctx.restore();
};


Ball.prototype.update = function(dt){
    if(!this.active) return;

    var dtXoc;      // temps empleat fins al xoc
    var xoc=false;  // si hi ha xoc en aquest dt
    var k;          // proporció de la trajectoria que supera al xoc

    this.trajectoria = {};
    this.trajectoria.p1={x:this.x, y:this.y};
    var deltaX=this.vx*dt;
    var deltaY=this.vy*dt;
    this.trajectoria.p2={x:this.x + deltaX, y:this.y + deltaY};  // nova posició de la bola

    // mirem tots els possibles xocs de la bola
    // Xoc amb la vora de sota de la pista
    if (this.trajectoria.p2.y + this.radi > game.height){

        // pilota perduda
        this.active = false;

        if(game.quantesBolesQueden()>0) {
            // Encara queden mes
            game.notifica(game.EVENT.BOLA_EXTRA_PERDUDA);

        } else {
            // hem perdut l'intent actual
            game.notifica(game.EVENT.BOLA_PERDUDA);

            game.bolaPerduda();
        }
    }

    // Xoc amb la vora de dalt de la pista
    if (this.trajectoria.p2.y - this.radi < 0){
        k=(this.trajectoria.p2.y-this.radi)/this.vy;  // k sempre positiu
        // ens col·loquem just tocant la vora de dalt   
        this.x=this.trajectoria.p2.x-k*this.vx;
        this.y=this.radi;
        this.vy = -this.vy;
        dtXoc=k*dt;  // temps que queda
        xoc=true;
        //game.notifica(game.EVENT.XOC_PISTA_SUPERIOR);

    }

    // Xoc amb la vora dreta de la pista
    if (this.trajectoria.p2.x + this.radi > game.width){
        k=(this.trajectoria.p2.x+this.radi - game.width)/this.vx;
        // ens col·loquem just tocant la vora de la dreta  
        this.x=game.width-this.radi;
        this.y=this.trajectoria.p2.y-k*this.vy;
        this.vx = -this.vx;
        dtXoc=k*dt;  // temps que queda
        xoc=true;
        //game.notifica(game.EVENT.XOC_PISTA_DRETA);
    }

    // Xoc amb la vora esquerra de la pista
    if (this.trajectoria.p2.x - this.radi< 0){
        k=(this.trajectoria.p2.x-this.radi)/this.vx;  // k sempre positiu
        // ens col·loquem just tocant la vora de l'esquerra  
        this.x=this.radi;
        this.y=this.trajectoria.p2.y-k*this.vy;
        this.vx = -this.vx;
        dtXoc=k*dt;  // temps que queda
        xoc=true;
        //game.notifica(game.EVENT.XOC_PISTA_ESQUERRA);
    }

    for(var i=0; i<game.totxos.length; i++ ) {
        var totxo = game.totxos[i];
        if(!totxo.active) continue;

        // Xoc amb el totxo
        var pXoc=Utilitats.interseccioSegmentRectangle(this.trajectoria,{p:{x:totxo.x-this.radi,y:totxo.y-this.radi},
            w:totxo.w+2*this.radi,
            h:totxo.h+2*this.radi});
        if(pXoc){
            xoc=true;
            this.x=pXoc.p.x;
            this.y=pXoc.p.y;
            switch(pXoc.vora){
                case "superior":
                case "inferior":
                    this.vy = -this.vy; break;
                case "esquerra":
                case "dreta"   :
                    this.vx = -this.vx; break;
            }
            dtXoc=(Utilitats.distancia(pXoc.p,this.trajectoria.p2)/Utilitats.distancia(this.trajectoria.p1,this.trajectoria.p2))*dt;

            game.notifica(game.EVENT.TOTXO_TRENCAT);

            game.puntuacio += totxo.punts;
            this.color = totxo.color;

            // Augmentar el tamany de la pilota
            //game.ball.radi = Math.min(game.PILOTA_RADI_MAX, game.ball.radi*1.01);

            // Cada totxo trencat fa augmentar la velocitat 10%
            //this.vx = Math.min(game.VELOCITAT_MAX, this.vx*1.1);
            //this.vy = Math.min(game.VELOCITAT_MAX, this.vy*1.1);


            // Si el totxo te Bonus, el deixa anar
            if(totxo.bonus != undefined) {
                if(totxo.bonus.hidden) {
                    game.notifica(game.EVENT.NOU_BONUS);
                    totxo.bonus.vy = game.VELOCITAT_BONUS;
                    totxo.bonus.hidden = false;

                    if(totxo.bonus instanceof BonusAtomic) {
                        game.notifica(game.EVENT.BONUS_ATOMIC);
                    }
                }
            }

            totxo.active = false;

            // Queden totxanes o bonus?
            if(game.quantsTotxosQueden() == 0)
                if(game.quantsBonusQueden() == 0)
                    game.aturarBoles();

            break;
        }
    }


    if(!xoc) {
        // Xoc amb la raqueta
        var rXoc=Utilitats.interseccioSegmentRectangle(this.trajectoria,{p:{x:game.paddle.x-this.radi,y:game.paddle.y-this.radi},
            w:game.paddle.width+2*this.radi,
            h:game.paddle.height+2*this.radi});
        if(rXoc) {
            xoc = true;
            this.x = rXoc.p.x;
            this.y = rXoc.p.y;

            switch (rXoc.vora) {
                case "superior":
                    game.notifica(game.EVENT.XOC_RAQUETA_SUPERIOR);

                    this.vy = -this.vy; // Rebot vertical

                    var DIRS = {aturat:0, bola_cap_a_la_dreta:1, bola_cap_a_l_esquerra:2};
                    var COPS = {cop_al_centre:0, cop_per_la_dreta:1, cop_per_l_esquerra:2};

                    var dir = DIRS.aturat;
                    if(this.vx > 0.0)
                        dir = DIRS.bola_cap_a_la_dreta;
                    else if (this.vx < 0.0)
                        dir = DIRS.bola_cap_a_l_esquerra;

                    var cop = COPS.cop_al_centre;
                    if( rXoc.p.x < game.paddle.x+(1/4*game.paddle.width)) {
                        cop = COPS.cop_per_l_esquerra ;
                    } else if(rXoc.p.x > game.paddle.x+(3/4*game.paddle.width)) {
                        cop = COPS.cop_per_la_dreta;
                    }

                    var distancia_al_centre = 2.0* Math.abs(game.paddle.x+(1/2*game.paddle.width) - rXoc.p.x);

                    // Cop d'efecte horitzontal amb la raqueta
                    if( dir == DIRS.bola_cap_a_la_dreta && cop == COPS.cop_per_l_esquerra ) { // Si la pilota va cap a la dreta
                        this.vx = -this.vx+distancia_al_centre;
                        game.notifica(game.EVENT.COP_EFECTE_RAQUETA_ESQUERRA, this.vx.toFixed(2));
                    } else if(dir == DIRS.bola_cap_a_l_esquerra && cop == COPS.cop_per_la_dreta ) { // Si la pilota va cap a l'esquerra i el cop es per la dreta
                        this.vx = -this.vx+distancia_al_centre;
                        game.notifica(game.EVENT.COP_EFECTE_RAQUETA_DRETA, this.vx.toFixed(2));
                    } else { // cop al centre amortigua la velocitat
                        this.vx = this.vx*0.5;
                    }

                    // Control de velocitat dins dels límits
                    var signx = this.vx / Math.abs(this.vx);
                    this.vx = Math.abs(this.vx);
                    this.vx = (Math.max(this.vx,game.VELOCITAT_MIN));
                    this.vx = (Math.min(this.vx,game.VELOCITAT_MAX));
                    this.vx = signx*this.vx;

                    var signy = this.vy / Math.abs(this.vy);
                    this.vy = Math.abs(this.vy);
                    this.vy = (Math.max(this.vy,game.VELOCITAT_MIN));
                    this.vy = (Math.min(this.vy,game.VELOCITAT_MAX));
                    this.vy = signy*this.vy;


                    break;
                case "inferior":
                    game.notifica(game.EVENT.XOC_RAQUETA_INFERIOR);
                    break;
                case "esquerra":
                    game.notifica(game.EVENT.XOC_RAQUETA_ESQUERRA);
                    this.vx = -this.vx; break;
                    break;
                case "dreta"   :
                    game.notifica(game.EVENT.XOC_RAQUETA_DRETA);
                    this.vx = -this.vx; break;
                    break;
            }

            
            // Efecte Flash: Increment de la velocitat al donar un cop
            var velocitat_max = game.VELOCITAT_MIN;
            if(game.paddle.copsForts>0) {
                velocitat_max = game.VELOCITAT_FLASH;
                this.vy *= 4.0;
                game.paddle.copsForts--;
            } else {
                game.paddle.height = game.ALCADA_RAQUETA;
            }


            // Cada cop de raqueta fa disminuir la velocitat 10%, Controlar el sentit del rebot
            if(this.vx>0)
                this.vx = Math.min(velocitat_max, this.vx * 0.90);
            else
                this.vx = Math.max(-1*velocitat_max, this.vx * 0.90);
            if(this.vy>0)
                this.vy = Math.min(velocitat_max, this.vy * 0.90);
            else
                this.vy = Math.max(-1*velocitat_max, this.vy * 0.90);



            dtXoc=(Utilitats.distancia(rXoc.p,this.trajectoria.p2)/Utilitats.distancia(this.trajectoria.p1,this.trajectoria.p2))*dt;
        }
    }



    // actualitzem la posició de la bola
    if(xoc){
        this.update(dtXoc);  // crida recursiva
    }
    else{
        this.x=this.trajectoria.p2.x;
        this.y=this.trajectoria.p2.y;
    }
};
