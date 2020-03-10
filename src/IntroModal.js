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
                <h6>距離之歌 Song of Distances<br/><span className='eng-hint'>紀柏豪 CHI PO-HAO, 2019</span></h6><br/>
                <p>《距離之歌》是一件將使用者定位資料轉化為樂音的生成式音樂系統。系統將不斷掃描使用者周遭的當前與歷史連線，同時也將您的定位資料提供給其他連線裝置。</p>
                <p>"Song of Distances" is a generative music system that transforms the user's positioning data into the music. The system continually scans the surrounding active and history sessions while exposing your GPS location to other devices.</p>               
            </Modal.Body>
        </Modal>
      </>
    );
}
