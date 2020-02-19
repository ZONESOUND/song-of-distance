import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.min.css';
import './NameModal.css';

export function NameModal(props) {
    const [show, setShow] = useState(props.show);
    const [name, setName] = useState("");
    const handleClose = () => {
        setShow(false);
        if (name !== "")
            props.onChange(name, true);
    }
    const handleShow = () => {
        setShow(true);
    }
  
    return (
      <>
        {/* <Button variant="primary" onClick={handleShow}>
          Launch demo modal
        </Button> */}
  
        <Modal show={show} 
                centered={true}
                dialogClassName={'name-modal-dialog'}
                backdropClassName={'name-modal-backdrop'}>
            <Modal.Body bsPrefix={'name-modal-body'}>
                <label htmlFor="name">Name your session</label> <br/>
                <input id="name" type="text" placeholder={props.name} 
                    value={name} onChange={e => setName(e.target.value)}></input>
                
            </Modal.Body>
            <Modal.Footer bsPrefix={'name-modal-footer'}>
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
