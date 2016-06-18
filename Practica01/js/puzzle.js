

var sImatge="";
// imatge del puzzle

var nFiles=2, nColumnes=2;
// quantitat de peces del puzzle: nFiles x nColumnes 

var ampladaPeça, alçadaPeça;
// mida de les peces

// comença el programa
$(document).ready(function() {

    $("#slider_f").val(nFiles);
    $("#slider_c").val(nColumnes);

    actualitzarMenu();

    $(".imatges").click(function (e) {

        sImatge = e.target.id;

        // desremarquem les imatges
        $(".imatges").removeClass("imatgeSeleccionada").addClass("imatgeNoSeleccionada");

        // remarquem la imatge seleccionada
        $(this).removeClass("imatgeNoSeleccionada").addClass("imatgeSeleccionada");
        
        actualitzarMenu();
    });


    $("#slider_f").change(function () {
        nFiles = $("#slider_f").val();
        actualitzarMenu();
    });

    $("#slider_c").change(function () {
        nColumnes = $("#slider_c").val();
        actualitzarMenu();
    });


    $("#b_inici").click(function () {

        iniciJoc();

        // conmutar pantalles
        $("#menu").css("display","none");
        $("#puzzle").css("display","block");

    });

    $("#b_tornar").click(function () {

        // conmutar pantalles
        $("#menu").css("display","block");
        $("#puzzle").css("display","none");
    });

});

function actualitzarMenu () {
    
    $("#slider_f_value").text("Files = "+ nFiles);
    $("#slider_c_value").text("Columnes = "+ nColumnes);

    $("#b_inici").prop('disabled', (sImatge==""));
}

function iniciJoc() {

    var f, c, peça;
// calculem l'amplada i alçada de la peça en funció de la imatge del puzzle
    ampladaPeça = Math.floor($("#solucio").width() / nColumnes);
    alçadaPeça = Math.floor($("#solucio").height() / nFiles);
// ajustem les mides del puzzle

    $("#puzzle").css("width", (ampladaPeça * nColumnes) + "px");
    $("#puzzle").css("height", ( alçadaPeça * nFiles) + "px");

// crear les peces del puzzle
    $(".peça").remove();
    for (f = 1; f <= nFiles; f++)
        for (c = 1; c <= nColumnes; c++)
            $("#puzzle").append('<div id="f'+ f +'c'+ c +'" class="peça"></div>');

// corregim les mides de les peces
    $(".peça").css({
        "width": ampladaPeça + "px",
        "height": alçadaPeça + "px"
    });

// posem la imatge de background a totes les peces
    $(".peça").css("background-image", "url(imatges/"+ sImatge +".jpg)");

// les peces estan apilades
// coloquem totes les peces en el seva fila i columna
    for (f = 1; f <= nFiles; f++)
        for (c = 1; c <= nColumnes; c++) {
            $("#f" + f + "c" + c).css("top", ((f-1) * alçadaPeça) + "px");
            $("#f" + f + "c" + c).css("left", ((c-1) * ampladaPeça) + "px");
        }

// posem la posició de la imatge de background de les peces al seu lloc
// sense moure les peçes
    for (f = 1; f <= nFiles; f++)
        for (c = 1; c <= nColumnes; c++)
            $("#f" + f + "c" + c).css("background-position", (-(c - 1) * ampladaPeça) + "px " + (-(f - 1) * alçadaPeça) + "px");

// barregem les peces del puzzle
    barrejarPeces();

// events: selecció d'una peça
    var peça1Seleccionada = false;
    var peça1, peça2;

    $(".peça").click(function (e) {


        if (peça1Seleccionada) {
            // seleccionem la segona peça
            peça2 = $(this);

            peça1Seleccionada = false;

            // intercanviem les posicions
            intercanviPeces(peça1, peça2);

            var jumping = $("#jumping")[0];
            jumping.play();

            // desmarquem la peça seleccionada
            peça1.removeClass("peçaSeleccionada").addClass("peçaNoSeleccionada");
            peça1.removeClass("primerPla").addClass("segonPla");

            // esperem el temps d'animació abans de comprovar si el puzzle està resolt
            setTimeout(
                function() {
                    // mirem si ja tenim el puzzle resolt
                    if(puzzleResolt()) {
                        // Mostrar felicitacio
                        $("#wincontainer").css("display","block");

                        // Desactivar events de les peces
                        $(".peça").unbind( "click" );

                        var tada = $("#tada")[0];
                        tada.play();
                    }


                }, 1010);

        } else {
            
            //seleccionem la primera peça
            peça1 = $(this);
            peça1Seleccionada = true;

            // remarquem la peça seleccionada
            peça1.removeClass("peçaNoSeleccionada").addClass("peçaSeleccionada");
            peça1.removeClass("segonPla").addClass("primerPla");

            var clap = $("#clap")[0];
            clap.play();

        }
    });

    // Ocultar felicitacio
    $("#wincontainer").css("display","none");

}

// intercanvia les posicions de les dues peces, les seleccionades
    function intercanviPeces(primerRect, segonRect) {

        var topPrimerRect  = parseInt(primerRect.css("top" ));
        var leftPrimerRect = parseInt(primerRect.css("left"));

        segonRect.removeClass("segonPla").addClass("primerPla");
        // intercanviem les posicions
        primerRect.animate({
            "top" : segonRect.css("top" ),
            "left": segonRect.css("left")
        },500,function(){
            primerRect.removeClass("primerPla").addClass("segonPla");
        });
        segonRect.animate({
            "top" : topPrimerRect,
            "left": leftPrimerRect
        },500,function(){
            segonRect.removeClass("primerPla").addClass("segonPla");
        });
    }

// barreja, aleatòriament, les posicions de les peces del puzzle
    function barrejarPeces() {

        var colocades =[] ; //posicions utilitzades
        for (var f = 1; f <= nFiles; f++)
            for (var c = 1; c <= nColumnes; c++) {

                while(true){
                    var numf = numeroAleatori(1,nFiles);
                    var numc = numeroAleatori(1,nColumnes);

                    var novaPos = numf*100+numc;
                    var solucio = f*100+c;

                    // Coloquem la peça si la posició no està ocupada
                    // Evitar que la barreja de peces sigui solució
                    if( novaPos != solucio)
                        if( -1 === colocades.indexOf(novaPos) ){
                            //console.log('['+ f +'-'+ c +']: '+  numf +'x'+ numc);
                            colocades.push(novaPos);
                            //console.log(pila);

                            // Movem les peces
                            $("#f" + f + "c" + c).css("top", ((numf-1) * alçadaPeça) + "px");
                            $("#f" + f + "c" + c).css("left", ((numc-1) * ampladaPeça) + "px");
                            break;
                        }
                }
            }
    }

// retorna un nombre enter aleatori entre a i b ambdós inclosos
    function numeroAleatori(a, b) {
        return Math.floor(Math.random() * b - a + 1) + a;
    }

// retorna cert si el puzzle ja està resolt, és a dir, totes les peces estan al seu lloc.
// Això passarà si totes les peces estan en la posició que tenien abans de ser barrejades.
    function puzzleResolt() {

        for (f = 1; f <= nFiles; f++)
            for (c = 1; c <= nColumnes; c++) {
                if(((f-1) * alçadaPeça) != parseInt($("#f" + f + "c" + c).css("top")))
                    return false;

                if(((c-1) * ampladaPeça) != parseInt($("#f" + f + "c" + c).css("left")))
                    return false;
            }
        return true;
    }
