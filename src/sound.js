import Tone from 'tone';
let osc;
export let initSound = () => {
    osc = new Tone.Oscillator().toMaster();
}

export let triggerSound = () => {
    osc.triggerAttackRelease('C4', '8n', 0)
}