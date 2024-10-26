import { useState, useRef, useEffect } from 'react';
import axios from 'axios'
import menuIcon from '../menu.png'
import homeIcon from './homeIcon.png'
import calendarIcon from './calendarIcon.png'
import wrenchIcon from './wrenchIcon.png'
import docIcon from './docIcon.png'
import plusIcon from './plusIcon.png'
import networkIcon from './networkIcon.png'
import inboxIcon from './inboxIcon.png'
import './sidebar.css'

export default function Sidebar(props) {
    /* This info will be fetched later*/ 
    let profileName = "Profile Name"
    profileName = "John Doe"

    /*const homeFrame = {id: 0, frameName: 'Home', componentToRender={<Home />}}*/

    const [newFrame, setNewFrame] = useState("") /* Stores new frames name */
    const [frames, setFrames] = useState(props.storedFrames) /* Stores the set of frames to be rendered */

    const [makeFrameDisplay, setMakeFrameDisplay] = useState(false)
    const [titleHovered, setTitleHovered] = useState(false)
    const makeFrameRef = useRef(null);

    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* Creating a new frame on submit */
    function handleSubmit(e) {
        e.preventDefault()

        setFrames(currentframes => {
            return [

                /* Later on add the functionality to store new frames in database -----? */

                ...currentframes, 
                { id: crypto.randomUUID(), frameName: newFrame, frameType: "Doc" },
            ]
        })

        /* Make the text input hidden after input */
        handleNewFrame()
    }

    function handleNewFrame(){
        setMakeFrameDisplay(makeFrameDisplay => !makeFrameDisplay)
        /*
        if (makeFrameDisplay){
            makeFrameRef.current.focus();
        }
        */
    }

    const handleTitleHover = () => {
        setTitleHovered(true)
    }

    const handleTitleLeave = () => {
        setTitleHovered(false)
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

    // Get basic user profile data
    useEffect(() => {
        const fetchUserProfile = async () => {
          try {
            const response = await axios.get('http://127.0.0.1:8000/api/user_profile', { withCredentials: true });
            setUserProfile(response.data);  // Set user profile data
          } catch (error) {
            console.error("Error fetching user profile:", error);
            setError(error.response ? error.response.data.detail : "An error occurred");
          } finally {
            setLoading(false);  // Set loading to false
          }
        };
    
        fetchUserProfile();
    }, []); 

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return(
        <div className="project-sidebar-holder">
            <div className="project-sidebar">
                <button href="/" className='profile-btn'> 
                    <p>{ userProfile.first_name + " " + userProfile.last_name} </p>
                    <img src={menuIcon}></img>
                </button>
                <div className="section-general">

                    <Frame frameName="Home" frameType="Home" onPageSelect={props.onPageSelect} />
                    <Frame frameName="Inbox" frameType="Inbox" onPageSelect={props.onPageSelect} />
                    <Frame frameName="Calendar" frameType="Calendar" onPageSelect={props.onPageSelect} />
                    <Frame frameName="Network" frameType="Network" onPageSelect={props.onPageSelect} />
                    <Frame frameName="Automation" frameType="Automation" onPageSelect={props.onPageSelect} />

                    <span className='sidebar-title-holder' onMouseEnter={ handleTitleHover } onMouseLeave={ handleTitleLeave }>
                        <p className='sidebar-title'>Pages</p>
                        <img src={plusIcon} onClick={ handleNewFrame } className={`${titleHovered ? 'makePlusVisible':'makePlusHidden'}`}></img>
                    </span>
                    <form onSubmit= { handleSubmit } className={`makeFrame ${makeFrameDisplay ? 'makeFrameVisible':'makeFrameHidden'}`}>
                        <div className='form-row'>
                            <input
                                ref={makeFrameRef}
                                value={newFrame}
                                onChange={e => setNewFrame(e.target.value)}
                                onBlur={ handleNewFrame }
                                type="text"
                                id="item"
                            />
                        </div>
                    </form>
                    { frameItems }
                </div>
                
                {/*<section className="section-more">
                    <span className='sidebar-title-holder'>
                        <p className='sidebar-title'>Workspaces</p>
                        <img src={plusIcon}></img>
                    </span>
                </section>*/}
            </div>
        </div>
    );
}

function Frame(props){
    /* Data passed back to render frame when button is clicked */
    const handleChange = () => {
        /* We pass back both frametype and framename to be used by RenderFrame */
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
    } else if (props.frameType === "Network"){
        src = networkIcon;
    } else if (props.frameType === "Inbox"){
        src = inboxIcon;
    } 

    return(
        <button className="frame" onClick={handleChange}>
            <img src={src}></img>
            <p>{props.frameName}</p>
        </button>
    )
}

