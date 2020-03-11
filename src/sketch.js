import {receiveOSC, emitOSC, isSocketConnect} from './socketUsage';
import {initSound, triggerSound} from './sound';
//import {earthLocRef} from './firebase';

export default function sketch (p) {
    let radioDeg = 0;
    let lastRadioDeg = 0;
    let allDataPoint = [];
    let dataPoint = [];
    let configData = {};
    let enableUpdate = true;
    let lightCounter = 0;
    let rDistArr = [];
    let myId;
    let testBtn;

    receiveOSC((data)=>{
        if (data.address == '/gps/trigger'){
            let scanId = JSON.parse(data.args[0].value).id
            if (scanId == myId){
                lightCounter = 0;
            }
        }
    });

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.frameRate(30);
        console.log('issocketConnect:' + isSocketConnect);
        initSound();
        // for test
        // testBtn = p.createButton('yo');
        // testBtn.position(19, 19);
        // testBtn.mousePressed(()=>{
        //     triggerSound({layer:30, leave: false});
        // })
    };

    p.windowResized = () =>  {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }

    p.myCustomRedrawAccordingToNewPropsHandler = (props) => {
        if (props.configData) {
            configData = props.configData;
            calcRdistArr();
        }
        if (props.dataPoint && Object.keys(configData).length !== 0){
            allDataPoint = props.dataPoint;
            allDataPoint.forEach(e => {
                if (!e) console.log('sth wrong?');
            })
            console.log('receive!');
            updateDataPoint();
        }
        if (props.myId) {
            myId = props.myId;
        }
    };

    let dataPointMap = (e) => {
        let pos = getPos(p, configData, e);
        let dist = pos.mag().toFixed(5)*1.0;
        let deg = (pos.heading()/Math.PI*180).toFixed(5)*1.0;
        return {...e, pos: pos, dist: dist, degree: deg}
    }

    let updateDataPoint = () => {
        let num = p.int(p.frameCount / 4);
        if (num) {
            let threshold = calcR(10, configData.globalScale, configData.globalPow);
            dataPoint = allDataPoint.slice(-num).map(dataPointMap).filter((e) => e.dist < threshold);
        }
        enableUpdate = num > allDataPoint.length ? false : true;
    }

    let calcRdistArr = () => {
        for (let i=0; i<50; i++) {
            rDistArr[i] = calcR(i, configData.globalScale, configData.globalPow);
        }
    }


    p.draw = function () {
        if (p.frameCount % 25 === 0 && enableUpdate){
            updateDataPoint();
        }
        lastRadioDeg = radioDeg;
        radioDeg = calcDeg(configData.radioSpeed, p.frameCount);

        //emit radio
        // if (p.frameCount % 30 === 0)
        //     emitOSC('/gps/radio', (radioDeg/Math.PI*180).toFixed(5)*1.0)

        lightCounter++;
        p.background(255/lightCounter, 100);
        p.textSize(12)
        p.fill(255)
        p.stroke(255,10)
        p.strokeWeight(1)
        
        let text = `Total Nodes: ${calcPerson(dataPoint)}\nActive: ${calcActive(dataPoint)}\nExecute Time: ${p.frameCount}\nScanning: ${(radioDeg/Math.PI*180).toFixed(2)}°`
        drawText(p, text);
        //將繪製點移動到畫布中央
        p.translate(p.width/2, p.height/2);
        drawCircle(p, rDistArr);
        drawDataPoint(p, dataPoint, radioDeg, lastRadioDeg, configData);
        
        p.noFill()
        drawSwipeLine(p, radioDeg);
        drawCenter(p, configData.centerName);
        drawMapFrame(p);
        drawSecRect(p);
    };
};

function drawSecRect(p) {
    let sec = new Date().getSeconds();
    p.fill(255);
    p.rect(-p.width/2+(sec % 5)*30+20,p.height/2-75,25,6);
    p.stroke(255);
    p.noFill();
    p.rect(-p.width/2+( (sec+1) % 5)*30+20,p.height/2-75,25,6);
}

function drawMapFrame(p) {
    p.push();
        p.stroke(255,255);
        p.strokeWeight(10);
        p.rect(-p.width/2,-p.height/2, p.width, p.height);
        p.strokeWeight(1);
        p.stroke(255,30);
        
        p.rect(-p.width/2+10,-p.height/2+10, p.width-20, p.height-20);
    
        p.stroke(255,255);
        p.strokeWeight(2);
        p.line(-p.width/2,0,-p.width/2+20,0);
        p.line(p.width/2,0,p.width/2-20,0);
    
        p.line(0,-p.height/2,0,-p.height/2+20);
        p.line(0,p.height/2,0,p.height/2-20);
    
        p.noStroke();
        p.fill(255,200);
        p.textAlign(p.CENTER);
        p.text('W',-p.width/2+20+15,5);
        p.text('E',p.width/2-20-15,5);
        p.text('N',0,-p.height/2+20+20);
        p.text('S',0,p.height/2-20-10);
    p.pop();
}

function drawCenter(p, centerName) {
    p.push();
        p.fill("#f24");
        p.noStroke();
        p.ellipse(0,0,8,8);
        p.rectMode(p.CENTER);
        p.stroke(255);
        p.noFill();
        p.strokeWeight(2);
        p.rect(0,0,20,20);
    
    
        p.rotate(p.frameCount/100);
        p.stroke(255,20);
        p.rect(0,0,20,20);
    p.pop();

    p.push();
        p.fill(255,200);
        p.text(centerName, 20, 12);
    p.pop();
}

function drawSwipeLine(p, radioDeg) {
    p.push()
        p.stroke(255,200)
        p.strokeWeight(2)
        p.line(0,0,Math.cos(radioDeg)*1000, Math.sin(radioDeg)*1000)
        p.noStroke()
        let degSpan = 20
        for(var i=0;i < degSpan;i++){
            p.fill(255,50/ degSpan*(degSpan-i) )
            p.beginShape()
            p.vertex(0,0)
            p.vertex(Math.cos(radioDeg-0.02*(i-1))*1000,Math.sin(radioDeg-0.02*(i-1))*1000)
            p.vertex(Math.cos(radioDeg-0.02*i)*1000,Math.sin(radioDeg-0.02*i)*1000)
            p.endShape(p.CLOSE)
        }
    p.pop()
}

function drawDataPoint(p, dataPoint, radioDeg, lastRadioDeg, configData) {
    p.textSize(12)
    p.fill(255)
    p.stroke(255,10)
    p.strokeWeight(1)
    let lastTrigger;
    dataPoint.forEach(( e, eid)=>{
        let timeDelta = Date.now()- e.timeStamp;
        let dataDegree = e.pos.heading();
        let angleDelta = -1000
        let nowId = e.showId;
        if (!e.pos) {
            console.log('no position?');
            return;
        }
        angleDelta = dataDegree - radioDeg;
        let scanned = ((lastRadioDeg - dataDegree) * (radioDeg - dataDegree) <= 0)
                        && Math.abs(lastRadioDeg - radioDeg) < 1;
        
        if (scanned){
            if (lastTrigger !== e){
                //console.log(e);
                let d2 = JSON.stringify({
                    degree: e.degree,
                    dist: e.dist,
                    id: e.key,
                    data: e.data,
                    leave: e.leave,
                    timeStamp: e.timeStamp,
                    time_to_now_second: timeDelta,
                })               
                let d = {  
                    //layer: Math.ceil(Math.pow(e.dist/0.5, 1/configData.globalPow)*10/configData.globalScale),
                    //layer: Math.ceil(Math.pow(e.dist/0.5, 1/configData.globalPow)*10/configData.globalScale),
                    layer: calcReverseR(e.dist, configData.globalScale, configData.globalPow),
                    degree: e.degree,
                    dist: e.dist,
                    leave: e.leave,
                    pos: e.pos,
                }
                triggerSound(d);
                //emitOSC('/gps/trigger', d2);
            }
            lastTrigger = e;
        }

        p.push()
        let dist = e.pos.mag()

        //draw line
        if (dist < p.width * 2){
            p.noFill()
            p.beginShape()
            for(var o=0; o < dist-10; o+=2){
                let useAngle = dataDegree + p.noise(p.frameCount/10+ o/10)/60
                p.vertex(Math.cos(useAngle)*o, Math.sin(useAngle)*o)
                // line(o,o,a.pos.x*0.95,a.pos.y*0.95)
            }
            p.endShape()
        }
        p.pop()
                
        let scanAfter = Math.abs(angleDelta % (Math.PI*2) ) < 0.08 && angleDelta < 0
        if (scanAfter){
            
            p.push()
                p.fill(0,0,0,70)
                p.noStroke()
                p.rect(e.pos.x+6,e.pos.y-5, p.textWidth(nowId)+8,12)
                p.fill(255)
                p.text(nowId, e.pos.x+10, e.pos.y+5)
            p.pop()
        }
           
        if (!scanned){
            p.fill(255, 5+150/Math.log(timeDelta) + (scanAfter ? 50 : 0))  
        } else{
            p.fill(255)
        }
        
        //繪製正在線上的點
        let useR = 5 + (angleDelta<0?Math.max(Math.min(-1/(angleDelta),6),0):0) + p.noise(eid, p.frameCount, e.lon)*2

        if (!e.leave){
            p.fill(255,0,0)
            //p.text(this.uid, 0, 30)
            useR= 5+ Math.sin(p.frameCount/10)*2
            p.push()
                p.stroke(255,200)
                p.rectMode(p.CENTER)
                p.translate(e.pos.x,e.pos.y)
                p.rotate(p.frameCount/(10+ e.lon/100))
                p.noFill()
                p.rect(0,0,12,12)
            p.pop()
            p.text(`//ACTIVE ${(p.frameCount % 10 <5?".":"")}\nID: ${nowId}`, 
                e.pos.x+10, e.pos.y+20)
        }
        p.ellipse(e.pos.x, e.pos.y, useR, useR)
      })
}

function calcR(i, globalScale, globalPow) {
    return Math.pow(Math.abs(i * globalScale / 10), globalPow)*0.5;
}

function calcReverseR(dist, globalScale, globalPow) {
    return Math.pow(dist/0.25, 1/globalPow)*10/globalScale;
  //return Math.ceil(Math.pow(dist/0.25, 1/globalPow)*10/globalScale);
}

function drawCircle(p, rDistArr) {
    let frameCount = p.frameCount;
    p.noFill();
    for(let i=0;i<50;i++){
        //let r = Math.pow(Math.abs(i * globalScale / 10), globalPow) * 0.5
        let r = 0;
        if (rDistArr.length > i) r = rDistArr[i];
        //else r = calcR(i, globalScale, globalPow);
        p.stroke(255, Math.max(60-i/10*60,4) + Math.sin(-frameCount/10+i)*4)
        if (i<9){
            p.fill(255,255,255,1 + p.noise(frameCount/10,i)*1)
            p.stroke(255,20)
            p.beginShape(p.LINES)
    
            for(let o=0; o<360; o++){
                let useR = calcWaveR(r, frameCount, i, o, 50/(10-i));
                p.vertex(useR*Math.cos(p.radians(o+frameCount/40)),useR*Math.sin(p.radians(o+frameCount/40)) )
            }
            p.endShape()
          
            p.noStroke()
            //用 close 填內容色
            p.beginShape()
            for(let o=0;o<360;o++){
                let useR = calcWaveR(r, frameCount, i, o, 30/(8-i));
                p.vertex(useR*Math.cos(p.radians(o+frameCount/40)),useR*Math.sin(p.radians(o+frameCount/40)) )
            }
            p.endShape(p.CLOSE)

        } else{
            p.noFill()
            p.ellipse(0,0,r,r)

        }
    }  
}

function drawText(p, text) {
    //Draw Date Text 
    p.push();
    p.fill(255);
    p.textSize(14);
    p.textLeading(24);
    p.text(new Date(), 20, p.height-35);
    p.pop();

    //Show Number of Person
    //TODO: Calculate Person
    p.push();
        p.fill(255,130);
        p.text(text, 20, 35);
        //p.text("Total Nodes: "+calcPerson() + "\nActive: " + allActiveCount + "\nExecute Time: " + frameCount+"\nScanning: "+parseFloat( radioDeg/PI*180).toFixed(2)+"°", 20, 35)
    p.pop();
}

function calcWaveR(r, frameCount, i, o, mult) {
    return r/2 + Math.sin(frameCount/(10+i*10)+o/360*2*Math.PI*10)*mult;
}

function calcDeg(radioSpeed, frameCount) {
    return (radioSpeed * frameCount / 60) % (2*Math.PI) - Math.PI;
}

function getPos(p, configData, obj){

    if (obj.lon && obj.lat){
      let lon = (obj.lon-configData.lon)*configData.globalScale
      let lat = (obj.lat-configData.lat)*configData.globalScale
      let result= p.createVector(lon,lat)
      result.x = (result.x>0?1:-1)* Math.pow(Math.abs(result.x),configData.globalPow)
      result.y =  (result.y>0?1:-1)* Math.pow(Math.abs(result.y),configData.globalPow)
      result.y*=-1
      return result
    } 
    return null
}

function calcPerson(dataPoint) {
    return dataPoint.length;
}

function calcActive(dataPoint) {
    return dataPoint.filter(e => !e.leave).length;
}