import React, {useState, useEffect} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {makesound} from './sound';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BlackModal.css';

export function NameModal(props) {
    const [show, setShow] = useState(props.show);
    const [name, setName] = useState("");
    const handleClose = () => {
        makesound();
        setShow(false);
        if (name !== "")
            props.onChange(name, true);
    }
    useEffect(()=>{
        if (props.show)
            setShow(true);
    },[props.show]);
  
    return (
      <>
        {/* <Button variant="primary" onClick={handleShow}>
          Launch demo modal
        </Button> */}
  
        <Modal show={show} 
                centered={true}
                dialogClassName={'black-modal-dialog'}
                backdropClassName={'black-modal-backdrop'}>
            <Modal.Body bsPrefix={'black-modal-body'}>
                <label htmlFor="name">Please Name Your Session</label> <br/>
                <input id="name" type="text" placeholder={props.name} 
                    value={name} onChange={e => setName(e.target.value)}></input>
                <span className="hint"> ⚠ Turn on the audio and Location Services setting to have complete experience.</span>           </Modal.Body>
            <Modal.Footer bsPrefix={'black-modal-footer'}>
                <Button variant="dark" size="sm" onClick={handleClose}>
                    Default
                </Button>
                <Button variant="light" size="sm" onClick={handleClose}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
      </>
    );
}
