import '../../App.css'
import './landing.css'

function Landing() {
    return(
        <div className="initial-container">
            <div className='initial-container-item'>
                <h1>
                    Get work done. <br></br> Even in your sleep.{/* Get work done while your sleep or Automate Project Management*/}
                </h1>
                <div className="initial-smalltext">
                    <p>    
                        Try our project management platform integrated
                        with a personalized AI assistant
                    </p>
                </div>
                <a className='free-trial-btn' href="/">
                    Use Taskmate for Free
                </a>
            </div>
            <div className='initial-container-item'>
                <img src="" className='mainImg'></img>
            </div>
        </div>

    );
}

export default Landing;