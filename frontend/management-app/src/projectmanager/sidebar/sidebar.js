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
    const [frames, setFrames] = useState([]) /* Stores the set of frames to be rendered 
        Populate using a db fetch all documents call
    */

    const [makeFrameDisplay, setMakeFrameDisplay] = useState(false)
    const [titleHovered, setTitleHovered] = useState(false)
    const makeFrameRef = useRef(null);

    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Populates frames with a doc id and name
    // Fetch user documents when the component loads
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/fetch_user_documents', { withCredentials: true });
                
                // Assuming the API returns an object with a 'data' property containing the list of documents
                if (response.data && response.data) {
                    const documents = response.data.data.map(doc => ({
                        id: doc.doc_id, // Use doc_id from the API response
                        frameName: doc.title, // Use title from the API response
                        fileId: doc.doc_id // Use doc_id as fileId
                    }));

                    // Update the frames state with the fetched documents
                    setFrames(documents);
                }

            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        fetchDocuments();
    }, []); // Empty dependency array to run once on mount

    /* Creating a new frame on submit */
    async function handleSubmit(e) {
        e.preventDefault();
    
        // Create the new frame
        const createNewDocument = async (name) => {
            try {
                // Make the Axios POST request
                const response = await axios.post('http://127.0.0.1:8000/api/create_new_document', {
                    title: name  // Directly sending the title in the request body
                }, { withCredentials: true });
                // Handle the response
                let doc_id = response.data.doc_id;
                console.log("Document created with ID:", doc_id);
                return doc_id;  // Return the document ID
            } catch (error) {
                // Handle any errors
                if (error.response) {
                    console.error("Error creating document:", error.response.data.detail);
                } else {
                    console.error("Error creating document:", error.message);
                }
                throw error;  // Re-throw the error for further handling if needed
            }
        };
    
        try {
            // Await the result of createNewDocument
            console.log(newFrame)
            const id_holder = await createNewDocument(newFrame);
    
            // Update frames state
            const newFrameData = { id: crypto.randomUUID(), frameName: newFrame, frameType: "Doc", fileId: id_holder };
            setFrames(currentFrames => [
                ...currentFrames,
                newFrameData,
            ]);

            // Call the handleChange (or props.onPageSelect) to update the render frame
            props.onPageSelect(newFrameData.frameType, newFrameData.frameName, newFrameData.fileId);
        } catch (err) {
            console.error('Failed to create document:', err);
        }
    
        setNewFrame('');  // Clear the input
        handleNewFrame(); // Call your additional function to handle frame input visibility
    }

    function handleNewFrame(){
        setMakeFrameDisplay(makeFrameDisplay => !makeFrameDisplay)
        /*
        if (makeFrameDisplay){
            makeFrameRef.current.focus();
        }
        */
    }

    // Focus input when form becomes visible
    useEffect(() => {
        if (makeFrameDisplay && makeFrameRef.current) {
            makeFrameRef.current.focus();
        }
    }, [makeFrameDisplay]); // Watch for changes in makeFrameDisplay

    function handleNewFrameTrue(){
        setMakeFrameDisplay(true)
    }

    function handleNewFrameFalse(){
        setMakeFrameDisplay(false)
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
            key={crypto.randomUUID()} 
            frameName={frame.frameName}
            frameType={"Doc"}
            onPageSelect={props.onPageSelect}
            fileId={frame.fileId}
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

                    {/* To be completed in future functionality */}
                    {/*<Frame frameName="Network" frameType="Network" onPageSelect={props.onPageSelect} />*/}
                    {/*<Frame frameName="Automation" frameType="Automation" onPageSelect={props.onPageSelect} />*/}

                    <span className='sidebar-title-holder' onMouseEnter={ handleTitleHover } onMouseLeave={ handleTitleLeave }>
                        <p className='sidebar-title'>Pages</p>
                        <img src={plusIcon} onClick={ handleNewFrameTrue } className={`${titleHovered ? 'makePlusVisible':'makePlusHidden'}`}></img>
                    </span>
                    <form onSubmit= { handleSubmit } className={`makeFrame ${makeFrameDisplay ? 'makeFrameVisible':'makeFrameHidden'}`}>
                        <div className='form-row'>
                            <input
                                ref={makeFrameRef}
                                value={newFrame}
                                onChange={e => setNewFrame(e.target.value)}
                                onBlur={ handleNewFrameFalse }
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
        props.onPageSelect(props.frameType, props.frameName, props.fileId);
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

