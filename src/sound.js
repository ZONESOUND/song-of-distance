import Tone from 'tone';
let mode = 1; 
let octave = 'CDEFGAB'; //start from index 1 so put C at second 
let octaveStart = 2;
let octaveMax = 6;

let startFreq = Tone.Frequency('C2').toFrequency();
let noteBetween = 5;
let noteNumber = 10;

let noteDuration = 150;
let synth, reverb, comp;
let noteTimeout = {};
let noteSynth = {};

export let initSound = () => {
    comp = new Tone.Compressor(-30, 3).toMaster();    
    reverb = new Tone.Reverb({
        pre_delay: 0.05,
        decay: 3,
        wet: 0.6,
    }).connect(comp);
    reverb.generate();
    if (mode === 0) noteNumber = octave.length*(octaveMax-octaveStart+1);
    initNote();
    // synth = new Tone.Synth({
    //     oscillator : {type:'sine'} ,
    //     envelope : {
    //         attack: 0.1 ,
    //         decay: 0.1 ,
    //         sustain: 0.2 ,
    //         release: 0.5
    //     }});
        //.chain(filter, reverb);
}

let initNote = () => {
    for (let i=0; i<noteNumber; i++) {
        genSineSynth(i);
        //genFMSynth(i);
    }
}

let genSineSynth = (ind) => {
    noteSynth[ind] = new Tone.Synth({
        oscillator : {type:'sine'} ,
        envelope : {
            attack: 0.1 ,
            decay: 5 ,
            sustain: 0.2 ,
            release: 0.5
        }});
    noteSynth[ind].envelope.decayCurve = 'exponential';
}

let genFMSynth = (ind) => {
    noteSynth[ind] = new Tone.FMSynth({envelope:{
        attack: 0.1 ,
        decay: 5 ,
        sustain: 0.2 ,
        release: 0.5
    }});
    noteSynth[ind].envelope.decayCurve = 'exponential';
}

export let triggerSound = (d) => {
    let layer = Math.ceil(d.layer);
    let dis = Math.max(0.5, layer - d.layer);
    layer = scaleNumber(layer);
    let note = 0;
    let freq = 0;
    switch (mode) {
        case 0:
            note = getNote(layer);
            freq = Tone.Frequency(note).toFrequency()*0.8*dis;
            break;
        case 1:
            note = getFreq(layer);
            freq = note*0.8*dis;
            break;
    
        default:
            break;
    }
    //let note = getFreq(layer);
    //let freq = note*0.8*dis;
    
    
    if (noteTimeout[layer]) {
        clearTimeout(noteTimeout[layer]);
        setTimeout(()=>{setRelease(layer)}, noteDuration);
        return;
    }
    
    
    console.log(layer, note, freq);
    let filter = new Tone.Filter(freq, 'lowpass');
    
    // var fmSynth = new Tone.FMSynth().chain(filter, reverb, comp);
    // fmSynth.triggerAttackRelease(note, 0.15);
    setAttackRelease(filter, layer, note);
}

let setAttackRelease = (filter, ind, note) => {
    //(noteSynth[note].chain(filter, reverb, comp)).triggerAttack(note);
    (noteSynth[ind].chain(filter,reverb)).triggerAttack(note);
    noteTimeout[ind] = setTimeout(()=>{
        setRelease(ind);
    }, noteDuration);
}

let setRelease = (ind) => {
    noteSynth[ind].triggerRelease();
    noteTimeout[ind] = null;
}

let scaleNumber = (number) => {
    number = Math.floor(Math.pow(number, 1/2)) - 1;
    return Math.max(Math.min(number, noteNumber-1), 0);
    //not sure if i need to use max(..,0);
}

let getNote = (number) => {
    let len = octave.length;
    return octave[number%len]+
        Math.min(octaveMax, Math.floor(octaveStart+number/len));
}

let getFreq = (number) => {
    return calculateFreq(startFreq, number*noteBetween);
}

let calculateFreq = (freq, half) => {
    return freq * Math.pow(2, half/12.0);
}

export let makesound = () => {
    let temp = new Tone.Synth().toMaster();
    temp.volume.value = -60;
    temp.triggerAttackRelease('C4', '16n');
}