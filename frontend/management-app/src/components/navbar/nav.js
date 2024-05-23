import { Link, useMatch, useResolvedPath } from "react-router-dom"
import '../../App.css'
import './nav.css'

export default function Nav() {
    return(
        <nav className="nav">
            <Link to="/" className="title">
                Taskmate
            </Link>

            <div className="list-container">
                <ul>
                    <CustomLink to="/" className="list-link">Home</CustomLink>
                    <CustomLink to="/pricing" className="list-link">Pricing</CustomLink>
                    <CustomLink to="/contact" className="list-link">Contact</CustomLink>
                    <CustomLink to="/login" className="list-link">Log in</CustomLink>
                    <CustomLink to="/login" className="list-link" id="get-started">Get Started</CustomLink>
                </ul>
            </div>    
        </nav>
    )
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })

    return (
        <li className={isActive ? "active" : ""}>
        <Link to={to} {...props}>
            {children}
        </Link>
        </li>
    )
}