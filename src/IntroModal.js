import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.min.css';
import './BlackModal.css';

export function IntroModal(props) {
    const [show, setShow] = useState(props.show);

    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
    }
  
    return (
      <>
        <Button onClick={handleShow} bsPrefix="intro-button">
            i
        </Button>
  
        <Modal show={show} onHide={handleClose}
                centered={true}
                dialogClassName={'black-modal-dialog'}
                backdropClassName={'black-modal-backdrop'}>
            <Modal.Header closeButton bsPrefix={'black-modal-header'}>
                
            </Modal.Header>
            <Modal.Body bsPrefix={'black-modal-body'}>
                <h6>作品介紹</h6>
                <p>..............</p>  
                <h6>使用說明</h6>
                <p>..............</p>               
            </Modal.Body>
        </Modal>
      </>
    );
}
