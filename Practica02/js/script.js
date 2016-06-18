
var mapaSeleccionat=""; // imatge del laberint

var canvas, context;
var imatgePista, imatgeCara;

var colorPorta = {ENTRADA:"#f00", SORTIDA:"#0f0"};
var colorCua = "#FEFFA2";

var aturat = {dx:0,dy:0};
var direccio=[{dx:1,dy:0},{dx:0,dy:1},{dx:-1,dy:0},{dx:0,dy:-1}];  // dreta, avall, esquerra i amunt

var cara={x:0,y:0, moviment:aturat};           // posició actual de la cara i moviment de la cara

const DIR={DRETA:0,AVALL:1,ESQUERRA:2, AMUNT:3};  // codi de la tecla
const TECLA={AMUNT:38,AVALL:40,DRETA:39,ESQUERRA:37, MAJUSCULES:16, ESPAI:32};  // codi de la tecla

var teclaShift=false;   // quan apretem la tecla Shift, avancem píxel a píxel
var cua;                // no deixa rastre del camí recorregut

// Pixels per tic
const PIXEL_SPEED = { MAX:16, NORMAL:4, MIN: 1};
var pixelPerTic = PIXEL_SPEED.NORMAL;

var autoMove = false;
var dirIndex = DIR.AVALL;


var temporitzador;  // animacions

var pos = {x:0,y:0};
var distancia = 0;

var crono, temps;  // temporitzador i cronometre
var tempsFinal, tempsInici;

var playing = false; //Control de joc

var imatgesCrono={
    "dg0": (new Image()).src="imatges/dg0.gif",
    "dg1": (new Image()).src="imatges/dg1.gif",
    "dg2": (new Image()).src="imatges/dg2.gif",
    "dg3": (new Image()).src="imatges/dg3.gif",
    "dg4": (new Image()).src="imatges/dg4.gif",
    "dg5": (new Image()).src="imatges/dg5.gif",
    "dg6": (new Image()).src="imatges/dg6.gif",
    "dg7": (new Image()).src="imatges/dg7.gif",
    "dg8": (new Image()).src="imatges/dg8.gif",
    "dg9": (new Image()).src="imatges/dg9.gif",
}

var maps = {
    "mapa1-1": { in: {x:0, y:51}, out: {x:51, y:0}, start: {x:0, y:50}, dirIndex: DIR.ESQUERRA, temps:10 },
    "mapa2-1": { in: {x:187, y:357}, out: {x:357, y:204}, start: {x:180, y:357}, dirIndex: DIR.DRETA, temps:60*2 },
    "mapa3-1": { in: {x:0, y:221},   out: {x:68, y:0},    start: {x:0, y:210}, dirIndex: DIR.ESQUERRA, temps:60*4 }
};


$(document).ready(function(){

    actualitzarMenu();

    $(".imatges").click(function (e) {

        mapaSeleccionat = e.target.id;

        // desremarquem les imatges
        $(".imatges").removeClass("imatgeSeleccionada").addClass("imatgeNoSeleccionada");
        // remarquem la imatge seleccionada
        $(this).removeClass("imatgeNoSeleccionada").addClass("imatgeSeleccionada");

        actualitzarMenu();
    });

    $("#b_inici").click(function () {
        // conmutar pantalles
        $("#menu").css("display","none");
        $("#laberint").css("display","block");

        iniciJoc();
    });
    $(".imatges").dblclick(function () {
        // conmutar pantalles
        $("#menu").css("display","none");
        $("#laberint").css("display","block");

        iniciJoc();
    });

    $("#b_tornar").click(function() {
        finalJoc();

        // conmutar pantalles
        $("#menu").css("display","block");
        $("#laberint").css("display","none");
    });


    // events
    $(document).keydown(function(e){
        cara.moviment = aturat;    // si la cara s'està movent, la parem

        switch(e.keyCode){
            // ajustem la direcció del moviment d'acord a la tecla que s'ha premut
            case TECLA.AMUNT   : dirIndex = DIR.AMUNT;  cara.moviment = direccio[DIR.AMUNT]; autoMove = false; distancia=0; break;
            case TECLA.AVALL   : dirIndex = DIR.AVALL;  cara.moviment = direccio[DIR.AVALL]; autoMove = false; distancia=0; break;
            case TECLA.DRETA   : dirIndex = DIR.DRETA;  cara.moviment = direccio[DIR.DRETA]; autoMove = false; distancia=0; break;
            case TECLA.ESQUERRA: dirIndex = DIR.ESQUERRA;  cara.moviment = direccio[DIR.ESQUERRA]; autoMove = false; distancia=0; break;

            //Activa el modus precissió
            case TECLA.MAJUSCULES:
                distancia=0;
                teclaShift = true;
                pixelPerTic = PIXEL_SPEED.MIN;
                break;
        }
    });

    $(document).keyup(function(e){
        if(teclaShift)
            cara.moviment = aturat;

        switch(e.keyCode){
            case TECLA.MAJUSCULES:
                teclaShift = false;
                pixelPerTic = PIXEL_SPEED.NORMAL;
                break;
        }
    });

    $("#cua").change(function(){
        cua=!cua;
    });


});


function actualitzarMenu () {
    $("#b_inici").prop('disabled', (mapaSeleccionat==""));
}


function playAuto() {
    if(autoMove) {
        dirIndex = maps[mapaSeleccionat].dirIndex;
        cara.moviment = direccio[dirIndex];
        pixelPerTic = PIXEL_SPEED.MAX;
    } else {
        cara.moviment = aturat;
        pixelPerTic = PIXEL_SPEED.NORMAL;
    }
}

function finalJoc() {
    stopTemps();
    stopCrono();
    tempsInici = null;
    tempsFinal = null;
    actualitzarRellotge(0, 0);
}

function iniciJoc() {


    var sImatgeMida = mapaSeleccionat.substring(0,5);

    canvas=$("#canvas")[0];              // Objecte DOM, equivalent a document.getElementById("canvas")
    imatgePista=$("#"+ sImatgeMida)[0];	         // Objecte DOM

    canvas.width=imatgePista.width;              // dimenciona el llenç d'acord a la mida de la imatge
    canvas.height=imatgePista.height;
    $(canvas).css("margin","50px auto");

    imatgePista=$("#"+ mapaSeleccionat)[0];	         // Objecte DOM
    context=canvas.getContext("2d");     // agafem el context per poder dibuixar
    context.drawImage(imatgePista, 0,0);         // "dibuixa" la imatge en el llenç


    pintarEntradaSortida();

    autoMove=$("#mov_auto").is(":checked");
    if(autoMove)
        $("#resultat").text("AUTOMATIC");
     else
        $("#resultat").text("ENDAVANT!");


    // CARA
    imatgeCara=$("#cara")[0];
    //POSICIÓ INICIAL segons el mapa triat
    cara.x=maps[mapaSeleccionat].in.x; cara.y= maps[mapaSeleccionat].in.y;
    if(autoMove) {
        cara.x=maps[mapaSeleccionat].start.x; cara.y= maps[mapaSeleccionat].start.y;
    }
    //DIRECCIÓ INICIAL segons el mapa triat
    dirIndex = maps[mapaSeleccionat].startDir;
    context.drawImage(imatgeCara, cara.x, cara.y);  // "dibuixa" la cara

    pos = {x:cara.x, y:cara.y}; // posició inicial de la cara

    cua=$("#cua").is(":checked");


    playing = true;

    if(autoMove)
        playAuto();

    if(!temporitzador){
        temporitzador = window.requestAnimationFrame(animar);  // s'actualitza a f=60Hz, 60fps
    }


}


function animar() {

    if(((teclaShift && distancia<1) || !teclaShift) && (playing) )
    for(var i=0;i<pixelPerTic;i++) { // numero de vegades que avança

        if (autoMove) {

            // següent moviment
            var cIni = {x: cara.x, y: cara.y, dx: cara.moviment.dx, dy: cara.moviment.dy};

            //Provem d'avançar en direccio ma dreta
            var provaIndex = (dirIndex + 3) % 4;
            cara.moviment = direccio[provaIndex];

            // Esborra la posició anterior de la cara
            context.beginPath();
            context.fillStyle = "#fff";             // color blanc
            context.rect(cara.x, cara.y, 15, 15);
            context.fill();

            // Incrementa la posició de la cara
            cara.x += cara.moviment.dx;
            cara.y += cara.moviment.dy;

            // si no toca la paret del laberint pot girar
            if (!hiHaCol_lisio())
                dirIndex = provaIndex;

            cara = {x: cIni.x, y: cIni.y, moviment: {dx: cIni.dx, dy: cIni.dy}};
            cara.moviment = direccio[dirIndex];
        }

        // Només dibuixa un nou fotograma si la cara es mou
        if (cara.moviment.dx != 0 || cara.moviment.dy != 0) {
            var cIni = {x: cara.x, y: cara.y, dx: cara.moviment.dx, dy: cara.moviment.dy};

            if (cua) {
                // Esborra la posició anterior de la cara però deixa un rastre de color groc per crear un efecte cua
                context.beginPath();
                context.fillStyle = colorCua;             // color cua
                context.rect(cara.x, cara.y, 15, 15);
                context.fill();
            }
            else {
                // Esborra la posició anterior de la cara
                context.beginPath();
                context.fillStyle = "#fff";             // color blanc
                context.rect(cara.x, cara.y, 15, 15);
                context.fill();
            }

            // Incrementa la posició de la cara
            cara.x += cara.moviment.dx;
            cara.y += cara.moviment.dy;

            // si toca la paret del laberint: retrocedeix a la posició inicial i atura la cara
            if (hiHaCol_lisio()) {

                cara = {x: cIni.x, y: cIni.y, moviment: aturat};

                //gira sentit contrari
                if (autoMove) {
                    dirIndex = (dirIndex + 1) % 4;
                    cara.moviment = direccio[dirIndex];
                }
            }

            pintarEntradaSortida();

            if (hiSocEntrada()) {
                if(autoMove) iniTemps(); else iniCrono();
            }
            if (hiSocSortida()) {
                if(autoMove) stopTemps(); else stopCrono();

                cara.moviment = aturat; //aturem el moviment
                autoMove = false;

                if(tempsFinal) {
                    $("#resultat").text("ACONSEGUIT!!!");
                    playing = false;
                }
            }

            // Calculem la distancia
            distancia += (Math.abs(pos.x - cara.x) + Math.abs(pos.y - cara.y));
            pos = {x: cara.x, y: cara.y};

        }

        // Dibuixa la cara en la seva posició final
        context.drawImage(imatgeCara, cara.x, cara.y);

        $("#info1").text("(x:" + cara.x + ",y:" + cara.y + ") " + distancia);

    }
    window.requestAnimationFrame(animar);  // es crida un cop cada f=60Hz, 60fps
}



function hiHaCol_lisio() {
    // Agafem el bloc de píxels de la imatge on està situada la cara
    var imgData = context.getImageData(cara.x, cara.y, 15, 15);
    var pixels = imgData.data;

    // Mirem tots els píxels del bloc
    for (var i = 0; n = pixels.length, i < n; i += 4) {
        var red = pixels[i];
        var green = pixels[i+1];
        var blue = pixels[i+2];
        var alpha = pixels[i+3];

        // Busquem un píxels de color fosc, és a dir, la vora de la pista
        if (red<25 && green<25 && blue<25 ) {
            return true;
        }
    }

    // Si arribem aquí, és que no hi ha col·lisió.
    return false;
}

function pintarEntradaSortida() {

    // Entrada
    context.beginPath();
    context.fillStyle = colorPorta.ENTRADA;
    context.rect(maps[mapaSeleccionat].in.x, maps[mapaSeleccionat].in.y, 15, 15);
    context.fill();

    // Sortida
    context.beginPath();
    context.fillStyle = colorPorta.SORTIDA;
    context.rect(maps[mapaSeleccionat].out.x, maps[mapaSeleccionat].out.y, 15, 15);
    context.fill();
}



function hiSocEntrada() {

    var imgData = context.getImageData(cara.x, cara.y, 15, 15);
    var pixels = imgData.data;

    // Mirem tots els píxels del bloc
    for (var i = 0; n = pixels.length, i < n; i += 4) {
        var red = pixels[i];
        var green = pixels[i+1];
        var blue = pixels[i+2];

        if (red>250 && green<25 && blue<25 ) {
            return true;
        }
    }
    // Si arribem aquí, és que no hi ha col·lisió.
    return false;
}


function hiSocSortida() {

    var imgData = context.getImageData(cara.x, cara.y, 15, 15);
    var pixels = imgData.data;

    // Mirem tots els píxels del bloc
    for (var i = 0; n = pixels.length, i < n; i += 4) {
        var red = pixels[i];
        var green = pixels[i+1];
        var blue = pixels[i+2];

        if (red<25 && green>250 && blue<25 ) {
            return true;
        }
    }
    // Si arribem aquí, és que no hi ha col·lisió.
    return false;
}



// TEMPS RECORREGUT AUTOMATIC
function iniTemps() {
    if(!tempsInici) {
        tempsInici = Date.now();
        temps = setInterval(ticTemps,500); // activar temps
        ticTemps();
    }
}
function stopTemps() {
    if(tempsInici) {
        clearInterval(temps);
        playing = false;
    }
}

function ticTemps() {
    if(tempsInici) {
        var tempsPassat = (Date.now()-tempsInici)/1000;
        var minPassat = tempsPassat/60;
        var segonsPassat = tempsPassat-(Math.floor(minPassat)*60);
        actualitzarRellotge(minPassat, segonsPassat);
    }
}

// CRONO RECORREGUT MANUAL
function iniCrono() {
    if(!tempsFinal) {
        tempsFinal = Date.now()+(1000*maps[mapaSeleccionat].temps); //(1000*60*2)
        crono = setInterval(ticCrono,500); // activar crono
        ticCrono();
    }
}
function stopCrono() {
    if(tempsFinal) {
        clearInterval(crono);
    }
}
function cancelaCrono() {
    clearInterval(crono);
}

function ticCrono() {
    if(tempsFinal) {
        var tempsQueda = (tempsFinal-Date.now())/1000;
        var minQueda = tempsQueda/60;
        var segonsQueda = tempsQueda-(Math.floor(minQueda)*60);
        if(tempsQueda>=0)
            actualitzarRellotge(minQueda, segonsQueda);
        else {
            cancelaCrono();
            playing = false;
            $("#resultat").text("TEMPS ACAVAT!!!");
        }
    }
}

function actualitzarRellotge(minuts, segons) {

    minuts = Math.floor(minuts);
    segons = Math.floor(segons);

    if(minuts<10) minuts="0"+minuts;
    if(segons<10) segons="0"+segons;
    var hms= minuts+":"+segons;

    // agafem la imatge correcte emmagatzemada en l'objecte imatgesCrono
    $("#mn1").attr("src",imatgesCrono["dg"+hms.charAt(0)]);
    $("#mn2").attr("src",imatgesCrono["dg"+hms.charAt(1)]);
    $("#se1").attr("src",imatgesCrono["dg"+hms.charAt(3)]);
    $("#se2").attr("src",imatgesCrono["dg"+hms.charAt(4)]);

}
