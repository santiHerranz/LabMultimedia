
//////////////////////////// classe Punt ///////////////////////////
function Punt(x,y){
    this.x=x;
    this.y=y;
}
////// Mètodes estàtics
Punt.distanciaPuntPunt=function(p1,p2){
    return Math.sqrt(Math.pow(p1.x-p2.x,2) + Math.pow(p1.y-p2.y,2));
};
//////////////////////////////////////////////////////////////////

//////////////////////////// classe Cercle ///////////////////////
function Cercle(centre,radi,color){
    this.centre = centre;  // és un Punt
    this.radi = radi;
    this.color = color || "rgba(200, 200, 100, .9)";
}
Cercle.prototype.dibuixar = function(ctx){
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.centre.x, this.centre.y, this.radi, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
};
//////////////////////////////////////////////////////////////////

///////////////////////////// classe Segment /////////////////////
function Segment(p1, p2, gruix, color) {
    this.p1 = p1;  // és un Punt
    this.p2 = p2;
    this.gruix = gruix;
    this.color = color || "#cfc";
}
////// Mètodes públics
Segment.prototype.dibuixar = function(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.p1.x,this.p1.y);
    ctx.lineTo(this.p2.x,this.p2.y);
    ctx.lineWidth = this.gruix;
    ctx.strokeStyle = this.color;
    ctx.stroke();
};
////// Mètodes estàtics
Segment.esTallen=function (segment1, segment2){
    // retorna true si segment1 i segment2 es tallen
    // Nota: no només s'han de tallar les rectes dels segments
    // Busquem el punt d'intersecció dels segments i si existeix es que realment es tallen

    // si retorna undefined és que no es tallen
    function puntInterseccio(p1,p2,p3,p4) {
        var a1 = p2.y - p1.y;
        var b1 = p1.x - p2.x;
        var c1 = a1 * p1.x + b1 * p1.y;
        var a2 = p4.y - p3.y;
        var b2 = p3.x - p4.x;
        var c2 = a2 * p3.x + b2 * p3.y;
        var d = a1*b2 - a2*b1;
        if (d == 0) // control divisió per 0
            return undefined;
        var x = (b2*c1 - b1*c2) / d;
        var y = (a1*c2 - a2*c1) / d;
        return {x:x, y:y};
    }

    //obtenir el punt d'intersecció
    var p = puntInterseccio(segment1.p1, segment1.p2, segment2.p1, segment2.p2);

    // Si no existeix segur que no es tallen
    if(p == undefined)
        return false;

    // Comprovar que el punt pertany als dos segments
    if(Segment.contePunt(segment1, p) && Segment.contePunt(segment2, p) )
        return true;

    return false;
};

Segment.contePunt=function(segment, punt){
    return Segment.comprovaDinsInterval(punt.x, segment.p1.x, segment.p2.x) ||
        Segment.comprovaDinsInterval(punt.y, segment.p1.y, segment.p2.y);
};

Segment.comprovaDinsInterval = function(pos, inici, final) {
    return (inici < pos && pos < final) || (final < pos && pos < inici);
};

////// Classe estàtica  //////
function Utils(){
}
/// Mètodes estàtics //////
Utils.numAleatoriEntre= function(a, b){
    return Math.floor(Math.random()*(b-a+1)) + a;
};


//////////////////////////////////////////////////////////////////
// NAMESPACE ///
var jocNodes = {
    cercles: [],
    cercleRadi: 10,
    cercleClicat: undefined,
    linies: [],
    normalLine: 1,
    boldLine: 3,
    nivellActual:1,
    progressPercent:0,
    tempsFinal: undefined,
    tempsDisponible:10,
    crono: undefined,
    playing: false,  //Control de joc
    record: undefined,
    soApagat:true,
    soAmbient: undefined
};


jocNodes.nivells =
    [
        {
            "nivell" : 1,
            "cercles" : [{"x" : 400, "y" : 156},
                {"x" : 381, "y" : 241},
                {"x" : 84 , "y" : 233},
                {"x" : 88 , "y" : 73 }],
            "connexions" : {"0" : {"connectaAmb": [1,2]},
                "1" : {"connectaAmb" : [3]},
                "2" : {"connectaAmb" : [3]}}
        },{
        "nivell" : 2,
        "cercles" : [{"x" : 401, "y" : 73 },
            {"x" : 400, "y" : 240},
            {"x" : 88 , "y" : 241},
            {"x" : 84 , "y" : 72 }],
        "connexions" : {"0" : {"connectaAmb": [1,2,3]},
            "1" : {"connectaAmb" : [2,3]},
            "2" : {"connectaAmb" : [3]}}
    },{
        "nivell" : 3,
        "cercles" : [{"x" : 92, "y" : 85 },
            {"x" : 253, "y" : 13},
            {"x" : 393 , "y" : 86},
            {"x" : 390 , "y" : 214 },
            {"x" : 248 , "y" : 275 }],
        "connexions" : {"0" : {"connectaAmb": [1,2,3,4]},
            "1" : {"connectaAmb" : [2,3]},
            "2" : {"connectaAmb" : [3]}}
    },{
        "nivell" : 4,
        "cercles" : [{"x" : 92, "y" : 85 },
            {"x" : 253, "y" : 13},
            {"x" : 393 , "y" : 86},
            {"x" : 390 , "y" : 214 },
            {"x" : 248 , "y" : 275 }],
        "connexions" : {"0" : {"connectaAmb": [1,2,3,4]},
            "1" : {"connectaAmb" : [2,4]},
            "3" : {"connectaAmb" : [4]}}
    },{
        "nivell" : 5,
        "cercles" : [{"x" : 92, "y" : 85},
            {"x" : 253, "y" : 13},
            {"x" : 393, "y" : 86},
            {"x" : 390, "y" : 214},
            {"x" : 248, "y" : 275},
            {"x" : 95, "y" : 216}],

        "connexions" : {
            "0" : {"connectaAmb" : [2,3,4]},
            "1" : {"connectaAmb" : [3,5]},
            "2" : {"connectaAmb" : [0,4,5]},
            "3" : {"connectaAmb" : [0,1,5]},
            "4" : {"connectaAmb" : [0,2]},
            "5" : {"connectaAmb" : [1,2,3]}
        }
    }
    ];


///////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function(){

    //localStorage.clear();
    var record = localStorage.getItem("RECORD");
    if(record != undefined)
        jocNodes.record = JSON.parse(record);


    jocNodes.canvas = document.getElementById("canvas");  // afegim a la variable global jocNodes
    jocNodes.ctx = jocNodes.canvas.getContext("2d");

    $("#btnInici").click(function () {
        inciarJoc();
    });

    // Events per arrossegar els cercles
    $("#canvas").on({
        "mousedown":function(e) {
            if(!jocNodes.playing) return;
            // posició del clic
            var ratoli=new Punt(e.pageX-canvas.offsetLeft || 0, e.pageY-canvas.offsetTop  || 0);
            // mirem si el clic ha estat interior a un cercle
            for(var i=0;i<jocNodes.cercles.length && !jocNodes.cercleClicat;i++){
                var cercle = jocNodes.cercles[i] ;
                if(Punt.distanciaPuntPunt(ratoli,cercle.centre) < cercle.radi){
                    jocNodes.cercleClicat = i;
                }
            }
        },
        "mousemove":function(e) {
            if(!jocNodes.playing) return;
            if (jocNodes.cercleClicat != undefined){
                var ratoli=new Punt(e.pageX-canvas.offsetLeft || 0, e.pageY-canvas.offsetTop  || 0);

                //Correcció de la posició dins del canvas amb el tamany del cercle
                ratoli.x = Math.max(ratoli.x,jocNodes.cercleRadi);
                ratoli.y = Math.max(ratoli.y,jocNodes.cercleRadi);

                ratoli.x = Math.min(ratoli.x,canvas.offsetWidth-jocNodes.cercleRadi);
                ratoli.y = Math.min(ratoli.y,canvas.offsetHeight-jocNodes.cercleRadi);

                jocNodes.cercles[jocNodes.cercleClicat].centre.x=ratoli.x;
                jocNodes.cercles[jocNodes.cercleClicat].centre.y=ratoli.y;

                actualitzaLiniesIntersect();
                actualitzaProgress();
            }
        },
        "mouseup": function() {
            if(!jocNodes.playing) return;
            jocNodes.cercleClicat = undefined;
            comprovaXarxa();
            console.log(prec);
        }
    });

    // inicialitza display del compte enrere
    $('#countdown').countdown();

    jocNodes.soAmbient = $("#soAmbient")[0];
    jocNodes.soAmbient.loop = true;

    $("#imatgeSo").click(function(){
        if(jocNodes.silenci){ // fem play
            $(this).attr("src","imatges/audioOn.png");
            jocNodes.silenci=false;
            if(jocNodes.playing){
                jocNodes.soAmbient.play();
            }
        }
        else{         // fem pause
            $(this).attr("src","imatges/audioOff.png");
            jocNodes.silenci=true;
            jocNodes.soAmbient.pause();
        }
    });


    // actualització del fotograma
    window.requestAnimationFrame(actualitzaFotograma);  // s'actualitza a f=60Hz, 60fps


});


//////////////////////////////////////////////////////////////////////////////////////
// XARXA

function construirXarxa() {

    jocNodes.cercles = [];  // buidem l'array de cercles

    var nivell = jocNodes.nivells[jocNodes.nivellActual-1];
    if(jocNodes.nivellActual<=jocNodes.nivells.length) {
        for (var i=0; i<nivell.cercles.length; i++) {
            jocNodes.cercles.push(new Cercle(new Punt(nivell.cercles[i].x, nivell.cercles[i].y), jocNodes.cercleRadi));
        }
    } else {
        nivell = jocNodes.nivells[jocNodes.nivells.length-1];
        var marge = jocNodes.cercleRadi*2;
        for (var i=0; i<nivell.cercles.length; i++) {
            jocNodes.cercles.push(new Cercle(new Punt(
                Utils.numAleatoriEntre(marge,jocNodes.canvas.width-marge),
                Utils.numAleatoriEntre(marge,jocNodes.canvas.height-marge))
                , jocNodes.cercleRadi));
        }
    }
    connectarCercles();
    actualitzaLiniesIntersect();
}

function connectarCercles(){

    jocNodes.linies.length = 0;  // buidem l'array de segments

    var nivell = jocNodes.nivells[jocNodes.nivellActual-1];
    if(jocNodes.nivellActual>jocNodes.nivells.length) {
        nivell = jocNodes.nivells[jocNodes.nivells.length-1];
    }
    for(var i=0; i<jocNodes.cercles.length;i++) {
        var item = nivell.connexions[i];
        if(item != null) {
            var connectaAmb = item.connectaAmb;
            for(var j=0; j<connectaAmb.length; j++) {
                jocNodes.linies.push(new Segment(jocNodes.cercles[i].centre,
                    jocNodes.cercles[connectaAmb[j]].centre,1));
            }
        }
    }

}


function actualitzaLiniesIntersect()
{
    for (var i=0;i<jocNodes.linies.length;i++) {
        var aresta1 = jocNodes.linies[i];
        aresta1.gruix = jocNodes.normalLine;
        for(var j=0;j<i;j++) {
            var aresta2 = jocNodes.linies[j];

            if (Segment.esTallen(aresta1, aresta2)) {
                aresta1.gruix = jocNodes.boldLine;
                aresta2.gruix = jocNodes.boldLine;
            }
        }
    }
    actualitzaProgress();
}


// mirem el percentatge de progress comptant les linies normals respecte a totes
function actualitzaProgress() {

    var progress = 0;
    for (var i=0;i<jocNodes.linies.length;i++) {
        if(jocNodes.linies[i].gruix == jocNodes.normalLine)
            progress ++;
    }
    jocNodes.progressPercent = progress/jocNodes.linies.length;

}



function comprovaXarxa() {

    if(jocNodes.progressPercent === 1.0){

        jocNodes.nivellActual++;
        jocNodes.cercleClicat = undefined;

        stopCrono();
        do {
            construirXarxa();
        } while(jocNodes.progressPercent == 1.0);
        iniCrono();

        if(!jocNodes.silenci) {
            var levelUp = $("#pujarNivell")[0];
            levelUp.play();
        }

    }
}



//////////////////////////////////////////////////////////////////////////////////////
// PANTALLA


function actualitzaFotograma() {

    var ctx = jocNodes.ctx;

    // esborrem el canvas
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

    // dibuixem totes les línies
    for(var i=0;i<jocNodes.linies.length;i++) {
        jocNodes.linies[i].dibuixar(ctx);
    }
    // dibuixem tots els cercles
    for(var i=0;i<jocNodes.cercles.length;i++) {
        jocNodes.cercles[i].dibuixar(ctx);
    }

    $("#progress").text((jocNodes.progressPercent*100).toFixed(2));
    $("#nivell").text(jocNodes.nivellActual);

    if(jocNodes.record != undefined)
        $("#record").html("Record: "+ jocNodes.record.nom +" <br/>Nivell: "+ jocNodes.record.nivell);

    $("#btnInici").prop('disabled', jocNodes.playing);

    window.requestAnimationFrame(actualitzaFotograma);

}

//////////////////////////////////////////////////////////////////////////////////////
// JOC

function inciarJoc() {

    jocNodes.playing = true;
    jocNodes.nivellActual = 1;
    construirXarxa();

    jocNodes.tempsFinal = undefined;
    iniCrono();
    if(!jocNodes.silenci)
        jocNodes.soAmbient.play();

}

function acabarJoc() {

    for(var i=0;i<jocNodes.cercles.length;i++) {
        jocNodes.cercles[i].color = "#555555";
    }
    for(var i=0;i<jocNodes.linies.length;i++) {
        jocNodes.linies[i].color = "#555555";
    }
    actualitzaFotograma();

    jocNodes.playing = false;
    stopCrono();
    $('#countdown').mostra(0);

    jocNodes.soAmbient.pause();

    if(jocNodes.record == undefined || (jocNodes.nivellActual > 1 && jocNodes.nivellActual > jocNodes.record.nivell)) {

        if(!jocNodes.silenci) {
            var gameRecord = $("#gameRecord")[0];
            gameRecord.play();
        }

        var nom = prompt("Nou record! Nivell "+ jocNodes.nivellActual + ". Escriu el teu nom.");
        if(nom == undefined || nom.length==0) nom = "Anònim";
        jocNodes.record = {nom: nom , nivell: jocNodes.nivellActual};

        localStorage.setItem("RECORD", JSON.stringify(jocNodes.record));

    } else {
        if(!jocNodes.silenci) {
            var gameOver = $("#accioJocPerdut")[0];
            gameOver.play();
        }

    }
}

//////////////////////////////////////////////////////////////////////////////////////
// CRONO

function iniCrono() {
    if(!jocNodes.tempsFinal) {
        jocNodes.tempsFinal = Date.now()+(1000*jocNodes.tempsDisponible)+999; //(1000*60*2)
        ticCrono();
    }
}
function stopCrono() {
    jocNodes.tempsFinal = undefined;
}

function ticCrono() {
    if(jocNodes.tempsFinal) {
        var tempsQueda = (jocNodes.tempsFinal-Date.now())/1000;

        $('#countdown').mostra(parseInt(tempsQueda));

        if(tempsQueda>=0) {
            // Tornar a programar crida en 1s
            setTimeout(ticCrono, 1000);
        } else {
            // El temps ha acabat però comprovem que està resolt i no ha fet mouseUp
            comprovaXarxa();
            tempsQueda = (jocNodes.tempsFinal-Date.now())/1000;
            if(tempsQueda<=0)
                acabarJoc();
        }
    }
}
