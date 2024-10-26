import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import './network.css'
import arrowIcon from './arrowIconDark.png'
import addFolderIcon from './addFolderIcon.png'
import addPageIcon from './addPageIcon.png'

export default function Network(){
    const networkInfoExample = [
        {
            id: 1,
            folderName: "Work Associates",
            storedFolders: [
                {
                    id: 1,
                    folderName: "Team Members",
                    storedFolders: [],
                    storedPersonCards: [
                        {
                            id: 1,
                            name: "Mary Jane",
                            occupation: "Doctor",
                            lastContacted: "3 Weeks Ago",
                            association: "Work"
                        },
                        {
                            id: 2,
                            name: "Peter Parker Peter Parker",
                            occupation: "Friendly Neighborhood Spidermann",
                            lastContacted: "8 Months Ago",
                            association: "School"
                        }
                    ]
                }
            ],
            storedPersonCards: [
                {
                    id: 1,
                    name: "Mary Jane",
                    occupation: "Doctor",
                    lastContacted: "3 Weeks Ago",
                    association: "Work"
                },
                {
                    id: 2,
                    name: "Peter Parker Peter Parker",
                    occupation: "Friendly Neighborhood Spidermann",
                    lastContacted: "8 Months Ago",
                    association: "School"
                }
            ]
        },
        {
            id: 2,
            folderName: "Another Folder",
            storedPersonCards: [
                {
                    id: 1,
                    name: "Mary Jane",
                    occupation: "Doctor",
                    lastContacted: "3 Weeks Ago",
                    association: "School"
                },
                {
                    id: 2,
                    name: "Peter Parker",
                    occupation: "Friendly Neighborhood Spiderman",
                    lastContacted: "8 Months Ago",
                    association: "School"
                }
            ]
        },
        {
            id: 3,
            folderName: "Another Folder",
            storedPersonCards: [
                {
                    id: 1,
                    name: "Mary Jane",
                    occupation: "Doctor",
                    lastContacted: "3 Weeks Ago",
                    association: "School"
                },
                {
                    id: 2,
                    name: "Peter Parker",
                    occupation: "Friendly Neighborhood Spiderman",
                    lastContacted: "8 Months Ago",
                    association: "School"
                }
            ]
        }
    ]

    const storedNetworkInfo = networkInfoExample != null 
    ? networkInfoExample.map(folderInfo =>
        <CardFolder 
          key={folderInfo.key}
          folderName={folderInfo.folderName}
          storedFolders={folderInfo.storedFolders}
          storedPersonCards={folderInfo.storedPersonCards}
        />
      )
    : null;

    return(
        <section className='network-main'>
            <div className='network-header'>
                <h1>
                    Network
                </h1>
                <line className='network-divider'></line>    
            </div>
            <div className='network-tools'>
                <input
                    className='search-bar'
                    type='text'
                    size='80'
                    style={{
                        
                    }}
                />
            </div>
            <div className='network-info'>
                { storedNetworkInfo }
            </div>
        </section>
    )
}

function CardFolder (props){

    const [folderName, setFolderName] = useState(props.folderName)
    const [storedFolders, setStoredFolders] = useState(props.storedFolders || [])
    const [storedPersonCards, setStoredPersonCards] = useState(props.storedPersonCards || [])
    const [folderExpanded, setFolderExpanded] = useState(true)

    const folders = storedFolders != null 
        ? storedFolders.map(folderInfo =>
            <CardFolder 
                key = {folderInfo.key}
                folderName = {folderInfo.folderName}
                storedFolders = {folderInfo.storedFolders}
                storedPersonCards = {folderInfo.storedPersonCards}
            />
        )
    : null;

    const personCards = storedPersonCards != null 
        ? storedPersonCards.map(personCard =>
            <PersonCard 
                key={personCard.id} 
                name={personCard.name}
                occupation={personCard.occupation}
                lastContacted={personCard.lastContacted}
                association={personCard.association}
            />
        )
    : null;

    const handleFolderExpand = () => {
        setFolderExpanded(!folderExpanded)
    }

    const handleNewFolder = () => {
        const newFolder = {
            id: Date.now(), // Unique ID for the new card (could use a more sophisticated method)
            folderName: '',
            storedFolders: [],
            storedPersonCards: []
        };

        // Update the state to include the new card at the beginning
        setStoredFolders(prevFolders => {
            return [newFolder, ...prevFolders];
        });
    }

    const handleNewCard = () => {
        // Generate a new card with empty or default values
        const newCard = {
            id: Date.now(), // Unique ID for the new card (could use a more sophisticated method)
            name: '',
            occupation: '',
            lastContacted: '',
            association: ''
        };

        // Update the state to include the new card at the beginning
        setStoredPersonCards(prevCards => [newCard, ...prevCards]);
    }

    return(
        <>
        <section 
            className={'folder-header'}
            style={{
                borderBottom: folderExpanded ? '1px solid lightgray' : 'transparent',
                transition: 'border-bottom 3s linear'
            }}
        >
            <div className='folder-header-expand'> 
                <img
                    src={arrowIcon}
                    onClick={ handleFolderExpand }
                    style={{
                        transform: folderExpanded ? 'rotate(90deg)' : 'rotate(0)',
                        transition: 'transform 0.3s linear'
                    }}
                >
                </img>
            </div>
            <div className='folder-header-title'>
                { folderName }
            </div>
            <div className='folder-header-add-folder'>
                <img
                    src={addFolderIcon}
                    onClick={handleNewFolder}
                >  
                </img>
            </div>
            <div className='folder-header-add-card'>
                <img
                    src={addPageIcon}
                    onClick={handleNewCard}
                >
                </img>
            </div>
        </section>
        <div className='folder-body' 
            style={{
                maxHeight: folderExpanded ? '150rem' : '0',
                transition: folderExpanded ? 'max-height 1s' : 'max-height 0.3s',
                overflowY: folderExpanded ? 'auto' : 'hidden',
            }}
        >
            <div style={{
                marginLeft: "2rem",
                marginTop: "0",
            }}>
                { folders }
            </div>

            <div style={{
                marginLeft: "2rem",
                marginBottom: "3rem"
            }}>
                { personCards }
            </div>
        </div>
        </>
    )
}

function PersonCard (props){
    const [name, setName] = useState(props.name || '--')
    const [occupation, setOccupation] = useState(props.occupation || '--')
    const [lastContacted, setLastContacted] = useState(props.lastContacted || '--')
    const [association, setAssociation] = useState(props.association || '--')

    const [infoCardExpanded, setInfoCardExpanded] = useState(false)

    const toggleInfoCard = () => {
        setInfoCardExpanded(!infoCardExpanded)
    }

    // Handles right click card expansion
    const handleContextMenu = (e) => {
        e.preventDefault(); // Prevent the default context menu
        
        setInfoCardExpanded(!infoCardExpanded)
    };

    return(
        <section className='info-card-holder'>
            <div className='info-card-draggable'>

            </div>
            <div className='info-card'>
                <div className='info-card-min'>
                    <section className='info-card-min-name'>
                        <InfoCardNameInput
                            displayText = {name}
                        />
                    </section>
                    <section 
                        className='info-card-min-section' 
                        onDoubleClick={toggleInfoCard} 
                        onContextMenu={handleContextMenu}
                    >
                        <div>
                            <span className='info-card-min-descriptor'>Occupation</span>
                            <br></br>
                            <InfoCardInput
                                displayText = {occupation}
                            />
                        </div>
                        <div>
                            <span className='info-card-min-descriptor'>Last Contacted</span>
                            <br></br>
                            <InfoCardInput
                                displayText = {lastContacted}
                            />
                        </div>
                        <div>
                            <span className='info-card-min-descriptor'>Association</span>
                            <br></br>
                            <InfoCardInput
                                displayText = {association}
                            />
                        </div>
                        <div className='info-display-accessories'>
                            <button className='info-card-btn'>
                                Contact
                            </button>
                            <img src={arrowIcon} 
                                className='info-card-arrow'
                                onClick={toggleInfoCard}
                                style={{
                                    transition: 'transform 0.3s',
                                    transform: infoCardExpanded ? 'rotate(-90deg)' : 'rotate(0)'
                                }}
                            ></img>
                        </div>
                    </section>
                </div>
                <div className='info-card-max' style={{
                    maxHeight: infoCardExpanded ? '10rem' : '0',
                    transition: 'max-height 0.3s ease-in-out',
                    overflow: 'hidden',
                }}>
                    {/* Add the top border line here so it goes invisible when the lower section is hidden */}
                    yo
                </div>
            </div>
        </section>
    )
}

// For the card descriptor inputs
function InfoCardInput(props){

    const [isFocused, setIsFocused] = useState(false)
    const [inputText, setInputText] = useState(props.displayText)
    const inputRef = useRef(null);

    const handleInputFocus = (e) => {
        if (e.target.value === "--"){
            setInputText("");
        }
        setIsFocused(true);
    }

    const handleInputBlur = (e) => {
        setIsFocused(false);
        if (e.target.value === ""){
            setInputText("--");
        }
    }

    const handleTextChange = (e) => {
        setInputText(e.target.value);
    }

    // Handles enter key down blur
    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === "") {
            // Blur the input when Enter key is pressed
            inputRef.current.blur();
        }
    };

    return (
        <input
            className='info-input'
            type='text'
            size='20'
            ref={inputRef}
            value={inputText}
            onKeyDown={handleKeyDown}
            onChange={handleTextChange}
            onFocus={ handleInputFocus }
            onBlur={ handleInputBlur }
            style={{
                borderBottom: isFocused ? '1px solid black':'transparent',
                transition: 'border-bottom-color 0.5s',
                maxWidth: '20ch', // Maximum width of 20 characters
                width: 'fit-content'// Ensures padding/border doesn't affect the width
            }}
        />
    )
}

// For the name of each persons card
function InfoCardNameInput(props){

    const [isFocused, setIsFocused] = useState(false)
    const [inputText, setInputText] = useState(props.displayText)
    const inputRef = useRef(null);

    const handleInputFocus = (e) => {
        if (e.target.value === "--"){
            setInputText("");
        }
        setIsFocused(true);
    }

    const handleInputBlur = (e) => {
        setIsFocused(false);
        if (e.target.value === ""){
            setInputText("--");
        }
    }

    const handleTextChange = (e) => {
        setInputText(e.target.value);
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            // Blur the input when Enter key is pressed
            inputRef.current.blur();
        }
    };

    return (
        <input
            className='info-input-name'
            type='text'
            size='14'
            ref={inputRef}
            value={inputText}
            onKeyDown={handleKeyDown}
            onChange={handleTextChange}
            onFocus={ handleInputFocus }
            onBlur={ handleInputBlur }
            style={{
                borderBottom: isFocused ? '1px solid white':'transparent',
                transition: 'border-bottom-color 0.5s',
                maxWidth: '20ch', // Maximum width of 20 characters
                width: 'fit-content'// Ensures padding/border doesn't affect the width
            }}
        />
    )
}