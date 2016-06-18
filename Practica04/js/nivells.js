

Game.prototype.llegirNivells = function(){
    this.NIVELLS = [

        {
            colors: {
                t: "#F77", // taronja
                c: "#4CF", // blue cel
                v: "#8D1", // verd
                e: "#D30", // vermell
                l: "#00D", // blau
                r: "#F7B", // rosa
                g: "#F93", // groc
                p: "#BBB"  // plata
            }, totxos: [
            "",
            "",
            " ppp       ppp ",
            " tt         tt ",
            " cc         cc ",
            " vv         vv ",
            "  eeeeeeeeeee  ",
            "  lllllllllll  ",
            "     rrrrr     ",
            "      ggg      "
        ] },

        {
            colors: {
                b: "#FFF", // blanc
                t: "#F77", // taronja
                c: "#4CF", // blue cel
                v: "#8D1", // verd
                e: "#D30", // vermell
                l: "#00D", // blau
                r: "#F7B", // rosa
                g: "#F93", // groc
                p: "#BBB", // plata
                d: "#FB4"  // dorat
            }, totxos: [
            "",
            " ddd           ",
            " pppp          ",
            " ttttt         ",
            " cccccc        ",
            " vvvvvvv       ",
            " eeeeeeee      ",
            " lllllllll     ",
            " rrrrrrrrrr    ",
            " ggggggggggg   ",
            " bbbbbbbbbbbb  ",
            " ddddddddddddd "
        ] },
    {
        colors: {
            g: "#4CDD00", // verd
            n: "#336699", // blau fort
            t: "#FFB21C", // taronga
            v: "#C44236", // vermell
            b: "#30CAD9" // blau
        },
        totxos: [
            "               ",
            "               ",
            "  ggggggggggg  ",
            "  vvvvvvvvvvv  ",
            "  nnnnnnnnnnn  ",
            "  bbbbbbbbbbb  ",
            "  ttttttttttt  "
        ]
    },{
        colors: {
            v: "#D40000", // vermell
            w: "#ffffff", // blanc
            b: "#0026ff" // blau
        },
        totxos: [
            "               ",
            "     vvvv      ",
            "   vvvvvvvv    ",
            " vvvvvvvvvvvv  ",
            " vvwwwwvvwwww  ",
            " vvwwbbvvwwbb  ",
            " vvwwwwvvwwww  ",
            " vvvvvvvvvvvv  ",
            " vvvvvvvvvvvv  ",
            " vvvvvvvvvvvv  ",
            " vvvvvvvvvvvv  ",
            " vv  vvvv  vv  ",
            " vv  vvvv  vv  ",
            " vv  vvvv  vv  "
        ]
    }, {
        colors: {
            y: "#EBAD00", // groc
            b: "#0026ff", // blau
            c: "#ffc89e",  // carn
            d: "#000000",  // negre
            v: "#D40000", // vermell
            m: "#7f3300",  // marro
            g: "#6D8902" // verd
        },
        totxos: [
            "---------------",
            "-------y-------",
            "-----bbybb-----",
            "----bbbbbbb----",
            "---bbbbbbbbb---",
            "---yyyyyyyyy---",
            "---yycccccyy---",
            "---ccddcddcc---",
            "---ccccccccc---",
            "----cccvccc----",
            "----vvcccvv----",
            "---gyvvvvvyg---",
            "--ggvvvvvvvgg--",
            "-gggvvvvvvvggg-",
            "ggggmmmmmmmgggg"
        ]
    }, {
        colors: {
            d: "#000000",  // negre
            v: "#D40000", // vermell
            y: "#EBAD00", // groc
            g: "#6D8902" // verd
        },
        totxos: [
            "gyvvvvvvvvvvvyg",
            "gyvdvdvdvdvdvyg",
            "gyvvvvvvvvvvvyg",
            "gyvvdvdvdvdvvyg",
            "gyvvvvvvvvvvvyg",
            "gyvvvdvdvdvvvyg",
            "gyvvvvvvvvvvvyg",
            "ggyvvvvvvvvvygg",
            "-ggyvvvvvvvygg-",
            "--ggyvvvvvygg--",
            "---ggyyyyygg---",
            "----gggyggg----",
            "-----ggggg-----"
        ]
    },{
            colors: {
                g: "#EBAD00", // groc
                v: "#C44236" // vermell
            },
            totxos: [
                "               ",
                "               ",
                "   gvgvgvgvg   ",
                "   gvgvgvgvg   ",
                "   gvgvgvgvg   ",
                "   gvgvgvgvg   ",
                "   gvgvgvgvg   ",
                "   gvgvgvgvg   ",
                "   gvgvgvgvg   ",
                "   gvgvgvgvg   "
            ]
        }, {
        colors: {
            w: "#ffffff", // blanc
            d: "#000000",  // negre
            y: "#EBAD00" // groc
        },
        totxos: [
            "-ddddddddddddd-",
            "-ddwwwwwwwwwdd-",
            "-ddddddddddddd-",
            "--ddwwwwwwwdd--",
            "--ddwwywywwdd--",
            "---ddwwywwdd---",
            "----ddwwwdd----",
            "-----dwwwd-----",
            "-----dwwwd-----",
            "----ddwwwdd----",
            "---ddwwywwdd---",
            "--ddwwywywwdd--",
            "--ddwywywywdd--",
            "-ddddddddddddd-",
            "-ddwwwwwwwwwdd-",
            "-ddddddddddddd-"
        ]
    },{
        colors: {
            r: "#F3BFD8", // rosa
            g: "#5C6468", // gris
            w: "#ffffff", // blanc
            n: "#000000", // negre
            y: "#F0C510", // groc
            s: "#F0948C",  // salmo
            v: "#C44236"
        },
        totxos: [
            "               ",
            "    g      g   ",
            "   grg    grg  ",
            "   gggggggggg  ",
            "   ggnggggngg  ",
            "   ggngwwgngg  ",
            "  nggnwwwwnggn ",
            "   gwwwsswwwg  ",
            "  nwwwwsswwwwn ",
            "      vyvv     ",
            "      gggg     ",
            "      gwwg   w ",
            "     ggwwgg  g ",
            "     ggwwgggg  ",
            "     ggggggg   ",
            ""
        ]
    },{
        colors: {
            r: "#D40000", // vermell
            g: "#6D8902", // verd
            y: "#EBAD00"  // groc
        },
        totxos: [
            "               ",
            "     rrrrrr    ",
            "    rrrrrrrrr  ",
            "    gggyygy    ",
            "   gygyyygyyy  ",
            "   gyggyyygyyy ",
            "   ggyyyygggg  ",
            "     yyyyyyy   ",
            "    ggrggg     ",
            "   gggrggrggg  ",
            "  ggggrrrrgggg ",
            "  yygryrryrgyy ",
            "  yyyrrrrrryyy ",
            "    rrr rrr    ",
            "   ggg ggg     ",
            "  gggg gggg    "
        ]
    },{
        colors: {
            b: "#000000", // negre
            w: "#ffffff", // blanc
            g: "#acacac"  // gris
        },
        totxos: [
            "               ",
            "    bbbbbbbb   ",
            "    bwgwgwgbg  ",
            "    bbbbbbbbg  ",
            "    bggggggbg  ",
            "    bg     bg  ",
            "    bg     bg  ",
            "    bg   bbbg  ",
            "  bbbg  bwgbg  ",
            " bwgbg   bbgg  ",
            "  bbgg    gg   ",
            "   gg          "
        ]
    }, {
        colors: {
            w: "#ffffff", // blanc
            d: "#000000", // negre
            y: "#EBAD00" // groc
        },
        totxos: [
            "-d-----------d-",
            "-ddddd---ddddd-",
            "-ddddddddddddd-",
            "-dddydddddyddd-",
            "--dddddwddddd--",
            "---ddddddddd---",
            "-d----yyy------",
            "-d---ddddd-----",
            "--d-ddddddd----",
            "---ddddddddd---",
            "--ddddddddddd--",
            "-ddddddddddddd-",
            "-ddddddddddddd-",
            "-dddd-ddd-dddd-",
            "-dddd-ddd-dddd-"
        ]
    }, {
        colors: {
            t: "#ffa420" //taronja
        },
        totxos:[
            "ttttttttttttttt",
            "ttttttttttttttt",
            "ttttttttttttttt",
            "tttt-ttttt-tttt",
            "ttttt-ttt-ttttt",
            "tttt-------tttt",
            "ttt--t---t--ttt",
            "tt-----------tt",
            "tt-t-------t-tt",
            "tt-t-ttttt-t-tt",
            "ttttt--t--ttttt",
            "ttttttttttttttt",
            "ttttttttttttttt",
            "ttttttttttttttt",
            "---------------",
            "---------------"
        ]
    }, {
        colors: {
            b: "#ffffff", // blanc
            n: "#000000",  // negre
            g: "#acacac",  // gris
            r: "#D40000" // vermell
        },
        totxos:[
            "---------------",
            "-----nnnn------",
            "---nnrrrrnn----",
            "--nrrbrrrrrn---",
            "--nrbbbrrrrn---",
            "-nrrrbrrrrrrn--",
            "-nrrrrnnrrrrn--",
            "-nnrrnbgnrrnn--",
            "-nbnnnggnnngn--",
            "--nbbbnngggn---",
            "--ngbbbggggn---",
            "---nnggggnn----",
            "-----nnnn------",
            "---------------",
            "---------------",
            "---------------"
        ]
    }, { colors: {
        y: "#EBAD00", // groc
        n: "#000000",  // negre
        t: "#ffa420" //taronja
    },
        totxos:[
            "---------nnn---",
            "--------nyyyn--",
            "-------nyyyyyn-",
            "-------nyyynyn-",
            "-------nyyyyttn",
            "--------nyyynn-",
            "-n-------nyn---",
            "nyn----nnyyn---",
            "nyynnnnyyyyyn--",
            "nyyyyyyyyyyyyn-",
            "-nyyyyyyynyyyn-",
            "-nyynyyynyyyyn-",
            "--nyynnnnyyyn--",
            "--nyyyyyyyyyn--",
            "---nnyyyyynn---",
            "-----nnnnn-----"
        ]

    }, { colors: {
        b: "#ffffff", // blanc
        n: "#000000",  // negre
        t: "#ffa420", //taronja
        r: "#D40000", // vermell
        g: "#6D8902" // verd
    },
        totxos:[
            "---nnnnnnnnn---",
            "-nnnrrrrrrrnnn-",
            "nnrrrttttttrrnn",
            "nrrtttnbbnttrrn",
            "nrrtttnbbnttrrn",
            "nrrrrttttttrrrn",
            "nnrrrrrrrrrrrnn",
            "-nnnrrrrrrrnnn-",
            "---nnnnnnnnn---",
            "-nn---ngn---nn-",
            "nggnn-ngn-nnggn",
            "nggggnngnnggggn",
            "ngggggngngggggn",
            "-nggggngnggggn-",
            "--nngggggggnn--",
            "----nnnnnnn----",
        ]
    }, { colors: {
        b: "#ffffff", // blanc
        n: "#000000",  // negre
        r: "#F3BFD8", // rosa
        m: "#EBAD00", // groc
        f: "#FC00FF"
    },
        totxos:[
            "------nnnn-----",
            "----nnrrrrnn---",
            "---nrrrrrrrrn--",
            "--nrrrrrrrrrrn-",
            "--nrbnrrrrbnrn-",
            "-nrfnnrrrrnnfrn",
            "-nrffrrrrrrffrn",
            "-nrrrrrrrrrrrrn",
            "--nnrrnnnnrrnn-",
            "--nmnnmmmmnnmn-",
            "--nmmmmmmmmmmn-",
            "--nnnnnnnnnnnn-",
            "----nmmmmmmn---",
            "-----nmmmmn----",
            "------nmmn-----",
            "-------nn------"
        ]
    }
]};
