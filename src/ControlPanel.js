import React, {Component} from 'react';
import P5Wrapper from 'react-p5-wrapper';
import sketch from './sketch';
import {earthLocRef} from './firebase';
import * as dat from 'dat.gui';
import {gpsPermission, gpsData, setupGPS} from './gps';
import {NameModal} from './NameModal';
import {IntroModal} from './IntroModal';
import { LocHintModal } from './LocHintModal';

const SESSION_ID = 'generative_geo_id';
const SESSION_NAME = 'generative_name';
const SESSION_TIME = 'generative_geo_id_time';

class LocData extends Component {
    state = {
        gp: {},
        //allLocations: [],
        dataPoint: []
    }

    componentDidMount() {
        //this.initGPS();
        console.log('setupGPS');
        setupGPS();
        earthLocRef.on('value', (snapshot) => {
            //console.log(snapshot.val());
            // this.setState({
            //     allLocations: snapshot.val()
            // });
            //getAll();
            this.updateDataSet(snapshot.val());
        });
    }

    initGPS = () => {
        
    }

    updateDataSet = (allLocations) => {
        console.log('updateDataset');
        
        //this.checkData(allLocations);
        this.setState({
            // dataPoint: Object.entries(this.state.allLocations).map(d => 
            dataPoint: Object.entries(allLocations)
            .filter(d=> {
                return d[0] !== gpsData.key})
            .map(d => 
                ({...d[1], key: d[0]}))
        })
        
    }

    checkData = (allLocations) => {
        //should be removed....
        Object.entries(allLocations).forEach((e)=>{
            //如果沒有 key 補上
            if (!('key' in e[1])) {
                earthLocRef.child(e[0]).child('key').set(e[0]);
            }
            //如果沒有 showId 補上
            if (!('showId' in e[1]) && e[0] ){
                earthLocRef.child(e[0]).child("showId").set(getShowId(e[0]))
            }
            //如果沒有時間戳或位置資料，移除該資料
            if (!e[1].timeStamp || !e[1].lat || !e[1].lon){
                earthLocRef.child(e[0]).remove()
            } else { //check offline
                let timeDelta = Date.now()-e[1].timeStamp
                //如果已離線>6秒，設定為離線
                if (timeDelta > 6000){
                    if (!e[1].leave){
                        earthLocRef.child(e[0]).child('leave').set(true)
                    }
                } else{
                    //如果沒有，設定為活躍
                    if (e[1].leave){
                        earthLocRef.child(e[0]).child('leave').set(false)    
                    }
                }
            }
        })
    }

    render() {
        return (<>
            <LocHintModal show={gpsPermission===false}/>
            <IntroModal show={false}/>
            {gpsPermission && <ControlPanel dataPoint={this.state.dataPoint}/>}
            </>
        );
    }
}

class ControlPanel extends Component {
    state = {
        data: {
            globalScale: 250000,
            globalPow: 0.58,
            maxLineLength: 100,
            radioSpeed: 0.8,
            lat: gpsData.lat,
            lon: gpsData.lon,
            centerName: 'center'
        }, 
        name: 'center',
        naming: false
        //GUI: new dat.GUI()
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.handleWindowBeforeUnload);
        this.addGPSKey();
        this.setState({naming: true});
        //let dataStore = sessionStorage.getItem('controlData');
        //console.log(dataStore);
        //let {data, GUI} = this.state;
        //if (dataStore) {
        // data = JSON.parse(dataStore);
        //     this.setState({
        //         data: data
        //     })
        //} 
        // const btn = {'add config': this.saveControlData};
        // GUI.add(data,"globalScale",1000,800000)
        // GUI.add(data,"globalPow",0,0.99)
        // GUI.add(data,"maxLineLength")
        // GUI.add(data,'radioSpeed',0,3,0.01)
        // GUI.add(data,'centerName')
        // GUI.add(data,'lat',-90,90,0.01)
        // GUI.add(data,'lon',-180,180,0.01)
        // GUI.add(btn, 'add config');

        // GUI.close()
    }

    componentWillUnmount() {
        window.removeEventListener("beforeunload", this.handleWindowBeforeUnload);
    }

    addGPSKey = () => {
        let myId;
        let lastId = localStorage.getItem(SESSION_ID)
        let lastIdTime = localStorage.getItem(SESSION_TIME)
        let showId = localStorage.getItem(SESSION_NAME)
        if (lastId && (Date.now() - lastIdTime < 60*60*1000)){
            console.log("Old Id Detected! use " + lastId)
            myId = lastId
            localStorage.setItem(SESSION_TIME, Date.now())
        } else{
            myId = earthLocRef.push(gpsData).key;
            showId = getShowId(myId);
            console.log("Generate new id " + myId)
            localStorage.setItem(SESSION_ID,myId)
            localStorage.setItem(SESSION_TIME, Date.now())
        }
        
        gpsData.key = myId;
        console.log(gpsData.key);
        if (!showId)
            showId = getShowId(myId);
        gpsData.showId = showId;
        earthLocRef.child(myId).set(gpsData);
        this.changeCenterName(showId, false);
    }

    changeCenterName = (name, updateFirebase) => {
        localStorage.setItem(SESSION_NAME, name);
        if (updateFirebase && gpsData.key) 
            earthLocRef.child(gpsData.key).child('showId').set(name);
        this.setState({data:{...this.state.data, centerName: name}, name: name});
    }
    
    saveControlData = () => {
        let {data} = this.state;
        sessionStorage.setItem('controlData', JSON.stringify({...data}));
    }

    handleWindowBeforeUnload = (e) => {
        earthLocRef.child(gpsData.key).child('leave').set(true);
        return;
    }

    render() {
        const {data} = this.state;
        let {dataPoint} = this.props;

        return (
            <>
            <NameModal show={this.state.naming} name={data.centerName} 
                        onChange={this.changeCenterName}/>
            <P5Wrapper sketch={sketch} dataPoint={dataPoint}
                    configData={data} myId={gpsData.key}/>
            </>
        )


    }

}

const getShowId = (id) => {
    return "A" + (id.split("").map(ch=>ch.charCodeAt(0)).reduce((a,b)=>(a*b),1) % 1000)
  }

export default LocData;