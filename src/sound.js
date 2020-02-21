import Tone from 'tone';
let octave = 'BCDEFGA'; //start from index 1 so put C at second 
let octaveStart = 3;
let octaveMax = 6;
let synth;

export let initSound = () => {
    synth = new Tone.Synth({
        oscillator : {type:'sine'} ,
        envelope : {
            attack: 0.1 ,
            decay: 0.1 ,
            sustain: 0.2 ,
            release: 0.5
        }}).toMaster();
}

export let triggerSound = (d) => {
    synth.triggerAttackRelease(getNote(d.layer), '16n');
}

let getNote = (number) => {
    let len = octave.length;
    return octave[number%len]+
        Math.min(octaveMax, Math.floor(octaveStart+number/len));
}

export let makesound = () => {
    let temp = new Tone.Synth().toMaster();
    temp.volume.value = -60;
    temp.triggerAttackRelease('C4', '16n');
}