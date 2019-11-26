//Height and Width;
const h=600;
const w=600;
const margin={top: 0, right: 0, bottom: 0, left: 0};

//Initialize Selection;
let chartType="dance";

//Initialize SVG;
const svg = d3.select("svg");

//Set Track Data;
const trackData = [
    {name: "Every Hour", 	        value: 1},
    {name: "Selah", 		        value: 1},
    {name: "Follow God", 	        value: 1},
    {name: "Closed On Sunday", 	    value: 1},
    {name: "On God",	            value: 1},
    {name: "Everything We Need",    value: 1},
    {name: "Water",                 value: 1},
    {name: "God Is", 	            value: 1},
    {name: "Hands On",              value: 1},
    {name: "Use This Gospel",       value: 1},
    {name: "Jesus Is Lord",         value: 1}
];

//Initialize Quote Class;
class quotes {
    constructor(quoteArray){
        this._quoteArray = quoteArray;
        this._i = 0;
        this._arrayLen = quoteArray.length;
    }

    get quoteArray() {
        return this._quoteArray;
    }

    get i(){
        return this._i;
    }
 
    set quoteArray(newArray) {
        this._quoteArray = newArray;
    }

    quoteReturn(){
        if(this._i === this._arrayLen){
            this._i = 0;
        }

        this._i += 1;
        return this._quoteArray[this._i-1];
    }
}

const track1 = new quotes(["Sing 'til the power of the Lord comes down",
                           'Let everything that have breath praise God',
                           'When we sing the glory of the Lord comes down']);
const track2 = new quotes(["God is King, we the soldiers",
                           "I ain't mean I'm just focused",
                           "Everybody wanted Yahndi, then Jesus Christ did the laundry",
                           "The strong start on Sunday",
                           "The army of God and we are the truth"]);
const track3  = new quotes(["Screamin' at my dad and he told me 'It ain't Christ-like'",
                            "Wrestlin' with God, I don't really want to wrestle",
                            "Stretch my hands to You"]);
const track4  = new quotes(["Closed on Sunday, you're my Chick-fil-A",
                            "Follow Jesus, listen and obey",
                            "Jezebel don't even stand a chance",
                            "Chick-fil-A!"]);
const track5  = new quotes(["Thou shalt love thy neighbor, not divide",
                            "Thirteenth amendment, gotta end it, that's on me",
                            "I wore my heart on my sleeve, I couldn't hide",
                            "That's on God"]);
const track6  = new quotes(["Switch your, switch your attitude",
                            "Switch my, switch my attitude",
                            "What if Eve made apple juice?"]);
const track7  = new quotes(["Take the chlorine out our conversation",
                            "Pure as water, like a newborn daughter",
                            "The storm may come, but we'll get through it because of your love"]);
const track8  = new quotes(["He's the strength in this race that I run",
                            "You won't ever be the same when you call on Jesus' name",
                            "This ain't 'bout a dead religion, Jesus brought a revolution",
                            "There is freedom from addiction"]);
const track9  = new quotes(["Made a left when I should've made a right",
                            "Told the devil that I'm going on strike",
                            "What have you been hearin' from the Christians?",
                            "They'll be the first one to judge me",
                            "If they only see the wrongs, never listen to the songs"]);
const track10 = new quotes(["Use this gospel for protection, it's a hard road to Heaven",
                            "The best is yet to come, I'm just glad that you waited",
                            "From the concrete grew a rose",
                            "Just hold onto your brother when his faith lost"]);
const track11 = new quotes(["Every knee shall bow",
                            "Every tongue confess",
                            "Jesus is Lord"]);

const lyricsArray=[track1,track2,track3,track4,track5,track6,
                   track7,track8,track9,track10,track11];

//Set number of tracks;
const numTracks = trackData.length;

//Set Radius;
const radius = Math.min(w/2,h/2);

//Calculate Angles;
const angleSlice = Math.PI * 2 / numTracks;

//Define pie;
const pie = d3.pie()
              .startAngle(0 - (angleSlice/2))
			  .endAngle(2*Math.PI + (angleSlice/2))
              .value(function(d) { return d.value; })
              .padAngle(.01)
              .sort(null);

//Define Arc;
const arc = d3.arc()
              .innerRadius(w*0.85/2)
              .outerRadius(w*0.90/2);

//Draw the arcs;
svg.append('g')
     .attr("class","tracksLayer")
     .attr('transform', 'translate(' + w/2 +  ',' + h/2 +')')
   .selectAll(".trackArc")
     .data(pie(trackData))
     .enter()
   .append("path")
     .attr("class","trackArc")
     .attr("d",arc)
     .attr("fill","none")
     .each(function(d,i){
        //Search pattern for everything between the start and the first capital L
        let firstArcSection = /(^.+?)L/; 

        //Grab everything up to the first Line statement
        let newArc = firstArcSection.exec( d3.select(this).attr("d") )[1];

        //Replace all the comma's so that IE can handle it
        newArc = newArc.replace(/,/g , " ");

        //If the end angle lies beyond a quarter of a circle (90 degrees or pi/2) 
        //flip the end and start position
        if ((d.endAngle > (Math.PI/2) + (angleSlice/2)) && (d.endAngle < (3*Math.PI/2)+(angleSlice/2))) {
            var startLoc 	= /M(.*?)A/,		//Everything between the first capital M and first capital A
                middleLoc 	= /A(.*?)0 0 1/,	//Everything between the first capital A and 0 0 1
                endLoc 		= /0 0 1 (.*?)$/;	//Everything between the first 0 0 1 and the end of the string (denoted by $)
            //Flip the direction of the arc by switching the start en end point (and sweep flag)
            //of those elements that are below the horizontal line
            var newStart = endLoc.exec( newArc )[1];
            var newEnd = startLoc.exec( newArc )[1];
            var middleSec = middleLoc.exec( newArc )[1];
            
            //Build up the new arc notation, set the sweep-flag to 0
            newArc = "M" + newStart + "A" + middleSec + "0 0 0 " + newEnd;
        }

        //Create a new invisible arc that the text can flow along
        svg.select(".tracksLayer")
           .append("path")
            .attr("class", "hiddenTrackArcs")
            .attr("id", "trackArc_"+i)
            .attr("d", newArc)
            .style("fill", "none");
     });

//Add Text to arcs;
svg.select(".tracksLayer")
   .selectAll(".trackText")
     .data(pie(trackData))
     .enter()
   .append("text")
     .attr("class","trackText")
     .attr("font-family","Playfair Display")
     .attr("font-size","1.1em")
     //Move the labels below the arcs for those slices with an end angle greater than 90 degrees
     .attr("dy", function(d,i) { return ((d.endAngle > (Math.PI/2) + (angleSlice/2)) && (d.endAngle < (3*Math.PI/2)+(angleSlice/2)) ? 18 : -11); })
   .append("textPath")
     .attr("startOffset","50%")
     .style("text-anchor","middle")
     .attr("fill","#C5BD59")
     .attr("xlink:href",function(d,i){return "#trackArc_"+i;})
     .text(function(d){return d.data.name;});

//Center Text;
svg.select("#lyricText")
     .attr("x","300")
     .attr("y","272")
     .attr("dy", "0.35em")
     .text("Jesus is King")
     .call(wrap, 280);

//Create Lyrics Event;
svg.selectAll(".trackText")
     .on("click", function(d){
         console.log(d.index);
         svg.select("#lyricText")
            .text(lyricsArray[d.index].quoteReturn())
            .call(wrap, 280);
     })

//Initialize Variables;
let featureData, maxVal;

//Read in JSON;
d3.json("www/data/features.json").then(function(data){
    featureData=data[chartType];

    //Set Maximum Value Based on Feature;
    switch(chartType) {
        case "dance":
            maxVal=1;
            break;
        case "energy":
            maxVal=1;
            break;
        case "valence":
            maxVal=1;
            break;
        case "tempo":
            maxVal=d3.max(data[chartType],function(d){ return d.value; });
            break;
        case "duration":
            maxVal=d3.max(data[chartType],function(d){ return d.value; });
            break;
      }

	//Scale for the radius
    let rScale = d3.scaleLinear()
                   .domain([0, maxVal])
                   .range([90, (radius*0.90)]);
        
    //The radial line function
    let radarLine = d3.lineRadial()
                      .curve(d3.curveCatmullRomClosed)
		              .radius(function(d) {return rScale(d.value); })
                      .angle(function(d,i) {return i*angleSlice; });
    
    //Create group for radar;
    svg.append("g")
         .attr("class","radarLayer")
         .attr('transform', 'translate(' + w/2 +  ',' + h/2 +')')
       .selectAll('path')
         .data([data[chartType]])
         .enter()
       .append('path')
		 .attr("class", "radarStroke")
		 .attr("d", function(d,i) { return radarLine(d); })
		 .style("stroke-width", "3px")
		 .style("stroke", "#C5BD59")
         .style("fill", "none");
         
    //Append Circles;
    svg.select(".radarLayer")
       .selectAll("circle")
         .data(data[chartType])
         .enter()
       .append('circle')
         .attr("r","4")
         .attr("cx",function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
         .attr("cy",function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
         .attr("fill","#C5BD59");

    d3.select(".radarLayer")
      .selectAll("circle")
        .on("mouseover", function(d){
            d3.select("#tooltip")
                .style("left",  d3.event.pageX + "px")
                .style("top",  d3.event.pageY + "px");
            
            d3.select("#tipName")
                .text(d.axis);

            d3.select("#tipValue")
                .text(function(){
                    if(chartType==="duration"){
                        let min = Math.floor(d.value/1000/60);
                        let sec = Math.round((d.value-(min*60*1000))/1000);
                        return min + ":" + sec;
                    } else if(chartType==="tempo"){
                        return Math.round(d.value) + " BPM";
                    } else {
                        return d.value;
                    }
                });

            d3.select("#tooltip")
                .classed("hidden",false);
        })
        .on("mouseout", function(){
            d3.select("#tooltip")
                .classed("hidden",true);
        })

    //Radio Button;
    d3.selectAll("input")
        .on("click", function() {
            chartType = d3.select(this).node().value;

            //Set Maximum Value Based on Feature;
            switch(chartType) {
                case "dance":
                    maxVal=1;
                    break;
                case "energy":
                    maxVal=1;
                    break;
                case "valence":
                    maxVal=1;
                    break;
                case "tempo":
                    maxVal=d3.max(data[chartType],function(d){ return d.value; });
                    break;
                case "duration":
                    maxVal=d3.max(data[chartType],function(d){ return d.value; });
                    break;
            }

            //Scale for the radius
            let rScale = d3.scaleLinear()
                        .domain([0, maxVal])
                        .range([90, (radius*0.90)]);

            //The radial line function
            let radarLine = d3.lineRadial()
                            .curve(d3.curveCatmullRomClosed)
                            .radius(function(d) {return rScale(d.value); })
                            .angle(function(d,i) {return i*angleSlice; });

            //Create group for radar;
            svg.select(".radarLayer")
               .selectAll('path')
                 .data([data[chartType]])
                 .transition()
                 .duration(1000)
                 .attr("d", function(d,i) { return radarLine(d); });

            svg.select(".radarLayer")
               .selectAll("circle")
                 .data(data[chartType])
                 .transition()
                 .duration(1000)
                 .attr("cx",function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
                 .attr("cy",function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); });
        });
})

function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 3.0, // ems
          y = text.attr("y"),
          x = text.attr("x"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
          
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }//wrap	