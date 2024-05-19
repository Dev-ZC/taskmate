import '../App.css'
import './project.css'
import Sidebar from './sidebar/sidebar.js';
import ProjectNav from './projectNav/projectNav.js';

export default function Project() {


    return(
        <div className="project-container">
            <ProjectNav />
            <Sidebar />
            <div styling="grid-area: 2 / 2 / 3 / 3;">yoo</div>
        </div>
    );
}