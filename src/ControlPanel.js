import React, {Component} from 'react';
import P5Wrapper from 'react-p5-wrapper';
import sketch from './sketch';
import {earthLocRef} from './firebase';
import * as dat from 'dat.gui';


class LocData extends Component {
    state = {
        allLocations: [],
        dataPoint: []
    }

    componentDidMount() {
        earthLocRef.on('value', (snapshot) => {
            //console.log(snapshot.val());
            this.setState({
                allLocations: snapshot.val()
            });
            //getAll();
            this.updateDataSet();
        });
    }

    updateDataSet = () => {
        console.log('updateDataset');
        
        this.checkData();
        this.setState({
            dataPoint: Object.entries(this.state.allLocations).map(d => 
                ({...d[1], key: d[0]}))
        })
        
    }

    checkData = () => {
        //should be removed....
        Object.entries(this.state.allLocations).forEach((e)=>{
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
        return (
        <ControlPanel dataPoint={this.state.dataPoint}/>
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
            lat: 42.35,
            lon: -71.05,
            centerName: 'center'
        }, 
        GUI: new dat.GUI()
    }

    componentDidMount() {
        let dataStore = sessionStorage.getItem('controlData');
        console.log(dataStore);
        let {data, GUI} = this.state;
        if (dataStore) {
            data = JSON.parse(dataStore);
            this.setState({
                data: data
            })
        } 
        const btn = {'add config': this.saveControlData};
        GUI.add(data,"globalScale",1000,800000)
        GUI.add(data,"globalPow",0,0.99)
        GUI.add(data,"maxLineLength")
        GUI.add(data,'radioSpeed',0,3,0.01)
        GUI.add(data,'centerName')
        GUI.add(data,'lat',-90,90,0.01)
        GUI.add(data,'lon',-180,180,0.01)
        GUI.add(btn, 'add config');

        GUI.close()
    }
    
    saveControlData = () => {
        let {data} = this.state;
        sessionStorage.setItem('controlData', JSON.stringify({...data}));
    }

    render() {
        const {data} = this.state;
        let {dataPoint} = this.props;

        return (
            <P5Wrapper sketch={sketch} dataPoint={dataPoint} configData={data}/>
        )


    }

}

const getShowId = (id) => {
    return "A" + (id.split("").map(ch=>ch.charCodeAt(0)).reduce((a,b)=>(a*b),1) % 1000)
  }

export default LocData;