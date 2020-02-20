import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import 'bootstrap/dist/css/bootstrap.min.css';
import './BlackModal.css';
import setting from './img/Settings-icon.png';

function getSettingStr() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
      if (/android|windows phone/i.test(userAgent)) {
        return "1. Open the Chrome app.\n\n2. Find and tap Settings.\n\n3. Tap Site settings > Location.\n\n4. Turn Location on.";
      }
      // iOS detection from: http://stackoverflow.com/a/9039885/177710
      if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "1. Open the settings app.\n\n2. Find and tap Safari/Chrome.\n\n3. Tap Location.\n\n4. Select \"While Using the App\".";
      }
      return "Enable Location Permission";
}

export function LocHintModal(props) {
    const [show, setShow] = useState(props.show);
    const [os] = useState(()=>{
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/android|windows phone/i.test(userAgent)) {
            return 0;
        }
        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return 1;
        }
        return 2;
    })

    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
    }
  
    return (
      <>  
        <Modal show={show}
                centered={true}
                dialogClassName={'black-modal-dialog'}
                backdropClassName={'black-modal-backdrop'}>
            <Modal.Header bsPrefix={'black-modal-header'}>
                
            </Modal.Header>
            <Modal.Body bsPrefix={'black-modal-body'}>
                <h6>
                <span class="zh-tw-hint">為了作品的完整呈現，請允許使用定位功能</span>
                <span class="eng-hint">Enable location permission for the best experience.</span>
                </h6>
                {os===0 && <IOSHint/>}  
                {os===1 && <AndroidHint/>}   
            </Modal.Body>
        </Modal>
      </>
    );
}

function IOSHint() {
    return (<>
        
        <ol>
            <li>
                <span class="zh-tw-hint">開啟<img src={setting} alt="Settings"/>「設定」應用程式。</span>
                <span class="eng-hint">Open the "Settings" app</span>
            </li>
            <li>
                <span class="zh-tw-hint">點選使用的瀏覽器。</span>
                <span class="eng-hint"> Find and tap "Safari" or "Chrome"</span>
            </li>
            <li>
                <span class="zh-tw-hint">輕觸「位置」。</span>
                <span class="eng-hint">Tap "Location"</span>
            </li>
            <li>
                <span class="zh-tw-hint">選擇「使用 App 期間」。</span>
                <span class="eng-hint">Select "While Using the App</span>
            </li>
        </ol>
    </>);
}

let grayStyle = {color:"gray",
                fontWeight:"bolder"};
function AndroidHint(props) {
    return (<>
        
        <ol>
            <li>
                <span class="zh-tw-hint">開啟Chrome應用程式。</span>
                <span class="eng-hint">Open the "Chrome" app.</span>
            </li>
            <li>
                <span class="zh-tw-hint">點選「設定」。</span>
                <span class="eng-hint"> Find and tap "Settings"</span>
            </li>
            <li>
                <span class="zh-tw-hint">輕觸「網站設定」
                    <span style={grayStyle}>></span>「定位」。</span>
                <span class="eng-hint">Tap "Site settings" <span style={grayStyle}>></span> "Location"</span>
            </li>
            <li>
                <span class="zh-tw-hint">將定位開啟。</span>
                <span class="eng-hint">Turn Location on</span>
            </li>
        </ol>
    </>);
}