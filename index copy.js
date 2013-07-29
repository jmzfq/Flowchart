
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

pr.attr({
    "cursor":"pointer",
    "fill":"white"
});
pr.click(function(event){
    addNode(event.x, event.y);
});

var circle = p.circle(50, 40, 10);
circle.attr("fill", "#00c");
circle.attr("stroke", "#fff");

var c = p.path("M 10 10 L 90 90");
c.attr({
    "arrow-end":"classic-wide-long",
    "stroke-width":2,
    "stroke":"#ccc"
});
c.glow({
    width:30,
    color:"#ccc",
    opacity:0.3
});



addLabel(c, "False");


function addNode(x, y){

    var width = 200
    var height = 40
    var node = p.rect(x - width/2, y - height/2 , 200, 40).attr({
        "fill":"#f9f9f9",
        "stroke-width":1,
        "stroke":"#333"
    });

    var a = 40
    var pivot = p.circle(x, y, a).attr({
        fill:"#666",
        "stroke-width":0,
        "opacity":0.5
    });
    pivot.data("role","pivot");
    pivot.data("node",node);

    node.data("role","node");
    node.data("pivot",pivot);

    pivot.hide();
    //node.toFront();

    var nodeset = p.set();
    nodeset.push(node);
    nodeset.push(pivot);

    node.drag(function(dx, dy, x, y, event){
        this.attr({
            "x": x - width/2,
            "y": y - height/2
        });
        pivot.attr({
            "cx": x,
            "cy": y
        });
        pivot.hide();
    });

    nodeset.click(function(){
        this.toFront();
    });


    var edgeX;
    var edgeY;
    var edge;
    pivot.drag(function(dx, dy, x, y, event){        
        if(edge){
            edge.remove();
        }
        edge = p.path("M "+edgeX+" "+edgeY+" L "+x+" "+y);
        edge.attr({
            "arrow-end":"classic-wide-long"
        });
        this.show();
    }, function(x, y){
        edgeX = pivot.attr("cx");
        edgeY = pivot.attr("cy");
    }, function(event){
        var valid_landing = false;
        land = p.getElementsByPoint(event.x, event.y);
        land.forEach(function(el){
            if(el.data("role") == "pivot"){
                valid_landing = true;
            }
        });
        if (valid_landing){
            edge.attr({
                "arrow-end":"classic-wide-long",
                "stroke-width":2,
                "stroke":"#ccc"
            });
            edge.glow({
                width:30,
                color:"#ccc",
                opacity:0.3
            });
            this.hide();
            nodeset.toFront();
        }else{
            edge.remove();
        }
    });

    nodeset.hover(
        function(){
            pivot.show();
        },function(){
            pivot.hide();
        }
    );

    return nodeset;
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









