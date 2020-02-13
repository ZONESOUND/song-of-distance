import Tone from 'tone';
let octave = 'CDEFGAB';
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
    synth.triggerAttackRelease('C4', '8n');
}