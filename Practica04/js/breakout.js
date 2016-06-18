

//////////////////////////////////////////////////////////////////////
// Comença el programa
var game;
$(document).ready(function(){

    game= new Game();  	   // Inicialitzem la instància del joc
    game.inicialitzar();   // estat inicial del joc
    game.carregarMur();

    /*
     game.jugador = "Proves";
     game.jugar();
     */

    setTimeout(function () {
        game.mostrarPantallaInici();
    },1000);
    
    
});

function mainLoop(){
    game.draw();
    game.update();
    refrescarPantalla();
    requestAnimationFrame(mainLoop);
}

function refrescarPantalla(){

    $("#btnCanviar").prop('disabled', game.status == game.ESTATS.JOC_MARXA );


    var sText = "";
    sText += "<p>modus:"+ game.modus +"</p>";
    sText += "<p>status:"+ game.status +"</p>";
    sText += "<p>vides:"+ game.vides +"</p>";
    sText += "<p>pilotes:"+ game.balls.length +"</p>";
    sText += "<p>bonus:"+ game.bonus.length +"</p>";
    sText += "<p>totxos:"+ game.totxos.length +"</p>";

    sText += "<p>Reaccio Cadena:"+ game.reaccioCadenaActivada +"</p>";
    sText += "<p>Raqueta copsForts:"+ game.paddle.copsForts +"</p>";
    sText += "<p>Auto:"+ game.auto +"</p>";
    sText += "<p>Silenci:"+ game.silenci +"</p>";
    $("#statusPane-content").html(sText);


    if(game.modus == game.MODES.NORMAL) {
        $("#logPane").hide();
        $("#statusPane").hide();
        $("#btnStats").hide();
        $("#btnReset").hide();
    } else {
        $("#logPane").show();
        $("#statusPane").show();
        $("#btnStats").show();
        $("#btnReset").show();
    }


    $("#pujarNivell").prop('disabled', game.status == game.ESTATS.JOC_MARXA);
    if(!game.status == game.ESTATS.JOC_MARXA) {
        $("#pujarNivell").prop('disabled', (game.nivell == game.NIVELLS.length-1));
        $("#baixarNivell").prop('disabled', (game.nivell == 0));
    }
    if(game.status == game.ESTATS.JOC_MARXA){
        $("#btnPausa").show();
    } else {
        $("#btnPausa").hide();
    }

    if(game.status == game.ESTATS.JOC_PAUSAT){
        $("#btnResume").show();
    } else {
        $("#btnResume").hide();
    }


    $("#jugador").html(game.jugador);
    $("#nivell").html(game.nivell+1);
    $("#puntuacio").html(game.puntuacio.toLocaleString());

    refrescarVides();
    refrescarRanking();
}

function refrescarVides() {

    var value = game.vides;
    $(".vida").remove();
    for (f = 1; f <= value; f++)
        $("#vides").append('<div id="vida_'+ f +'" class="vida"></div>');
}

function refrescarRanking() {

    if(game.record != undefined) {

        var recordNivell = game.record.filter(function (r) {
            return r.nivell == game.nivell;
        });

        for (var f = 0; f < 3; f++){
            var marca;
            if(f<recordNivell.length) {
                marca = recordNivell[f];
                $("#record-number-"+ (f+1)).html(marca.posicion);
                $("#record-name-"+ (f+1)).html(marca.jugador);
                $("#record-value-"+ (f+1)).html(marca.puntuacio.toLocaleString());
            } else {
                $("#record-number-"+ (f+1)).html("&nbsp;");
                $("#record-name-"+ (f+1)).html("&nbsp;");
                $("#record-value-"+ (f+1)).html("&nbsp;");
            }
        }
    }
}


function refrescarResum() {

    if(game.record != undefined) {

        var recordNivell = game.record.filter(function (r) {
            return r.nivell == game.nivell;
        });

        for (var f = 0; f < 3; f++){
            var marca;
            if(f<recordNivell.length) {
                marca = recordNivell[f];
                $("#summary-number-"+ (f+1)).html(marca.posicion);
                $("#summary-name-"+ (f+1)).html(marca.jugador);
                $("#summary-value-"+ (f+1)).html(marca.puntuacio.toLocaleString());
                var data = new Date(marca.data);
                $("#summary-data-"+ (f+1)).html(data.toLocaleDateString() +' '+ data.toLocaleTimeString() );
            } else {
                $("#summary-number-"+ (f+1)).html("&nbsp;");
                $("#summary-name-"+ (f+1)).html("&nbsp;");
                $("#summary-value-"+ (f+1)).html("&nbsp;");
                $("#summary-data-"+ (f+1)).html("&nbsp;");
            }
        }
    }
}



