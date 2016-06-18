

///////////////////////////////////    Objecte game
function Game(){

    this.MODES = {NORMAL: "NORMAL", PROVES: "PROVES"};
    this.modus = this.MODES.NORMAL;

    this.addHandlers();
    this.defineixConstants();

    this.VIDES_INICIALS = 4;
    this.VIDES_MAX = 10;

    this.BONUS_VIDES_EXTRA = 1;     // Una vida extra per nivell
    this.BONUS_BOLES_EXTRA = 2;     // 2 vides extres per nivell
    this.BONUS_ATOMIC_MAX = 3;      // Una reacció en cadena per nivell

    /// VALORS NORMALS
    this.VELOCITAT_FLASH = 800;
    this.VELOCITAT_MAX = 300;
    this.VELOCITAT_MIN = 250;
    this.VELOCITAT_BONUS = 300;
    this.VELOCITAT_RAQUETA = 1000;
    this.COLOR_RAQUETA = "#296FC0";
    this.COLOR_RAQUETA_BONUS = "#F41314";
    this.COPS_RAQUETA_BONUS = 5;    // Cops que pot donar la raqueta amb extra de força


    this.AMPLADA_PISTA = 15;    // Numero de Totxos
    this.ALCADA_PISTA = 28;     // Alçada de la pista en totxos

    this.AMPLADA_RAQUETA=160; this.ALCADA_RAQUETA=20;   // en pixel

    this.AMPLADA_TOTXO=42; this.ALCADA_TOTXO=18; // MIDES DEL TOTXO EN PÍXELS

    this.PILOTA_RADI = 10;          // en pixels
    this.PILOTA_RADI_MAX = 15;      // en pixels


    this.canvas,  this.context;       // context per poder dibuixar en el Canvas
    this.width, this.height;          // mides del canvas

    this.paddle;   // la raqueta
    this.ball;     // la pilota
    this.totxos;   // les totxanes del mur
    this.bonus;    // els bonus amagats a les totxanes

    this.jugador = "";      // El jugador
    this.puntuacio = 0;     // La puntuació de la partida
    this.vides  = 0;        // Les vides que te el jugador

    this.t=0;              // control del temps
    this.silenci = true;  // control dels efectes de so

    this.previousStatus = this.ESTATS.JOC_PREPARAT;
    this.status = this.ESTATS.JOC_PREPARAT; // estat del joc

    this.auto = false;     // Mode de joc automàtic
    this.clear = true;     // Mode de visualització continu

    this.CLAU_LOCAL_STORAGE = "BREAKOUT_TOP3_RECORDS_BY_LEVEL";
    this.record;

    this.reaccioCadenaActivada = false;

}

Game.prototype.mostrarPantallaInici = function(){

    $("#loginJugador").fadeIn(1000);
    $("#txtJugador")[0].focus();
    $("#txtJugador")[0].select();

};



Game.prototype.defineixConstants = function () {

    //Estats del joc
    this.ESTATS = {
        JOC_INICIAT: "JOC_INICIAT",
        JOC_PREPARAT: "JOC_PREPARAT",
        JOC_PERDUT: "JOC_PERDUT",
        JOC_MARXA: "JOC_MARXA",
        JOC_PAUSAT: "JOC_PAUSAT",
        JOC_NIVELL_ACABAT: "JOC_NIVELL_ACABAT",
        JOC_GUANYAT: "JOC_GUANYAT"
    };

    // Events del teclat
    this.key={
        RIGHT:{code: 39, pressed:false},
        LEFT :{code: 37, pressed:false},
        UP :{code: 38, pressed:false},
        d : {code: 68},
        s : {code: 83},
        b : {code: 66},
        p : {code: 80},
        a : {code: 65},
        c : {code: 67},
        space: {code : 32}
    };


    // Events del joc
    this.EVENT = {
        JOC_INICIAT: "JOC_INICIAT",
        JOC_PREPARAT: "JOC_PREPARAT",
        JOC_PERDUT: "JOC_PERDUT",
        JOC_PAUSAT: "JOC_PAUSAT",
        JOC_CONTINUAT: "JOC_CONTINUAT",
        NOU_RECORD: "NOU_RECORD",
        JOC_GUARDAT: "JOC_GUARDAT",
        RANKING_ESBORRAT: "RANKING_ESBORRAT",
        RANKING_CARREGAT: "RANKING_CARREGAT",

        NIVELL_COMPLETAT: "NIVELL_COMPLETAT",


        NOU_BONUS: "NOU_BONUS",
        BOLA_EXTRA: "BOLA_EXTRA",
        VIDA_EXTRA: "VIDA_EXTRA",
        BONUS_MONEDA: "BONUS_MONEDA",
        BONUS_GEGANT: "BONUS_GEGANT",
        BONUS_PERDUT: "BONUS_PERDUT",
        BONUS_RAQUETA: "BONUS_RAQUETA",
        BONUS_ATOMIC: "BONUS_ATOMIC",
        BOLA_PERDUDA: "BOLA_PERDUDA",
        BOLA_EXTRA_PERDUDA: "BOLA_EXTRA_PERDUDA",
        ULTIMA_VIDA: "ULTIMA_VIDA",
        TOTXO_TRENCAT: "TOTXO_TRENCAT",

        XOC_PISTA_SUPERIOR: "XOC_PISTA_SUPERIOR",
        XOC_PISTA_INFERIOR: "XOC_PISTA_INFERIOR",
        XOC_PISTA_DRETA:    "XOC_PISTA_DRETA",
        XOC_PISTA_ESQUERRA: "XOC_PISTA_ESQUERRA",

        XOC_RAQUETA_SUPERIOR: "XOC_RAQUETA_SUPERIOR",
        XOC_RAQUETA_INFERIOR: "XOC_RAQUETA_INFERIOR",
        XOC_RAQUETA_DRETA:    "XOC_RAQUETA_DRETA",
        XOC_RAQUETA_ESQUERRA: "XOC_RAQUETA_ESQUERRA",

        COP_EFECTE_RAQUETA_ESQUERRA: "COP_EFECTE_RAQUETA_ESQUERRA",
        COP_EFECTE_RAQUETA_CENTRE: "COP_EFECTE_RAQUETA_CENTRE",
        COP_EFECTE_RAQUETA_DRETA: "COP_EFECTE_RAQUETA_DRETA"

    };
};


Game.prototype.notifica = function(e, d) {
    // El joc notifica els events i activa els sons corresponents
    if(game.silenci)
        return;

    switch (e) {
        case game.EVENT.BONUS_MONEDA: $("#audio_bonus_moneda")[0].play();  break;
        case game.EVENT.VIDA_EXTRA: $("#audio_bonus_vida")[0].play(); break;
        case game.EVENT.BOLA_EXTRA: break;
        case game.EVENT.BONUS_GEGANT: $("#audio_bonus_gegant")[0].play(); break;
        case game.EVENT.BONUS_RAQUETA: $("#audio_bonus_raqueta")[0].play(); break;
        case game.EVENT.BONUS_ATOMIC: $("#audio_bonus_atomic")[0].play(); break;
        case game.EVENT.BONUS_PERDUT: break;
        case game.EVENT.NOU_BONUS: $("#audio_nou_bonus")[0].play(); break;

        case game.EVENT.NIVELL_COMPLETAT: $("#audio_nivell_completat")[0].play();  break;

        case game.EVENT.JOC_PREPARAT:   break;
        case game.EVENT.JOC_GUANYAT:  $("#audio_joc_guanyat")[0].play();  break;
        case game.EVENT.RANKING_ESBORRAT:   break;

        case game.EVENT.JOC_INICIAT:   break;
        case game.EVENT.JOC_PERDUT:  $("#audio_joc_perdut")[0].play(); break;

        case game.EVENT.ULTIMA_VIDA: $("#audio_ultima_vida")[0].play(); break;
        case game.EVENT.NOU_RECORD:  $("#audio_nou_record")[0].play(); break;

        case game.EVENT.TOTXO_TRENCAT: break;
        case game.EVENT.BOLA_PERDUDA:
        case game.EVENT.BOLA_EXTRA_PERDUDA: $("#audio_bola_perduda")[0].play(); break;

        case game.EVENT.XOC_PISTA_ESQUERRA:
        case game.EVENT.XOC_PISTA_SUPERIOR:
        case game.EVENT.XOC_PISTA_DRETA:
        case game.EVENT.XOC_PISTA_INFERIOR: break; //

        case game.EVENT.XOC_RAQUETA_SUPERIOR: $("#audio_raqueta")[0].play(); break;
        case game.EVENT.XOC_RAQUETA_ESQUERRA: break;
        case game.EVENT.XOC_RAQUETA_DRETA: break;
        case game.EVENT.XOC_RAQUETA_INFERIOR: $("#audio_error_raqueta")[0].play(); break;


    }

    $("#logPane").prepend($('<p>'+ e +' '+ (d?d:'') + '</p>').fadeIn('slow'));

};



Game.prototype.addHandlers = function(){


    // Events amb jQuery
    $(document).on("keydown", {game:this},function(e) {

        if(e.keyCode==e.data.game.key.RIGHT.code){
            if(game.status == game.ESTATS.JOC_MARXA || game.status == game.ESTATS.JOC_PREPARAT)
                e.data.game.key.RIGHT.pressed = true;
        }
        else if(e.keyCode==e.data.game.key.LEFT.code){
            if(game.status == game.ESTATS.JOC_MARXA || game.status == game.ESTATS.JOC_PREPARAT)
                e.data.game.key.LEFT.pressed = true;
        }
        else if(e.keyCode==e.data.game.key.UP.code || e.keyCode == game.key.space.code){
            game.iniciarNivell();
        }


        if(game.status != game.ESTATS.JOC_INICIAT) {
            if(e.keyCode==game.key.s.code){ // s - so/silenci
                game.canviarSo();
            }
            if(e.keyCode==game.key.d.code){ // d - entra mode proves
                game.modeProves();
            }
            else if(e.keyCode==game.key.b.code){ // b - regenera bonus
                game.regenerarBonus();
            }
            else if(e.keyCode==game.key.p.code){ // p - autra/continua joc
                game.aturaContinuaJoc();
            }
            else if(e.keyCode==game.key.a.code) { // a - activa el móde automàtic
                game.modeAutomatic();
            }
            else if(e.keyCode==game.key.c.code){ // c - desactiva la neteja de pantalla per veure traça de la pilota
                game.mostraTrajectoriaPilota();
            }
        }
        //console.log(e.keyCode);
    });

    $(document).on("keyup", {game:this},function(e) {
        if(e.keyCode==e.data.game.key.RIGHT.code){
            e.data.game.key.RIGHT.pressed = false;
        }
        else if(e.keyCode==e.data.game.key.LEFT.code){
            e.data.game.key.LEFT.pressed = false;
        }
    });

    $("#btnCanviar").click(function (e) {
        e.preventDefault();
        game.mostrarPantallaInici();
    });

    $("#btnPausa").click(function (e) {
        e.preventDefault();
        game.pausar();
    });
    $("#btnResume").click(function (e) {
        e.preventDefault();
        game.continuar();
    });


    $("#txtJugador").keyup(function(event){
        if(event.keyCode == 13){
            $("#btnJugar").click();
        }
    });
    $("#btnReset").click(function (e) {
        game.esborrarRanking();
    });
    $("#btnStats").click(function (e) {
        game.mostrarResumNivell();
    });
    $("#btnSummaryClose").click(function (e) {
        $("#summaryContainer").hide();
        game.carregarNivell();
    });


    $("#btnTornarJugar").click(function (e) {
        $("#gameOverContainer").hide();
        game.inicialitzar();
        game.jugar();
    });
    
    
    $("#btnSeguent").click(function (e) {
        $("#summaryContainer").hide();
        game.passarSeguentNivell();
    });

    $("#btnJugar").click(function (e) {

        var nom = $("#txtJugador").val();

        var result = game.validarNom(nom);
        if(result == "") {
            $("#loginJugador").hide();

            game.jugador = nom;
            game.jugar();
        } else {
            $("#loginError").html(result);
        }

    });

    $("#btnLevelUp").click(function (e) {
        game.pujarNivell();
    });
    $("#btnLevelDown").click(function (e) {
        game.baixarNivell();
    });


    $("#imatgeSo").click(function(){
        game.canviarSo();

    });


};

Game.prototype.canviarSo = function(){

    game.silenci = !game.silenci;

    if(!game.silenci){ // fem play
        $("#imatgeSo").attr("src","imatges/audioOn.png");
    }
    else{         // fem pause
        $("#imatgeSo").attr("src","imatges/audioOff.png");
    }
};


Game.prototype.mostraTrajectoriaPilota = function(){
    if(game.status==game.ESTATS.JOC_MARXA)
        game.clear = !game.clear;
};

Game.prototype.modeAutomatic = function(){
    if(game.status==game.ESTATS.JOC_MARXA)
        game.auto = !game.auto;
};

Game.prototype.aturaContinuaJoc = function(){
    if(game.status == game.ESTATS.JOC_MARXA)
        game.pausar();
    else if(game.status == game.ESTATS.JOC_PAUSAT )
        game.continuar();
};

Game.prototype.regenerarBonus = function(){
    if(game.status == game.ESTATS.JOC_PREPARAT)
        game.carregarBonus();
};

Game.prototype.modeProves = function(){
    if(game.status == game.ESTATS.JOC_PREPARAT || game.status == game.ESTATS.JOC_PAUSAT)
        if(game.modus != game.MODES.PROVES)
            game.modus = game.MODES.PROVES;
        else
            game.modus = game.MODES.NORMAL;
};


Game.prototype.validarNom = function(s){
    if(s.length < 3) return "El nom ha de tenir 3 lletres min.";
    if(s.length > 8) return "El nom ha de tenir 8 lletres max.";
    return "";
};


Game.prototype.inicialitzar = function(){

    this.canvas = document.getElementById("game");
    this.width = this.AMPLADA_TOTXO*this.AMPLADA_PISTA;  // 15 totxos com a màxim d'amplada
    this.canvas.width = this.width;
    this.height = this.ALCADA_TOTXO*this.ALCADA_PISTA;
    this.canvas.height =this.height;
    this.context = this.canvas.getContext("2d");

    this.llegirNivells();
    this.nivell = 0;

    this.totxos = [];
    this.balls = [];
    this.bonus = [];
    this.record = [];

    this.paddle = new Paddle(this.AMPLADA_RAQUETA, this.ALCADA_RAQUETA, this.VELOCITAT_RAQUETA, game.COLOR_RAQUETA);

    this.puntuacio = 0;
    this.vides = this.VIDES_INICIALS;

    this.carregarRanking();

    this.t=new Date().getTime();     // inicialitzem el temps
    mainLoop();

    this.status = game.ESTATS.JOC_INICIAT;
    this.notifica(game.EVENT.JOC_INICIAT);

};

Game.prototype.jugar = function(){

    $("#splashContainer").hide();
    this.carregarNivell();

};


Game.prototype.draw = function(){

    if(this.clear) {
        // Metode suau, amb transparencia
        //this.context.fillStyle = 'rgba(255,255,255,0.6)';
        //this.context.fillRect(0,0,this.width,this.height);

        // Metode fort
        this.context.clearRect(0, 0, this.width, this.height);
    }

    for(var i=0; i<this.totxos.length; i++ )
        this.totxos[i].draw(this.context);

    for(var i=0; i<this.bonus.length; i++ )
        this.bonus[i].draw(this.context);

    this.paddle.draw(this.context);

    for(var i=0; i<this.balls.length; i++ )
        this.balls[i].draw(this.context);
};


Game.prototype.update = function() {

    var dt = Math.min((new Date().getTime() - this.t) / 1000, 0.1); // temps, en segons, que ha passat des del darrer update
    this.t = new Date().getTime();

    if(this.status == game.ESTATS.JOC_PAUSAT) return;

    this.paddle.update(dt);    // Moviment de la raqueta

    if(this.status == game.ESTATS.JOC_MARXA) {

        this.bonus.forEach(function (b) { // Moviment dels bonus
            b.update(dt);
        });
        this.totxos.forEach(function (t) { // Moviment dels totxos
            t.update(dt);
        });
        this.balls.forEach(function (b) { // moviment de la bola, depen del temps que ha passat
            b.update(dt);
        });

        if(this.auto) {
            this.paddle.x = Math.max(0, Math.min(this.width - this.paddle.width, this.ball.x-this.paddle.width/2));
        }

        /**/
        // Només quan tot esta aturat s'avalua l'estat del joc
        // - Bonus de vida agafats despres de perdre la pilota
        if(this.status == game.ESTATS.JOC_MARXA) {

            var bolesAturades = this.balls.filter(function (b) {
                    return Math.abs(b.vy)==0.0;
                }).length == this.balls.length;

            if(bolesAturades) {

                var bonusAturats = this.bonus.filter(function (b) {
                        return Math.abs(b.vy)==0.0;
                    }).length == this.bonus.length;

                if(bonusAturats) {
                    if(this.estaNivellCompletat()) { // Comprovar si el nivell esta complert

                        // Guardar marca de la partida
                        this.guardarPuntuacio();

                        this.carregarRanking();

                        this.notifica(game.EVENT.NIVELL_COMPLETAT);
                        this.accioNivellCompletat();

                    } else {
                        if(this.estaJocAcabat())
                            this.accioJocPerdut();
                        else
                            this.prepararNivell();
                    }

                }
            }
        }


    }

    this.escombrar();
};

Game.prototype.escombrar = function() {

    this.totxos = this.totxos.filter(function (t) { // Eliminar totxos no actius
        return t.esPotEscombrar != true;
    });

    this.bonus = this.bonus.filter(function (t) { // Eliminar bonus no actius
        return t.active == true;
    });

    this.balls = this.balls.filter(function (t) { // Eliminar boles no actives
        return t.active == true;
    })
};

Game.prototype.carregarMur = function(){

    this.totxos.length = 0;

    // Mur de totxtos
    var nivellActual = this.NIVELLS[this.nivell];
    for( var j =0; j<nivellActual.totxos.length; j++) {
        var s = nivellActual.totxos[j];
        for(var i = 0; i<= s.length; i++) {
            if(nivellActual.colors[s[i]] != undefined) {

                var colorIndex = s[i];
                var color = nivellActual.colors[colorIndex];
                var punts = j*10;

                var totxo = new Totxo(this.AMPLADA_TOTXO*i,this.ALCADA_TOTXO*j,this.AMPLADA_TOTXO,this.ALCADA_TOTXO, color, punts);
                totxo.fila = j;
                totxo.columna = i;
                this.totxos.push(totxo);
            }
        }
    }
    
}

Game.prototype.carregarNivell = function(){

    this.carregarMur();
    
    // La puntuació depén del nivell
    this.puntuacio = 0;

    this.carregarBonus();

    this.prepararNivell();

};

Game.prototype.carregarBonus = function(){

    this.bonus = []; // Eliminem els bonus anteriors
    for( var j =0; j<this.totxos.length; j++) {
        var totxo = this.totxos[j];
        totxo.bonus = null;
    }

    //Comptadors de bonus
    var countBonusSize = 0;
    var countBonusVides = 0;
    var countBonusFlash = 0;
    var countBonusBoles = 0;
    var countBonusMonedes = 0;

    //TODO Millorar la barreja aleatoria de bonus als totxos
    // barrejem el totxos al array, cada totxo te la posicio assignada
    this.totxos = Utilitats.barrejar(this.totxos);

    // Definició de quantitats màximas de bonus
    var maxBonus = 2/3*this.totxos.length;
    var maxBonusVides = this.BONUS_VIDES_EXTRA;
    var maxBonusBoles =  this.BONUS_BOLES_EXTRA;
    var maxBonusSize = 8;
    var maxBonusLeft = maxBonus - maxBonusVides-maxBonusBoles;
    var maxBonusMonedes = maxBonusLeft*0.5;
    maxBonusLeft -= maxBonusMonedes;
    var maxBonusFlash = maxBonusLeft*0.5;

    for( var j =0; j<this.totxos.length; j++) {
        var totxo = this.totxos[j];

        if(j < game.BONUS_ATOMIC_MAX) {
            totxo.bonus = new BonusAtomic(totxo.x+totxo.w/2 ,totxo.y+totxo.h/2, 16, totxo.color);
        } else
        if(countBonusVides < maxBonusVides) {
            totxo.bonus = new BonusVida(totxo.x + totxo.w / 2, totxo.y + totxo.h / 2, 16, totxo.color);
            countBonusVides++;
        } else
        if(countBonusBoles < maxBonusBoles){
            totxo.bonus = new BonusBolaExtra(totxo.x+totxo.w/2 ,totxo.y+totxo.h/2, 16, totxo.color, 4);
            countBonusBoles++;
        } else
        if (countBonusMonedes < maxBonusMonedes){
            totxo.bonus = new BonusMoneda(totxo.x+totxo.w/2 ,totxo.y+totxo.h/2, 16, totxo.color, totxo.punts*100);
            countBonusMonedes++;
        } else
        if(countBonusFlash < maxBonusFlash) {
            totxo.bonus = new BonusRaqueta(totxo.x+totxo.w/2 ,totxo.y+totxo.h/2, 16, totxo.color);
            countBonusFlash++;
        } else
        if(countBonusSize < maxBonusSize){
            totxo.bonus = new BonusBolaGran(totxo.x+totxo.w/2 ,totxo.y+totxo.h/2, 16, totxo.color);
            countBonusSize++;
        }

        if(totxo.bonus) {
            this.bonus.push(totxo.bonus);
        }
    }
};


Game.prototype.prepararNivell = function(){

    if(this.vides>0 && this.quantsTotxosQueden()>0 ) {

        this.reaccioCadenaActivada = false; // desactiva la reaccio en cadena
        this.paddle.copsForts = 0; //desactiva la raqueta copsForts

        this.ball = new Ball();
        this.balls = [];
        this.balls.push(this.ball);

        this.ball.radi = game.PILOTA_RADI;

        // Posició inicial de la pilota
        this.ball.x = this.paddle.x+(1/2*this.paddle.width);
        this.ball.y = this.paddle.y-(2*this.ball.radi);

        if(this.vides==1)
            this.notifica(this.EVENT.ULTIMA_VIDA);

        this.status = game.ESTATS.JOC_PREPARAT;
        this.notifica(game.EVENT.JOC_PREPARAT);
    }
};

Game.prototype.crearBolaExtra = function(x, y){

    this.ballExtra = new Ball();

    this.ballExtra.x = x;
    this.ballExtra.y = y;
    this.ballExtra.vx = this.VELOCITAT_MIN;
    this.ballExtra.vy = -1*this.VELOCITAT_MIN;

    this.balls.push(this.ballExtra);
};


Game.prototype.iniciarNivell = function(){
    if(this.status == game.ESTATS.JOC_PREPARAT) {

        this.ball.vx = -1*game.VELOCITAT_MIN;
        this.ball.vy = 1*game.VELOCITAT_MIN;

        this.status = game.ESTATS.JOC_MARXA;
        this.notifica(game.EVENT.JOC_INICIAT);
    }
};

Game.prototype.baixarNivell = function(){
    if(this.status == game.ESTATS.JOC_MARXA) return;
    if(this.nivell>0) {
        this.nivell--;
        this.carregarNivell();
    }
};

Game.prototype.pujarNivell = function(){
    if(this.status == game.ESTATS.JOC_MARXA) return;

    if(this.nivell < this.NIVELLS.length-1) {
        this.nivell++;
        this.carregarNivell();

    }
};


Game.prototype.bolaPerduda = function () {
    // Atura les pilotes
    this.aturarBoles();

    // Perd vida
    this.vides--;
};

Game.prototype.estaJocAcabat = function () {
    if(this.status == game.ESTATS.JOC_PERDUT)
        return true;

    if(this.vides>0)
        return false;

    return 0 == this.quantsBonusCaient();
};

Game.prototype.accioNivellCompletat = function(){
    game.status = game.ESTATS.JOC_PREPARAT;
    this.mostrarResumNivell();
};

Game.prototype.passarSeguentNivell = function(){
    if(this.estaJocCompletat())
        this.mostrarCredits();
    else
        this.pujarNivell()
};


Game.prototype.estaNivellCompletat = function(){
    return (this.totxos.filter(function (t) {
        return t.active==true;
    }).length==0);
};

Game.prototype.estaJocCompletat = function(){
    return (this.nivell == this.NIVELLS.length-1);
};

Game.prototype.mostrarCredits = function(){
    game.status = game.ESTATS.JOC_GUANYAT;
    $("#summaryContainer").hide();
    $("#gameOverContainer").show();
};

Game.prototype.mostrarResumNivell = function(){

    this.status = game.ESTATS.JOC_NIVELL_ACABAT;

    refrescarResum();

    $("#summaryContainer").slideDown();
    $("#btnSeguent").focus();
};


Game.prototype.quantsBonusQueden = function(){
    return this.bonus.filter(function (b) {
        return b.active == true;
    }).length;
};

Game.prototype.quantsBonusCaient = function(){
    return this.bonus.filter(function (b) {
        return b.active == true && b.hidden == false;
    }).length;
};



Game.prototype.quantesBolesQueden = function(){
    return this.balls.filter(function (b) {
        return b.active == true;
    }).length;
};

Game.prototype.quantsTotxosQueden = function(){
    return this.totxos.filter(function (b) {
        return b.active == true;
    }).length;
};



/////////////////////////
/// RANKING

Game.prototype.carregarRanking = function () {

    //localStorage.clear();
    var record = localStorage.getItem(this.CLAU_LOCAL_STORAGE);
    if(record != undefined) {
        this.record = JSON.parse(record);
        this.notifica(this.EVENT.RANKING_CARREGAT);
    }


};

Game.prototype.esborrarRanking = function () {

    this.guardarRanking(); // Sense marca
    this.notifica(game.EVENT.RANKING_ESBORRAT);
};

Game.prototype.guardarPuntuacio = function () {

    var marca = {posicion:1, jugador: this.jugador , nivell: this.nivell , puntuacio: this.puntuacio, data: new Date()};

    this.guardarRanking(marca);
    this.notifica(game.EVENT.JOC_GUARDAT);
};

Game.prototype.guardarRanking = function (m) {

    if(m) {
        this.record.push(m);
        this.record = game.calcularRanking(this.record,3, this.nivell);  // Ordena les marques del nivell

        if (m.posicion == 1) {  // si la marca ha quedat numero 1 efecte de so
            this.notifica(game.EVENT.NOU_RECORD, this.jugador +' ('+ this.nivell +'): '+  this.puntuacio);
        }
    } else {
        this.record = [];
    }

    localStorage.setItem(this.CLAU_LOCAL_STORAGE, JSON.stringify(this.record));
    this.carregarRanking();
};


Game.prototype.calcularRanking = function(series, k, n) {
    var others = series.filter(function (a) {
        return a.nivell != n;
    });

    var orderedSerie = series.filter(function (a) {
        return a.nivell == n;
    }).sort(function (a,b) {
        return b.puntuacio-a.puntuacio;
    });
    var top = [];
    for (var i = 0; i < k && i < orderedSerie.length ; ++i) {
        orderedSerie[i].posicion = i+1;
        top.push(orderedSerie[i]);
    }

    return others.concat(top);
};


/////////////////////////
/// CONTROL DELS ESTATS DEL JOC

Game.prototype.pausar = function(){
    this.previousStatus = this.status;
    this.status = game.ESTATS.JOC_PAUSAT;
    this.notifica(game.EVENT.JOC_PAUSAT);
};
Game.prototype.continuar = function(){
    this.status = this.previousStatus;
    this.notifica(game.EVENT.JOC_CONTINUAT);
};

Game.prototype.accioJocPerdut = function(){

    this.status = game.ESTATS.JOC_PERDUT;
    this.notifica(this.EVENT.JOC_PERDUT);

    $("#gameOverContainer").show();

};


Game.prototype.aturarBoles = function(){

    this.balls.forEach(function (b) {
        b.vx = 0;
        b.vy = 0;
    })
};






///////////////////////////////////    Totxo
function Totxo(x,y,w,h,color,punts,bonus){
    this.x=x; this.y=y;         // posició, en píxels respecte el canvas
    this.w=w; this.h=h;         // mides
    this.color=color;
    this.active = true;
    this.columna = 0;
    this.fila = 0;
    this.punts = (punts?punts:0);
    this.bonus = bonus;
    this.esPotEscombrar = false;
}
Totxo.prototype.draw = function(ctx){

    if(this.w<1) {
        this.esPotEscombrar = true;
        return;
    }

    ctx.save();

    ctx.fillStyle=this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);

    if(!this.active) {
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(0,0,this.w,this.h);
    }

    ctx.strokeStyle="#333";
    ctx.strokeRect(this.x, this.y, this.w, this.h);
    ctx.restore();
};

Totxo.prototype.update = function(dt){

    var factor = 0.08;
    if(!this.active) {
        this.x += this.w/2*factor;
        this.y += this.h/2*factor;
        this.w *= 1-0-factor;
        this.h *= 1-0-factor;
    }

};


///////////////////////////////////    Raqueta
function Paddle(w,h,s,c){
    this.width = w;
    this.height = h;
    this.height_normal = h;
    this.x = game.width/2 - this.width/2;
    this.y = game.height-50;
    this.vx = s;
    this.color = c;
    this.copsForts = 0;
}
Paddle.prototype.draw = function(ctx){
    ctx.save();
    ctx.fillStyle=(this.copsForts>0?game.COLOR_RAQUETA_BONUS:this.color);
    ctx.strokeStyle="#333";

//    ctx.fillRect(this.x, this.y, this.width, this.height);
//    ctx.strokeRect(this.x, this.y, this.width, this.height);

    roundRect(ctx, this.x, this.y, this.width, this.height, 0.2*this.height, true, true);
    ctx.restore();
};

Paddle.prototype.update = function(dt){

    this.height = this.height_normal + (this.copsForts);

    if (game.key.RIGHT.pressed) {
        this.x = Math.min(game.width - this.width, this.x + dt*this.vx);
    } else if (game.key.LEFT.pressed) {
        this.x = Math.max(0, this.x - dt*this.vx);
    }

    // Si la bola està aturada, la raqueta mou la pilota principal
    if(game.status != game.ESTATS.JOC_MARXA) {
        if(game.ball) {
            game.ball.x = this.x + this.width / 2;
            game.ball.y = this.y - (2*game.ball.radi);
        }

    }
};


/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined" ) {
        stroke = true;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
        ctx.stroke();
    }
    if (fill) {
        ctx.fill();
    }
}



