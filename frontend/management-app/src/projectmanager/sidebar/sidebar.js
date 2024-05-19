import menuIcon from './menu.png'
import './sidebar.css'

export default function ProjectNav() {
    const profileName = "Profile Name"

    const frameName = "my notes"

    return(
        <div className="project-sidebar-holder">
            <a href="/" className='profile-btn'> 
                <p>{ profileName } </p>
                <img src={menuIcon}></img>
            </a>
            <div className="section-name">
                <p>General</p>
            </div>
            <div className="section-name">
                <p>More</p>
            </div>
        </div>
    );
}

function frame(props){
    return(
        <button className="frame">
            <p>{props.frameName}</p>
        </button>
    )
}

