import '../../App.css'
import './nav.css'

function Nav() {
    return(
        <nav className="nav">
            <a href="/" className="title">Taskmate</a>

            <div className="list-container">
                <ul>
                    <li>
                        <a href="/" class="active">Home</a>
                    </li>
                    <li>
                        <a href="/news">News</a>
                    </li>
                    <li>
                        <a href="/projects">Contact</a>
                    </li>
                    <li>
                        <a href="/about">About</a>
                    </li>
                </ul>
            </div>    
        </nav>
    )
}

export default Nav;