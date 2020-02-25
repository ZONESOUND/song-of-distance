import Tone from 'tone';
let octave = 'CDEFGAB'; //start from index 1 so put C at second 
let octaveStart = 2;
let octaveMax = 6;
let synth, reverb, comp;
let noteTimeout = {};
let noteSynth = {};

export let initSound = () => {
    comp = new Tone.Compressor(-30, 3).toMaster();    
    reverb = new Tone.Reverb({
        pre_delay: 0.05,
        decay: 3,
        wet: 0.6,
    });
    reverb.generate();
    for (let i=0; i<octave.length; i++) {
        for (let j=octaveStart; j<=octaveMax; j++) {
            noteSynth[octave[i]+j] = new Tone.Synth({
                oscillator : {type:'sine'} ,
                envelope : {
                    attack: 0.1 ,
                    decay: 5 ,
                    sustain: 0.2 ,
                    release: 0.5
                }});
            noteSynth[octave[i]+j].envelope.decayCurve = 'exponential';
        }
    }
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

export let triggerSound = (d) => {
    let layer = Math.ceil(d.layer);
    let dis = Math.max(0.5, layer - d.layer);
    let note = getNote(layer);
    if (noteTimeout[note]) {
        clearTimeout(noteTimeout[note]);
        setTimeout(()=>{setRelease(note)}, 150);
        return;
    }
    
    let freq = Tone.Frequency(note).toFrequency()*0.8*dis;
    console.log(note, freq);
    let filter = new Tone.Filter(freq, 'lowpass');
    
    // var fmSynth = new Tone.FMSynth().chain(filter, reverb, comp);
    // fmSynth.triggerAttackRelease(note, 0.15);
    console.log(noteSynth[note]);

    //let newSynth = noteSynth[note].chain(filter, reverb, comp);
    //newSynth.triggerAttack(note);
    (noteSynth[note].chain(filter, reverb, comp)).triggerAttack(note);
    
    noteTimeout[note] = setTimeout(()=>{
        setRelease(note);
    }, 150);
}

let setRelease = (note) => {
    noteSynth[note].triggerRelease();
    noteTimeout[note] = null;
}

let getNote = (number) => {
    number = Math.floor(Math.pow(number, 1/1.4));
    let len = octave.length;
    return octave[number%len]+
        Math.min(octaveMax, Math.floor(octaveStart+number/len));
}

export let makesound = () => {
    let temp = new Tone.Synth().toMaster();
    temp.volume.value = -60;
    temp.triggerAttackRelease('C4', '16n');
}