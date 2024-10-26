import React, { useState, useEffect } from 'react';
import './home.css'
import chatIcon from '../chatIcon.png'
import chatBlinkIcon from '../chatBlinkIcon3.png'

export default function Home(props) {

    let chatContent = " Hey John, I went ahead and got the following tasks started for you."

    const chatIcons = [
        chatIcon,
        chatBlinkIcon
    ]

    // State to keep track of the current image index
    const [currentIndex, setCurrentIndex] = useState(0);

    // State to keep track of the current duration
    const [currentDuration, setCurrentDuration] = useState(20000);

    // Effect to set up the timeout
    useEffect(() => {
        const timeout = setTimeout(() => {
        // Update the index and duration
        if (currentIndex === 0) {
            setCurrentIndex(1);
            setCurrentDuration(250); // Set duration to 0.2 seconds for the second image
        } else {
            setCurrentIndex(0);
            setCurrentDuration(6000); // Set duration back to 6 seconds for the first image
        }
        }, currentDuration); // Use current duration for timeout

        // Cleanup function to clear the timeout
        return () => clearTimeout(timeout);
    }, [currentIndex, currentDuration]);

    return(
        <div className="project-home">
            <div className='header-content'>
                <div className='greeting'>
                    <h1>Good morning, John Doe!</h1>
                    <h2>Ask me anything using the chat bar below</h2>
                </div>
                <div className='task-tracker'>
                    <div>
                        <h1>7 <span className='tracker-title'>To Do Today</span></h1>
                    </div>
                    <div>
                        <h1>2 <span className='tracker-title'>In Progress</span></h1>
                    </div>
                    <div>
                        <h1>4 <span className='tracker-title'>Completed Today</span></h1>
                    </div>
                </div>
            </div>
            <div className='info-cards'>
                <section className='left-holder'>
                    <div className='card-automated' id="home-card">
                        <ChatMessageDisplay src={ chatIcons[currentIndex] } content={ chatContent }/>
                    </div>
                </section>
                <section className='right-holder'>
                    <div className='card-calendar' id="home-card">
                        Calendar
                    </div>
                    <div className='card-priority-tasks' id="home-card">
                        To Do List (Most Urgent)
                    </div>
                </section>
            </div>
        </div>
    );
}

const useTypewriter = (text, speed = 50) => {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        let i = 0;
        
        const typeNextCharacter = () => {
        if (i < text.length) {
            setDisplayText(prevText => prevText + text.charAt(i));
            i++;
            setTimeout(typeNextCharacter, speed);
        }
        };

        const typingTimeout = setTimeout(typeNextCharacter, speed);

        return () => clearTimeout(typingTimeout);
    }, [text, speed]);

    return displayText;
};

function ChatMessageDisplay (props) {
    /*const displayedContent = useTypewriter("bruh", 50);*/

    return(
        <div className='chat-message'>
            <img src={props.src} className="chat-icon"></img>
            <div className='chat-message-content'>
                <p>
                    {props.content}
                </p>
            </div>
        </div>
    );
}
