
// Find window dimensions
var winW = 1000, winH = 1000;
if (document.body && document.body.offsetWidth) {
 winW = document.body.offsetWidth;
 winH = document.body.offsetHeight;
}
if (document.compatMode=='CSS1Compat' &&
    document.documentElement &&
    document.documentElement.offsetWidth ) {
 winW = document.documentElement.offsetWidth;
 winH = document.documentElement.offsetHeight;
}
if (window.innerWidth && window.innerHeight) {
 winW = window.innerWidth;
 winH = window.innerHeight;
}


// Flowchart

var paperX = 0;
var paperY = 0;
var p = Raphael(paperX, paperY, winW, winH);
var pr = p.rect(paperX, paperY, winW, winH);

var graph = p.set();
var nodeset = p.set();
var edgeset = p.set();

graph.data("nodeset", nodeset);
graph.data("edgeset", edgeset);

pr.attr({
    "cursor":"pointer",
    "fill":"white"
});

pr.data("name", "pr");

pr.click(function(event){
    addNode(event.x, event.y);
});



function addNode(x, y){

    // BOX
    var width = 200
    var height = 40
    var box = p.rect(x - width/2, y - height/2 , 200, 40).attr({
        "fill":"#f9f9f9",
        "stroke-width":1,
        "stroke":"#333"
    });
    box.data("name","box");

    // HALO
    var a = 40
    var halo = p.circle(x, y, a).attr({
        fill:"#666",
        "stroke-width":0,
        "opacity":0.5
    });
    halo.data("name","halo");
    halo.hide();

    box.data("halo",halo);
    halo.data("box",box);
    
    nodeset.push(box);

    log();

    // BOX: Drag
    var affectedEdges;
    box.drag(function(dx, dy, x, y, event){
        this.attr({
            "x": x - width/2,
            "y": y - height/2
        });
        halo.attr({
            "cx": x,
            "cy": y
        });
        affectedEdges.forEach(function(edge){
            console.log("Affected Edge: "+printEdge(edge));
            var source = edge.data("source");
            var target = edge.data("target");
            var pathString = "M "+(source.attr("x")+width/2)+" "+(source.attr("y")+height)+
                    " L "+(target.attr("x")+width/2)+" "+target.attr("y");
            edge.attr({"path":pathString});
        });
    }, function(){
        affectedEdges = p.set();
        edgeset.forEach(function(edge){
            if(edge.data("source") == box || edge.data("target") == box){
                affectedEdges.push(edge);
            }
        });
        halo.hide();
        this.toFront();
        //var boxLabel = prompt("Type the condition here.");
        //console.log(boxLabel);
    }, function(event){
        halo.show();
        // halo.attr({
        //     "cx": event.x,
        //     "cy": event.y
        // });
        this.toFront();
        halo.toFront();
    });


    // HALO: Drag
    var edgeX;
    var edgeY;
    var edge;
    halo.drag(function(dx, dy, x, y, event){        
        if(edge){
            edge.remove();
        }
        edge = p.path("M "+edgeX+" "+edgeY+" L "+x+" "+y);
        edge.attr({
            "arrow-end":"classic-wide-long"
        });
        this.show();
    }, function(x, y){
        edgeX = halo.attr("cx");
        edgeY = halo.attr("cy");
    }, function(event){
        console.log("1");
        var landing_point = null;
        land = p.getElementsByPoint(event.x, event.y);
        land.forEach(function(el){
            //alert(el.data("name"));
            if(el.data("name") == "halo"){
                landing_point = el;
            }
        });
        console.log("2");
        if (landing_point){
            console.log("3");
            if(edge){
                console.log("4");
                var source = this.data("box");
                var target = landing_point.data("box");
                newEdge = p.path("M "+(source.attr("x")+width/2)+" "+(source.attr("y")+height)+
                    " L "+(target.attr("x")+width/2)+" "+target.attr("y"));

                console.log("5");
                edge.remove();
                newEdge.data("source", source);
                newEdge.data("target", target);
                edgeset.push(newEdge);

                log();

                newEdge.attr({
                    "arrow-end":"classic-wide-long",
                    "stroke-width":4,
                    "stroke":"#ccc"
                });
                // newEdge.glow({
                //     width:30,
                //     color:"#ccc",
                //     opacity:0.3
                // });
                this.hide();
                target.toFront();
                landing_point.toFront();
            }
        }else{
            edge.remove();
        }
    });

    // BOX + HALO: Click + Hover
    node = p.set();
    node.push(box);
    node.push(halo);
    //node.click(function(){
    box.click(function(){
        //this.toFront();
        //var boxLabel = input("Enter Condition");
        //console.log("boxLabel");
    });
    node.hover(
        function(){
            halo.show();
        },function(){
            halo.hide();
        }
    );

    return node;
}



function addLabel(toObj, text, textattr)
{
    if(textattr == undefined){
        textattr = { 'font-size':20, 
        fill: '#444', 
        stroke: 'none', 
        'font-family': 'Helvetica,Arial,sans-serif', 
        'font-weight':400 };
    }
    var bbox = toObj.getBBox();
    var textObj = toObj.paper.text( bbox.x + bbox.width / 2, bbox.y + bbox.height / 2, text ).attr( textattr );
    return textObj;
}




function zoom(w, h, fit){
    p.setViewBox(paperX, paperY, w, h, fit)
}




var circle = p.circle(500, 10, 5);
circle.attr("fill", "#00c");
circle.attr("stroke", "#fff");

// var c = p.path("M 10 10 L 90 90");
// c.attr({
//     "arrow-end":"classic-wide-long",
//     "stroke-width":2,
//     "stroke":"#ccc"
// });
// c.glow({
//     width:30,
//     color:"#ccc",
//     opacity:0.3
// });
// addLabel(c, "False");


function log(){
    console.clear();

    nodeset.forEach(function(el){
        console.log("Node: "+ printNode(el));
    });

    edgeset.forEach(function(el){
        console.log("Edge: " + printEdge(el) );
    });

}

function printNode(box){
    return "(" + box.attr("x") + ", " + box.attr("y") + "):{"+box.data("halo").attr("cx")+","+box.data("halo").attr("cy")+"}";
}

function printEdge(edge){
    var source = edge.data("source");
    var target = edge.data("target");
    return printNode(source) +" to "+ printNode(target) ;
}















































