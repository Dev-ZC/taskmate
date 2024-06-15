import { useState } from 'react';
import menuIcon from './menu.png'
import homeIcon from './homeIcon.png'
import calendarIcon from './calendarIcon.png'
import wrenchIcon from './wrenchIcon.png'
import docIcon from './docIcon.png'
import './sidebar.css'

export default function Sidebar(props) {
    /* This info will be fetched later*/ 
    let profileName = "Profile Name"
    profileName = "John Doe"

    /*const homeFrame = {id: 0, frameName: 'Home', componentToRender={<Home />}}*/

    const [newFrame, setNewFrame] = useState("") /* Stores new frames name */
    const [frames, setFrames] = useState(props.storedFrames) /* Stores the set of frames to be rendered */

    /* Creating a new frame on submit */
    function handleSubmit(e) {
        e.preventDefault()

        setFrames(currentframes => {
            return [

                /* Later on add the functionality to store new frames in database -----? */

                ...currentframes, 
                { id: crypto.randomUUID(), frameName: newFrame },
            ]
        })
    }

    /* All data passed into each frame */
    const frameItems = frames.map(frame =>
        <Frame 
            key={frame.id} 
            frameName={frame.frameName}
            frameType={frame.frameType}
            onPageSelect={props.onPageSelect}
        />
    )

    return(
        <div className="project-sidebar-holder">
            <div className="project-sidebar">
                <button href="/" className='profile-btn'> 
                    <p>{ profileName } </p>
                    <img src={menuIcon}></img>
                </button>
                <div className="section-general">

                    <Frame frameName="Home" frameType="Home" onPageSelect={props.onPageSelect} />
                    <Frame frameName="Calendar" frameType="Calendar" onPageSelect={props.onPageSelect} />
                    <Frame frameName="Automation" frameType="Automation" onPageSelect={props.onPageSelect} />

                    <p>General</p>
                    <form onSubmit= { handleSubmit } className='makeFrame'>
                        <div className='form-row'>
                            <label>New Frame</label>
                            <input
                                value={newFrame}
                                onChange={e => setNewFrame(e.target.value)}
                                type="text"
                                id="item"
                            />
                        </div>
                    </form>
                    { frameItems }
                </div>
                <div className="section-more">
                    <p>More</p>
                </div>
            </div>
        </div>
    );
}

function Frame(props){
    /* Data passed back to render frame when button is clicked*/
    const handleChange = () => {
        /* We pass back both frametype and framename to be used by RenderFrame*/
        props.onPageSelect(props.frameType, props.frameName, props.id);
    };

    let src = ''

    if (props.frameType === "Home"){
        src = homeIcon;
    } else if (props.frameType === "Calendar"){
        src = calendarIcon;
    } else if (props.frameType === "Automation"){
        src = wrenchIcon;
    } else if (props.frameType === "Doc"){
        src = docIcon;
    } 

    return(
        <button className="frame" onClick={handleChange}>
            <img src={src}></img>
            <p>{props.frameName}</p>
        </button>
    )
}

