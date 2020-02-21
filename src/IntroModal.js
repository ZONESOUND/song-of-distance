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
                <h6>距離之歌<br/><span class='eng-hint'>Song of Distance</span></h6><br/>
                <p>「距離之歌」是一件將使用者定位資料轉化為樂音的生成式音樂系統。系統將不斷掃描周圍所的連線裝置，同時也將您的裝置座標提供給其他裝置。</p>               
            </Modal.Body>
        </Modal>
      </>
    );
}
