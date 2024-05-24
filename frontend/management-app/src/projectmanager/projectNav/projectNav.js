import './projectNav.css'
import moreIcon from './dotsHorizontal.png'

export default function ProjectNav() {

    return(
        <div className="project-nav-holder">
            <button className='more-btn'>
                <img src={moreIcon}></img>
            </button>
        </div>
    );
}