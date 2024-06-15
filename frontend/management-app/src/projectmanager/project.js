import React, { useState, useRef } from 'react'
import axios from 'axios'
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
    let senderId = 1; // Change later, so it is set to a real sender Id

    const [messages, setMessages] = useState([
        // Example initial messages
        { message: 'Hello!', sender_type: 'user' },
        { message: 'Hi there!', sender_type: 'bot' }
    ]); // List of messages, SHOULD BE CACHED LATER
    const [displayChat, setDisplayChat] = useState(false); // State to control chat display (none or block)
    const [displayBar, setDisplayBar] = useState(true); // State to control chat display (none or block)
    const [searchInput, setSearchInput] = useState("");

    const inputRef = useRef(null); // Used to for MaxMin to focus input tag

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };

    // Sends message written in chat bar to api end point
    const sendChatMessage = () => {
        //e.preventDefault(); // Prevent the default behavior of the button
        //inputRef.current.focus();
        if (searchInput.trim() === "") return;
    
        axios.post('http://127.0.0.1:8000/api/messages', { message: searchInput, sender_id: senderId, sender_type: "user" })
            .then(response => {
                console.log("Message sent:", response.data);

                setMessages(prevMessages => [...prevMessages, response.data]);

                console.log(messages)

                setSearchInput("");  // Clear the input field after sending
            })
            .catch(error => {
                console.error("Error sending message:", error);
            });
    };

    
    // On focus this will display the tree of messages between user and chat bot    
    const [focus, setFocus] = useState(false);
    const showMessageTree = () => {setDisplayChat(true); setFocus(true);}
    const hideMessageTree = () => {setDisplayChat(false); setFocus(false);}

    const handleInputBlur = (e) => {
        if (e.relatedTarget && ( // List of classnames that will not effect the input bar focus
            e.relatedTarget.classList.contains('send-btn') ||
            e.relatedTarget.classList.contains('max-min-btn') || // Not working, just need this button to be independent of blurring input tag, but wont work
            e.relatedTarget.classList.contains('max-min-img') ||
            e.relatedTarget.classList.contains('chat-message') ||
            e.relatedTarget.classList.contains('chat-display')
          )) {
            inputRef.current.focus();
        } else {
            hideMessageTree();
            if (e.relatedTarget !== null){
                console.log(`Focus moved to element with class: ${e.relatedTarget.className}`);
            }
        }
    }


    // FIX LATER ----------------------->>
    const handleMaxMin = () => {
        /*
        if (!focus){
            if (displayChat) {
                hideMessageTree();
            } else {
                showMessageTree();
            }
        }*/
    }

    const handleHideBar = () => {
        const chatBar = document.querySelector('.chat-bar');
        const sendButton = document.querySelector('.send-btn');
        const hideButton = document.querySelector('.hide-btn');

        // Weird but works it does the opposite, may refactor later
        if (chatBar && sendButton && hideButton) {
            if (displayBar) {
                chatBar.style.width = '2.8rem';
                chatBar.style.padding = '0';
                sendButton.style.opacity = '0';
                hideButton.style.padding = '0.6rem 0.65rem';
            } else {
                chatBar.style.width = '50%';
                chatBar.style.padding = '0 0.8rem';
                sendButton.style.opacity = '1';
                hideButton.style.padding = '0.5rem';
            }
        }
        setDisplayBar(prevDisplayBar => !prevDisplayBar); 
    }

    const handleSendButton = (e) => {
        e.preventDefault();
        sendChatMessage();
    }

    return(
        <>
            <div className='chat-display' tabIndex="1" style={{ display: displayChat ? 'block' : 'none' }}>
                {messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg.message} sender_type={msg.sender_type} />
                ))}
            </div>
            <div className='chat-bar-holder'>
                <div className='max-min-btn' onClick={handleMaxMin}>
                    <img src={maxIcon} alt='max min icon' className='max-min-img'/>
                </div>
                <div className='chat-bar'>
                    <div className='input-hide-holder'>
                        <button className='hide-btn' onClick={handleHideBar}>
                            <img src={hideIcon} alt='hide icon' />
                        </button>
                        <input
                        ref={inputRef}
                        style={{ display: displayBar ? 'block' : 'none' }}
                        className='input-bar'
                        type="input"
                        placeholder="Input here"
                        onChange={handleChange}
                        onSubmit={sendChatMessage}
                        onKeyDown={(e) => {
                            if (e.key === "Enter")
                                sendChatMessage();
                        }}
                        onFocus={showMessageTree}
                        onBlur={handleInputBlur}
                        value={searchInput} />
                    </div>
                    <button className='send-btn'>
                        <img src={sendIcon} onClick={(e) => handleSendButton(e)} alt='send icon' />
                    </button>
                </div>
            </div>
        </>
    );
}

function ChatMessage(props){

    // If sender_type is user align items right, else align left
    const chatMessageStyle = {
        justifyContent: props.sender_type === 'user' ? 'flex-end' : 'flex-start',
    };
    
    return (
        <div className='chat-message' style={chatMessageStyle}>
            <p className='chat-message-text'>{props.message}</p>
        </div>
    )
}