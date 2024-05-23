import React, { useState } from 'react'
import '../App.css'
import './project.css'
import hideIcon from './hideIconDark.png'
import sendIcon from './sendIconDark.png'
import maxIcon from './maxIcon.png'
import Sidebar from './sidebar/sidebar.js';
import ProjectNav from './projectNav/projectNav.js';
import Home from './home/home.js'

export default function Project() {
    const [pageToLoad, setPageToLoad] = useState(['Home', 'Home', ''])
    const handlePageChange = (page) => {
        setPageToLoad([page, pageToLoad])
    }

    /* We pass the stored frames into sidebar to be rendered */
    const storedFrames = [

        {
            id: 0,
            frameName: 'notes',
            frameType: 'Doc',
        },
      
        {
            id: 1,
            frameName: 'random',
            frameType: 'Doc',
        },

        {
            id: 2,
            frameName: 'other',
            frameType: 'Doc',
        }
      
      ]

    return(
        <div className="project-container">
            <ProjectNav />
            <Sidebar onPageSelect={handlePageChange} storedFrames={storedFrames}/>
            <RenderFrame pageToLoad={pageToLoad} storedFrames={storedFrames}/>  
        </div>
    );
}

function RenderFrame(props) {
    /* Page to load is the frameType value 
    
    {props.pageToLoad === 'Calendar' && <Calendar />} 
    {props.pageToLoad === 'Inbox' && <Inbox />} 
    {props.pageToLoad === 'Doc' && <Doc pageName={frameName}/>}

    Note: When loading the Doc frame type search the saved frame data by name to located all info for that
    specific doc as 
            */

    /* These values are loaded and changed from the Frame component definition in Sidebar */
    const frameType = props.pageToLoad[0];
    const frameName = props.pageToLoad[1];
    const frameId = props.pageToLoad[2];
    console.log(frameId)


    return(
        /* Frametype decides what component to render */

        /* Internally each component will find frame data/content stored
        in the json file using the frame name or frame ID, this will mostly be used for
        docs components instead of Home, Calendar, and Inbox*/
        <div className='render-frame'>
            {frameType === 'Home' && <Home pageName={frameName} />} 
            <ChatBar />
        </div>
    );
}

function ChatBar (){
    const [searchInput, setSearchInput] = useState("");

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };

    return(
        <div className='chat-bar-holder'>
            <div className='max-min-btn'>
                <img src={maxIcon} alt='max min icon' />
            </div>
            <div className='chat-bar'>
                <div className='input-hide-holder'>
                    <button className='hide-btn'>
                        <img src={hideIcon} alt='hide icon' />
                    </button>
                    <input
                    className='input-bar'
                    type="input"
                    placeholder="Input here"
                    onChange={handleChange}
                    value={searchInput} />
                </div>
                <button className='send-btn'>
                    <img src={sendIcon} alt='send icon' />
                </button>
            </div>
        </div>
    );
}