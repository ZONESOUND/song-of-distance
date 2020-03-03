import Tone from 'tone';
let mode = 1; 
let octave = 'CDEFGAB'; //start from index 1 so put C at second 
let octaveStart = 2;
let octaveMax = 6;

let startFreq = Tone.Frequency('F3').toFrequency();
let noteBetween = 5;
let noteNumber = 9;

let layerInner = 2;
let layerOuter = 15;

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
    //return;
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
    
    if (d.leave !== true) {
        //mode ? note : Tone.Frequency(note)
        triggerActive(note);
        //triggerMetal(mode ? note : Tone.Frequency(note), dis*200+600, 12);
        return;
    }

    let filter = new Tone.Filter(freq, 'bandpass');
    filter.Q.value = 2;
    
    if (d.layer <= layerInner) {
        let membrane = new Tone.MembraneSynth ({
            pitchDecay  : 0.001 ,
            octaves  : 2,
            oscillator  : {
            type  : 'sine'
            }  ,
            envelope  : {
            attack  : 0.1 ,
            decay  : 0.5 ,
            sustain  : 0.05 ,
            release  : 1.4 ,
            attackCurve  : 'exponential'
            }
            }).chain(reverb);
            //d.layer*Tone.Frequency('C4')
        membrane.triggerAttackRelease(note, 1);

        return;
    }
    // if (d.layer > layerOuter) {
    //     let env = new Tone.AmplitudeEnvelope({
    //         attack: 0.4,
    //             attackCurve: 'sine',
    //             decay: 0,
    //             sustain: 1,
    //             release: 0.5,
    //             releaseCurve: 'sine'
    //       }).toMaster();
          
    //       let osci = new Tone.FatOscillator({
    //         type: 'sine',
    //         spread: 20,
    //         count: 10,
    //       }).start().connect(env);
    //       osci.freq = note;
    //       env.triggerAttackRelease(1);
    //     return;
    // }
    if (noteTimeout[layer]) {
        clearTimeout(noteTimeout[layer]);
        setTimeout(()=>{setRelease(layer)}, noteDuration);
        return;
    }
    
    //console.log(layer, note, freq);
    //freq
    
    // var fmSynth = new Tone.FMSynth().chain(filter, reverb, comp);
    // fmSynth.triggerAttackRelease(note, 0.15);
    setAttackRelease(filter, layer, note);

    
    
}

let triggerActive = (note) => {
    let synth = new Tone.PolySynth(5, Tone.Synth, {
        oscillator : {
            type: 'sawtooth',
            partials : [1, 0.34, 0.67, 1],
            partialCounts: 5,
        },
        envelop: {
          attack: 0.01,
          decay: 1.2,
          decayCurve: 'exponential',
          sustain: 0,
          release: 0.3
        }
    }).connect(reverb);
    synth.triggerAttackRelease(note, noteDuration/1000);
}

let triggerMetal = (frequency, resonance, harmonicity) => {
    // frequency = Math.max(Math.min(100, frequency), Tone.Frequency('C6'));
    // let metal = new Tone.MetalSynth({
    //     frequency  : frequency,
    //     envelope  : {
    //     attack  : 0.01 ,
    //     decay  : 0.4 ,
    //     release  : 0.2
    //     },
    //     harmonicity  : harmonicity,
    //     modulationIndex  : 20,
    //     resonance  : resonance,
    //     octaves  : 1.5
    //     }
    // ).connect(reverb);
    // metal.envelope.decayCurve = 'exponential';
    // metal.triggerAttackRelease(0.4);
    
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
    number = Math.floor(Math.pow(number, 1/1.2)) - 1;
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