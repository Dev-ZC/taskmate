import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import '../App.css'
import './project.css'
import hideIcon from './hideIconDark.png'
import sendIcon from './sendIconDark.png'
import maxIcon from './maxIcon.png'
import Sidebar from './sidebar/sidebar.js';
import ProjectNav from './projectNav/projectNav.js';
import chatIcon from './chatIcon.png'
import Home from './home/home.js'
import Calendar from './calendar/calendar.js'
import Automation from './automation/automation.js'
import Inbox from './inbox/inbox.js'
import Network from './network/network.js'

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

    console.log(frameType, frameName)

    return(
        /* Frametype decides what component to render */

        /* Internally each component will find frame data/content stored
        in the json file using the frame name or frame ID, this will mostly be used for
        docs components instead of Home, Calendar, and Inbox*/
        <div className='render-frame'>
            {frameType === 'Home' && <Home pageName={frameName} />} 
            {frameType === 'Inbox' && <Inbox pageName={frameName} />} 
            {frameType === 'Calendar' && <Calendar pageName={frameName} />} 
            {frameType === 'Network' && <Network pageName={frameName} />} 
            {frameType === 'Automation' && <Automation pageName={frameName} />} 
            <ChatBar />
        </div>
    );
}

function ChatBar (){
    let senderId = 1; // Change later, so it is set to a real sender Id

    const [messages_ex, setMessages_ex] = useState([
        // Example initial messages
        { message: 'Hello!', sender_type: 'user' },
        { message: 'Hi there!', sender_type: 'bot' }
    ]); // List of messages, SHOULD BE CACHED LATER
    const [messages, setMessages] = useState([]);
    const [displayChat, setDisplayChat] = useState(false); // State to control chat display (none or block)
    const [displayBar, setDisplayBar] = useState(true); // State to control chat display (none or block)
    const [searchInput, setSearchInput] = useState("");
    const inputRef = useRef(null); // Used to for MaxMin to focus input tag
    const contentRef = useRef(null); // Used for display chat transition

    // Handles display 
    useEffect(() => {
        if (displayChat) {
          // Trigger reflow to ensure the transition works
          contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
        } else {
          contentRef.current.style.height = '0px';
        }
      }, [displayChat]);
    
    useEffect(() => {
    if (displayChat) {
        // Update the height whenever messages change
        // contentRef.current.style.height = 'auto'; // Temporarily set to auto to get the new scrollHeight
        const scrollHeight = contentRef.current.scrollHeight; // Get the scroll height
        contentRef.current.style.height = '0px'; // Reset to 0px
        setTimeout(() => {
        contentRef.current.style.height = `${scrollHeight}px`; // Set to scrollHeight
        scrollToBottom();
        }, 0); // Delay to allow DOM update
    }
    }, [messages, displayChat]);

    const scrollToBottom = () => {
        if (contentRef.current) {
            contentRef.current.scrollTo({
              top: contentRef.current.scrollHeight,
              behavior: 'smooth' // Smooth scrolling behavior
            });
          }
      };

    const handleChange = (e) => {
        e.preventDefault();
        setSearchInput(e.target.value);
    };  

    // Sends message written in chat bar to api end point
    // and receive AI response
    const sendChatMessage = () => {
        if (searchInput.trim() === "") return;
    
        axios.post('http://127.0.0.1:8000/api/messages', { message: searchInput, sender_id: senderId, sender_type: "user" })
            .then(response => {
                console.log("Message sent:", response.data);

                setMessages(prevMessages => [...prevMessages, response.data]); // Add user message to message log

                console.log(messages)

                setSearchInput("");  // Clear the input field after sending

                // Second Axios call to get AI response
                axios.post(`http://127.0.0.1:8000/api/ai_response?user_id=${senderId}`, {message: searchInput, sender_id: senderId, sender_type: "user"})
                    .then(aiResponse => {
                        console.log("AI Response:", aiResponse.data);

                        // Handle AI response as needed (e.g., update state)
                        // Adds AI message to message log with sender_type 'bot'
                        setMessages(prevMessages => [
                            ...prevMessages,
                            { message: aiResponse.data.response, sender_type: 'bot' }
                        ]);
                    })
                    .catch(error => {
                        console.error("Error getting AI response:", error);
                        // Handle error if necessary
                    });
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
        }
        setDisplayChat(!displayChat);
        if (displayChat) {
            inputRef.current.blur();
        } else {
            inputRef.current.focus();
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
            <div 
            className={`chat-display ${displayChat ? 'chat-visible' : 'chat-hidden'}`} 
            ref={contentRef}
            tabIndex="0.5">
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
    const isUser = (props) => {
        if (props.sender_type === 'user') {
            return true;
        } else {
            return false;
        }
    };

    // If sender_type is user align items right, else align left
    const chatMessageStyle = {
        justifyContent: isUser(props) ? 'flex-end' : 'flex-start'
    };

    //Alters styling depending on user or non-user
    const chatMessageUser = (props) => {
        return isUser(props) ? 'chat-message-text-user' : 'chat-message-text-non-user';
    };

    const useChatIcon = (props) => {
        return isUser(props) ? '' : chatIcon;
    }

    const iconSrc = useChatIcon(props);
    
    return (
        <div className='chat-message' style={chatMessageStyle}>
            {iconSrc && <img src={iconSrc} className='chat-message-img' alt="Chat Icon" />}
            <p className={`chat-message-text ${chatMessageUser(props)}`}>{props.message}</p>
        </div>
    )
}