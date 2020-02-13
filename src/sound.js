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
    synth.triggerAttackRelease(octave[d.layer%7]+
        Math.min(octaveMax, Math.floor(octaveStart+d.layer/7)), '16n');
}