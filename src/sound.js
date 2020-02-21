import Tone from 'tone';
let octave = 'EFGABCD'; //start from index 1 so put C at second 
let octaveStart = 3;
let octaveMax = 6;
let synth, reverb, comp;

export let initSound = () => {
    comp = new Tone.Compressor(-30, 3).toMaster();    
    reverb = new Tone.Reverb({
        pre_delay: 0.05,
        decay: 3,
        wet: 0.6,
    });
    reverb.generate();
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
    let dis = layer - d.layer;
    let note = getNote(layer);
    console.log(note);
    let freq = Tone.Frequency(note).toFrequency()*0.8*dis;
    
    let filter = new Tone.Filter(freq, 'lowpass');
    let synth2 = new Tone.Synth({
        oscillator : {type:'sine'} ,
        envelope : {
            attack: 0.1 ,
            decay: 0.1 ,
            sustain: 0.2 ,
            release: 0.5
        }}).chain(filter, reverb, comp);

    synth2.triggerAttackRelease(note, '16n');
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