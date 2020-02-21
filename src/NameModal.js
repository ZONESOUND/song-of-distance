import React, {useState, useEffect} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.min.css';
import './BlackModal.css';

export function NameModal(props) {
    const [show, setShow] = useState(props.show);
    const [name, setName] = useState("");
    const handleClose = () => {
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
                <label htmlFor="name">Name your session</label> <br/>
                <input id="name" type="text" placeholder={props.name} 
                    value={name} onChange={e => setName(e.target.value)}></input>
                <span className="hint"> ⚠ 完整呈現作品，請打開聲音及定位。</span>           </Modal.Body>
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
